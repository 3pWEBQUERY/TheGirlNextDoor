import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomUUID } from 'crypto';

// GET /api/profile - Hole das Profil des eingeloggten Benutzers oder anhand des Benutzernamens
export async function GET(request: Request) {
  try {
    // Prüfe, ob ein Benutzername in der URL angegeben wurde
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    
    // Wenn ein Benutzername übergeben wurde, hole das Profil anhand des Benutzernamens
    if (username) {
      console.log('Suche Profil für Benutzername:', username);
      
      try {
        // Suche nach dem Profil mit dem angegebenen Benutzernamen
        const profile = await prisma.profile.findUnique({
          where: { username },
          include: {
            photos: { 
              take: 1, // Nur das erste Foto für das Profilbild
              orderBy: { createdAt: 'desc' } 
            }
          },
        });
        
        console.log('Gefundenes Profil:', profile ? `ID: ${profile.id}, UserID: ${profile.userId}` : 'Keines');
        
        if (!profile) {
          return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 });
        }
        
        // Gib das Profil zurück (mit userId für die Nachrichtenfunktion)
        const result = {
          id: profile.id,
          userId: profile.userId, // Dies ist die wichtigste Information für die Nachrichtenfunktion
          username: profile.username,
          displayName: profile.username, // Profile hat kein displayName in diesem Schema
          bio: profile.bio,
          location: profile.location,
          profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].url : profile.profileImage
        };
        
        console.log('Zurückgegebene Daten:', result);
        
        return NextResponse.json(result);
      } catch (error) {
        console.error('Fehler beim Suchen des Profils nach Benutzername:', error);
        return NextResponse.json({ error: 'Serverfehler bei der Profilsuche' }, { status: 500 });
      }
    }
    
    // Andernfalls das eigene Profil abrufen wie bisher
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
        if (session?.user && session.user.email) {
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

    // Suche nach dem Profil des Benutzers mit allen verknüpften Daten
    let profile = null;
    try {
      // Profil mit allen Feldern abrufen - inklusive aller neuen Eigenschaftsfelder
      profile = await prisma.profile.findFirst({
        where: { userId: user.id },
        include: {
          services: true,
          rates: true,
          availability: true,
          photos: true,
          videos: true,
        },
      });
      
      // Log für Debugging
      console.log('Profil abgerufen mit allen Eigenschaften:', 
        profile ? Object.keys(profile).filter(k => k !== 'services' && k !== 'rates' && k !== 'availability' && k !== 'photos' && k !== 'videos') : 'kein Profil gefunden');
    } catch (dbError) {
      // Bei Fehler in der Datenbankabfrage: Fallback auf einfachere Abfrage
      console.error('Fehler bei der Profilabfrage:', dbError);
      try {
        // Einfachere Abfrage ohne verknüpfte Daten
        profile = await prisma.profile.findFirst({
          where: { userId: user.id },
        });
        
        // Manuelle Abfrage der verknüpften Daten
        if (profile) {
          const photos = await prisma.photo.findMany({
            where: { profileId: profile.id }
          });
          const videos = await prisma.video.findMany({
            where: { profileId: profile.id }
          });
          const services = await prisma.service.findMany({
            where: { profileId: profile.id }
          });
          const rates = await prisma.rate.findMany({
            where: { profileId: profile.id }
          });
          const availability = await prisma.availability.findMany({
            where: { profileId: profile.id }
          });
          
          // Manuelle Zusammenführung
          profile = {
            ...profile,
            photos,
            videos,
            services,
            rates,
            availability,
          };
        }
      } catch (fallbackError) {
        console.error('Auch Fallback-Abfrage fehlgeschlagen:', fallbackError);
        // Im Notfall ein leeres Profil mit Mindestdaten zurückgeben
        profile = {
          id: 'temp-' + user.id,
          userId: user.id,
          username: user.name || 'tempuser',
          bio: null,
          location: null,
          photos: [],
          videos: [],
          services: [],
          rates: [],
          availability: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          profileType: 'MITGLIED',
          verificationStatus: 'PENDING'
        };
      }
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 });
    }

    // HINWEIS: Alle zusätzlichen Abrufe entfernt, um die ursprüngliche Funktionalität wiederherzustellen
    console.log('Profil erfolgreich abgerufen:', { 
      id: profile.id, 
      username: profile.username,
      hasAvailability: !!profile.availability,
      hasPhotos: Array.isArray(profile.photos) ? profile.photos.length : 0,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Fehler beim Abrufen des Profils:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

// PUT /api/profile - Aktualisiere das Profil des eingeloggten Benutzers
export async function PUT(request: Request) {
  try {
    // In der Entwicklungsumgebung immer den ersten Benutzer verwenden
    // WARNUNG: Dies ist nur für Entwicklungszwecke, niemals für Produktion!
    let user = null;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Entwicklungsumgebung: Auth-Check wird umgangen in PUT /api/profile');
      // Ersten Benutzer in der Datenbank finden
      user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Im Produktionsmodus normale Auth verwenden
      try {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
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

    // Profildaten aus dem Request-Body extrahieren
    const profileData = await request.json();
    
    console.log('Erhaltene Profildaten:', profileData);
    
    // Verarbeite verschachtelte Objekte (stats, rates, availability)
    const stats: Record<string, any> = {};
    const rates: Record<string, any> = {};
    const availability: Record<string, any> = {};
    
    // Extrahiere stats.* Felder
    Object.keys(profileData).forEach(key => {
      if (key.startsWith('stats.')) {
        const statKey = key.replace('stats.', '');
        stats[statKey] = profileData[key];
        // Lösche das ursprüngliche Feld, damit es nicht doppelt verarbeitet wird
        delete profileData[key];
      } else if (key.startsWith('rates.')) {
        const rateKey = key.replace('rates.', '');
        rates[rateKey] = profileData[key];
        delete profileData[key];
      } else if (key.startsWith('availability.')) {
        const availKey = key.replace('availability.', '');
        availability[availKey] = profileData[key];
        delete profileData[key];
      }
    });
    
    // Füge die extrahierten Daten wieder als Objekte hinzu
    if (Object.keys(stats).length > 0) {
      profileData.stats = stats;
    }
    if (Object.keys(rates).length > 0) {
      profileData.rates = rates;
    }
    if (Object.keys(availability).length > 0) {
      profileData.availability = availability;
    }
    
    console.log('Verarbeitete Profildaten:', profileData);
    
    // Profil des Benutzers suchen
    let profile = await prisma.profile.findFirst({
      where: { userId: user.id },
    });
    
    if (!profile) {
      // Erstelle ein neues Profil, falls keines existiert
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          username: profileData.username || `user_${Date.now()}`, // Standardbenutzername, falls nicht angegeben
          profileType: profileData.profileType || 'ESCORT',
        },
      });
    }
    
    // Aktualisiere die Hauptprofildaten
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        username: profileData.username || profile.username,
        displayName: profileData.displayName,
        bio: profileData.bio,
        location: profileData.location,
        age: profileData.age ? parseInt(profileData.age.toString()) : null,
        gender: profileData.gender,
        // Das normale bodyType-Feld könnte überschrieben werden durch stats.bodyType
        bodyType: profileData.stats?.bodyType || profileData.bodyType,
        // Verwende stats-Daten oder Fallback auf normale Felder für Kompatibilität
        height: profileData.stats?.height ? parseInt(profileData.stats.height.toString()) : profileData.height ? parseInt(profileData.height.toString()) : null,
        weight: profileData.stats?.weight ? parseInt(profileData.stats.weight.toString()) : profileData.weight ? parseInt(profileData.weight.toString()) : null,
        // Zusätzliche Eigenschaftsfelder aus stats
        measurements: profileData.stats?.measurements || profileData.measurements,
        hair: profileData.stats?.hair || profileData.hair,
        eyes: profileData.stats?.eyes || profileData.eyes,
        hairLength: profileData.stats?.hairLength || profileData.hairLength,
        breastSize: profileData.stats?.breastSize || profileData.breastSize,
        breastType: profileData.stats?.breastType || profileData.breastType,
        intimate: profileData.stats?.intimate || profileData.intimate,
        tattoos: profileData.stats?.tattoos || profileData.tattoos,
        piercings: profileData.stats?.piercings || profileData.piercings,
        ethnicity: profileData.ethnicity,
        languages: profileData.languages || [],
        profileType: profileData.profileType || profile.profileType,
        // Neue zusätzliche Eigenschaftsfelder werden mit TypeCast behandelt
        ...(profileData.stats && {
          measurements: profileData.stats.measurements || null,
          hair: profileData.stats.hair || null,
          eyes: profileData.stats.eyes || null,
          hairLength: profileData.stats.hairLength || null,
          breastType: profileData.stats.breastType || null,
          breastSize: profileData.stats.breastSize || null,
          intimate: profileData.stats.intimate || null,
          tattoos: profileData.stats.tattoos || null,
          piercings: profileData.stats.piercings || null,
        } as any),
      },
    });

    // Services aktualisieren, falls vorhanden
    if (profileData.services && Array.isArray(profileData.services)) {
      // Lösche bestehende Services
      await prisma.service.deleteMany({
        where: { profileId: profile.id },
      });

      // Erstelle neue Services
      for (const service of profileData.services) {
        await prisma.service.create({
          data: {
            profileId: profile.id,
            name: service,
            description: '', // Optional, könnte auch aus profileData extrahiert werden
          },
        });
      }
    }

    // Rates aktualisieren, falls vorhanden
    if (profileData.rates) {
      // Lösche bestehende Rates
      await prisma.rate.deleteMany({
        where: { profileId: profile.id },
      });

      // Erstelle neue Rates basierend auf dem Schema
      if (profileData.rates.hourly !== undefined) {
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: '1 hour',
            price: parseFloat(profileData.rates.hourly || 0),
            description: 'Stundensatz',
          },
        });
      }

      if (profileData.rates.twoHours !== undefined) {
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: '2 hours',
            price: parseFloat(profileData.rates.twoHours || 0),
            description: '2 Stunden',
          },
        });
      }

      if (profileData.rates.daily !== undefined) {
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: '1 day',
            price: parseFloat(profileData.rates.daily || 0),
            description: 'Tagessatz',
          },
        });
      }

      if (profileData.rates.overnight !== undefined) {
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: 'overnight',
            price: parseFloat(profileData.rates.overnight || 0),
            description: 'Übernachtung',
          },
        });
      }

      if (profileData.rates.weekend !== undefined) {
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: 'weekend',
            price: parseFloat(profileData.rates.weekend || 0),
            description: 'Wochenende',
          },
        });
      }

      // Speichere zusätzliche Info zu Rates, falls vorhanden
      if (profileData.rates.info) {
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: 'info',
            price: 0,
            description: profileData.rates.info,
          },
        });
      }
    }

    // Verfügbarkeit aktualisieren, falls vorhanden
    if (profileData.availability) {
      // Lösche bestehende Verfügbarkeiten
      await prisma.availability.deleteMany({
        where: { profileId: profile.id },
      });

      // Erstelle neue Verfügbarkeiten
      const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      // Konvertiere day1-day7 zu Verfügbarkeitseinträgen
      for (let i = 1; i <= 7; i++) {
        const dayKey = `day${i}` as keyof typeof profileData.availability;
        const isAvailable = profileData.availability[dayKey] === 'true';
        
        if (isAvailable) {
          await prisma.availability.create({
            data: {
              profileId: profile.id,
              dayOfWeek: i % 7, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
              startTime: profileData.availability.fromTime || '09:00',
              endTime: profileData.availability.toTime || '17:00',
            },
          });
        }
      }
      
      // Verfügbarkeitsinformationen speichern (falls vorhanden)
      if (profileData.availability && profileData.availability.info) {
        console.log('Speichere Info aus dem Formular:', profileData.availability.info);
        
        // Speichere die Info in der Rate-Tabelle, die garantiert funktioniert
        // Lösche zuerst bestehende Info-Einträge
        await prisma.rate.deleteMany({
          where: { 
            profileId: profile.id,
            duration: 'availability-info' 
          }
        });
        
        // Speichere als speziellen Rate-Eintrag
        await prisma.rate.create({
          data: {
            profileId: profile.id,
            duration: 'availability-info',
            price: 0,
            description: profileData.availability.info,
          },
        });
        
        console.log('Verfügbarkeitsinformationen gespeichert als Rate-Eintrag');
      }
    }

    // Füge Medien hinzu, falls vorhanden (in einer echten Anwendung würde hier der Upload-Prozess stattfinden)
    // Die Medien-URLs würden normalerweise nach dem Upload zurückgegeben werden
    if (profileData.media?.images && Array.isArray(profileData.media.images)) {
      // Bei echten Uploads würden wir hier nicht alle löschen, sondern eher nach Änderungen suchen
      // Für diesen Beispielcode vereinfachen wir es

      for (const imageUrl of profileData.media.images) {
        // Prüfen, ob das Bild bereits existiert
        const existingPhoto = await prisma.photo.findFirst({
          where: { 
            profileId: profile.id,
            url: imageUrl
          }
        });
        
        // Nur erstellen, wenn es noch nicht existiert
        if (!existingPhoto) {
          await prisma.photo.create({
            data: {
              profileId: profile.id,
              url: imageUrl,
              isPublic: true,
            },
          });
        }
      }
    }

    if (profileData.media?.videos && Array.isArray(profileData.media.videos)) {
      for (const videoUrl of profileData.media.videos) {
        // Prüfen, ob das Video bereits existiert
        const existingVideo = await prisma.video.findFirst({
          where: { 
            profileId: profile.id,
            url: videoUrl
          }
        });
        
        // Nur erstellen, wenn es noch nicht existiert
        if (!existingVideo) {
          await prisma.video.create({
            data: {
              profileId: profile.id,
              url: videoUrl,
              title: `Video ${Date.now()}`,
              isPublic: true,
            },
          });
        }
      }
    }

    // Holen des aktualisierten Profils mit allen verknüpften Daten
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        services: true,
        rates: true,
        availability: true,
        photos: true,
        videos: true,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profils:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
