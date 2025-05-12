import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Alle Videos aus der Datenbank laden
    const videos = await prisma.video.findMany({
      include: {
        profile: true,
        likes: true
      }
    });

    // Video-Daten für die Ausgabe aufbereiten
    const formattedVideos = videos.map(video => ({
      id: video.id,
      profileId: video.profileId,
      profileUsername: video.profile?.username,
      title: video.title,
      url: video.url,
      isPublic: video.isPublic,
      createdAt: video.createdAt,
      thumbnailUrl: video.thumbnailUrl,
      likesCount: video.likes.length
    }));

    // Debug-Infos über die gefundenen Videos
    console.log(`${videos.length} Videos in der Datenbank gefunden`);
    
    return NextResponse.json({
      count: videos.length,
      videos: formattedVideos
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Videos:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
