import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfileVideoGallery from '@/components/profile/ProfileVideoGallery';

// Hier würde normalerweise eine dynamische Metadaten-Funktion stehen
export const metadata: Metadata = {
  title: 'Profilseite | TheGND',
  description: 'Detailliertes Profil eines Anbieters auf TheGND',
};

// Mock-Daten für ein Beispielprofil
const mockProfileData = {
  username: 'sophia_berlin',
  displayName: 'Sophia',
  profileImage: '/escorts/escort2.jpg',
  location: 'Berlin',
  age: 25,
  bio: 'Hi, ich bin Sophia aus Berlin! Ich bin eine aufgeschlossene und lebenslustige Begleiterin für verschiedene Anlässe. In meiner Freizeit liebe ich es zu reisen, neue Restaurants zu entdecken und zu tanzen.',
  followers: 1245,
  following: 327,
  isVerified: true,
  stats: {
    height: 172,
    weight: 57,
    measurements: '85-60-90',
    hair: 'Blond',
    eyes: 'Blau',
  },
  services: [
    'Begleitung',
    'Dinner Date',
    'Reisebegleitung',
    'Hoteltreffen',
    'Besuch zu Hause',
    'Pärchen',
    'Fotoshooting',
  ],
  languages: ['Deutsch', 'Englisch', 'Französisch'],
  rates: {
    hourly: 250,
    twoHours: 450,
    overnight: 1500,
    weekend: 3500,
  },
  availability: {
    monday: '10:00 - 22:00',
    tuesday: '10:00 - 22:00',
    wednesday: '10:00 - 22:00',
    thursday: '10:00 - 22:00',
    friday: '10:00 - 24:00',
    saturday: '12:00 - 24:00',
    sunday: 'Nach Vereinbarung',
  },
  videos: [
    {
      id: '1',
      thumbnailUrl: '/escorts/escort1.jpg',
      videoUrl: '/videos/video1.mp4',
      caption: 'Ein Tag in Berlin #escortlife',
      views: 2456,
      likes: 245,
      createdAt: '2025-04-20',
    },
    {
      id: '2',
      thumbnailUrl: '/escorts/escort2.jpg',
      videoUrl: '/videos/video2.mp4',
      caption: 'Mein neues Outfit für heute Abend',
      views: 1834,
      likes: 178,
      createdAt: '2025-04-18',
    },
    {
      id: '3',
      thumbnailUrl: '/escorts/escort3.jpg',
      videoUrl: '/videos/video3.mp4',
      caption: 'Shopping-Tag in der Stadt',
      views: 3120,
      likes: 312,
      createdAt: '2025-04-15',
    },
    {
      id: '4',
      thumbnailUrl: '/escorts/escort4.jpg',
      videoUrl: '/videos/video4.mp4',
      caption: 'Sightseeing in Berlin',
      views: 1987,
      likes: 198,
      createdAt: '2025-04-12',
    },
  ],
};

export default function ProfilePage({ params }: { params: { username: string } }) {
  // In einer tatsächlichen Anwendung würden wir hier die Daten basierend auf dem Benutzernamen abrufen
  const profile = mockProfileData;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/discover" className="text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Zurück zur Übersicht
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
        
        {/* Video-Galerie mit TikTok-ähnlichen Videos (TikTok-Teil) */}
        <ProfileVideoGallery 
          videos={profile.videos} 
          username={profile.username}
        />
      </div>
    </div>
  );
}
