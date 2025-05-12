import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Kommentare abrufen
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
      return NextResponse.json({ error: 'Video-ID ist erforderlich' }, { status: 400 });
    }
    
    // Prüfen, ob das Video existiert
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });
    
    if (!video) {
      return NextResponse.json({ error: 'Video nicht gefunden' }, { status: 404 });
    }

    // Kommentare mit Benutzerinformationen abrufen
    const comments = await prisma.comment.findMany({
      where: { videoId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kommentare:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}

// Kommentar hinzufügen
export async function POST(request: Request) {
  try {
    const { videoId, content } = await request.json();
    
    if (!videoId || !content) {
      return NextResponse.json({ error: 'Video-ID und Inhalt sind erforderlich' }, { status: 400 });
    }
    
    // Für die Entwicklungsumgebung vereinfachen wir die Authentifizierung
    let userId: string;
    let userName: string = '';
    
    if (process.env.NODE_ENV === 'development') {
      // In der Entwicklung: ersten Benutzer nehmen
      const firstUser = await prisma.user.findFirst();
      userId = firstUser?.id || 'default-user-id';
      userName = firstUser?.name || 'Anonym';
    } else {
      // In Produktion: Authentifizierung überprüfen
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
      }
      
      const user = await prisma.user.findUnique({
        where: { email: session.user.email || '' }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
      }
      
      userId = user.id;
      userName = user.name || 'Anonym';
    }

    // Prüfen, ob das Video existiert
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });
    
    if (!video) {
      return NextResponse.json({ error: 'Video nicht gefunden' }, { status: 404 });
    }

    // Kommentar erstellen
    const comment = await prisma.comment.create({
      data: {
        userId,
        videoId,
        content
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Fehler beim Erstellen des Kommentars:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}

// Kommentar löschen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    
    if (!commentId) {
      return NextResponse.json({ error: 'Kommentar-ID ist erforderlich' }, { status: 400 });
    }
    
    // Für die Entwicklungsumgebung vereinfachen wir die Authentifizierung
    let userId: string;
    
    if (process.env.NODE_ENV === 'development') {
      // In der Entwicklung: ersten Benutzer nehmen
      const firstUser = await prisma.user.findFirst();
      userId = firstUser?.id || 'default-user-id';
    } else {
      // In Produktion: Authentifizierung prüfen
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
      }
      
      const user = await prisma.user.findUnique({
        where: { email: session.user.email || '' }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
      }
      
      userId = user.id;
    }

    // Kommentar abrufen
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    
    if (!comment) {
      return NextResponse.json({ error: 'Kommentar nicht gefunden' }, { status: 404 });
    }
    
    // Prüfen, ob der Benutzer berechtigt ist, den Kommentar zu löschen
    if (comment.userId !== userId) {
      return NextResponse.json({ error: 'Nicht berechtigt, diesen Kommentar zu löschen' }, { status: 403 });
    }

    // Kommentar löschen
    await prisma.comment.delete({
      where: { id: commentId }
    });
    
    return NextResponse.json({ message: 'Kommentar erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Kommentars:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}
