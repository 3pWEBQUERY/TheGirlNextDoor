"use client";

import { useState, useEffect } from 'react';

interface PhotoViewCounterProps {
  photoId: string;
  initialViews?: number;
}

const PhotoViewCounter = ({ photoId, initialViews = 0 }: PhotoViewCounterProps) => {
  const [viewCount, setViewCount] = useState<number>(initialViews);
  
  useEffect(() => {
    // Nur Views zählen, wenn es ein gültiges photoId gibt
    if (!photoId) return;
    
    const recordView = async () => {
      try {
        const response = await fetch('/api/photos/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ photoId }),
        });

        if (response.ok) {
          const data = await response.json();
          setViewCount(data.viewCount);
        }
      } catch (error) {
        console.error('Fehler beim Zählen der Ansichten:', error);
      }
    };

    recordView();
  }, [photoId]);

  return (
    <div className="flex items-center text-sm text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span>{viewCount}</span>
    </div>
  );
};

export default PhotoViewCounter;
