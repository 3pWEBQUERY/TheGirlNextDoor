"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  updateAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  logout: () => {},
  updateAuth: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Beim Mounting der Komponente den aktuellen Benutzer abrufen
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    console.log('Logout-Funktion aufgerufen');
    
    try {
      // 1. Benutzer sofort aus lokalem State entfernen
      setUser(null);
      console.log('Lokalen Benutzer-State auf null gesetzt');
      
      // 2. Alle lokalen Speicher löschen, die auth-bezogene Daten enthalten könnten
      try {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        console.log('Lokale Speicherdaten gelöscht');
      } catch (e) {
        console.error('Fehler beim Löschen lokaler Speicherdaten:', e);
      }
      
      // 3. Cookie durch API-Aufruf löschen
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Stellt sicher, dass Cookies mitgesendet werden
        cache: 'no-store', // Verhindert Caching des Requests
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        }
      });
      
      const responseData = await response.json();
      console.log('Antwort vom Server:', responseData);
      
      if (response.ok) {
        console.log('Abmeldung erfolgreich, leite zur Startseite weiter');
        
        // 4. Hard redirect zur Startseite mit Cache-Breaking Parameter
        // Das folgende wird den gesamten Anwendungszustand zurücksetzen
        const cacheBuster = new Date().getTime();
        window.location.href = `/?logout=${cacheBuster}`;
      } else {
        // Fehlerfall behandeln
        console.error('Logout nicht erfolgreich:', responseData);
        alert('Abmelden fehlgeschlagen. Die Seite wird neu geladen.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout fehlgeschlagen mit Ausnahme:', error);
      alert('Abmelden fehlgeschlagen. Die Seite wird neu geladen.');
      window.location.reload();
    }
  };

  // Funktion zur manuellen Aktualisierung des Auth-Status
  const updateAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to update auth status:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
