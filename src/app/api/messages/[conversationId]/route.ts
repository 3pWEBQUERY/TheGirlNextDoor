import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Hilfsfunktion zum Abrufen der Benutzer-ID aus dem Cookie
async function getUserIdFromCookie() {
  try {
    console.log('Versuche UserId aus Cookie zu ermitteln');
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value;
    
    console.log('Session-Token aus Cookie:', sessionToken ? 'Vorhanden' : 'Nicht vorhanden');
    
    if (!sessionToken) {
      return null;
    }
    
    // Session anhand des Tokens finden
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

// GET /api/messages/[conversationId] - Holt alle Nachrichten einer Konversation
export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const userId = await getUserIdFromCookie();
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    const { conversationId } = params;
    
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
    
    // Hole alle Nachrichten der Konversation
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc', // u00c4lteste zuerst
      },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fehler beim Abrufen der Nachrichten:', error);
    return NextResponse.json(
      { error: 'Serverfehler: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// POST /api/messages/[conversationId]/read - Markiert Nachrichten als gelesen
export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const userId = await getUserIdFromCookie();
    
    if (!userId) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    const { conversationId } = params;
    
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
    
    // Markiere alle Nachrichten als gelesen, bei denen der Benutzer der Empfu00e4nger ist
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    
    return NextResponse.json({ message: 'Nachrichten als gelesen markiert' });
  } catch (error) {
    console.error('Fehler beim Markieren der Nachrichten als gelesen:', error);
    return NextResponse.json(
      { error: 'Serverfehler: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
