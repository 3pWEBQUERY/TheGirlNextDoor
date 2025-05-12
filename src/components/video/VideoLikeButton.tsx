'use client';

import { useState, useEffect } from 'react';

interface VideoLikeButtonProps {
  videoId: string;
  initialLikes: number;
}

const VideoLikeButton = ({ videoId, initialLikes }: VideoLikeButtonProps) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(initialLikes);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Prüfen, ob der Benutzer das Video bereits geliked hat
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        // Im Produktionscode würden wir hier den Like-Status vom Server abrufen
        // In dieser Demo setzen wir den Status auf false
        // Der Status könnte auch im localStorage gespeichert werden
        setLiked(localStorage.getItem(`video-like-${videoId}`) === 'true');
      } catch (err) {
        console.error('Fehler beim Prüfen des Like-Status:', err);
      }
    };

    if (videoId) {
      checkLikeStatus();
    }
  }, [videoId]);

  // Like-Funktion
  const toggleLike = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/videos/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });
      
      if (!response.ok) {
        throw new Error('Fehler bei der Like-Aktion');
      }
      
      const data = await response.json();
      
      // Status aktualisieren
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      
      // Status im localStorage speichern
      localStorage.setItem(`video-like-${videoId}`, String(data.liked));
    } catch (err) {
      console.error('Fehler beim Liken des Videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleLike} 
      disabled={isLoading}
      className="flex items-center gap-1 text-sm"
      aria-label={liked ? 'Like entfernen' : 'Video liken'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={liked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        className={`w-5 h-5 ${liked ? 'text-pink-500' : 'text-gray-300'}`}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.5" 
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
        />
      </svg>
      <span className={liked ? 'font-medium text-pink-500' : ''}>{likeCount || 0}</span>
    </button>
  );
};

export default VideoLikeButton;
