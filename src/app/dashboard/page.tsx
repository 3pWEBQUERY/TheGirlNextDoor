"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MyProfilePage from './my-profile/page';
import MessagesPage from './messages/page';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    followers: 0,
    likes: 0,
    messages: 0
  });
  
  // Schütze die Route - nur für eingeloggte Benutzer
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Lese URL-Parameter, um den aktiven Tab und die Konversation zu setzen
  useEffect(() => {
    // Lese Tab-Parameter aus der URL
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    const conversationParam = searchParams.get('conversation');
    
    // Setze den aktiven Tab, wenn ein gültiger Tab in der URL angegeben ist
    if (tabParam && ['overview', 'profile', 'content', 'messages', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Setze die ausgewählte Konversation, wenn eine angegeben ist
    if (conversationParam) {
      setSelectedConversation(conversationParam);
    }
  }, []);

  // Simuliere das Laden von Statistiken
  useEffect(() => {
    if (user) {
      // In einer echten App würden diese Daten von einer API abgerufen
      setStats({
        profileViews: 1245,
        followers: 78,
        likes: 423,
        messages: 12
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // useEffect wird die Umleitung übernehmen
  }

  // Die verschiedenen Tabs des Dashboards
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Statistik-Karten */}
            <div className="bg-white rounded-md shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Profilaufrufe</h3>
              <p className="text-3xl font-bold text-rose-700">{stats.profileViews}</p>
              <p className="text-sm text-gray-500 mt-2">In den letzten 30 Tagen</p>
            </div>
            
            <div className="bg-white rounded-md shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Follower</h3>
              <p className="text-3xl font-bold text-rose-700">{stats.followers}</p>
              <p className="text-sm text-gray-500 mt-2">Gesamt</p>
            </div>
            
            <div className="bg-white rounded-md shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Likes</h3>
              <p className="text-3xl font-bold text-rose-700">{stats.likes}</p>
              <p className="text-sm text-gray-500 mt-2">Auf allen Inhalten</p>
            </div>
            
            <div className="bg-white rounded-md shadow-sm p-5">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nachrichten</h3>
              <p className="text-3xl font-bold text-rose-700">{stats.messages}</p>
              <p className="text-sm text-gray-500 mt-2">Ungelesen</p>
            </div>
          </div>
        );
      case 'profile':
        // Profil-Verwaltung mit der MyProfilePage Komponente
        return <MyProfilePage />;
      case 'content':
        // Inhalts-Verwaltung Tab wird später implementiert
        return <div className="mt-4 bg-white rounded-md shadow-sm p-6"><p>Inhalts-Verwaltung wird geladen...</p></div>;
      case 'messages':
        // Nachrichten-Messenger Component einbinden und ausgewählte Konversation übergeben
        return <div className="mt-4"><MessagesPage initialConversationId={selectedConversation} /></div>;
      case 'settings':
        // Einstellungen Tab wird später implementiert
        return <div className="mt-4 bg-white rounded-md shadow-sm p-6"><p>Kontoeinstellungen werden geladen...</p></div>;
      default:
        return null;
    }
  };

  // Responsiver Tab-Switch für Mobile und Desktop
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Willkommen zurück, {user?.name || 'Benutzer'}</p>
        </div>
        
        {/* Desktop Tabs - versteckt auf mobilen Geräten */}
        <div className="hidden md:flex mb-6 border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'overview' ? 'text-rose-700 border-b-2 border-rose-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Übersicht
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'profile' ? 'text-rose-700 border-b-2 border-rose-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'content' ? 'text-rose-700 border-b-2 border-rose-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('content')}
          >
            Inhalte
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'messages' ? 'text-rose-700 border-b-2 border-rose-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('messages')}
          >
            Nachrichten
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'settings' ? 'text-rose-700 border-b-2 border-rose-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Einstellungen
          </button>
        </div>
        
        {/* Mobile Tab Dropdown - nur auf mobilen Geräten sichtbar */}
        <div className="md:hidden mb-6">
          <select 
            className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="overview">Übersicht</option>
            <option value="profile">Profil</option>
            <option value="content">Inhalte</option>
            <option value="messages">Nachrichten</option>
            <option value="settings">Einstellungen</option>
          </select>
        </div>
        
        {/* Tabinhalte */}
        <div className="bg-white rounded-md shadow-sm p-4 md:p-6">
          {renderContent()}
        </div>
        
        {/* Schnellzugriff-Karten - nur auf Desktop sichtbar */}
        <div className="hidden lg:block mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Schnellzugriff</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/my-profile" className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-rose-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Profil bearbeiten</h3>
                  <p className="text-sm text-gray-500">Persönliche Daten aktualisieren</p>
                </div>
              </div>
            </Link>
            
            <Link href="/messages" className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-rose-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Nachrichten</h3>
                  <p className="text-sm text-gray-500">{stats.messages} ungelesene Nachrichten</p>
                </div>
              </div>
            </Link>
            
            <Link href="/content/new" className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-rose-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Neuen Inhalt erstellen</h3>
                  <p className="text-sm text-gray-500">Video oder Bild hochladen</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
