"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Kategorien
const CATEGORIES = [
  {
    id: 'c1',
    name: 'Escort',
    count: 234,
    image: '/escort.jpg',
    color: 'hsl(345.3, 82.7%, 40.8%)'
  },
  {
    id: 'c2',
    name: 'Massage',
    count: 156,
    image: '/massage.jpg',
    color: 'hsl(190, 70%, 50%)'
  },
  {
    id: 'c3',
    name: 'Domina',
    count: 89,
    image: '/domina.jpg',
    color: 'hsl(260, 70%, 40%)'
  },
  {
    id: 'c4',
    name: 'Tantra',
    count: 112,
    image: '/tantra.jpg',
    color: 'hsl(30, 80%, 60%)'
  },
  {
    id: 'c5',
    name: 'Fetisch',
    count: 67,
    image: '/fetisch.jpg',
    color: 'hsl(310, 65%, 45%)'
  },
  {
    id: 'c6',
    name: 'BDSM',
    count: 73,
    image: '/bdsm.jpg',
    color: 'hsl(0, 70%, 40%)'
  },
  {
    id: 'c7',
    name: 'Transgender',
    count: 48,
    image: '/transgender.jpg',
    color: 'hsl(150, 60%, 50%)'
  },
  {
    id: 'c8',
    name: 'Paare',
    count: 92,
    image: '/paar.jpg',
    color: 'hsl(210, 70%, 50%)'
  },
  {
    id: 'c9',
    name: 'Rollenspiele',
    count: 56,
    image: '/rollenspiel.jpg',
    color: 'hsl(280, 70%, 50%)'
  },
  {
    id: 'c10',
    name: 'Hausbesuche',
    count: 184,
    image: '/hausbesuch.jpg',
    color: 'hsl(170, 70%, 45%)'
  },
  {
    id: 'c11',
    name: 'Hotels',
    count: 205,
    image: '/hotel.jpg',
    color: 'hsl(45, 90%, 55%)'
  },
  {
    id: 'c12',
    name: 'Webcam',
    count: 128,
    image: '/webcam.jpg',
    color: 'hsl(225, 65%, 50%)'
  }
];

interface Location {
  id: string;
  name: string;
  count: number;
}

const LOCATIONS: Location[] = [
  { id: 'l1', name: 'Zürich', count: 245 },
  { id: 'l2', name: 'Bern', count: 187 },
  { id: 'l3', name: 'Luzern', count: 176 },
  { id: 'l4', name: 'Uri', count: 42 },
  { id: 'l5', name: 'Schwyz', count: 68 },
  { id: 'l6', name: 'Obwalden', count: 38 },
  { id: 'l7', name: 'Nidwalden', count: 36 },
  { id: 'l8', name: 'Glarus', count: 32 },
  { id: 'l9', name: 'Zug', count: 98 },
  { id: 'l10', name: 'Freiburg', count: 87 },
  { id: 'l11', name: 'Solothurn', count: 78 },
  { id: 'l12', name: 'Basel-Stadt', count: 121 },
  { id: 'l13', name: 'Basel-Landschaft', count: 93 },
  { id: 'l14', name: 'Schaffhausen', count: 54 },
  { id: 'l15', name: 'Appenzell Ausserrhoden', count: 31 },
  { id: 'l16', name: 'Appenzell Innerrhoden', count: 27 },
  { id: 'l17', name: 'St. Gallen', count: 115 },
  { id: 'l18', name: 'Graubünden', count: 89 },
  { id: 'l19', name: 'Aargau', count: 128 },
  { id: 'l20', name: 'Thurgau', count: 72 },
  { id: 'l21', name: 'Tessin', count: 105 },
  { id: 'l22', name: 'Waadt', count: 132 },
  { id: 'l23', name: 'Wallis', count: 94 },
  { id: 'l24', name: 'Neuenburg', count: 68 },
  { id: 'l25', name: 'Genf', count: 158 },
  { id: 'l26', name: 'Jura', count: 45 },
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="py-10" style={{ background: 'linear-gradient(135deg, hsla(345.3, 82.7%, 40.8%, 0.1), hsla(345.3, 82.7%, 40.8%, 0.2))' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Kategorien</h1>
          <p className="text-center text-gray-600 mb-6">
            Entdecke Profile und Videos nach deinen Interessen
          </p>
          
          {/* Suchleiste */}
          <div className="max-w-lg mx-auto">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Suche nach Kategorien, Stichworten oder Orten..."
                className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent focus:ring-pink-600"
              />
              <button 
                className="px-4 py-2 rounded-r-md text-white" 
                style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
              >
                Suchen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kategorie-Karten */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Beliebteste Kategorien</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <Link href={`/discover?category=${category.name}`} key={category.id} className="group">
              <div className="bg-white rounded-md shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative aspect-square w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    fill
                  />
                  <div 
                    className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white shadow-text">{category.name}</h3>
                      <p className="text-white text-sm shadow-text">{category.count} Profile</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Standorte-Sektion */}
        <h2 className="text-2xl font-bold mt-16 mb-6">Nach Standort</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {LOCATIONS.map((location) => (
            <Link 
              href={`/discover?location=${location.name}`} 
              key={location.id}
              className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{location.name}</span>
                <span 
                  className="px-2 py-1 text-xs rounded-md text-white" 
                  style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
                >
                  {location.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Alle Kategorien */}
        <div className="mt-16 bg-white rounded-md shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Alle Kategorien durchsuchen</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4">
            {[
              'Escort', 'Massage', 'Domina', 'Tantra', 'Fetisch', 'BDSM',
              'Transgender', 'Paare', 'Rollenspiele', 'Hausbesuche', 'Hotels', 'Webcam',
              'Companionship', 'Parties', 'Reisebegleitung', 'Anfängerfreundlich',
              'Erfahren', 'Mehrsprachig', 'International', 'VIP-Service', 'Studenten',
              'Mature', 'Junge Escorts', 'BBW', 'Petite', 'Model-Figur'
            ].map((tag, index) => (
              <Link 
                href={`/discover?tag=${tag}`} 
                key={`tag-${index}`}
                className="text-gray-700 hover:text-gray-900"
              >
                <div className="flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
                  ></span>
                  {tag}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Weitere Infos */}
          <div className="mt-10 p-5 rounded-md border" style={{ borderColor: 'hsla(345.3, 82.7%, 40.8%, 0.3)' }}>
            <h3 className="font-bold mb-3">Nicht das Richtige gefunden?</h3>
            <p className="text-gray-600 mb-4">
              Wir erweitern stetig unsere Kategorien und Filtermöglichkeiten. Hast du Vorschläge oder Wünsche?
            </p>
            <button 
              className="px-4 py-2 text-sm rounded-md text-white"
              style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
            >
              Feedback geben
            </button>
          </div>
        </div>
      </div>

      {/* CSS für Textschatten */}
      <style jsx global>{`
        .shadow-text {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
