"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  profileImage: string;
  location: string;
  age: number;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
}

const ProfileHeader = ({
  username,
  displayName,
  profileImage,
  location,
  age,
  bio,
  followers,
  following,
  isVerified
}: ProfileHeaderProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  
  // Funktion zum Erstellen einer neuen Konversation und Weiterleitung zum Chat
  const startConversation = async () => {
    if (isCreatingConversation) return;
    
    try {
      setIsCreatingConversation(true);
      console.log('Starte Konversation mit Benutzer:', username);
      
      // Finde zuerst die Profil-ID des Benutzers anhand des Benutzernamens
      const profileResponse = await fetch(`/api/profile?username=${username}`);
      console.log('Profile API Response Status:', profileResponse.status);
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profil-API Fehler:', errorText);
        throw new Error(`Fehler beim Abrufen des Profils: ${profileResponse.status} ${errorText}`);
      }
      
      const profileData = await profileResponse.json();
      console.log('Empfangene Profildaten:', profileData);
      
      const recipientProfileId = profileData.id;
      const recipientUserId = profileData.userId;
      
      console.log('Empfänger IDs:', { recipientProfileId, recipientUserId });
      
      if (!recipientUserId) {
        throw new Error('Empfänger-ID konnte nicht gefunden werden');
      }
      
      // Erstelle eine neue Konversation mit diesem Benutzer
      // Die Authentifizierung erfolgt über Session-Cookies, die automatisch mitgesendet werden
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Wichtig: Sendet Cookies mit der Anfrage
        body: JSON.stringify({ recipientId: recipientUserId }),
      });
      
      console.log('Konversations-API Response Status:', response.status);
      
      // Prüfe auf 401 Fehler (Nicht autorisiert)
      if (response.status === 401) {
        throw new Error('Sie sind nicht eingeloggt. Bitte loggen Sie sich ein, um Nachrichten zu senden.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Konversations-API Fehler:', errorText);
        throw new Error(`Fehler beim Erstellen der Konversation: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Konversationsdaten:', data);
      
      // Zur Nachrichten-Seite weiterleiten und die neue Konversation auswählen
      router.push(`/dashboard?tab=messages&conversation=${data.conversationId}`);
    } catch (error) {
      console.error('Fehler beim Starten der Konversation:', error);
      // Zeige die Fehlermeldung an
      if (error instanceof Error && error.message.includes('nicht eingeloggt')) {
        alert(`${error.message}`);
        router.push('/login'); // Weiterleitung zur Anmeldeseite
      } else {
        // Andere Fehler: Zeige Meldung und leite zur Nachrichtenseite weiter
        alert(`Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}

Sie werden zur Nachrichtenseite weitergeleitet.`);
        router.push('/dashboard?tab=messages');
      }
    } finally {
      setIsCreatingConversation(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profilbild */}
        <div className="relative h-24 w-24 md:h-32 md:w-32">
          <Image
            src={profileImage}
            alt={displayName}
            fill
            className="profile-avatar"
          />
          {isVerified && (
            <div className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Profilinformationen */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:gap-3">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <div className="text-gray-600 text-sm flex items-center justify-center md:justify-start gap-1">
              <span>@{username}</span>
              <span>•</span>
              <span>{age} Jahre</span>
              <span>•</span>
              <span>{location}</span>
            </div>
          </div>
          
          <p className="text-gray-700 my-3">{bio}</p>
          
          <div className="flex justify-center md:justify-start gap-4 mb-4">
            <div>
              <span className="font-bold">{followers}</span>
              <span className="text-gray-600 text-sm ml-1">Follower</span>
            </div>
            <div>
              <span className="font-bold">{following}</span>
              <span className="text-gray-600 text-sm ml-1">Folgt</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleFollow}
              className={`${isFollowing ? 'btn-secondary' : 'btn-primary'} flex items-center gap-1`}
            >
              {isFollowing ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                  Folge ich
                </>
              ) : (
                <>Folgen</>
              )}
            </button>
            <button 
              onClick={startConversation}
              disabled={isCreatingConversation}
              className="btn-secondary flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
              {isCreatingConversation ? 'Wird geladen...' : 'Nachricht'}
            </button>
            <button className="btn-secondary flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
              </svg>
              Teilen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
