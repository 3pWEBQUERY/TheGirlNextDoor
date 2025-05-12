import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Typumwandlung für den Prisma-Client, da der TypeScript-Compiler die neuen Modelle noch nicht kennt
// Diese dynamische Umwandlung sollte nur vorübergehend sein, bis ein vollständiger Neustart erfolgt
type PrismaWithPhotoComment = typeof prisma & {
  photoComment: {
    findMany: (args: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  }
};

// Kommentare abrufen
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photoId');
    
    if (!photoId) {
      return NextResponse.json({ error: 'Foto-ID ist erforderlich' }, { status: 400 });
    }
    
    // Prüfen, ob das Foto existiert
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });
    
    if (!photo) {
      return NextResponse.json({ error: 'Foto nicht gefunden' }, { status: 404 });
    }
    
    // Kommentare abrufen und nach Erstellungsdatum sortieren (neueste zuerst)
    const comments = await (prisma as PrismaWithPhotoComment).photoComment.findMany({
      where: { photoId },
      orderBy: { createdAt: 'desc' },
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
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Foto-Kommentare:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}

// Kommentar hinzufügen
export async function POST(request: Request) {
  try {
    const { photoId, content } = await request.json();
    if (!photoId || !content) {
      return NextResponse.json({ error: 'Foto-ID und Inhalt sind erforderlich' }, { status: 400 });
    }
    
    // Für die Entwicklungsumgebung vereinfachen wir die Authentifizierung
    let userId: string;
    let userName: string = '';
    
    if (process.env.NODE_ENV === 'development') {
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

    // Prüfen, ob das Foto existiert
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });
    
    if (!photo) {
      return NextResponse.json({ error: 'Foto nicht gefunden' }, { status: 404 });
    }
    
    // Kommentar erstellen
    const comment = await (prisma as PrismaWithPhotoComment).photoComment.create({
      data: {
        content,
        userId,
        photoId
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
    console.error('Fehler beim Erstellen des Foto-Kommentars:', error);
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
    const commentId = searchParams.get('id');
    
    if (!commentId) {
      return NextResponse.json({ error: 'Kommentar-ID ist erforderlich' }, { status: 400 });
    }
    
    // Für die Entwicklungsumgebung vereinfachen wir die Authentifizierung
    let userId: string;
    
    if (process.env.NODE_ENV === 'development') {
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
    
    // Kommentar finden
    const comment = await (prisma as PrismaWithPhotoComment).photoComment.findUnique({
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
    await (prisma as PrismaWithPhotoComment).photoComment.delete({
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
