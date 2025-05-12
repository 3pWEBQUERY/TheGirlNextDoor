"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaComment, FaShareAlt, FaPause, FaPlay, FaExpandAlt, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

// Interface für Video-Objekt
interface Video {
  id: string;
  username: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  timestamp: string;
  verified: boolean;
  profileImage: string;
}

// Mockdaten für trending Videos
const MOCK_TRENDING_VIDEOS: Video[] = [
  {
    id: 't1',
    username: 'sophia_deluxe',
    caption: 'Ein Tag am See 💦 #sommer #entspannung',
    videoUrl: '/videos/video1.mp4',
    thumbnailUrl: '/escorts/escort1.jpg',
    likes: 3420,
    comments: 89,
    timestamp: '2h',
    verified: true,
    profileImage: '/escorts/escort1.jpg'
  },
  {
    id: 't2',
    username: 'emma_joy',
    caption: 'Mein neues Outfit für heute Abend 😍 #fashion #nightlife',
    videoUrl: '/videos/video2.mp4',
    thumbnailUrl: '/escorts/escort2.jpg',
    likes: 8756,
    comments: 211,
    timestamp: '5h',
    verified: true,
    profileImage: '/escorts/escort2.jpg'
  },
  {
    id: 't3',
    username: 'lisa_glamour',
    caption: 'Workout Routine für einen perfekten Start in den Tag ☀️ #fitness #morning',
    videoUrl: '/videos/video3.mp4',
    thumbnailUrl: '/escorts/escort3.jpg',
    likes: 6120,
    comments: 143,
    timestamp: '11h',
    verified: false,
    profileImage: '/escorts/escort3.jpg'
  },
  {
    id: 't4',
    username: 'julia_star',
    caption: 'Meine Lieblingsplätze in Berlin ✨ #berlin #travel',
    videoUrl: '/videos/video4.mp4',
    thumbnailUrl: '/escorts/escort4.jpg',
    likes: 5280,
    comments: 124,
    timestamp: '1d',
    verified: true,
    profileImage: '/escorts/escort4.jpg'
  },
  {
    id: 't5',
    username: 'hannah_dream',
    caption: 'Bereit für ein Abenteuer? 🏙️ #adventure #city',
    videoUrl: '/videos/video5.mp4',
    thumbnailUrl: '/escorts/escort5.jpg',
    likes: 9430,
    comments: 276,
    timestamp: '1d',
    verified: false,
    profileImage: '/escorts/escort5.jpg'
  },
  {
    id: 't6',
    username: 'nicole_elegance',
    caption: 'Ein perfekter Abend beginnt mit... 🍸 #nightlife #cocktails',
    videoUrl: '/videos/video6.mp4',
    thumbnailUrl: '/escorts/escort6.jpg',
    likes: 4980,
    comments: 118,
    timestamp: '2d',
    verified: true,
    profileImage: '/escorts/escort6.jpg'
  },
];

// VideoCard-Komponente mit einfacherem Ansatz
const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative aspect-[9/16] w-full">
        {/* Immer das Video-Element anzeigen mit vollständigen Steuerelementen */}
        <div className="w-full h-full relative">
          <video
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
            style={{
              backgroundColor: 'black'
            }}
          />
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Link href={`/profile/${video.username}`} className="flex items-center">
            <div className="relative w-10 h-10 mr-3">
              <Image
                src={video.profileImage}
                alt={video.username}
                className="rounded-full object-cover"
                fill
              />
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{video.username}</span>
                {video.verified && (
                  <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500">{video.timestamp}</p>
            </div>
          </Link>
        </div>
        
        <p className="text-sm mb-3">{video.caption}</p>
        
        {/* Engagement Stats */}
        <div className="flex items-center text-gray-500 text-sm">
          <div className="flex items-center mr-4">
            <FaHeart className="mr-1" />
            <span>{video.likes.toLocaleString('de-DE')}</span>
          </div>
          <div className="flex items-center mr-4">
            <FaComment className="mr-1" />
            <span>{video.comments.toLocaleString('de-DE')}</span>
          </div>
          <div className="flex items-center">
            <FaShareAlt className="mr-1" />
            <span>Teilen</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingPage = () => {
  const [filter, setFilter] = useState('today');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-6 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Trending Videos</h1>
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
            Die beliebtesten Videos auf TheGND – sieh dir an, was gerade angesagt ist
          </p>
          
          {/* Filter Tabs - Responsive */}
          <div className="flex justify-center mt-4 md:mt-6">
            <div className="inline-flex flex-wrap justify-center rounded-md bg-white p-1 shadow-sm w-full max-w-md">
              <button
                onClick={() => setFilter('today')}
                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${filter === 'today' ? 'text-white' : 'text-gray-700'} m-1`}
                style={{
                  backgroundColor: filter === 'today' ? 'hsl(345.3, 82.7%, 40.8%)' : 'transparent'
                }}
              >
                Heute
              </button>
              <button
                onClick={() => setFilter('week')}
                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${filter === 'week' ? 'text-white' : 'text-gray-700'} m-1`}
                style={{
                  backgroundColor: filter === 'week' ? 'hsl(345.3, 82.7%, 40.8%)' : 'transparent'
                }}
              >
                Diese Woche
              </button>
              <button
                onClick={() => setFilter('month')}
                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${filter === 'month' ? 'text-white' : 'text-gray-700'} m-1`}
                style={{
                  backgroundColor: filter === 'month' ? 'hsl(345.3, 82.7%, 40.8%)' : 'transparent'
                }}
              >
                Dieser Monat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Videos Grid - Responsive Layout */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MOCK_TRENDING_VIDEOS.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        
        {/* Load More Button - Responsive */}
        <div className="flex justify-center mt-6 md:mt-10">
          <button
            className="px-4 sm:px-6 py-2 text-white rounded-md text-xs sm:text-sm font-medium w-full sm:w-auto mx-4 sm:mx-0 max-w-xs"
            style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
          >
            Mehr anzeigen
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
