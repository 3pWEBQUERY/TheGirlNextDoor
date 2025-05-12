"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Benutzer State und Funktionen aus AuthContext holen mit aktualisierter Referenz
  const { user, loading, logout } = useAuth();
  
  // Debugging-Hilfe (kann später entfernt werden)
  useEffect(() => {
    console.log('Header Auth State:', { user, loading });
  }, [user, loading]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Dropdown schließen, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="logo-container">
            <Image 
              src="/images/logo-dark.png" 
              alt="TheGND Logo" 
              width={120} 
              height={50} 
              className="rounded" 
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/discover" className="text-gray-700 hover:text-primary-600 transition-colors">
            Entdecken
          </Link>
          <Link href="/trending" className="text-gray-700 hover:text-primary-600 transition-colors">
            Trending
          </Link>
          <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
            Kategorien
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Wenn nicht lädt UND kein Benutzer vorhanden ist ODER der Benutzer explizit null ist: Login/Register anzeigen */}
          {(!loading && !user) ? (
            <>
              <Link 
                href="/login" 
                className="hidden sm:inline-block px-4 py-2 rounded-md text-sm font-medium border transition-colors"
                style={{
                  color: 'hsl(345.3, 82.7%, 40.8%)',
                  borderColor: 'hsl(345.3, 82.7%, 40.8%)'
                }}
              >
                Anmelden
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
                style={{
                  backgroundColor: 'hsl(345.3, 82.7%, 40.8%)'
                }}
              >
                Registrieren
              </Link>
            </>
          ) : (!loading && user) ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="relative h-8 w-8 rounded-md overflow-hidden border border-gray-200">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="Profilbild"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-rose-100 text-rose-700 w-full h-full flex items-center justify-center font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/u/${user.name}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Mein Profil
                  </Link>
                  <Link
                    href="/newsfeed"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Newsfeed
                  </Link>
                  <Link
                    href="/messages"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Nachrichten
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Einstellungen
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          ) : null}
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 absolute w-full z-50">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/discover" 
              className="text-gray-700 hover:text-rose-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Entdecken
            </Link>
            <Link 
              href="/trending" 
              className="text-gray-700 hover:text-rose-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-rose-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Kategorien
            </Link>
            
            {/* Prüfe explizit auf nicht vorhandenen Benutzer */}
            {(!user) ? (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Anmelden
                </Link>
                <Link 
                  href="/register" 
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrieren
                </Link>
              </>
            ) : (
              <>
                {/* Benutzerinfo anzeigen */}
                <div className="pt-2 pb-3 border-t border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="relative h-8 w-8 rounded-md overflow-hidden border border-gray-200 mr-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt="Profilbild"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-rose-100 text-rose-700 w-full h-full flex items-center justify-center font-medium">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </div>
                
                {/* Benutzermenü-Optionen */}
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href={`/u/${user.name}`}
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mein Profil
                </Link>
                <Link 
                  href="/newsfeed" 
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Newsfeed
                </Link>
                <Link 
                  href="/messages" 
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nachrichten
                </Link>
                <Link 
                  href="/settings" 
                  className="text-gray-700 hover:text-rose-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Einstellungen
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-rose-700 hover:text-rose-800 transition-colors"
                >
                  Abmelden
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
