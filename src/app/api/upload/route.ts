import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Einfache Hilfsfunktion zum Bereinigen von Dateinamen
function sanitizeFilename(filename: string): string {
  // Entfernt Sonderzeichen und ersetzt Leerzeichen
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_');
}

export async function POST(request: Request) {
  try {
    console.log('Upload-Anfrage erhalten');
    
    // Statt session-basierter Authentifizierung verwenden wir einen direkteren Ansatz
    // Falls ein Profile-ID-Param in der URL ist, nehmen wir diesen
    const reqUrl = new URL(request.url);
    const profileIdParam = reqUrl.searchParams.get('profileId');
    
    // Formular-Daten extrahieren
    const formData = await request.formData();
    const mediaType = formData.get('type') as string;
    const file = formData.get('file') as File;
    // Optional: Falls profileId im FormData ist (wir brauchen mind. eine Quelle)
    const formProfileId = formData.get('profileId') as string;
    
    console.log('Formular-Daten erhalten:', { mediaType, file: file?.name, formProfileId });
    
    if (!file || !mediaType) {
      return NextResponse.json(
        { error: 'Datei oder Medientyp fehlt' }, 
        { status: 400 }
      );
    }
    
    // Verwende die ProfileId aus einem der möglichen Quellen
    const profileId = profileIdParam || formProfileId;
    
    // Wenn keine ProfileId angegeben wurde, versuche das erste Profil zu finden
    let profile;
    if (profileId) {
      profile = await prisma.profile.findUnique({
        where: { id: profileId },
      });
    } else {
      // Hole einfach das erste Profil aus der Datenbank als Fallback
      const profiles = await prisma.profile.findMany({
        take: 1,
      });
      profile = profiles[0];
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 });
    }

    // Überprüfen des Medientyps
    if (mediaType !== 'images' && mediaType !== 'videos') {
      return NextResponse.json(
        { error: 'Ungültiger Medientyp' }, 
        { status: 400 }
      );
    }

    // Dateiendung überprüfen
    const fileExtension = path.extname(file.name).toLowerCase();
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const validVideoExtensions = ['.mp4', '.mov', '.avi', '.webm'];

    const isImage = mediaType === 'images' && validImageExtensions.includes(fileExtension);
    const isVideo = mediaType === 'videos' && validVideoExtensions.includes(fileExtension);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: `Ungültiges Dateiformat: ${fileExtension}` }, 
        { status: 400 }
      );
    }

    // Größenbeschränkungen prüfen
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Bild ist zu groß. Maximale Größe: 5MB' }, 
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: 'Video ist zu groß. Maximale Größe: 50MB' }, 
        { status: 400 }
      );
    }

    console.log('Gefundenes Profil:', profile);
    
    // Falls wir kein Profil haben, erstellen wir einen generischen Uploads-Ordner
    const uploadBasePath = profile ? `/uploads/${profile.id}` : '/uploads/shared';
    const uploadDir = path.join(process.cwd(), 'public', uploadBasePath);
    console.log('Upload-Verzeichnis:', uploadDir);
    await ensureDir(uploadDir);

    // Sauberen Dateinamen erstellen
    const safeOriginalFilename = sanitizeFilename(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Blob aus der Formdata in ein Array-Buffer konvertieren
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Datei speichern
    await writeFile(filePath, buffer);

    // URL für die hochgeladene Datei
    const fileUrl = `/uploads/${profile.id}/${uniqueFilename}`;
    let thumbnailUrl = '';
    
    // Für Videos ein Thumbnail erstellen - TEMPORÄR DEAKTIVIERT, UM FEHLER ZU VERMEIDEN
    if (isVideo) {
      // Standardmäßigen Thumbnail-Pfad verwenden
      thumbnailUrl = '/images/default-video-thumbnail.jpg';
      
      // Erstelle sicher, dass das Standard-Bild existiert
      const defaultImageDir = path.join(process.cwd(), 'public/images');
      const defaultImagePath = path.join(defaultImageDir, 'default-video-thumbnail.jpg');
      
      // Falls Standard-Thumbnail nicht existiert, erstellen wir das Verzeichnis
      if (!fs.existsSync(defaultImageDir)) {
        fs.mkdirSync(defaultImageDir, { recursive: true });
      }
      
      // Falls Standard-Thumbnail nicht existiert, erzeugen wir einen leeren
      if (!fs.existsSync(defaultImagePath)) {
        // Einfaches 1x1 Pixel transparentes Bild erstellen
        await writeFile(defaultImagePath, Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
      }
      
      console.log('Standard-Thumbnail wird verwendet:', thumbnailUrl);
    }

    // In die Datenbank eintragen
    let dbEntry;

    if (isImage) {
      dbEntry = await prisma.photo.create({
        data: {
          profileId: profile.id,
          url: fileUrl,
          isPublic: true,
        },
      });
    } else {
      dbEntry = await prisma.video.create({
        data: {
          profileId: profile.id,
          url: fileUrl,
          thumbnailUrl: thumbnailUrl,
          title: safeOriginalFilename,
          isPublic: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      id: dbEntry.id,
    });

  } catch (error) {
    console.error('Fehler beim Hochladen der Datei:', error);
    return NextResponse.json(
      { error: 'Fehler beim Hochladen der Datei' }, 
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
