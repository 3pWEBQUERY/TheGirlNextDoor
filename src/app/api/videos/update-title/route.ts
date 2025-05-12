import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    // Request-Body parsen
    const { url, title } = await request.json();

    if (!url || !title) {
      return NextResponse.json({ error: 'URL und Titel sind erforderlich' }, { status: 400 });
    }

    // Die Video-URL muss den Benutzernamen oder eine ID enthalten, um das Video zu identifizieren
    // Hier extrahieren wir die Video-ID aus der URL-Struktur
    // Annahme: URL-Format ist /uploads/{profileId}/{filename}
    const urlPathParts = url.split('/');
    const filename = urlPathParts[urlPathParts.length - 1];
    const profileIdFromUrl = urlPathParts[urlPathParts.length - 2]; // Der vorletzte Teil sollte die Profile-ID sein

    // HINWEIS: Authentifizierungsprüfung wurde für Entwicklungszwecke vereinfacht
    // In einer Produktionsumgebung sollte eine ordnungsgemäße Authentifizierung implementiert werden!
    
    // Vereinfachte Überprüfung: Wir prüfen nur, ob das Profil existiert
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileIdFromUrl
      }
    });
    
    if (!profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 });
    }

    // Das Video in der Datenbank finden und aktualisieren
    const video = await prisma.video.findFirst({
      where: {
        url: url,
        profileId: profileIdFromUrl
      }
    });

    if (!video) {
      return NextResponse.json({ error: 'Video nicht gefunden' }, { status: 404 });
    }

    // Video-Titel aktualisieren
    const updatedVideo = await prisma.video.update({
      where: {
        id: video.id
      },
      data: {
        title: title
      }
    });

    return NextResponse.json({
      message: 'Videotitel erfolgreich aktualisiert',
      video: updatedVideo
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Videotitels:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Videotitels' }, 
      { status: 500 }
    );
  }
}
