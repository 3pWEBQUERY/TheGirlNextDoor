"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { updateAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Anmeldung');
      }
      
      // Benutzerinformationen sofort aktualisieren, ohne Seiten-Reload
      await updateAuth();
      
      // Nach erfolgreicher Anmeldung zur Startseite weiterleiten
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Bei der Anmeldung ist ein Fehler aufgetreten');
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
            
            <h1 className="text-2xl font-bold text-center mb-2">Willkommen zurück</h1>
            <p className="text-gray-600 text-center mb-8">Melde dich an, um fortzufahren</p>
            
            <form onSubmit={handleSubmit}>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Passwort</label>
                  <Link href="/forgot-password" className="text-sm text-rose-700 hover:text-rose-500">Passwort vergessen?</Link>
                </div>
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
              
              {/* Remember Me */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-rose-700 focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-600">Angemeldet bleiben</span>
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
                {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Noch kein Konto? <Link href="/register" className="text-rose-700 hover:underline">Registrieren</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
