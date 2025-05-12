"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface VideoCardProps {
  id: string;
  username: string;
  userImage: string;
  videoSrc: string;
  thumbnailUrl: string; // Neue Eigenschaft für dediziertes Thumbnail
  caption: string;
  likes: number;
  comments: number;
  profileUrl: string;
}

const VideoCard = ({
  id,
  username,
  userImage,
  videoSrc,
  thumbnailUrl,
  caption,
  likes,
  comments,
  profileUrl
}: VideoCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  
  const toggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="video-card w-full max-w-lg mx-auto bg-white shadow-xl rounded-lg overflow-hidden" style={{ maxHeight: '85vh' }}>
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-black w-full">
        {/* Video Element */}
        {isPlaying ? (
          <video
            className="w-full h-full object-cover absolute inset-0 rounded-t-lg"
            src={videoSrc}
            poster={thumbnailUrl} /* Verwende thumbnailUrl als Poster */
            autoPlay
            controls
            playsInline
            loop
            onClick={(e) => e.stopPropagation()}
            style={{
              objectFit: 'cover',
              backgroundColor: 'black'
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
            {/* Thumbnail-Bild */}
            <div className="relative w-full h-full">
              <Image 
                src={thumbnailUrl} 
                alt={`Thumbnail für ${username}`}
                fill
                className="object-cover"
              />
              {/* Play-Button mit abgerundeten Ecken und pink-600 Farbe */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-opacity-70 rounded-md p-3 shadow-lg" style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Video Overlay - User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="flex items-center mb-2">
            <Link href={profileUrl} className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <Image 
                  src={userImage} 
                  alt={username}
                  fill
                  className="profile-avatar"
                />
              </div>
              <span className="font-medium">{username}</span>
            </Link>
          </div>
          <p className="text-sm truncate">{caption}</p>
        </div>
        
        {/* Video Controls */}
        <div className="absolute right-3 bottom-16 flex flex-col items-center space-y-4">
          {/* Like Button */}
          <button onClick={toggleLike} className="flex flex-col items-center">
            <div className={`rounded-full bg-black/20 p-2 ${isLiked ? 'text-primary-500' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <span className="text-white text-xs mt-1">{likesCount}</span>
          </button>
          
          {/* Comment Button */}
          <button className="flex flex-col items-center">
            <div className="rounded-full bg-black/20 p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white text-xs mt-1">{comments}</span>
          </button>
          
          {/* Share Button */}
          <button className="flex flex-col items-center">
            <div className="rounded-full bg-black/20 p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
