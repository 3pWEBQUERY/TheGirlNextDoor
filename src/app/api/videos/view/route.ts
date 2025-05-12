import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Typumwandlung für den Prisma-Client, da der TypeScript-Compiler die neuen Modelle noch nicht kennt
// Diese dynamische Umwandlung sollte nur vorübergehend sein, bis ein vollständiger Neustart erfolgt
type PrismaWithVideoView = typeof prisma & {
  videoView: {
    findFirst: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    count: (args: any) => Promise<number>;
  }
};

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    
    // Prüfen, ob das Video existiert
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });
    
    if (!video) {
      return NextResponse.json({ error: 'Video nicht gefunden' }, { status: 404 });
    }

    // Benutzer-ID und IP-Adresse ermitteln
    let userId: string | null = null;
    let ip = request.headers.get('x-forwarded-for') || 'unknown';
    let userAgent = request.headers.get('user-agent') || 'unknown';
    
    // In der Entwicklungsumgebung vereinfachen wir die Authentifizierung
    if (process.env.NODE_ENV === 'development') {
      // Ersten Benutzer verwenden, wenn in Entwicklung
      const firstUser = await prisma.user.findFirst();
      userId = firstUser?.id || null;
    } else {
      // In Produktion: Authentifizierung prüfen
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email || '' }
        });
        
        if (user) {
          userId = user.id;
        }
      }
    }

    // Prüfen, ob dieser Benutzer oder diese IP das Video bereits angesehen hat
    const existingView = await (prisma as PrismaWithVideoView).videoView.findFirst({
      where: {
        videoId,
        OR: [
          { userId: userId || undefined },
          { ip: ip || undefined }
        ]
      }
    });

    // Wenn noch kein View existiert, einen neuen erstellen
    if (!existingView) {
      await (prisma as PrismaWithVideoView).videoView.create({
        data: {
          videoId,
          userId,
          ip,
          userAgent
        }
      });
    }
    
    // Gesamtzahl der Views für dieses Video abrufen
    const viewCount = await (prisma as PrismaWithVideoView).videoView.count({
      where: { videoId }
    });
    
    return NextResponse.json({ viewCount });
  } catch (error) {
    console.error('Fehler beim Zu00e4hlen der Video-Views:', error);
    return NextResponse.json(
      { error: 'Serverfehler' }, 
      { status: 500 }
    );
  }
}
