"use client";

import { useState, useEffect, useRef } from 'react';
import VideoCard from './VideoCard';

// Mock-Daten für den Video-Feed
const mockVideos = [
  {
    id: '1',
    username: 'sophia_berlin',
    userImage: '/escorts/escort1.jpg',
    videoSrc: '/videos/video1.mp4',
    thumbnailUrl: '/escorts/escort1.jpg',
    caption: 'Ein Tag in Berlin #escortlife #berlin',
    likes: 245,
    comments: 32,
    profileUrl: '/profile/sophia_berlin'
  },
  {
    id: '2',
    username: 'emma_hamburg',
    userImage: '/escorts/escort2.jpg',
    videoSrc: '/videos/video2.mp4',
    thumbnailUrl: '/escorts/escort2.jpg',
    caption: 'Shopping-Tag in der HafenCity #hamburg #shopping',
    likes: 178,
    comments: 24,
    profileUrl: '/profile/emma_hamburg'
  },
  {
    id: '3',
    username: 'julia_munich',
    userImage: '/escorts/escort3.jpg',
    videoSrc: '/videos/video3.mp4',
    thumbnailUrl: '/escorts/escort3.jpg',
    caption: 'Oktoberfest-Vorbereitungen #munich #oktoberfest',
    likes: 312,
    comments: 56,
    profileUrl: '/profile/julia_munich'
  },
  {
    id: '4',
    username: 'laura_koeln',
    userImage: '/escorts/escort4.jpg',
    videoSrc: '/videos/video4.mp4',
    thumbnailUrl: '/escorts/escort4.jpg',
    caption: 'Dom-Tour in Köln #koeln #sightseeing',
    likes: 198,
    comments: 29,
    profileUrl: '/profile/laura_koeln'
  },
  {
    id: '5',
    username: 'laura_koeln',
    userImage: '/escorts/escort5.jpg',
    videoSrc: '/videos/video5.mp4',
    thumbnailUrl: '/escorts/escort5.jpg',
    caption: 'Dom-Tour in Köln #koeln #sightseeing',
    likes: 198,
    comments: 29,
    profileUrl: '/profile/laura_koeln'
  },
  {
    id: '6',
    username: 'laura_koeln',
    userImage: '/escorts/escort6.jpg',
    videoSrc: '/videos/video6.mp4',
    thumbnailUrl: '/escorts/escort6.jpg',
    caption: 'Dom-Tour in Köln #koeln #sightseeing',
    likes: 198,
    comments: 29,
    profileUrl: '/profile/laura_koeln'
  }
];

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (feedRef.current) {
      const scrollTop = feedRef.current.scrollTop;
      const videoHeight = feedRef.current.clientHeight;
      
      const index = Math.round(scrollTop / videoHeight);
      setCurrentIndex(index);
    }
  };
  
  useEffect(() => {
    const feedElement = feedRef.current;
    
    if (feedElement) {
      feedElement.addEventListener('scroll', handleScroll);
      
      return () => {
        feedElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  return (
    <div 
      ref={feedRef}
      className="h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory scrollbar-none hide-scrollbar" 
      style={{
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none',  /* IE 10+ */
      }}
    >
      {mockVideos.map((video) => (
        <div key={video.id} className="snap-start h-[calc(100vh-64px)] flex items-center justify-center py-4">
          <VideoCard 
            id={video.id}
            username={video.username}
            userImage={video.userImage}
            videoSrc={video.videoSrc}
            thumbnailUrl={video.thumbnailUrl}
            caption={video.caption}
            likes={video.likes}
            comments={video.comments}
            profileUrl={video.profileUrl}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
