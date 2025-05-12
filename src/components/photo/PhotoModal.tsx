"use client";

import { useState } from 'react';
import Image from 'next/image';
import PhotoLikeButton from './PhotoLikeButton';
import PhotoViewCounter from './PhotoViewCounter';
import PhotoComments from './PhotoComments';

interface PhotoModalProps {
  photoId: string;
  photoUrl: string;
  caption?: string;
  initialLikes?: number;
  initialViews?: number;
  onClose: () => void;
}

const PhotoModal = ({
  photoId,
  photoUrl,
  caption,
  initialLikes = 0,
  initialViews = 0,
  onClose,
}: PhotoModalProps) => {
  const [showComments, setShowComments] = useState<boolean>(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Schließen-Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
          aria-label="Schließen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Bild-Container */}
        <div className="flex-grow md:w-2/3 bg-black relative">
          <div className="relative pt-[100%] md:pt-[75%] overflow-hidden">
            <Image
              src={photoUrl}
              alt={caption || 'Foto'}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Foto-Info-Bereich */}
          <div className="p-4 bg-gray-900 text-white">
            <h3 className="text-lg font-semibold mb-2">{caption || 'Foto'}</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <PhotoLikeButton photoId={photoId} initialLikes={initialLikes} />
                <PhotoViewCounter photoId={photoId} initialViews={initialViews} />
                <button
                  onClick={toggleComments}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white py-1 px-2 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span>Kommentare</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kommentar-Bereich */}
        {showComments && (
          <div className="md:w-1/3 bg-white p-4 overflow-y-auto max-h-[50vh] md:max-h-full">
            <h3 className="text-lg font-semibold mb-4">Kommentare</h3>
            <PhotoComments photoId={photoId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;
