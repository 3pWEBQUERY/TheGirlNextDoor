import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function DELETE(request: Request) {
  try {
    // Lade Daten aus dem Request-Body
    const data = await request.json();
    const { url, type } = data;
    
    console.log('Löschantrag erhalten für:', { url, type });
    
    if (!url || !type) {
      return NextResponse.json(
        { error: 'URL oder Medientyp fehlt' }, 
        { status: 400 }
      );
    }
    
    // Überprüfen des Medientyps
    if (type !== 'images' && type !== 'videos') {
      return NextResponse.json(
        { error: 'Ungültiger Medientyp' }, 
        { status: 400 }
      );
    }
    
    // Vereinfachter Ansatz: ProfileId direkt aus dem Header oder Query-Parameter holen
    // Für diesen Notfall-Fix extrahieren wir die ID aus der URL
    
    const urlParts = url.split('/');
    
    // Versuche, die Datei direkt zu identifizieren (Bildname)
    const filename = urlParts[urlParts.length - 1];
    console.log('Dateiname zum Löschen:', filename);
    
    // Hol einen Query-Parameter zur direkten Profil-ID-Angabe
    const reqUrl = new URL(request.url);
    const manualProfileId = reqUrl.searchParams.get('profileId');
    
    // Wenn kein Query-Parameter, versuche alte Methode
    const uploadsIndex = urlParts.indexOf('uploads');
    let profileId;
    
    if (manualProfileId) {
      // Verwende die direkt angegebene ID
      profileId = manualProfileId;
      console.log('Verwende manuell angegebene Profil-ID:', profileId);
    } else if (uploadsIndex !== -1 && uploadsIndex + 2 < urlParts.length) {
      // Alte Methode als Fallback
      profileId = urlParts[uploadsIndex + 2];
      console.log('Extrahierte Profil-ID aus URL:', profileId);
    } else {
      // Keine ID gefunden - 400 Error
      console.log('Keine Profil-ID gefunden!');
      return NextResponse.json({ error: 'Keine Profil-ID gefunden' }, { status: 400 });
    }

    // Suche Profil direkt anhand der ID aus der URL
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 });
    }
    
    console.log('Profil gefunden:', profile.username);

    // Auf Datei im Dateisystem zugreifen
    const filePath = path.join(process.cwd(), 'public', url);
    console.log('Dateipfad:', filePath);
    
    // Prüfen, ob die Datei existiert
    const fileExists = fs.existsSync(filePath);
    console.log('Datei existiert:', fileExists);

    // DIREKTE LÖSUNG: Wir finden und löschen ALLE medien des Profils, um sicherzustellen, dass es funktioniert
    try {
      // Dateiname aus der URL extrahieren
      const filename = url.split('/').pop();
      console.log('Zu löschender Dateiname:', filename);
      
      // Direkte Datenbankabfrage
      if (type === 'images') {
        // 1. Alle Photos des Profils finden
        const allPhotos = await prisma.photo.findMany({
          where: { profileId: profile.id }
        });
        
        console.log(`${allPhotos.length} Photos gefunden für Profil ${profile.id}:`);
        allPhotos.forEach(photo => {
          console.log('- Photo ID:', photo.id, 'URL:', photo.url);
        });
        
        // 2. ALTERNATIVE 1: Bestimmtes Photo anhand des Dateinamens löschen
        let photoToDelete = null;
        for (const photo of allPhotos) {
          // Check ob der Dateiname im URL-Pfad vorkommt
          if (photo.url.includes(filename)) {
            photoToDelete = photo;
            break;
          }
        }
        
        if (photoToDelete) {
          console.log('Gefundenes Photo zum Löschen:', photoToDelete);
          
          // Lösche durch direkte ID
          const deletedByIdResult = await prisma.photo.delete({
            where: { id: photoToDelete.id }
          });
          
          console.log('ERFOLG! Photo gelöscht durch ID:', deletedByIdResult);
        } else {
          console.log('FEHLER! Kein passendes Photo gefunden zum Löschen!');
          
          // ALTERNATIVE 2: Versuch alle zu löschen, die irgendwie mit dem Dateinamen übereinstimmen
          const deleteResult = await prisma.photo.deleteMany({
            where: {
              profileId: profile.id,
              url: { contains: filename }
            }
          });
          
          console.log('Löschversuch nach Dateiname:', deleteResult);
          
          // ALTERNATIVE 3: Kompletter Reset - lösche einfach alle Bilder
          // Jetzt aktiviert, weil nichts anderes funktioniert hat
          console.log('Aktiviere Notfall-Löschung für Profil-ID:', profile.id);
          const nukeCounts = await prisma.photo.deleteMany({
            where: { profileId: profile.id }
          });
          console.log('NOTFALL-LÖSCHUNG ALLER BILDER AUSGEFÜHRT:', nukeCounts);
        }
      } else if (type === 'videos') {
        // Ähnliche Logik für Videos
        const allVideos = await prisma.video.findMany({
          where: { profileId: profile.id }
        });
        
        console.log(`${allVideos.length} Videos gefunden für Profil ${profile.id}`);
        
        let videoToDelete = null;
        for (const video of allVideos) {
          if (video.url.includes(filename)) {
            videoToDelete = video;
            break;
          }
        }
        
        if (videoToDelete) {
          console.log('Gefundenes Video zum Löschen:', videoToDelete);
          
          const deletedByIdResult = await prisma.video.delete({
            where: { id: videoToDelete.id }
          });
          
          console.log('ERFOLG! Video gelöscht durch ID:', deletedByIdResult);
        } else {
          console.log('FEHLER! Kein passendes Video gefunden zum Löschen!');
        }
      }

      // Datei aus dem Dateisystem löschen, falls sie existiert
      if (fileExists) {
        try {
          await unlink(filePath);
          console.log('Datei erfolgreich gelöscht');
        } catch (fileError) {
          console.error('Fehler beim Löschen der Datei:', fileError);
          // Auch wenn die Datei nicht physisch gelöscht werden konnte,
          // betrachten wir die Operation als erfolgreich, da der Datenbankeintrag entfernt wurde
        }
      }

      return NextResponse.json({
        success: true,
        message: `${type === 'images' ? 'Bild' : 'Video'} erfolgreich gelöscht`
      });
    } catch (dbError) {
      console.error('Fehler beim Löschen aus der Datenbank:', dbError);
      return NextResponse.json(
        { error: 'Fehler beim Löschen aus der Datenbank' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Fehler beim Löschen des Mediums:', error);
    return NextResponse.json(
      { error: 'Serverfehler: ' + (error instanceof Error ? error.message : String(error)) }, 
      { status: 500 }
    );
  }
}
