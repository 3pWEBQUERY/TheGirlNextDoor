"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from '@/components/video/VideoPlayer';
import VideoLikeButton from '@/components/video/VideoLikeButton';
import VideoViewCounter from '@/components/video/VideoViewCounter';
import VideoComments from '@/components/video/VideoComments';
import PhotoModal from '@/components/photo/PhotoModal';

interface Video {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  caption: string;
  views: number;
  likes: number;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  isPrimary: boolean;
  createdAt: string;
  likes?: number;
  views?: number;
}

interface ProfileVideoGalleryProps {
  videos: Video[];
  photos: Photo[];  // Neue Eigenschaft für Fotos
  username: string;
}

const ProfileVideoGallery = ({ videos, photos, username }: ProfileVideoGalleryProps) => {
  const [selectedTab, setSelectedTab] = useState<'videos' | 'images'>('videos');
  
  // Video-State
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  
  // Foto-State
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Debug-Ausgaben für die Daten, die hereinkommen
  useEffect(() => {
    console.log('ProfileVideoGallery erhaltene Videos:', videos);
    console.log('ProfileVideoGallery erhaltene Photos:', photos);
  }, [videos, photos]);
  
  const openVideoPlayer = (videoUrl: string, title: string = '', videoId: string = '') => {
    if (videoUrl && !videoUrl.startsWith('blob:')) {
      setSelectedVideo(videoUrl);
      setVideoTitle(title);
      setSelectedVideoId(videoId);
    } else {
      console.log('Kein gültiges Video zum Öffnen');
    }
  };
  
  const closeVideoPlayer = () => {
    setSelectedVideo(null);
    setSelectedVideoId(null);
    setShowComments(false);
  };
  
  const toggleComments = () => {
    setShowComments(prev => !prev);
  };
  
  // Foto öffnen, wenn darauf geklickt wird
  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };
  
  // Foto-Modal schließen
  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      {/* Foto-Modal */}
      {selectedPhoto && (
        <PhotoModal
          photoId={selectedPhoto.id}
          photoUrl={selectedPhoto.url}
          caption={selectedPhoto.caption}
          initialLikes={selectedPhoto.likes || 0}
          initialViews={selectedPhoto.views || 0}
          onClose={closePhotoModal}
        />
      )}
      
      {/* Video-Player-Modal mit Kommentaren */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
            {/* Schließen-Button */}
            <button
              onClick={closeVideoPlayer}
              className="absolute top-2 right-2 z-10 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
              aria-label="Schließen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video-Container */}
            <div className="flex-grow md:w-2/3 bg-black relative">
              <div className="relative pt-[56.25%] md:pt-[75%]">
                <video
                  className="absolute inset-0 w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  src={selectedVideo}
                />
              </div>
              
              {/* Video-Info-Bereich */}
              <div className="p-4 bg-gray-900 text-white">
                <h3 className="text-lg font-semibold mb-2">{videoTitle || 'Video'}</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedVideoId && (
                      <>
                        <VideoLikeButton
                          videoId={selectedVideoId}
                          initialLikes={videos.find(v => v.id === selectedVideoId)?.likes || 0}
                        />
                        <VideoViewCounter
                          videoId={selectedVideoId}
                          initialViews={videos.find(v => v.id === selectedVideoId)?.views || 0}
                        />
                      </>
                    )}
                  </div>
                  
                  {/* Kommentar-Toggle für mobile Ansicht */}
                  <button
                    onClick={toggleComments}
                    className="md:hidden flex items-center text-sm text-gray-300 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Kommentare
                  </button>
                </div>
              </div>
            </div>
            
            {/* Kommentar-Bereich (immer sichtbar auf Desktop, toggle auf Mobil) */}
            <div className={`md:w-1/3 bg-white overflow-y-auto max-h-[60vh] md:max-h-[90vh] ${showComments ? 'block' : 'hidden md:block'}`}>
              {selectedVideoId && (
                <VideoComments videoId={selectedVideoId} />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium text-sm ${selectedTab === 'videos' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'}`}
          onClick={() => setSelectedTab('videos')}
        >
          Videos
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${selectedTab === 'images' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'}`}
          onClick={() => setSelectedTab('images')}
        >
          Bilder
        </button>
      </div>
      
      {selectedTab === 'videos' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative rounded-lg overflow-hidden shadow-lg bg-gray-900"
            >
              {/* Debug-Ausgabe beim Rendern jedes Videos */}
              {(() => {
                console.log('Rendering video:', { id: video.id, videoUrl: video.videoUrl });
                return null;
              })()}
              
              {/* Direktes Video-Element ohne Popup */}
              <div className="relative aspect-[9/16] w-full">
                <video 
                  className="w-full h-full object-contain" 
                  controls
                  controlsList="nodownload"
                  playsInline
                  muted
                  autoPlay
                  loop={false}
                  preload="auto"
                  src={video.videoUrl}
                />
              </div>
              
              {/* Video-Informationen darunter */}
              <div className="p-3 bg-gray-800">
                <p className="font-medium text-white mb-1 truncate">{video.caption || video.videoUrl.split('/').pop() || 'Video'}</p>
                <div className="flex items-center justify-between text-gray-300 text-xs">
                  <div className="flex items-center gap-4">
                    <VideoLikeButton
                      videoId={video.id}
                      initialLikes={video.likes}
                    />
                    <VideoViewCounter
                      videoId={video.id}
                      initialViews={video.views}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openVideoPlayer(video.videoUrl, video.caption, video.id);
                    }}
                    className="flex items-center text-sm text-gray-300 hover:text-white"
                    aria-label="Kommentare anzeigen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Kommentare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Verbesserte Bildergalerie */}
          {photos.length > 0 ? (
            photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square md:aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => openPhotoModal(photo)}
            >
              {photo.url && !photo.url.startsWith('blob:') ? (
                <Image
                  src={photo.url}
                  alt={photo.caption || 'Profilbild'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Caption mit Like und View Counter */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                {photo.caption && (
                  <p className="text-white text-sm font-medium truncate mb-1">{photo.caption}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-white text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span>{photo.likes || 0}</span>
                  </div>
                  <div className="flex items-center text-white text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                    <span>{photo.views || 0}</span>
                  </div>
                </div>
              </div>
              {/* Hover-Effekt */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-pink-600 text-white text-xs py-1 px-3 rounded-md shadow-lg hover:bg-pink-700">
                    Anzeigen
                  </button>
                </div>
              </div>
            </div>
          )))
          : (
            <div className="col-span-4 text-center py-4 text-gray-400">
              Lade Bilder...
            </div>
          )}
        </div>
      )}
      
      {selectedTab === 'videos' && videos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.25 2.25 0 00-1.872-1.031 48.117 48.117 0 00-1.965-.001 2.25 2.25 0 00-1.872 1.031l-.821 1.316a2.31 2.31 0 01-1.64 1.055 47.904 47.904 0 00-1.134.175C3 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.25 2.25 0 00-1.872-1.031 48.117 48.117 0 00-1.965-.001 2.25 2.25 0 00-1.872 1.031l-.821 1.316a2.31 2.31 0 01-1.64 1.055a47.904 47.904 0 00-1.134.175C3 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.25 2.25 0 00-1.872-1.031" />
          </svg>
          <p className="text-lg font-medium">Keine Videos gefunden</p>
          <p className="mt-1">{username} hat noch keine Videos hochgeladen</p>
        </div>
      )}

      {selectedTab === 'images' && photos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-lg font-medium">Keine Bilder gefunden</p>
          <p className="mt-1">{username} hat noch keine Bilder hochgeladen</p>
        </div>
      )}
    </div>
  );
};

export default ProfileVideoGallery;
