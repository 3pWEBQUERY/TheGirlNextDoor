import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Typumwandlung für den Prisma-Client, da der TypeScript-Compiler die neuen Modelle noch nicht kennt
// Diese dynamische Umwandlung sollte nur vorübergehend sein, bis ein vollständiger Neustart erfolgt
type PrismaWithPhotoLike = typeof prisma & {
  photoLike: {
    findFirst: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    count: (args: any) => Promise<number>;
  }
};

export async function POST(request: Request) {
  try {
    const { photoId } = await request.json();
    
    // Für die Entwicklungsumgebung vereinfachen wir die Authentifizierung
    let userId: string;
    if (process.env.NODE_ENV === 'development') {
      // In der Entwicklung: ersten Benutzer nehmen
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return NextResponse.json({ error: 'Kein Benutzer gefunden' }, { status: 404 });
      }
      userId = firstUser.id;
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

    // Prüfen, ob das Foto existiert
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });
    
    if (!photo) {
      return NextResponse.json({ error: 'Foto nicht gefunden' }, { status: 404 });
    }

    // Prüfen, ob der Benutzer das Foto bereits geliked hat
    const existingLike = await (prisma as PrismaWithPhotoLike).photoLike.findFirst({
      where: {
        userId: userId,
        photoId: photoId
      }
    });

    let liked: boolean;
    
    // Toggle: Like hinzufügen oder entfernen
    if (existingLike) {
      // Like entfernen
      await (prisma as PrismaWithPhotoLike).photoLike.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      // Like hinzufügen
      await (prisma as PrismaWithPhotoLike).photoLike.create({
        data: {
          userId: userId,
          photoId: photoId
        }
      });
      liked = true;
    }

    // Like-Anzahl abrufen
    const likeCount = await (prisma as PrismaWithPhotoLike).photoLike.count({
      where: { photoId: photoId }
    });

    return NextResponse.json({ liked, likeCount });
  } catch (error) {
    console.error('Fehler beim Verarbeiten des Foto-Likes:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}
