'use client';

import { useState, useEffect } from 'react';

interface VideoViewCounterProps {
  videoId: string;
  initialViews: number;
}

const VideoViewCounter = ({ videoId, initialViews }: VideoViewCounterProps) => {
  const [viewCount, setViewCount] = useState<number>(initialViews);

  // View zählen, wenn das Video angezeigt wird
  useEffect(() => {
    const trackView = async () => {
      try {
        // View-Zählung an den Server senden - die Duplikaterkennung erfolgt jetzt serverseitig
        // über die Datenbank mit der uniqueView-Constraint (videoId + userId + ip)
        const response = await fetch('/api/videos/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });
        
        if (!response.ok) {
          throw new Error('Fehler beim Zählen des Views');
        }
        
        const data = await response.json();
        setViewCount(data.viewCount);
      } catch (err) {
        console.error('Fehler beim Erfassen des Views:', err);
      }
    };

    if (videoId) {
      trackView();
    }
  }, [videoId]);

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>{viewCount || 0}</span>
    </div>
  );
};

export default VideoViewCounter;
