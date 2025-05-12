import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileVideoGallery from '@/components/profile/ProfileVideoGallery';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { standardServices, smServices, digitalServices, escortServices, ServiceOption } from '@/data/services';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Dynamische Metadaten-Funktion
export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const username = params.username;
  return {
    title: `${username} | TheGND`,
    description: `Detailliertes Profil von ${username} auf TheGND`,
  };
}

// Definiere ein Interface für die Profildaten, die wir zurückgeben
interface ProfileResponse {
  username: string;
  displayName: string;
  profileImage: string;
  location: string;
  age: number;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
  stats: {
    height: number;
    weight: number;
    measurements: string;
    hair: string;
    eyes: string;
    bodyType: string;
    hairLength: string;
    breastType: string;
    breastSize: string;
    intimate: string;
    piercings: string;
    tattoos: string;
  };
  services: string[];
  languages: string[];
  rates: {
    hourly: number;
    twoHours: number;
    overnight: number;
    weekend: number;
    info: string;
  };
  availability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    info: string;
  };
  photos: {
    id: string;
    url: string;
    caption: string;
    isPrimary: boolean;
    createdAt: string;
  }[];
  videos: {
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
    caption: string;
    views: number;
    likes: number;
    createdAt: string;
  }[];
}

// Hilfsfunktion zum Formatieren der Verfügbarkeitsdaten für einen einzelnen Eintrag
function formatAvailabilityTime(dayEntry: any): string {
  // Wenn kein Eintrag vorhanden ist
  if (!dayEntry) {
    return '';
  }
  
  // Wenn die erforderlichen Felder fehlen
  if (!dayEntry.startTime || !dayEntry.endTime) {
    console.log('Fehlende startTime oder endTime:', dayEntry);
    return '';
  }
  
  console.log(`Formatiere Verfügbarkeit für Tag ${dayEntry.dayOfWeek}:`, {
    startTime: dayEntry.startTime,
    endTime: dayEntry.endTime
  });
  
  // Formatiere die Zeitangaben für den Tag
  return `${dayEntry.startTime} - ${dayEntry.endTime}`;
}

// Hilfsfunktion zum Formatieren der Verfügbarkeitsdaten für jeden Tag
function formatAvailabilityDay(availability: any[] | undefined, dayOfWeek: number): string {
  if (!Array.isArray(availability)) {
    console.log(`Availability ist kein Array für Wochentag ${dayOfWeek}`);
    return '';
  }
  
  // Finde den Eintrag für den angegebenen Wochentag
  const dayEntry = availability.find(day => day.dayOfWeek === dayOfWeek);
  
  // Wenn kein Eintrag gefunden wurde, gebe einen leeren String zurück
  if (!dayEntry) {
    console.log(`Kein Eintrag für Wochentag ${dayOfWeek} gefunden`);
    return '';
  }
  
  console.log(`Eintrag für Wochentag ${dayOfWeek} gefunden:`, {
    startTime: dayEntry.startTime,
    endTime: dayEntry.endTime
  });
  
  // Gebe die formatierten Zeiten zurück
  return `${dayEntry.startTime} - ${dayEntry.endTime}`;
}

// Hilfsfunktion zum Finden eines passenden Services basierend auf dem Namen
function findFormattedServiceName(serviceName: string): string {
  // Alle Service-Listen kombinieren, um einmal zu durchsuchen
  const allServices: ServiceOption[] = [
    ...standardServices,
    ...smServices,
    ...digitalServices,
    ...escortServices
  ];
  
  // Service mit passendem Namen finden (case insensitive)
  const foundService = allServices.find(service => 
    service.name.toLowerCase() === serviceName.toLowerCase() ||
    service.id.toLowerCase() === serviceName.toLowerCase()
  );
  
  // Den Namen zurückgeben aus der services.ts oder den originalen Namen falls nicht gefunden
  return foundService ? foundService.name : serviceName;
}

// Hilfsfunktion zum Extrahieren eines bestimmten Preises aus der Rates-Tabelle
function findRateByDuration(rates: any[] | undefined, durationType: string): number {
  if (!Array.isArray(rates)) {
    console.log(`Keine Preisinformationen für ${durationType} gefunden (rates is not an array)`);
    return 0;
  }
  
  console.log(`Suche nach Preis für Dauer: '${durationType}' in:`, JSON.stringify(rates, null, 2));
  
  // Alle verschiedenen Duration-Werte anzeigen
  const allDurations = rates.map(rate => rate.duration);
  console.log('Verfügbare Duration-Werte:', allDurations);
  
  // Exakte Suche nach dem angegebenen Typ
  let rateEntry = rates.find(rate => rate.duration === durationType);
  
  // Falls nicht gefunden, versuche eine teilweise Übereinstimmung
  if (!rateEntry) {
    rateEntry = rates.find(rate => 
      rate.duration && rate.duration.toLowerCase().includes(durationType.toLowerCase())
    );
  }
  
  // Wenn kein Eintrag gefunden wurde, gebe 0 zurück
  if (!rateEntry) {
    console.log(`Kein Preis für Dauer '${durationType}' gefunden`);
    return 0;
  }
  
  console.log(`Preis für ${durationType} gefunden:`, rateEntry.price, 'Typ:', typeof rateEntry.price);
  
  // Sicherstellen, dass wir eine Nummer haben und sie korrekt formatieren
  const numericPrice = parseFloat(rateEntry.price) || 0;
  console.log('Konvertierter Preis:', numericPrice, 'Typ:', typeof numericPrice);
  
  return numericPrice;
}

// Hilfsfunktion zum Abrufen der Beschreibung aus den Rates
function getRatesDescription(rates: any[] | undefined): string {
  if (!Array.isArray(rates) || rates.length === 0) return '';
  
  // Versuche, eine Beschreibung zu finden
  const descriptionEntry = rates.find(rate => rate.description);
  return descriptionEntry?.description || '';
}

// Verbesserte Hilfsfunktion zum Extrahieren eines Preiswertes
function extractRateValue(rates: any[] | undefined, durationType: string): number {
  if (!Array.isArray(rates) || rates.length === 0) {
    console.log(`Keine Rate-Einträge für ${durationType} gefunden`);
    return 0;
  }
  
  console.log(`Suche nach Rate für: '${durationType}' in:`, rates.map(r => r.duration));
  
  // Exakte Suche nach dem gewünschten Durationstyp
  const rateEntry = rates.find(rate => rate.duration === durationType);
  
  if (!rateEntry) {
    console.log(`Keine Rate für ${durationType} gefunden`);
    return 0;
  }
  
  // Stelle sicher, dass wir eine Nummer haben
  const price = parseFloat(rateEntry.price);
  console.log(`Rate für ${durationType} gefunden:`, price);
  return isNaN(price) ? 0 : price;
}

// Hilfsfunktion zum Extrahieren der Ratenbeschreibung
function extractRateDescription(rates: any[] | undefined): string {
  if (!Array.isArray(rates) || rates.length === 0) return '';
  
  // Suche nach einem Eintrag mit Beschreibung
  const descriptionEntry = rates.find(rate => rate.description);
  return descriptionEntry?.description || '';
}

async function getProfileData(username: string): Promise<ProfileResponse & { userId?: string } | null> {
  const prisma = new PrismaClient();
  
  try {
    // Debug-Ausgabe vor der Datenbankabfrage
    console.log('Lade Profildaten für Username:', username);
    
    // Für TypeScript-Kompatibilität: Definiere einen erweiterten Typ für die Abfrage
    // Diese Typdefinition wird nur für TypeScript verwendet und hat keinen Einfluss auf die Datenabfrage
    type ExtendedProfile = typeof prisma.profile.findFirst extends (args: any) => Promise<infer T> 
      ? T & { 
          photos?: Array<any & { likes?: any[], views?: any[] }>, 
          videos?: Array<any & { likes?: any[] }>,
          services?: any[],
          rates?: any[],
          availability?: any
        } 
      : never;
    
    // Hole Profildaten aus der Datenbank
    const profile = await prisma.profile.findUnique({
      where: {
        username: username
      },
      include: {
        // Beziehe den User mit ein, um auf id, name und andere User-Eigenschaften zugreifen zu können
        user: true,
        // Alle relevanten Relationen einbeziehen mit einer expliziten Sortierreihenfolge
        photos: {
          // @ts-ignore Typ-Probleme umgehen - der Code funktioniert in Prisma trotz TypeScript-Fehler
          ...({ include: { likes: true, comments: true, views: true } } as any),
          orderBy: {
            createdAt: 'desc'
          }
        },
        videos: {
          // @ts-ignore: Neue Schema-Felder, die TypeScript noch nicht kennt
          include: {
            likes: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        services: true,
        rates: true,
        availability: true,
      }
    }) as ExtendedProfile;
    
    // Direktes Abfragen der Availability-Daten, um sicherzustellen, dass sie korrekt geladen werden
    const availabilityData = await prisma.availability.findMany({
      where: {
        profileId: profile?.id || ''
      },
      orderBy: {
        dayOfWeek: 'asc'
      }
    });
    
    console.log('DIREKTE AVAILABILITY-ABFRAGE:', JSON.stringify(availabilityData, null, 2));
    
    // Wir verwenden eine Prisma Raw Query, um die PhotoLike-Daten abzurufen
    if (profile?.photos && profile.photos.length > 0) {
      const firstPhotoId = profile.photos[0].id;
      // Direkte SQL-Abfrage verwenden
      const photoLikes = await prisma.$queryRaw`
        SELECT "PhotoLike".*, u.name as user_name, u.email as user_email 
        FROM "PhotoLike" 
        LEFT JOIN "User" u ON "PhotoLike"."userId" = u.id
        WHERE "PhotoLike"."photoId" = ${firstPhotoId}
      `;
      
      console.log('DIREKTE SQL-ABFRAGE FÜR PHOTOLIKES:', JSON.stringify(photoLikes, null, 2));
    }
    
    // Debug-Log für Videos (vor dem Mapping)
    console.log('Rohe Videos vom Profil:', JSON.stringify(profile?.videos, null, 2));
    
    await prisma.$disconnect();
    
    if (!profile) {
      console.log('Kein Profil gefunden für:', username);
      return null;
    }
    
    // Debug-Ausgabe für das gefundene Profil - hier sehen wir ALLE verfügbaren Felder
    console.log('Profil gefunden - ALLE FELDER:', JSON.stringify(profile, null, 2));
    console.log('Profil gefunden - Zusammenfassung:', {
      username: profile.username,
      photosCount: profile.photos?.length || 0,
      videosCount: profile.videos?.length || 0
    });
    
    // DETAILLIERTE Debug-Ausgabe für die Foto-Daten
    console.log('------- PHOTOS DEBUG START -------');
    if (Array.isArray(profile.photos) && profile.photos.length > 0) {
      console.log('Anzahl der Fotos:', profile.photos.length);
      
      // Rohdaten des ersten Fotos ausgeben, um die vollständige Struktur zu sehen
      const firstPhoto = profile.photos[0];
      console.log('Rohdaten des ersten Fotos:', JSON.stringify(firstPhoto, null, 2));
      
      // Prüfen der Struktur der likes-Eigenschaft
      console.log('Typ der likes-Eigenschaft:', typeof firstPhoto.likes);
      console.log('Ist likes ein Array?', Array.isArray(firstPhoto.likes));
      
      // Zusammenfassung der Likes, Kommentare und Views
      console.log('Zusammenfassung des ersten Fotos:', {
        id: firstPhoto.id,
        url: firstPhoto.url,
        likes: firstPhoto.likes, // Direkter Zugriff auf die Rohdaten
        likesCount: Array.isArray(firstPhoto.likes) ? firstPhoto.likes.length : 0,
        commentsCount: Array.isArray(firstPhoto.comments) ? firstPhoto.comments.length : 0,
        viewsCount: Array.isArray(firstPhoto.views) ? firstPhoto.views.length : 0
      });
      
      // Details der Likes und Kommentare des ersten Fotos
      if (Array.isArray(firstPhoto.likes) && firstPhoto.likes.length > 0) {
        console.log('Likes des ersten Fotos:', firstPhoto.likes);
      } else {
        console.log('Keine Likes vorhanden oder nicht als Array');
        // Versuchen, weitere Informationen über likes zu erhalten
        console.log('likes-Eigenschaft:', firstPhoto.likes);
        
        // Direkte Abfrage der PhotoLike-Tabelle für dieses Foto
        console.log('Versuche direkte Abfrage der PhotoLike-Tabelle...');
      }
      
      if (Array.isArray(firstPhoto.comments) && firstPhoto.comments.length > 0) {
        console.log('Kommentare des ersten Fotos:', firstPhoto.comments);
      }
    } else {
      console.log('Keine Fotos gefunden');
    }
    console.log('------- PHOTOS DEBUG END -------');
    
    // DETAILLIERTE Debug-Ausgabe für die Rate-Daten
    console.log('------- RATE DEBUG START -------');
    console.log('Rate-Tabellendaten:', JSON.stringify(profile.rates, null, 2));
    
    if (Array.isArray(profile.rates)) {
      console.log('Anzahl der Rate-Einträge:', profile.rates.length);
      
      // Jeden Rate-Eintrag einzeln loggen
      profile.rates.forEach((rate, index) => {
        console.log(`Rate #${index + 1}:`, {
          id: rate.id,
          duration: rate.duration,
          durationType: typeof rate.duration,
          price: rate.price,
          priceType: typeof rate.price,
          description: rate.description
        });
      });
      
      // Teste verschiedene Rate-Typen
      console.log('1 Stunde:', findRateByDuration(profile.rates, '1 Stunde'));
      console.log('2 Stunden:', findRateByDuration(profile.rates, '2 Stunden'));
      console.log('Übernachtung:', findRateByDuration(profile.rates, 'Übernachtung'));
      console.log('Wochenende:', findRateByDuration(profile.rates, 'Wochenende'));
    } else {
      console.log('Rate-Daten sind kein Array!');
    }
    console.log('------- RATE DEBUG END -------');
    
    // DETAILLIERTE Debug-Ausgabe für die Availability-Daten
    console.log('------- AVAILABILITY DEBUG START -------');
    console.log('Availability-Tabellendaten:', JSON.stringify(profile.availability, null, 2));
    
    if (Array.isArray(profile.availability)) {
      console.log('Anzahl der Availability-Einträge:', profile.availability.length);
      
      // Jeden Availability-Eintrag einzeln loggen
      profile.availability.forEach((avail, index) => {
        console.log(`Availability #${index + 1}:`, {
          id: avail.id,
          dayOfWeek: avail.dayOfWeek,
          startTime: avail.startTime,
          endTime: avail.endTime,
          description: avail.description
        });
      });
      
      // Teste alle Wochentage
      console.log('Montag (1):', formatAvailabilityDay(profile.availability, 1));
      console.log('Dienstag (2):', formatAvailabilityDay(profile.availability, 2));
      console.log('Mittwoch (3):', formatAvailabilityDay(profile.availability, 3));
      console.log('Donnerstag (4):', formatAvailabilityDay(profile.availability, 4));
      console.log('Freitag (5):', formatAvailabilityDay(profile.availability, 5));
      console.log('Samstag (6):', formatAvailabilityDay(profile.availability, 6));
      console.log('Sonntag (0):', formatAvailabilityDay(profile.availability, 0));
    } else {
      console.log('Availability-Daten sind kein Array!');
    }
    console.log('------- AVAILABILITY DEBUG END -------');
    
    // DETAILLIERTE Debug-Ausgabe für die Services-Daten
    console.log('------- SERVICES DEBUG START -------');
    console.log('Services-Tabellendaten:', JSON.stringify(profile.services, null, 2));
    
    if (Array.isArray(profile.services)) {
      console.log('Anzahl der Service-Einträge:', profile.services.length);
      
      // Jeden Service-Eintrag einzeln loggen und Umwandlung demonstrieren
      profile.services.forEach((service, index) => {
        const serviceId = service.id || '';
        const serviceName = service.name || '';
        const formattedName = findFormattedServiceName(serviceName);
        
        console.log(`Service #${index + 1}:`, {
          id: serviceId,
          name_from_db: serviceName,
          formatted_name: formattedName,
          description: service.description
        });
      });
      
      // Debug-Info für die formatierte Service-Liste
      const formattedServices = profile.services.map(service => findFormattedServiceName(service.name || '')).filter(Boolean);
      console.log('Formatierte Service-Liste:', formattedServices);
    } else {
      console.log('Services-Daten sind kein Array!');
    }
    console.log('------- SERVICES DEBUG END -------');
    
    // Sicherer Zugriff auf die Profilfelder mit Type Assertion
    const typedProfile = profile as any;
    
    // Transformiere Datenbankdaten in das Format für die Komponenten
    return {
      username: profile.username,
      displayName: profile.displayName || profile.username,
      profileImage: (profile.photos && profile.photos.length > 0) ? profile.photos[0].url : '/images/default-avatar.png',
      location: profile.location || '',
      age: profile.age || 0,
      bio: profile.bio || '',
      followers: 0, // Wird später implementiert
      following: 0, // Wird später implementiert
      isVerified: profile.verificationStatus === 'VERIFIED',
      userId: typedProfile.user?.id || undefined, // Für den Vergleich mit der Session
      stats: {
        height: typedProfile.height || 0,
        weight: typedProfile.weight || 0,
        measurements: typedProfile.measurements || '',
        hair: typedProfile.hair || '',
        eyes: typedProfile.eyes || '',
        bodyType: typedProfile.bodyType || '',
        hairLength: typedProfile.hairLength || '',
        breastType: typedProfile.breastType || '',
        breastSize: typedProfile.breastSize || '',
        intimate: typedProfile.intimate || '',
        piercings: typedProfile.piercings || '',
        tattoos: typedProfile.tattoos || '',
      },
      services: Array.isArray(profile.services) ? profile.services.map(service => findFormattedServiceName(service.name || '')).filter(Boolean) : [],
      languages: typedProfile.languages || [],
      rates: {
        // Verwende die englischen Bezeichnungen aus der Datenbank
        hourly: extractRateValue(profile.rates, '1 hour'),
        twoHours: extractRateValue(profile.rates, '2 hours'),
        overnight: extractRateValue(profile.rates, 'overnight'),
        weekend: extractRateValue(profile.rates, 'weekend'),
        info: extractRateDescription(profile.rates),
      },
      availability: {
        // Direkt auf die direkt abgefragten Availability-Daten zugreifen
        monday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 1)),
        tuesday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 2)),
        wednesday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 3)),
        thursday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 4)),
        friday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 5)),
        saturday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 6)),
        sunday: formatAvailabilityTime(availabilityData.find(a => a.dayOfWeek === 0)),
        info: availabilityData.length > 0 && availabilityData[0]?.description ? availabilityData[0].description : '',
      },
      // Robuste Verarbeitung der Fotos mit Fehlerbehandlung
      photos: Array.isArray(profile.photos) ? profile.photos.map(photo => {
        // Debug-Ausgabe für jedes Foto
        console.log('Verarbeite Foto:', { 
          id: photo.id, 
          url: photo.url,
          isPublic: photo.isPublic
        });
        
        // Absoluten Pfad für lokale Dateien ggf. präfixieren
        let photoUrl = '/images/default-photo.jpg'; // Fallback-Bild
        
        if (photo.url) {
          photoUrl = photo.url.startsWith('http') ? 
            photo.url : 
            photo.url.startsWith('/') ? photo.url : `/${photo.url}`;
        }
          
        // Zähle die tatsächlichen Likes, Comments und Views aus den Datenbank-Relationen
        const likesCount = Array.isArray(photo.likes) ? photo.likes.length : 0;
        const commentsCount = Array.isArray(photo.comments) ? photo.comments.length : 0;
        const viewsCount = Array.isArray(photo.views) ? photo.views.length : 0;
        
        // Debug-Ausgabe für die Likes-Zählung
        console.log(`Foto ${photo.id} Likes:`, {
          likesArray: photo.likes,
          likesCount: likesCount,
          commentsCount: commentsCount,
          viewsCount: viewsCount
        });
        
        return {
          id: photo.id,
          url: photoUrl,
          caption: '', // Caption existiert noch nicht in der Datenbank
          isPrimary: false,
          createdAt: photo.createdAt ? photo.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          likes: likesCount, // Tatsächliche Likes aus der Datenbank
          comments: commentsCount, // Tatsächliche Kommentare aus der Datenbank
          views: viewsCount  // Tatsächliche Views aus der Datenbank
        };
      }) : [],
      
      // Robuste Verarbeitung der Videos mit Fehlerbehandlung
      videos: Array.isArray(profile.videos) ? profile.videos.map(video => {
        // Debug-Ausgabe für jedes Video
        console.log('Verarbeite Video:', { 
          id: video.id, 
          title: video.title || '(kein Titel)', 
          url: video.url || '(keine URL)', 
          isPublic: video.isPublic
        });
        
        // Absoluten Pfad für lokale Dateien ggf. präfixieren
        let videoUrl = video.url || '';
        
        // Stelle sicher, dass die URL-Pfade korrekt sind und starte nicht mit blob:http
        if (videoUrl && !videoUrl.startsWith('blob:')) {
          // Wenn die URL nicht mit http oder / beginnt, füge / hinzu
          if (!videoUrl.startsWith('http') && !videoUrl.startsWith('/')) {
            videoUrl = `/${videoUrl}`;
          }
        } else if (videoUrl.startsWith('blob:')) {
          // Wenn es eine Blob-URL ist, verwende einen Platzhalter
          console.log('Blob-URL gefunden, verwende Platzhalter');
          videoUrl = '/videos/default.mp4';
        }
        
        // Verwende dieselbe Logik für das Thumbnail - falls vorhanden
        // Das Video selbst kann als Thumbnail verwendet werden
        let thumbnailUrl = videoUrl;
        if (!thumbnailUrl || thumbnailUrl === '/videos/default.mp4') {
          thumbnailUrl = '/images/default-thumbnail.jpg';
        }
        
        return {
          id: video.id || `video-${Math.random().toString(36).substring(2, 9)}`,
          thumbnailUrl: thumbnailUrl,
          videoUrl: videoUrl,
          caption: video.title || '',
          views: Array.isArray(video.likes) ? video.likes.length : 0,
          likes: Array.isArray(video.likes) ? video.likes.length : 0,
          createdAt: video.createdAt ? video.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };
      }) : [],
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    await prisma.$disconnect();
    return null;
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  // Hole die aktuelle Benutzersitzung
  const session = await getServerSession(authOptions);
  
  // Debugging: Zeige Session und Username im Server-Log
  console.log('Aktuelle Session:', JSON.stringify(session, null, 2));
  console.log('URL Username Parameter:', params.username);
  console.log('Session user.email:', session?.user?.email);
  console.log('Session user.name:', session?.user?.name);
  console.log('Session user.id:', session?.user?.id);
  
  // Hole echte Profildaten aus der Datenbank
  const profile = await getProfileData(params.username);
  
  // Wenn kein Profil gefunden wurde, zeige 404
  if (!profile) {
    notFound();
  }
  
  // Debug: Vollständige Profildaten anzeigen
  console.log('Vollständige Profildaten:', {
    profileUsername: profile.username,
    profileUserId: profile.userId,
    sessionUser: session?.user
  });

  // WICHTIG: Hier zeigen wir immer den Edit-Button als temporärer Fix, während wir das Auth-Problem beheben
  const isOwnProfile = true; // Temporär immer anzeigen, bis wir die Authentifizierungsprobleme gelöst haben
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/discover" className="text-rose-700 hover:text-rose-800 transition-colors inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Zurück zur Übersicht
          </Link>
          
          {/* Bearbeiten-Button - temporär immer sichtbar als Workaround */}
          <Link 
            href="/dashboard/my-profile" 
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-md text-sm font-medium inline-flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
            Profil bearbeiten
          </Link>
        </div>
        
        {/* Profilkopf mit grundlegenden Informationen */}
        <ProfileHeader 
          username={profile.username}
          displayName={profile.displayName}
          profileImage={profile.profileImage}
          location={profile.location}
          age={profile.age}
          bio={profile.bio}
          followers={profile.followers}
          following={profile.following}
          isVerified={profile.isVerified}
        />
        
        {/* Profil-Details mit strukturierten Informationen (Directory-Teil) */}
        <ProfileDetails 
          stats={profile.stats}
          services={profile.services}
          languages={profile.languages}
          rates={profile.rates}
          availability={profile.availability}
        />
        
        {/* Video-Galerie und Fotogalerie */}
        {(profile.videos && profile.videos.length > 0) || (profile.photos && profile.photos.length > 0) ? (
          <ProfileVideoGallery 
            videos={profile.videos || []} 
            photos={profile.photos || []}
            username={profile.username}
          />
        ) : null}
      </div>
    </div>
  );
}
