import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Hilfsfunktion zum Extrahieren der UserId aus einem Cookie
async function getUserId(req?: Request) {
  try {
    // Verwende den Cookie-Store um das Session-Token zu erhalten
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    // Finde die Session anhand des Tokens
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      select: { userId: true }
    });
    
    return session?.userId || null;
  } catch (error) {
    console.error('Fehler beim Abrufen der User-ID:', error);
    return null;
  }
}

// POST /api/messages - Sendet eine neue Nachricht
export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    
    const { conversationId, content, imageUrl, videoUrl } = await request.json();
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Konversations-ID fehlt' }, { status: 400 });
    }
    
    if (!content && !imageUrl && !videoUrl) {
      return NextResponse.json({ error: 'Nachrichteninhalt fehlt' }, { status: 400 });
    }
    
    // userId wird bereits oben abgerufen
    
    // Pru00fcfe, ob die Konversation existiert und der Benutzer daran teilnimmt
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Konversation nicht gefunden' }, { status: 404 });
    }
    
    if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
      return NextResponse.json({ error: 'Sie sind kein Teilnehmer dieser Konversation' }, { status: 403 });
    }
    
    // Bestimme den Empfu00e4nger
    const receiverId = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
    
    // Erstelle die Nachricht
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId,
        content,
        imageUrl,
        videoUrl,
        isRead: false,
      },
    });
    
    // Aktualisiere den lastMessageAt-Zeitstempel der Konversation
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });
    
    return NextResponse.json({
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      imageUrl: message.imageUrl,
      videoUrl: message.videoUrl,
      isRead: message.isRead,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error('Fehler beim Senden der Nachricht:', error);
    return NextResponse.json(
      { error: 'Serverfehler: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
