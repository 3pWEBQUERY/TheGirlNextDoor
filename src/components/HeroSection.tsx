"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'mitglied' | 'escort'>('mitglied');
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              The Girl Next Door
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Die neue Art, authentische Persönlichkeiten zu entdecken. Eine hybride Plattform, die Directory-Struktur mit TikTok-ähnlicher Video-Interaktion verbindet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/discover" 
                className="px-6 py-2 rounded-md text-white font-medium text-center"
                style={{ backgroundColor: 'hsl(345.3, 82.7%, 40.8%)' }}
              >
                Entdecken
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2 rounded-md font-medium text-center border"
                style={{ 
                  color: 'hsl(345.3, 82.7%, 40.8%)', 
                  borderColor: 'hsl(345.3, 82.7%, 40.8%)' 
                }}
              >
                Registrieren
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Mobile Mockup */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 h-[500px] w-[250px] mx-auto relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-center px-4">
                    (Benutzer-Video-Feed-Vorschau)
                  </p>
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-md p-3 flex items-center justify-center" style={{ backgroundColor: 'hsla(345.3, 82.7%, 40.8%, 0.7)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Abstract Shapes for background decoration */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF0066" d="M44.9,-76.2C59.7,-69.2,74.1,-60.1,79.8,-46.8C85.6,-33.6,82.7,-16.8,79.9,-1.7C77.1,13.5,74.3,27,67.1,38.2C59.8,49.4,48,58.3,35.4,62.3C22.9,66.3,9.7,65.3,-3.9,63.4C-17.5,61.5,-35,58.7,-43.8,49.7C-52.6,40.7,-52.7,25.4,-56.1,10.7C-59.6,-4,-66.5,-18.1,-65.1,-31.1C-63.7,-44.1,-54.1,-56,-42.2,-63.3C-30.3,-70.7,-15.2,-73.6,0.2,-74C15.5,-74.3,31.1,-72.1,44.9,-76.2Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 opacity-10">
        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FF0066" d="M39.3,-65.6C54.4,-61.1,72.2,-57.2,79.4,-46.4C86.6,-35.6,83.1,-17.8,79.8,-1.9C76.5,14,73.4,28,67.1,41.2C60.8,54.4,51.4,66.9,39.1,72.8C26.7,78.7,11.3,78.2,-2.6,76.1C-16.5,74,-33,70.4,-43.2,61.3C-53.4,52.3,-57.3,37.9,-64.3,23.7C-71.3,9.6,-81.4,-4.3,-81.9,-18.2C-82.3,-32.1,-73.1,-46,-60.8,-55.4C-48.5,-64.8,-33.2,-69.8,-19.4,-70.5C-5.5,-71.2,7,-70.6,39.3,-65.6Z" transform="translate(100 100)" />
        </svg>
      </div>
    </section>
  );
}
