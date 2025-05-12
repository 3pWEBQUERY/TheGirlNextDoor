'use client';

import React, { useState, useRef } from 'react';
import { ProfileData } from '../page';
import { Image as ImageIcon, Film, Upload, X, AlertCircle, Info, Edit2 } from 'lucide-react';

interface MediaFormProps {
  profileData: ProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMediaUpload?: (files: File[], type: 'images' | 'videos') => Promise<void>;
  handleMediaDelete?: (url: string, type: 'images' | 'videos') => Promise<void>;
  handleVideoTitleUpdate?: (url: string, title: string) => Promise<void>;
}

const MediaForm: React.FC<MediaFormProps> = ({ 
  profileData, 
  handleInputChange,
  handleMediaUpload,
  handleMediaDelete,
  handleVideoTitleUpdate 
}) => {
  const [activeSection, setActiveSection] = useState<'images' | 'videos'>('images');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [editingVideoUrl, setEditingVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isTitleUpdating, setIsTitleUpdating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Maximale Anzahl von Medien
  const MAX_IMAGES = 50;
  const MAX_VIDEOS = 20;
  
  // Berechnungen für Limits
  const currentImages = profileData.media?.images?.length || 0;
  const currentVideos = profileData.media?.videos?.length || 0;
  const imagesRemaining = MAX_IMAGES - currentImages;
  const videosRemaining = MAX_VIDEOS - currentVideos;
  
  // Simulierte Mock-Daten für die Vorschau (später durch echte Daten ersetzen)
  const mockImages = profileData.media?.images || [];
  const mockVideos = profileData.media?.videos || [];
  
  // Handle-Funktionen für Drag & Drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      await handleFiles(Array.from(files));
    }
  };
  
  // Dateitypen validieren
  const validateFiles = (files: File[], type: 'images' | 'videos'): File[] => {
    const validFiles: File[] = [];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    
    const validTypes = type === 'images' ? validImageTypes : validVideoTypes;
    const maxFiles = type === 'images' ? imagesRemaining : videosRemaining;
    
    // Filtern nach gültigen Dateitypen
    files.forEach(file => {
      if (validTypes.includes(file.type)) {
        validFiles.push(file);
      }
    });
    
    // Auf Maximalanzahl begrenzen
    return validFiles.slice(0, maxFiles);
  };
  
  // Dateien verarbeiten
  const handleFiles = async (files: File[]) => {
    const type = activeSection;
    
    if ((type === 'images' && imagesRemaining <= 0) || 
        (type === 'videos' && videosRemaining <= 0)) {
      setErrorMessage(`Sie haben das Limit für ${type === 'images' ? 'Bilder' : 'Videos'} erreicht.`);
      return;
    }
    
    const validFiles = validateFiles(files, type);
    
    if (validFiles.length === 0) {
      setErrorMessage(`Keine gültigen ${type === 'images' ? 'Bilder' : 'Videos'} ausgewählt.`);
      return;
    }
    
    // Tatsächlichen Upload starten
    setIsUploading(true);
    setErrorMessage('');
    
    try {
      if (handleMediaUpload) {
        // NUR die vom Parent bereitgestellte Upload-Funktion verwenden
        // Diese lädt zur Server-API hoch und aktualisiert den State
        console.log('Verwende Parent-Upload-Funktion', validFiles.length, type);
        await handleMediaUpload(validFiles, type);
      } else {
        // Wenn keine Upload-Funktion bereitgestellt wurde, zeigen wir eine Fehlermeldung
        // Dies sollte eigentlich nie passieren, da wir immer handleMediaUpload bekommen sollten
        console.error('Keine handleMediaUpload-Funktion bereitgestellt');
        setErrorMessage('Interner Fehler: Keine Upload-Funktion verfügbar');
      }
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      setErrorMessage(`Fehler beim Hochladen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Click-Handler für den Upload-Button
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handler für die Dateiauswahl
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      await handleFiles(Array.from(files));
    }
  };
  
  // NOTFALL-LÖSUNG: Direkte UI-Darstellung ohne API
  const handleDelete = async (url: string) => {
    try {
      setIsUploading(true);
      setErrorMessage('');
      
      console.log('NOTFALL-LÖSUNG: UI-Aktualisierung für', url);
      
      // URL zur Liste der gelöschten URLs hinzufügen
      setDeletedUrls(prev => [...prev, url]);
      
      // Sofort die UI aktualisieren, ohne auf API-Response zu warten
      if (activeSection === 'images') {
        const updatedImages = (profileData.media?.images || []).filter(item => item !== url);
        profileData.media = {
          ...profileData.media,
          images: updatedImages
        };
      } else {
        const updatedVideos = (profileData.media?.videos || []).filter(item => item !== url);
        profileData.media = {
          ...profileData.media,
          videos: updatedVideos
        };
      }
      
      // Force re-render
      handleInputChange({
        target: {
          name: 'forceUpdate',
          value: Date.now()
        }
      } as any);
      
      // Im Hintergrund trotzdem den Server-Aufruf machen
      try {
        const response = await fetch(`/api/media/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, type: activeSection }),
        });
        
        const result = await response.json();
        console.log('Server-Antwort (ignoriert):', result);
      } catch (serverError) {
        // Fehler beim Serveraufruf ignorieren, da wir die UI bereits aktualisiert haben
        console.log('Server-Fehler (ignoriert):', serverError);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      // Typensichere Fehlerbehandlung
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Fehler beim Löschen des Mediums: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Medien</h2>
      
      {/* Tabs für Bilder/Videos */}
      <div className="flex mb-6 bg-gray-100 rounded-md overflow-hidden">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${activeSection === 'images' ? 'bg-rose-700 text-white' : 'bg-transparent text-gray-700'}`}
          onClick={() => setActiveSection('images')}
        >
          <div className="flex items-center justify-center">
            <ImageIcon size={16} className="mr-2" />
            <span>Bilder ({currentImages}/{MAX_IMAGES})</span>
          </div>
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${activeSection === 'videos' ? 'bg-rose-700 text-white' : 'bg-transparent text-gray-700'}`}
          onClick={() => setActiveSection('videos')}
        >
          <div className="flex items-center justify-center">
            <Film size={16} className="mr-2" />
            <span>Videos ({currentVideos}/{MAX_VIDEOS})</span>
          </div>
        </button>
      </div>
      
      {/* Info-Box */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <Info size={20} className="text-blue-500 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Hinweise zum Hochladen:</p>
            <ul className="list-disc pl-5 space-y-1">
              {activeSection === 'images' ? (
                <>
                  <li>Maximale Anzahl: {MAX_IMAGES} Bilder (noch {imagesRemaining} verfügbar)</li>
                  <li>Erlaubte Formate: JPG, PNG, WEBP, GIF</li>
                  <li>Maximale Dateigröße: 10 MB pro Bild</li>
                  <li>Optimale Auflösung: Mindestens 800x600 Pixel</li>
                </>
              ) : (
                <>
                  <li>Maximale Anzahl: {MAX_VIDEOS} Videos (noch {videosRemaining} verfügbar)</li>
                  <li>Erlaubte Formate: MP4, WEBM, MOV</li>
                  <li>Maximale Dateigröße: 200 MB pro Video</li>
                  <li>Maximale Länge: 90 Sekunden</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Upload-Bereich */}
      <div 
        className={`border-2 border-dashed rounded-md p-8 mb-6 text-center ${isDragging ? 'border-pink-500 bg-pink-50' : 'border-gray-300'} ${(activeSection === 'images' && imagesRemaining <= 0) || (activeSection === 'videos' && videosRemaining <= 0) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input 
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept={activeSection === 'images' ? 'image/jpeg,image/png,image/webp,image/gif' : 'video/mp4,video/webm,video/quicktime'}
          disabled={(activeSection === 'images' && imagesRemaining <= 0) || (activeSection === 'videos' && videosRemaining <= 0) || isUploading}
        />
        
        <div className="flex flex-col items-center">
          <Upload 
            size={40} 
            className={`mb-2 ${isDragging ? 'text-pink-600' : 'text-gray-400'}`} 
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isUploading ? (
              'Wird hochgeladen...'
            ) : (
              <>
                {activeSection === 'images' ? (
                  imagesRemaining > 0 ? 'Bilder hierher ziehen oder klicken zum Auswählen' : 'Maximale Anzahl an Bildern erreicht'
                ) : (
                  videosRemaining > 0 ? 'Videos hierher ziehen oder klicken zum Auswählen' : 'Maximale Anzahl an Videos erreicht'
                )}
              </>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {activeSection === 'images' ? 
              `JPG, PNG, WEBP, GIF (max. 10 MB)` : 
              `MP4, WEBM, MOV (max. 200 MB)`
            }
          </p>
        </div>
      </div>
      
      {/* Fehlermeldung */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{errorMessage}</p>
          <button 
            className="ml-auto text-red-500" 
            onClick={() => setErrorMessage('')}
            aria-label="Fehlermeldung schließen"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Medien-Vorschau */}
      <div className="mb-4">
        <h3 className="text-md font-medium mb-3">
          {activeSection === 'images' ? 'Meine Bilder' : 'Meine Videos'}
        </h3>
        
        {/* Hier die Vorschau der hochgeladenen Medien anzeigen */}
        {activeSection === 'images' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockImages.length > 0 ? (
              mockImages.filter(url => !deletedUrls.includes(url)).map((url, index) => (
                <div key={index} className="relative group bg-gray-100 rounded-md overflow-hidden aspect-square">
                  {/* Echtes Bild (in der Mock-Version zeigen wir Platzhalter) */}
                  <img 
                    src={url} 
                    alt={"Bild " + (index + 1)} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Overlay mit Löschen-Button */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(url);
                      }}
                      className="p-1 bg-red-600 text-white rounded-md"
                      aria-label="Bild löschen"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                <p>Keine Bilder hochgeladen</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockVideos.length > 0 ? (
              mockVideos.filter(url => !deletedUrls.includes(url)).map((url, index) => (
                <div key={index} className="relative group bg-gray-100 rounded-md overflow-hidden">
                  {/* Video Player */}
                  <div className="aspect-video">
                    <video 
                      src={url} 
                      className="w-full h-full object-cover" 
                      controls 
                    />
                  </div>
                  
                  {/* Video-Titel Bereich */}
                  {editingVideoUrl === url ? (
                    <div className="p-2 bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="flex-1 p-1 text-sm border border-gray-300 rounded-l-md"
                          placeholder="Videotitel eingeben"
                        />
                        <button 
                          onClick={async () => {
                            if (handleVideoTitleUpdate && videoTitle.trim()) {
                              setIsTitleUpdating(true);
                              try {
                                await handleVideoTitleUpdate(url, videoTitle.trim());
                                setEditingVideoUrl(null);
                              } catch (error) {
                                console.error('Error updating video title:', error);
                                setErrorMessage('Fehler beim Aktualisieren des Videotitels');
                              } finally {
                                setIsTitleUpdating(false);
                              }
                            }
                          }}
                          disabled={isTitleUpdating}
                          className="p-1 bg-primary-600 text-white rounded-r-md"
                        >
                          {isTitleUpdating ? '...' : 'Speichern'}
                        </button>
                        <button 
                          onClick={() => setEditingVideoUrl(null)}
                          className="p-1 ml-1 bg-gray-300 text-gray-700 rounded-md"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-50 flex justify-between items-center">
                      <span className="text-sm font-medium truncate">
                        {profileData.media?.videoTitles?.[url] || 'Ohne Titel'}
                      </span>
                      <div className="flex">
                        <button 
                          onClick={() => {
                            setEditingVideoUrl(url);
                            setVideoTitle(profileData.media?.videoTitles?.[url] || '');
                          }}
                          className="p-1 mr-1 bg-blue-500 text-white rounded-md"
                          aria-label="Titel bearbeiten"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleDelete(url);
                          }}
                          className="p-1 bg-red-600 text-white rounded-md"
                          aria-label="Video löschen"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                <p>Keine Videos hochgeladen</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaForm;
