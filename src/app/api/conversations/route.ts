import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Hilfsfunktion zum Extrahieren der UserId aus einem Cookie
async function getUserId(req?: Request) {
  try {
    console.log('Versuche UserId zu ermitteln');
    // Verwende den Cookie-Store um das Session-Token zu erhalten
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value;
    
    console.log('Session-Token aus Cookie:', sessionToken ? 'Vorhanden' : 'Nicht vorhanden');
    
    if (!sessionToken) {
      return null;
    }
    
    // Finde die Session anhand des Tokens
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      select: { userId: true }
    });
    
    console.log('Gefundene User-ID:', session?.userId || 'Keine');
    return session?.userId || null;
  } catch (error) {
    console.error('Fehler beim Abrufen der User-ID:', error);
    return null;
  }
}

// GET /api/conversations - Holt alle Konversationen des eingeloggten Benutzers
export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    
    // Hole alle Konversationen, an denen der Benutzer beteiligt ist
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1: userId },
          { participant2: userId },
        ],
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Nur die letzte Nachricht
        },
      },
    });
    
    // Für jede Konversation, hole zusätzliche Informationen über den anderen Teilnehmer
    const conversationsWithProfiles = await Promise.all(
      conversations.map(async (conversation) => {
        // Bestimme die ID des anderen Teilnehmers
        const otherParticipantId = conversation.participant1 === userId ? 
                                  conversation.participant2 : conversation.participant1;
        
        // Hole das Profil des anderen Teilnehmers
        const participantProfile = await prisma.profile.findFirst({
          where: { userId: otherParticipantId },
          select: {
            username: true,
            // displayName ist laut Schema vorhanden
            // Wir müssen select an das vorhandene Schema anpassen
            // displayName: true,
            profileImage: true,
          },
        });
        
        // Erstelle ein angereichertes Profil-Objekt
        const enrichedProfile = participantProfile ? {
          username: participantProfile.username,
          // Verwende den Benutzernamen als Anzeigename, wenn kein displayName vorhanden ist
          displayName: participantProfile.username,
          profileImage: participantProfile.profileImage
        } : null;
        
        // Bestimme, ob die letzte Nachricht gelesen wurde
        const lastMessage = conversation.messages[0];
        
        return {
          id: conversation.id,
          participant1: conversation.participant1,
          participant2: conversation.participant2,
          lastMessageAt: conversation.lastMessageAt,
          createdAt: conversation.createdAt,
          participantProfile: enrichedProfile,
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            isRead: lastMessage.isRead,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId
          } : null,
        };
      })
    );
    
    return NextResponse.json(conversationsWithProfiles);
  } catch (error) {
    console.error('Fehler beim Abrufen der Konversationen:', error);
    return NextResponse.json(
      { error: 'Serverfehler: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Erstellt eine neue Konversation
export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    
    const { recipientId } = await request.json();
    
    if (!recipientId) {
      return NextResponse.json({ error: 'Empfänger-ID fehlt' }, { status: 400 });
    }
    
    // Prüfe, ob bereits eine Konversation zwischen den Benutzern existiert
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1: userId, participant2: recipientId },
          { participant1: recipientId, participant2: userId },
        ],
      },
    });
    
    if (existingConversation) {
      return NextResponse.json({ conversationId: existingConversation.id });
    }
    
    // Erstelle eine neue Konversation
    const conversation = await prisma.conversation.create({
      data: {
        participant1: userId,
        participant2: recipientId,
        lastMessageAt: new Date(),
      },
    });
    
    return NextResponse.json({ conversationId: conversation.id });
  } catch (error) {
    console.error('Fehler beim Erstellen der Konversation:', error);
    return NextResponse.json(
      { error: 'Serverfehler: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
