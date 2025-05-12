import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    
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

    // Prüfen, ob das Video existiert
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });
    
    if (!video) {
      return NextResponse.json({ error: 'Video nicht gefunden' }, { status: 404 });
    }

    // Prüfen, ob der Benutzer das Video bereits geliked hat
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        videoId: videoId
      }
    });

    if (existingLike) {
      // Like entfernen, wenn bereits vorhanden (Toggle-Funktion)
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      
      // Aktualisierte Like-Anzahl abrufen
      const likeCount = await prisma.like.count({
        where: { videoId }
      });
      
      return NextResponse.json({ liked: false, likeCount });
    } else {
      // Neuen Like erstellen
      await prisma.like.create({
        data: {
          userId: userId,
          videoId: videoId
        }
      });
      
      // Aktualisierte Like-Anzahl abrufen
      const likeCount = await prisma.like.count({
        where: { videoId }
      });
      
      return NextResponse.json({ liked: true, likeCount });
    }
  } catch (error) {
    console.error('Fehler beim Like/Unlike des Videos:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}
