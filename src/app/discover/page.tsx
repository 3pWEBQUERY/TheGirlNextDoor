import VideoFeed from '@/components/video/VideoFeed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entdecken | TheGND',
  description: 'Entdecke neue Profile und Videos auf TheGND',
};

export default function DiscoverPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Filter Button - Nur auf kleinen Bildschirmen sichtbar */}
      <div className="md:hidden sticky top-16 z-10 bg-white shadow-sm p-3">
        <button 
          className="w-full px-4 py-2 text-white rounded-md text-sm font-medium flex items-center justify-center"
          style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter anzeigen
        </button>
      </div>
      
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar für Desktop */}
          <div className="hidden md:block md:w-1/4 p-4 bg-white rounded-xl shadow-sm m-4">
            <h2 className="font-bold text-lg mb-4">Kategorien</h2>
            <ul className="space-y-2">
              <li className="p-2 bg-primary-50 text-primary-600 rounded-button font-medium">
                Alle Videos
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-button transition-colors cursor-pointer">
                Trending
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-button transition-colors cursor-pointer">
                Neu
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-button transition-colors cursor-pointer">
                Beliebt
              </li>
              <li className="p-2 hover:bg-gray-100 rounded-button transition-colors cursor-pointer">
                Folgt
              </li>
            </ul>
            
            <h2 className="font-bold text-lg mt-6 mb-4">Filter</h2>
            <div className="space-y-4">
              {/* Standort Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Standort</h3>
                <select className="w-full p-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Alle Standorte</option>
                  <option>Berlin</option>
                  <option>Hamburg</option>
                  <option>München</option>
                  <option>Köln</option>
                  <option>Frankfurt</option>
                </select>
              </div>
              
              {/* Altersbereich Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Alter</h3>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">18</span>
                  <span className="text-xs text-gray-500">50+</span>
                </div>
                <input 
                  type="range" 
                  min="18" 
                  max="50" 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Dienstleistungen Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dienstleistungen</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm">Begleitung</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm">Dinner Date</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm">Reisebegleitung</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hauptbereich für VideoFeed */}
          <div className="md:w-3/4">
            <VideoFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
