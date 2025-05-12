import React from 'react';
import { ProfileData } from '../page';
import { Info, Check, X } from 'lucide-react';

interface AvailabilityFormProps {
  profileData: ProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ profileData, handleInputChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verfügbarkeit</h2>
      
      {/* Wochentage */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Wochentage</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day, index) => {
            const dayKey = `day${index + 1}` as keyof typeof profileData.availability;
            const isAvailable = profileData.availability?.[dayKey] === 'true';
            
            return (
              <div key={day} className="flex items-center">
                <input
                  type="checkbox"
                  id={`availability.${dayKey}`}
                  name={`availability.${dayKey}`}
                  checked={isAvailable}
                  value={isAvailable ? 'false' : 'true'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-rose-700 focus:ring-rose-500 rounded"
                />
                <label htmlFor={`availability.${dayKey}`} className="ml-2 text-sm text-gray-700">
                  {day}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Uhrzeit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label htmlFor="availability.fromTime" className="block text-sm font-medium text-gray-700 mb-1">Von</label>
          <input 
            type="time" 
            id="availability.fromTime" 
            name="availability.fromTime" 
            value={profileData.availability?.fromTime || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        
        <div>
          <label htmlFor="availability.toTime" className="block text-sm font-medium text-gray-700 mb-1">Bis</label>
          <input 
            type="time" 
            id="availability.toTime" 
            name="availability.toTime" 
            value={profileData.availability?.toTime || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
      
      {/* Zusätzliche Info mit detaillierten Richtlinien */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="availability.info" className="block text-sm font-medium text-gray-700">
            Zusätzliche Informationen zur Verfügbarkeit
          </label>
          <div className="flex items-center text-xs text-rose-700">
            <Info size={14} className="mr-1" />
            <span>Wichtige Angaben</span>
          </div>
        </div>

        <textarea 
          id="availability.info" 
          name="availability.info" 
          value={profileData.availability?.info || ''} 
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-600"
          rows={4}
          placeholder="Geben Sie hier zusätzliche Details zu Ihrer Verfügbarkeit an..."
        />

        <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="font-medium text-sm mb-2 text-gray-700">Wichtige Informationen zu den Verfügbarkeitsangaben:</h4>
          
          <p className="text-sm text-gray-600 mb-3">
            Bitte beachten Sie, dass alle Angaben zur Verfügbarkeit verbindlich sind. Geben Sie nur Zeiten an, zu denen Sie tatsächlich verfügbar sind.
          </p>

          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Folgende Angaben sind erlaubt:</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <Check size={14} className="text-green-500 mr-1 shrink-0 mt-0.5" />
                <span>Genaue Zeitfenster (z.B. &quot;Nach Vereinbarung nur zwischen 18-22 Uhr&quot;)</span>
              </li>
              <li className="flex items-start">
                <Check size={14} className="text-green-500 mr-1 shrink-0 mt-0.5" />
                <span>Besondere Verfügbarkeiten (z.B. &quot;Buchungen min. 2 Tage im Voraus&quot;)</span>
              </li>
              <li className="flex items-start">
                <Check size={14} className="text-green-500 mr-1 shrink-0 mt-0.5" />
                <span>Stadtteile oder Regionen, in denen Sie arbeiten (z.B. &quot;Nur in Zürich und Umgebung&quot;)</span>
              </li>
              <li className="flex items-start">
                <Check size={14} className="text-green-500 mr-1 shrink-0 mt-0.5" />
                <span>Saisonale Verfügbarkeit (z.B. &quot;Im Sommer auch kurzfristig verfügbar&quot;)</span>
              </li>
            </ul>

            <h5 className="text-sm font-medium text-gray-700 mt-3">Nicht erlaubt sind:</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <X size={14} className="text-red-500 mr-1 shrink-0 mt-0.5" />
                <span>Kontaktinformationen (Telefonnummern, E-Mail, Social Media)</span>
              </li>
              <li className="flex items-start">
                <X size={14} className="text-red-500 mr-1 shrink-0 mt-0.5" />
                <span>Preisangaben oder Verhandlungen (nutzen Sie dafür den Bereich &quot;Preise&quot;)</span>
              </li>
              <li className="flex items-start">
                <X size={14} className="text-red-500 mr-1 shrink-0 mt-0.5" />
                <span>Explizite Beschreibungen von Services (nutzen Sie dafür den Bereich "Services")</span>
              </li>
              <li className="flex items-start">
                <X size={14} className="text-red-500 mr-1 shrink-0 mt-0.5" />
                <span>Beleidigungen oder unangemessene Sprache</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-500 mt-3 italic">
            Hinweis: Alle Einträge werden von unserem Team geprüft. Bei Verstößen gegen unsere Richtlinien kann Ihr Profil vorübergehend deaktiviert werden.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityForm;
