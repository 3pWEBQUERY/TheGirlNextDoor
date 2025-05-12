"use client";

import { useState } from 'react';

interface PhotoLikeButtonProps {
  photoId: string;
  initialLikes: number;
}

const PhotoLikeButton = ({ photoId, initialLikes }: PhotoLikeButtonProps) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Like-Status prüfen, wenn die Komponente geladen wird
  const checkLikeStatus = async () => {
    try {
      // API-Aufruf zum Abrufen des Like-Status
      const response = await fetch(`/api/photos/like/status?photoId=${photoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Like-Status:', error);
    }
  };

  // Like-Funktion
  const toggleLike = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/photos/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Liken des Fotos');
      }

      const data = await response.json();
      setLikes(data.likeCount);
      setIsLiked(data.liked);
    } catch (error) {
      console.error('Fehler beim Liken/Unliken:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 text-sm py-1 px-2 rounded-md ${isLiked ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'}`}
      aria-label={isLiked ? 'Gefällt mir nicht mehr' : 'Gefällt mir'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        className="w-5 h-5 transition-colors"
        strokeWidth={isLiked ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
};

export default PhotoLikeButton;
