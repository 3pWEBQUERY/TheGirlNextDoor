import React, { useState } from 'react';
import { ProfileData } from '../page';
import { languages, proficiencyLevels, type Language, type LanguageProficiency } from '../../../../data/languages';
import { serviceCategories } from '../../../../data/services';

// Import Service Tab Komponenten
import StandardServiceTab from './services/StandardServiceTab';
import SMServiceTab from './services/SMServiceTab';
import DigitalServiceTab from './services/DigitalServiceTab';
import EscortServiceTab from './services/EscortServiceTab';

interface LanguageWithProficiency {
  code: string;
  name: string;
  proficiency: string;
}

interface ServicesFormProps {
  profileData: ProfileData;
  newService: string;
  setNewService: (value: string) => void;
  handleArrayInput: (type: 'services' | 'languages', value: string) => void;
  handleRemoveArrayItem: (type: 'services' | 'languages', index: number) => void;
}

const ServicesForm: React.FC<ServicesFormProps> = ({ 
  profileData, 
  newService, 
  setNewService,
  handleArrayInput,
  handleRemoveArrayItem
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedProficiency, setSelectedProficiency] = useState<string>('');
  const [activeServiceTab, setActiveServiceTab] = useState<string>('standard');
  
  // Parse languages from profileData.languages (format: "Deutsch:proficient")
  const parsedLanguages = profileData.languages?.map(lang => {
    const [name, proficiency] = lang.split(':');
    return { 
      name, 
      proficiency: proficiency || 'beginner',
      code: languages.find(l => l.name === name)?.code || ''
    };
  }) || [];
  
  // Parse services to distinguish between different categories
  const selectedServices = profileData.services || [];
  
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      // Wenn der Service bereits ausgewählt ist, entferne ihn
      const index = selectedServices.indexOf(serviceId);
      handleRemoveArrayItem('services', index);
    } else {
      // Andernfalls füge den Service hinzu
      handleArrayInput('services', serviceId);
    }
  };
  
  const addLanguage = () => {
    if (selectedLanguage && selectedProficiency) {
      const languageName = languages.find(l => l.code === selectedLanguage)?.name || '';
      handleArrayInput('languages', `${languageName}:${selectedProficiency}`);
      setSelectedLanguage('');
      setSelectedProficiency('');
    }
  };
  
  const renderStars = (proficiencyId: string) => {
    const proficiency = proficiencyLevels.find(p => p.id === proficiencyId);
    const stars = proficiency ? proficiency.stars : 1;
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={i < stars ? 'hsl(345.3, 82.7%, 40.8%)' : 'currentColor'} 
            className="w-4 h-4 text-gray-300"
          >
            <path 
              fillRule="evenodd" 
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
              clipRule="evenodd" 
            />
          </svg>
        ))}
      </div>
    );
  };
  
  // Render Service Tab Content basierend auf aktivem Tab
  const renderServiceTabContent = () => {
    switch (activeServiceTab) {
      case 'standard':
        return <StandardServiceTab selectedServices={selectedServices} onToggleService={toggleService} />;
      case 'sm':
        return <SMServiceTab selectedServices={selectedServices} onToggleService={toggleService} />;
      case 'digital':
        return <DigitalServiceTab selectedServices={selectedServices} onToggleService={toggleService} />;
      case 'escort':
        return <EscortServiceTab selectedServices={selectedServices} onToggleService={toggleService} />;
      default:
        return <StandardServiceTab selectedServices={selectedServices} onToggleService={toggleService} />;
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Services & Sprachen</h2>
      
      {/* Services */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Angebotene Services</label>
        
        {/* Service Tabs */}
        <div className="flex border-b border-gray-200 mb-2">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 text-sm font-medium rounded-t-md mr-1 ${activeServiceTab === category.id 
                ? 'bg-rose-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveServiceTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Service Tab Content */}
        {renderServiceTabContent()}
        
        {/* Ausgewählte Services anzeigen */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ausgewählte Services:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedServices.length > 0 ? (
              selectedServices.map((serviceId, index) => {
                // Finde den Service in allen Kategorien
                const serviceInfo = serviceCategories
                  .flatMap(category => category.services)
                  .find(s => s.id === serviceId);
                  
                return serviceInfo ? (
                  <div 
                    key={index} 
                    className="inline-flex items-center bg-rose-50 text-rose-700 px-3 py-1 rounded-md"
                  >
                    <span>{serviceInfo.name}</span>
                    <button 
                      type="button" 
                      className="ml-2 text-rose-500 hover:text-rose-700"
                      onClick={() => handleRemoveArrayItem('services', index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-sm text-gray-500 italic">Noch keine Services ausgewählt</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sprachkenntnisse</label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {parsedLanguages.map((language, index) => (
            <div 
              key={index} 
              className="inline-flex items-center justify-between bg-rose-50 text-rose-700 px-3 py-1 rounded-md w-full md:w-auto"
            >
              <span className="mr-2">{language.name}</span>
              {renderStars(language.proficiency)}
              <button 
                type="button" 
                className="ml-2 text-rose-500 hover:text-rose-700"
                onClick={() => handleRemoveArrayItem('languages', index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="col-span-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">Sprache auswählen...</option>
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2">
            <span className="mr-2 text-sm text-gray-700">Kenntnisse:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    // Finde den entsprechenden Proficiency-Level für diese Sternanzahl
                    const proficiency = proficiencyLevels.find(level => level.stars === star);
                    if (proficiency) {
                      setSelectedProficiency(proficiency.id);
                    }
                  }}
                  className="focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={star <= (proficiencyLevels.find(p => p.id === selectedProficiency)?.stars || 0) ? 'hsl(345.3, 82.7%, 40.8%)' : 'currentColor'}
                    className="w-6 h-6 text-gray-300 hover:text-rose-400 transition-colors"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              ))}
              {selectedProficiency && (
                <button 
                  type="button" 
                  onClick={() => setSelectedProficiency('')}
                  className="ml-2 text-gray-500 hover:text-rose-700"
                  title="Auswahl zurücksetzen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <button
          type="button"
          className="bg-rose-700 text-white px-4 py-2 rounded-md hover:bg-rose-600 w-full"
          onClick={addLanguage}
          disabled={!selectedLanguage || !selectedProficiency}
        >
          Sprache hinzufügen
        </button>
      </div>
    </div>
  );
};

export default ServicesForm;
