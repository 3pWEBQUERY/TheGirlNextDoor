import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // In der Entwicklungsumgebung immer den ersten Benutzer verwenden
    // WARNUNG: Dies ist nur für Entwicklungszwecke, niemals für Produktion!
    let user = null;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Entwicklungsumgebung: Auth-Check wird umgangen');
      // Ersten Benutzer in der Datenbank finden
      user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Im Produktionsmodus normale Auth verwenden
      try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          user = await prisma.user.findUnique({
            where: { email: session.user.email },
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    // Profil des Benutzers abrufen
    // Mit expliziter Selektion der Felder, die definitiv existieren
    let profile = null;
    try {
      profile = await prisma.profile.findFirst({
        where: { userId: user.id },
        select: {
          id: true,
          userId: true,
        },
      });
    } catch (dbError) {
      console.error('Fehler beim Profil-Abruf:', dbError);
      // Erstelle ein Minimal-Profil bei Fehler
      profile = { id: 'temp-' + user.id, userId: user.id };
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 });
    }

    // Formular-Daten extrahieren
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Datei fehlt' }, 
        { status: 400 }
      );
    }

    // Dateiendung überprüfen
    const fileExtension = path.extname(file.name).toLowerCase();
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!validImageExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Ungültiges Dateiformat: ${fileExtension}. Erlaubt sind nur: ${validImageExtensions.join(', ')}` }, 
        { status: 400 }
      );
    }

    // Größenbeschränkung prüfen
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Bild ist zu groß. Maximale Größe: 5MB' }, 
        { status: 400 }
      );
    }

    // Upload-Verzeichnis erstellen, falls es nicht existiert
    const uploadDir = path.join(process.cwd(), 'public/uploads/profiles', profile.id);
    await ensureDir(uploadDir);

    // Eindeutigen Dateinamen generieren
    const uniqueFilename = `profile_${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Blob aus der Formdata in ein Array-Buffer konvertieren
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Datei speichern
    await writeFile(filePath, buffer);

    // URL für die hochgeladene Datei
    const fileUrl = `/uploads/profiles/${profile.id}/${uniqueFilename}`;

    // Als erstes Foto in der Galerie speichern
    console.log('Profilbild hochgeladen nach:', fileUrl);
    
    // Lösche alte Fotos mit isProfileImage-Markierung, falls vorhanden
    await prisma.photo.updateMany({
      where: { 
        profileId: profile.id,
        isPublic: true
      },
      data: {
        isPublic: true  // Stelle sicher, dass alle Bilder öffentlich sind
      }
    });
    
    // Eintrag in der Datenbank erstellen - sowohl als Foto als auch als Profilbild
    await prisma.photo.create({
      data: {
        profileId: profile.id,
        url: fileUrl,
        isPublic: true,
      },
    });
    
    // Aktualisiere das profileImage in der Profile-Tabelle
    await prisma.$executeRaw`UPDATE "Profile" SET "profileImage" = ${fileUrl} WHERE "id" = ${profile.id}`;
    
    console.log(`Profilbild wurde gespeichert: ${fileUrl} für Profil ${profile.id}`);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });

  } catch (error) {
    console.error('Fehler beim Hochladen des Profilbildes:', error);
    return NextResponse.json(
      { error: 'Fehler beim Hochladen des Profilbildes' }, 
      { status: 500 }
    );
  }
}

// Hilfsfunktion zum sicherstellen, dass ein Verzeichnis existiert
async function ensureDir(dirPath: string) {
  try {
    await import('fs').then(fs => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  } catch (error) {
    console.error('Fehler beim Erstellen des Verzeichnisses:', error);
    throw error;
  }
}
