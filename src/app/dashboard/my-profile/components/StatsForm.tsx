import React from 'react';
import { ProfileData } from '../page';

interface StatsFormProps {
  profileData: ProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const StatsForm: React.FC<StatsFormProps> = ({ profileData, handleInputChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Körperliche Eigenschaften</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Größe */}
        <div className="mb-4">
          <label htmlFor="stats.height" className="block text-sm font-medium text-gray-700 mb-1">Größe (cm)</label>
          <input 
            type="number" 
            id="stats.height" 
            name="stats.height" 
            value={profileData.stats?.height || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            min="140"
            max="220"
          />
        </div>
        
        {/* Gewicht */}
        <div className="mb-4">
          <label htmlFor="stats.weight" className="block text-sm font-medium text-gray-700 mb-1">Gewicht (kg)</label>
          <input 
            type="number" 
            id="stats.weight" 
            name="stats.weight" 
            value={profileData.stats?.weight || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            min="40"
            max="150"
          />
        </div>
        
        {/* Figur */}
        <div className="mb-4">
          <label htmlFor="stats.bodyType" className="block text-sm font-medium text-gray-700 mb-1">Figur</label>
          <select 
            id="stats.bodyType" 
            name="stats.bodyType" 
            value={profileData.stats?.bodyType || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="schlank">Schlank</option>
            <option value="sportlich">Sportlich</option>
            <option value="athletisch">Athletisch</option>
            <option value="durchschnittlich">Durchschnittlich</option>
            <option value="kurvig">Kurvig</option>
            <option value="vollschlank">Vollschlank</option>
            <option value="mollig">Mollig</option>
          </select>
        </div>
        
        {/* Haarfarbe */}
        <div className="mb-4">
          <label htmlFor="stats.hair" className="block text-sm font-medium text-gray-700 mb-1">Haarfarbe</label>
          <select 
            id="stats.hair" 
            name="stats.hair" 
            value={profileData.stats?.hair || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="blond">Blond</option>
            <option value="braun">Braun</option>
            <option value="schwarz">Schwarz</option>
            <option value="rot">Rot</option>
            <option value="grau">Grau</option>
            <option value="weiß">Weiß</option>
            <option value="gefärbt">Gefärbt</option>
          </select>
        </div>
        
        {/* Haarlänge */}
        <div className="mb-4">
          <label htmlFor="stats.hairLength" className="block text-sm font-medium text-gray-700 mb-1">Haarlänge</label>
          <select 
            id="stats.hairLength" 
            name="stats.hairLength" 
            value={profileData.stats?.hairLength || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="kurz">Kurz</option>
            <option value="mittel">Mittel</option>
            <option value="lang">Lang</option>
            <option value="sehr lang">Sehr lang</option>
          </select>
        </div>
        
        {/* Augenfarbe */}
        <div className="mb-4">
          <label htmlFor="stats.eyes" className="block text-sm font-medium text-gray-700 mb-1">Augenfarbe</label>
          <select 
            id="stats.eyes" 
            name="stats.eyes" 
            value={profileData.stats?.eyes || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="blau">Blau</option>
            <option value="grün">Grün</option>
            <option value="braun">Braun</option>
            <option value="grau">Grau</option>
            <option value="bernstein">Bernstein</option>
            <option value="haselnuss">Haselnuss</option>
          </select>
        </div>
        
        {/* Brusttyp */}
        <div className="mb-4">
          <label htmlFor="stats.breastType" className="block text-sm font-medium text-gray-700 mb-1">Brusttyp</label>
          <select 
            id="stats.breastType" 
            name="stats.breastType" 
            value={profileData.stats?.breastType || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="natürlich">Natürlich</option>
            <option value="silikon">Silikon</option>
          </select>
        </div>
        
        {/* Brustgröße */}
        <div className="mb-4">
          <label htmlFor="stats.breastSize" className="block text-sm font-medium text-gray-700 mb-1">Brustgröße</label>
          <select 
            id="stats.breastSize" 
            name="stats.breastSize" 
            value={profileData.stats?.breastSize || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
          </select>
        </div>
        
        {/* Intimbereich */}
        <div className="mb-4">
          <label htmlFor="stats.intimate" className="block text-sm font-medium text-gray-700 mb-1">Intimbereich</label>
          <select 
            id="stats.intimate" 
            name="stats.intimate" 
            value={profileData.stats?.intimate || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="natürlich">Natürlich</option>
            <option value="teilrasiert">Teilrasiert</option>
            <option value="vollständig rasiert">Vollständig rasiert</option>
            <option value="gestylt">Gestylt</option>
          </select>
        </div>
        
        {/* Tätowierungen */}
        <div className="mb-4">
          <label htmlFor="stats.tattoos" className="block text-sm font-medium text-gray-700 mb-1">Tätowierungen</label>
          <select 
            id="stats.tattoos" 
            name="stats.tattoos" 
            value={profileData.stats?.tattoos || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="keine">Keine</option>
            <option value="wenige">Wenige</option>
            <option value="mehrere">Mehrere</option>
            <option value="viele">Viele</option>
          </select>
        </div>
        
        {/* Piercings */}
        <div className="mb-4">
          <label htmlFor="stats.piercings" className="block text-sm font-medium text-gray-700 mb-1">Piercings</label>
          <select 
            id="stats.piercings" 
            name="stats.piercings" 
            value={profileData.stats?.piercings || ''} 
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">Auswählen...</option>
            <option value="keine">Keine</option>
            <option value="nur Ohren">Nur Ohren</option>
            <option value="einige">Einige</option>
            <option value="viele">Viele</option>
            <option value="intime Piercings">Intime Piercings</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StatsForm;
