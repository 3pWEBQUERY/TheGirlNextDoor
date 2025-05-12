'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BasicInfoForm from './components/BasicInfoForm';
import StatsForm from './components/StatsForm';
import MediaForm from './components/MediaForm';
import ServicesForm from './components/ServicesForm';
import RatesForm from './components/RatesForm';
import AvailabilityForm from './components/AvailabilityForm';

// Profil-Typ basierend auf dem Datenbankschema
export type ProfileData = {
  username: string;
  displayName?: string;
  profileImage?: string;
  location?: string;
  age?: number;
  bio?: string;
  isVerified?: boolean;
  profileType?: 'ESCORT' | 'MITGLIED' | 'AGENCY' | 'USER'; // Profiltyp hinzugefügt
  services?: string[];
  languages?: string[];
  media?: {
    images?: string[];
    videos?: string[];
    videoTitles?: Record<string, string>;
  };
  stats?: {
    height?: number;
    weight?: number;
    measurements?: string;
    hair?: string;
    eyes?: string;
    bodyType?: string;
    hairLength?: string;
    breastType?: string;
    breastSize?: string;
    intimate?: string;
    tattoos?: string;
    piercings?: string;
  };
  rates?: {
    hourly?: number;
    twoHours?: number;
    daily?: number;
    overnight?: number;
    weekend?: number;
    info?: string;
  };
  availability?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    fromTime?: string;
    toTime?: string;
    info?: string;
    day1?: string;
    day2?: string;
    day3?: string;
    day4?: string;
    day5?: string;
    day6?: string;
    day7?: string;
  };
};

export default function MyProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('basicInfo');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newService, setNewService] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    displayName: '',
    profileImage: '',
    location: '',
    age: 0,
    bio: '',
    isVerified: false,
    services: [],
    languages: [],
    media: {
      images: [],
      videos: [],
      videoTitles: {},
    },
    stats: {
      height: 0,
      weight: 0,
      measurements: '',
      hair: '',
      eyes: '',
      bodyType: '',
    },
    rates: {
      hourly: 0,
      twoHours: 0,
      daily: 0,
      overnight: 0,
      weekend: 0,
      info: '',
    },
    availability: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
      fromTime: '',
      toTime: '',
      info: '',
      day1: '',
      day2: '',
      day3: '',
      day4: '',
      day5: '',
      day6: '',
      day7: '',
    },
  });
  
  // Profildaten laden
  useEffect(() => {
    // Überprüfen, ob der Benutzer eingeloggt ist
    if (!user) {
      router.push('/login?redirect=/dashboard/my-profile');
      return;
    }
    
    // Echte Profildaten aus der Datenbank laden über die API
    const fetchProfileData = async () => {
      try {
        setIsSaving(true); // Lade-Zustand aktivieren
        
        // Echt API-Aufruf, um Profildaten abzurufen
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Profils');
        }
        
        const profileFromDb = await response.json();
        
        // Transformiere die Datenbankdaten in das Format, das von unserer Anwendung verwendet wird
        const transformedProfile: ProfileData = {
          username: profileFromDb.username || '',
          displayName: profileFromDb.displayName || profileFromDb.username || '',
          profileImage: profileFromDb.photos && profileFromDb.photos.length > 0 
            ? profileFromDb.photos[0].url 
            : '/images/default-avatar.png',
          location: profileFromDb.location || '',
          age: profileFromDb.age || 0,
          bio: profileFromDb.bio || '',
          isVerified: profileFromDb.verificationStatus === 'VERIFIED',
          
          // Extrahiere Services aus der Datenbank
          services: profileFromDb.services?.map((service: { name: string }) => service.name) || [],
          
          // Sprachen direkt aus dem Profil
          languages: profileFromDb.languages || [],
          
          // Medien-URLs aus Photos und Videos extrahieren
          media: {
            images: profileFromDb.photos?.map((photo: { url: string }) => photo.url) || [],
            videos: profileFromDb.videos?.map((video: { url: string }) => video.url) || [],
            // Videotitel in eine Map (url -> title) konvertieren
            videoTitles: profileFromDb.videos?.reduce((titles: Record<string, string>, video: { url: string, title?: string }) => {
              if (video.url && video.title) {
                titles[video.url] = video.title;
              }
              return titles;
            }, {}) || {},
          },
          
          // Stats aus den Profildaten zusammenstellen
          stats: {
            height: profileFromDb.height || 0,
            weight: profileFromDb.weight || 0,
            measurements: profileFromDb.measurements || '',
            hair: profileFromDb.hair || '',
            eyes: profileFromDb.eyes || '',
            bodyType: profileFromDb.bodyType || '',
            hairLength: profileFromDb.hairLength || '',
            breastType: profileFromDb.breastType || '',
            breastSize: profileFromDb.breastSize || '',
            intimate: profileFromDb.intimate || '',
            tattoos: profileFromDb.tattoos || '',
            piercings: profileFromDb.piercings || '',
          },
          
          // Rates aus der Datenbank transformieren
          rates: {
            hourly: profileFromDb.rates?.find((rate: { duration: string; price: number }) => rate.duration === '1 hour')?.price || 0,
            twoHours: profileFromDb.rates?.find((rate: { duration: string; price: number }) => rate.duration === '2 hours')?.price || 0,
            daily: profileFromDb.rates?.find((rate: { duration: string; price: number }) => rate.duration === '1 day')?.price || 0,
            overnight: profileFromDb.rates?.find((rate: { duration: string; price: number }) => rate.duration === 'overnight')?.price || 0,
            weekend: profileFromDb.rates?.find((rate: { duration: string; price: number }) => rate.duration === 'weekend')?.price || 0,
            info: profileFromDb.rates?.find((rate: { duration: string; description?: string }) => rate.duration === 'info')?.description || '',
          },
          
          // Verfügbarkeit aus der Datenbank extrahieren
          availability: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: '',
            fromTime: profileFromDb.availability?.[0]?.startTime || '09:00',
            toTime: profileFromDb.availability?.[0]?.endTime || '17:00',
            info: '',
            day1: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 1) ? 'true' : '',
            day2: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 2) ? 'true' : '',
            day3: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 3) ? 'true' : '',
            day4: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 4) ? 'true' : '',
            day5: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 5) ? 'true' : '',
            day6: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 6) ? 'true' : '',
            day7: profileFromDb.availability?.some((a: { dayOfWeek: number }) => a.dayOfWeek === 0) ? 'true' : '',
          },
        };
        
        setProfileData(transformedProfile);
      } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
        
        // Initialisiere mit Standardwerten bei Fehler
        setProfileData({
          username: user?.name || '',
          displayName: '',
          profileImage: '/images/default-avatar.png',
          location: '',
          age: 0,
          bio: '',
          isVerified: false,
          services: [],
          languages: [],
          media: {
            images: [],
            videos: [],
          },
          stats: {
            height: 0,
            weight: 0,
            measurements: '',
            hair: '',
            eyes: '',
            bodyType: '',
          },
          rates: {
            hourly: 0,
            twoHours: 0,
            daily: 0,
            overnight: 0,
            weekend: 0,
            info: '',
          },
          availability: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: '',
            fromTime: '',
            toTime: '',
            info: '',
            day1: '',
            day2: '',
            day3: '',
            day4: '',
            day5: '',
            day6: '',
            day7: '',
          },
        });
      } finally {
        setIsSaving(false); // Lade-Zustand deaktivieren
      }
    };
    
    fetchProfileData();
  }, [user, router]);
  
  // Eingabeänderungen verarbeiten
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Verschachtelte Eigenschaften verarbeiten (stats, rates, availability)
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setProfileData(prev => {
        // Sicherstellen, dass die Kategorie vorhanden ist oder ein leeres Objekt erstellen
        const categoryKey = category as keyof ProfileData;
        // Wir benutzen Record<string, any> um sicherzustellen, dass es sich um ein Objekt handelt
        const categoryObj = (prev[categoryKey] as Record<string, any>) || {};
        
        return {
          ...prev,
          [category]: {
            ...categoryObj,
            [field]: value
          }
        };
      });
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Behandelt Änderungen an Arrays (Services, Sprachen)
  const handleArrayInput = (type: 'services' | 'languages', value: string) => {
    if (!value.trim()) return;
    
    setProfileData(prev => {
      // Sicherstellen, dass wir eine Kopie des vorherigen Arrays haben oder ein neues Array erstellen
      const currentArray = prev[type] ? [...prev[type]] : [];
      
      return {
        ...prev,
        [type]: [...currentArray, value]
      };
    });
  };
  
  // Entfernt einen Eintrag aus einem Array
  const handleRemoveArrayItem = (type: 'services' | 'languages', index: number) => {
    setProfileData(prev => {
      // Sicherstellen, dass wir mit einem gültigen Array arbeiten
      const currentArray = prev[type] ? [...prev[type]] : [];
      
      return {
        ...prev,
        [type]: currentArray.filter((_, i) => i !== index)
      };
    });
  };
  
  // Profil speichern
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Echten API-Aufruf verwenden, um das Profil zu aktualisieren
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Speichern des Profils');
      }
      
      // Aktualisierte Profildaten zurückerhalten
      const updatedProfile = await response.json();
      
      // Erfolgreiche Speicherung anzeigen
      setSaveSuccess(true);
      
      // Nach 3 Sekunden die Erfolgsmeldung ausblenden
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      alert('Das Profil konnte nicht gespeichert werden. Bitte versuche es später erneut.');
    } finally {
      setIsSaving(false);
    }
  }
  
  // Handler für das Hochladen von Medien
  const handleMediaUpload = async (files: File[], type: 'images' | 'videos'): Promise<void> => {
    try {
      setIsSaving(true);
      console.log(`Uploading ${files.length} ${type}...`);
      
      const uploadedUrls: string[] = [];
      
      // Dateien nacheinander hochladen
      for (const file of files) {
        // FormData erstellen für den Upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        // Datei zum Server hochladen über die API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload fehlgeschlagen');
        }
        
        const result = await response.json();
        console.log('Upload result:', result);
        
        if (result.success && result.url) {
          uploadedUrls.push(result.url);
        }
      }
      
      // Aktualisiere den state mit den neuen Medien
      setProfileData(prevData => ({
        ...prevData,
        media: {
          ...prevData.media,
          [type]: [...(prevData.media?.[type] || []), ...uploadedUrls]
        }
      }));
      
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      setIsSaving(false);
      throw error;
    }
  };
  
  // Handler für die Aktualisierung von Videotiteln
  const handleVideoTitleUpdate = async (url: string, title: string) => {
    try {
      // Aktualisiere den Titel in der lokalen Daten-Struktur
      setProfileData(prev => ({
        ...prev,
        media: {
          ...prev.media,
          videoTitles: {
            ...prev.media?.videoTitles,
            [url]: title
          }
        }
      }));
      
      // Hier würde man normalerweise eine API-Anfrage senden, um den Titel in der Datenbank zu aktualisieren
      // Zum Beispiel:
      const response = await fetch(`/api/videos/update-title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, title }),
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Videotitels');
      }
      
      // Erfolgsmeldung anzeigen
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      return response.json();
    } catch (error) {
      console.error('Error updating video title:', error);
      throw error;
    }
  };

  // Handler für das Löschen von Medien
  const handleMediaDelete = async (url: string, type: 'images' | 'videos') => {
    try {
      setIsSaving(true);
      console.log(`Lösche ${type} mit URL: ${url}`);
      
      // API-Aufruf zum Löschen des Mediums auf dem Server
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Löschen fehlgeschlagen');
      }
      
      const result = await response.json();
      console.log('Löschergebnis:', result);
      
      if (result.success) {
        // Aktualisiere den state und entferne das Medium
        setProfileData(prevData => ({
          ...prevData,
          media: {
            ...prevData.media,
            [type]: prevData.media?.[type]?.filter(item => item !== url) || []
          }
        }));
        
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      setIsSaving(false);
      throw error;
    }
  };

  // Wenn der Benutzer nicht eingeloggt ist, Umleitung
  if (!user) {
    return null; // useEffect wird die Umleitung übernehmen
  }

  // Rendere den entsprechenden Tab basierend auf activeTab
  const renderActiveTabContent = () => {
    // Prüfe, ob das Profil vom Typ MITGLIED ist
    const isMitglied = profileData.profileType === 'MITGLIED';
    
    switch (activeTab) {
      case 'basicInfo':
        return <BasicInfoForm profileData={profileData} handleInputChange={handleInputChange} />;
      case 'stats':
        // Stats nur für Escorts anzeigen
        return isMitglied ? 
          <div className="text-center py-8">
            <p>Dieser Bereich ist nur für Escort-Profile verfügbar.</p>
          </div> : 
          <StatsForm profileData={profileData} handleInputChange={handleInputChange} />;
      case 'media':
        // Medien für alle Profiltypen erlauben
        return <MediaForm 
          profileData={profileData}
          handleInputChange={handleInputChange}
          handleMediaUpload={handleMediaUpload}
          handleMediaDelete={handleMediaDelete}
          handleVideoTitleUpdate={handleVideoTitleUpdate}
        />;
      case 'services':
        // Services nur für Escorts anzeigen
        return isMitglied ? 
          <div className="text-center py-8">
            <p>Dieser Bereich ist nur für Escort-Profile verfügbar.</p>
          </div> : 
          <ServicesForm 
            profileData={profileData}
            newService={newService}
            setNewService={setNewService}
            handleArrayInput={handleArrayInput}
            handleRemoveArrayItem={handleRemoveArrayItem}
          />;
      case 'rates':
        // Preise nur für Escorts anzeigen
        return isMitglied ? 
          <div className="text-center py-8">
            <p>Dieser Bereich ist nur für Escort-Profile verfügbar.</p>
          </div> : 
          <RatesForm profileData={profileData} handleInputChange={handleInputChange} />;
      case 'availability':
        // Verfügbarkeit nur für Escorts anzeigen
        return isMitglied ? 
          <div className="text-center py-8">
            <p>Dieser Bereich ist nur für Escort-Profile verfügbar.</p>
          </div> : 
          <AvailabilityForm profileData={profileData} handleInputChange={handleInputChange} />;
      default:
        return <BasicInfoForm profileData={profileData} handleInputChange={handleInputChange} />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mein Profil</h1>
          <p className="text-gray-600">Verwalte deine Profilinformationen</p>
        </div>
        <Link href={profileData?.username ? `/u/${profileData.username}` : '#'} className="text-rose-700 hover:text-rose-800 flex items-center">
          <span>Öffentliches Profil anzeigen</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {/* Grundinformationen Tab (für alle Profiltypen) */}
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basicInfo' 
                ? 'border-rose-700 text-rose-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('basicInfo')}
          >
            Grundinformationen
          </button>
          
          {/* Eigenschaften Tab (nur für ESCORT) */}
          {profileData.profileType !== 'MITGLIED' && (
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats' 
                  ? 'border-rose-700 text-rose-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Eigenschaften
            </button>
          )}
          
          {/* Medien Tab (für alle Profiltypen) */}
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'media' 
                ? 'border-rose-700 text-rose-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('media')}
          >
            Medien
          </button>
          
          {/* Services Tab (nur für ESCORT) */}
          {profileData.profileType !== 'MITGLIED' && (
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services' 
                  ? 'border-rose-700 text-rose-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Services & Sprachen
            </button>
          )}
          
          {/* Preise Tab (nur für ESCORT) */}
          {profileData.profileType !== 'MITGLIED' && (
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rates' 
                  ? 'border-rose-700 text-rose-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('rates')}
            >
              Preise
            </button>
          )}
          
          {/* Verfügbarkeit Tab (nur für ESCORT) */}
          {profileData.profileType !== 'MITGLIED' && (
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'availability' 
                  ? 'border-rose-700 text-rose-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('availability')}
            >
              Verfügbarkeit
            </button>
          )}
        </nav>
      </div>
      
      {/* Formular */}
      <div className="bg-white shadow-sm rounded-md p-6 mb-6">
        {renderActiveTabContent()}
      </div>
      
      {/* Speichern Button */}
      <div className="flex justify-end">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Erfolgreich gespeichert!</span>
          </div>
        )}
        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className={`px-4 py-2 ${
            isSaving ? 'bg-gray-400' : 'bg-rose-700 hover:bg-rose-800'
          } text-white rounded-md transition-colors flex items-center`}
        >
          {isSaving && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSaving ? 'Wird gespeichert...' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}
