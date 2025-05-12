"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  // Standard-Kontotyp ist "Mitglied" gemäß Benutzervorlieben
  const router = useRouter();
  const { updateAuth } = useAuth();
  const [accountType, setAccountType] = useState<'mitglied' | 'escort'>('mitglied');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Passwort-Validierung auf Client-Seite
    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          accountType: accountType
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Registrierung');
      }
      
      // Nach erfolgreicher Registrierung den Auth-Status aktualisieren, damit der Avatar sofort angezeigt wird
      await updateAuth();
      
      // Nach erfolgreicher Registrierung zur Startseite weiterleiten
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Bei der Registrierung ist ein Fehler aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="logo-container">
                <Image 
                  src="/images/logo-dark.png" 
                  alt="TheGND Logo" 
                  width={120} 
                  height={60} 
                  className="rounded" 
                />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-2">Bei TheGND registrieren</h1>
            <p className="text-gray-600 text-center mb-8">Erstelle ein Konto und entdecke unsere Plattform</p>
            
            {/* Kontotyp-Auswahl über Buttons am Anfang des Formulars gemäß Benutzervorlieben */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-3">Kontotyp auswählen</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`py-2 px-3 rounded-button text-sm text-center transition-colors ${accountType === 'mitglied' 
                    ? 'bg-rose-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setAccountType('mitglied')}
                >
                  Mitglied
                </button>
                <button
                  type="button"
                  className={`py-2 px-3 rounded-button text-sm text-center transition-colors ${accountType === 'escort' 
                    ? 'bg-rose-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setAccountType('escort')}
                >
                  Girl | Escort
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Benutzername (statt "Name" gemäß Benutzervorlieben) */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Benutzername</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Benutzername"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* E-Mail */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="E-Mail Adresse"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Passwort */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Passwort</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Passwort"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Passwort bestätigen */}
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">Passwort bestätigen</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Passwort bestätigen"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* AGB und Datenschutz */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-rose-700 focus:ring-rose-500"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    Ich stimme den <Link href="/terms" className="text-rose-700 hover:underline">AGB</Link> und 
                    <Link href="/privacy" className="text-rose-700 hover:underline"> Datenschutzbestimmungen</Link> zu
                  </span>
                </label>
              </div>
              
              {/* Submit Button */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-700 text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-rose-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Wird erstellt...' : 'Konto erstellen'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Bereits ein Konto? <Link href="/login" className="text-rose-700 hover:underline">Anmelden</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
