import React from 'react';
import Image from 'next/image';
import { ProfileData } from '../page';

interface BasicInfoFormProps {
  profileData: ProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleProfileImageUpload?: (file: File) => Promise<void>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ profileData, handleInputChange, handleProfileImageUpload }) => {
  // Verwende das erste Foto aus der Galerie oder ein Standard-Bild
  const initialImageSrc = profileData?.media?.images && profileData.media.images.length > 0 
    ? profileData.media.images[0] 
    : '/images/default-avatar.png';
  
  const [imageSrc, setImageSrc] = React.useState<string>(initialImageSrc);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    // Prüfen, ob es sich um ein Bild handelt
    if (!file.type.startsWith('image/')) {
      alert('Bitte wähle ein Bild aus (JPG, PNG)');
      return;
    }
    
    // Prüfen, ob die Dateigröße unter 10MB liegt
    if (file.size > 10 * 1024 * 1024) {
      alert('Das Bild darf max. 10MB groß sein');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Wenn eine Handler-Funktion bereitgestellt wurde, verwende diese
      if (handleProfileImageUpload) {
        await handleProfileImageUpload(file);
      } else {
        // Fallback: Hochladen mit FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'profileImage');
        
        const response = await fetch('/api/upload/profile-image', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Fehler beim Hochladen des Bildes');
        }
        
        const data = await response.json();
        // Setze das Anzeigebild auf die URL vom Server
        setImageSrc(data.url);
      }
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      alert('Das Bild konnte nicht hochgeladen werden. Bitte versuche es später erneut.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Grundinformationen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anzeigebild Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Anzeigebild</label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden relative">
              <Image
                src={imageSrc}
                alt="Anzeigebild"
                fill
                className="object-cover"
                priority
                onError={() => setImageSrc('/images/default-avatar.png')}
              />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              <button 
                type="button" 
                onClick={handleUploadClick}
                disabled={isUploading}
                className={`px-3 py-1 ${isUploading ? 'bg-gray-400' : 'bg-rose-700 hover:bg-rose-800'} text-white rounded-md transition-colors flex items-center`}
              >
                {isUploading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, max. 5MB</p>
            </div>
          </div>
        </div>
        
        {/* Benutzername (nur lesbar) */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Benutzername</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={profileData.username} 
            readOnly
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Der Benutzername kann nicht geändert werden</p>
        </div>
        
        {/* Anzeigename */}
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Anzeigename</label>
          <input 
            type="text" 
            id="displayName" 
            name="displayName" 
            value={profileData.displayName} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <p className="text-sm text-gray-500 mt-1">Dein Name, wie er auf der Plattform angezeigt wird</p>
        </div>
        
        {/* Standort */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Standort</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            value={profileData.location} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        
        {/* Alter */}
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Alter</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            value={profileData.age || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            min="18"
            max="99"
          />
        </div>
        
        {/* Biografie */}
        <div className="mb-4 col-span-1 md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biografie</label>
          <textarea 
            id="bio" 
            name="bio" 
            value={profileData.bio} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">Beschreibe dich und was dich besonders macht (max. 500 Zeichen)</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
