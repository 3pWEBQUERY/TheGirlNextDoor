"use client";

import HeroSection from "../components/HeroSection";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'mitglied' | 'escort'>('mitglied');
  return (
    <>
      {/* Hero Section als separate Komponente */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Was TheGND bietet</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.25 2.25 0 0 0-1.872-1.031 48.317 48.317 0 0 0-1.965-.001 2.25 2.25 0 0 0-1.872 1.03l-.821 1.317a2.31 2.31 0 0 1-1.64 1.055 48.172 48.172 0 0 0-1.133.176C4.5 7.612 3.75 8.539 3.75 9.606v.072c0 .267.21.488.471.518a42.55 42.55 0 0 1 3.346.245c2.276.283 4.553.689 6.779 1.208" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Video-Basierte Profile</h3>
              <p className="text-gray-600">
                Entdecke authentische Persönlichkeiten durch kurze Videos statt statischer Bilder und lerne die Person hinter dem Profil kennen.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalisierter Feed</h3>
              <p className="text-gray-600">
                Ein auf deine Interessen zugeschnittener Video-Feed hilft dir, genau die Profile zu entdecken, die zu deinen Vorlieben passen.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sichere Kommunikation</h3>
              <p className="text-gray-600">
                Unser integriertes Nachrichtensystem ermöglicht dir eine sichere Kontaktaufnahme und den Austausch von Bild- und Videomaterial.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">So funktioniert's</h2>
          <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
            TheGND kombiniert die Vorteile einer strukturierten Escort Directory mit der Dynamik von kurzen Videos für ein besseres Nutzererlebnis.
          </p>
          
          {/* Tab-Menü */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-button bg-gray-200 p-1">
              <button
                onClick={() => setActiveTab('mitglied')}
                className={`px-4 py-2 rounded-button text-sm font-medium transition-colors ${
                  activeTab === 'mitglied'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-white'
                }`}
                style={{
                  backgroundColor: activeTab === 'mitglied' ? 'hsl(345.3, 82.7%, 40.8%)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'mitglied') {
                    e.currentTarget.style.backgroundColor = 'hsla(345.3, 82.7%, 40.8%, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'mitglied') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Mitglied
              </button>
              <button
                onClick={() => setActiveTab('escort')}
                className={`px-4 py-2 rounded-button text-sm font-medium transition-colors ${
                  activeTab === 'escort'
                    ? 'text-white' 
                    : 'text-gray-700 hover:text-white'
                }`}
                style={{
                  backgroundColor: activeTab === 'escort' ? 'hsl(345.3, 82.7%, 40.8%)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'escort') {
                    e.currentTarget.style.backgroundColor = 'hsla(345.3, 82.7%, 40.8%, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'escort') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Girls | Escort
              </button>
            </div>
          </div>
          
          {/* Mitglied Content */}
          {activeTab === 'mitglied' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 - Mitglied */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'}}>1</div>
                <h3 className="text-xl font-semibold mb-2">Registriere dich</h3>
                <p className="text-gray-600">
                  Erstelle ein kostenloses Mitglieds-Konto und gestalte dein Profil mit deinen Vorlieben und Interessen.
                </p>
              </div>
              
              {/* Step 2 - Mitglied */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'}}>2</div>
                <h3 className="text-xl font-semibold mb-2">Entdecke Profile</h3>
                <p className="text-gray-600">
                  Durchstöbere die Escort-Profile, sieh dir ihre Videos an und finde die Person, die zu deinen Vorstellungen passt.
                </p>
              </div>
              
              {/* Step 3 - Mitglied */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'}}>3</div>
                <h3 className="text-xl font-semibold mb-2">Nimm Kontakt auf</h3>
                <p className="text-gray-600">
                  Kontaktiere Escorts direkt über unser sicheres Nachrichtensystem und vereinbare ein Treffen zu deinen Bedingungen.
                </p>
              </div>
            </div>
          )}
          
          {/* Escort Content */}
          {activeTab === 'escort' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 - Escort */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'}}>1</div>
                <h3 className="text-xl font-semibold mb-2">Erstelle dein Profil</h3>
                <p className="text-gray-600">
                  Registriere dich als Escort und gestalte dein Profil mit allen wichtigen Details zu deinen Dienstleistungen, Preisen und Verfügbarkeiten.
                </p>
              </div>
              
              {/* Step 2 - Escort */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'}}>2</div>
                <h3 className="text-xl font-semibold mb-2">Lade Videos hoch</h3>
                <p className="text-gray-600">
                  Teile kurze Videos (15-60 Sekunden), die deine Persönlichkeit zeigen und potenzielle Kunden von deiner Einzigartigkeit überzeugen.
                </p>
              </div>
              
              {/* Step 3 - Escort */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'}}>3</div>
                <h3 className="text-xl font-semibold mb-2">Verbinde dich</h3>
                <p className="text-gray-600">
                  Erhalte Nachrichten von interessierten Mitgliedern, verwalte deine Buchungen und baue deinen Kundenstamm in einer sicheren Umgebung auf.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Join Now CTA */}
      <section className="py-16 text-white" style={{background: 'hsl(345.3, 82.7%, 40.8%)'}}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für eine neue Erfahrung?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Tritt noch heute unserer wachsenden Community bei und erlebe, wie TheGND die Art und Weise verändert, wie Anbieter und Kunden interagieren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary-600 px-6 py-2 rounded-button text-sm font-medium hover:bg-gray-100 transition-colors">
              Registrieren
            </Link>
            <Link href="/about" className="bg-transparent border border-white text-white px-6 py-2 rounded-button text-sm font-medium hover:bg-white/10 transition-colors">
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* Weitere Sektionen können hier hinzugefügt werden */}
    </>
  );
}
