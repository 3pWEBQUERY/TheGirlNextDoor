"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

type Conversation = {
  id: string;
  participant1: string;
  participant2: string;
  lastMessageAt: Date;
  participantProfile?: {
    username: string;
    displayName?: string;
    profileImage?: string;
  };
  lastMessage?: {
    content?: string;
    isRead: boolean;
    createdAt: Date;
  };
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: Date;
};

interface MessagesPageProps {
  initialConversationId?: string | null;
}

export default function MessagesPage({ initialConversationId }: MessagesPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Schütze die Route - nur für eingeloggte Benutzer
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchConversations();
    }
  }, [user, loading, router]);
  
  // Wenn eine initialConversationId übergeben wurde, lade diese Konversation und setze sie als ausgewählt
  useEffect(() => {
    if (initialConversationId && user) {
      console.log('Initialisiere Konversation mit ID:', initialConversationId);
      setSelectedConversation(initialConversationId);
      fetchMessages(initialConversationId);
    }
  }, [initialConversationId, user]);

  // Lade Konversationen des Benutzers
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/conversations');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Laden der Konversationen');
      }
      
      const data = await response.json();
      setConversations(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Konversationen:', error);
      // Auth-Fehler unterdrücken, andere Fehler anzeigen
      if (error instanceof Error && !error.message.includes('Nicht autorisiert')) {
        setError(error.message);
      } else {
        console.log('Konversationen konnten nicht geladen werden');
      }
      setIsLoading(false);
    }
  };

  // Lade Nachrichten für die ausgewählte Konversation
  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages/${conversationId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Laden der Nachrichten');
      }
      
      const data = await response.json();
      setMessages(data);
      setSelectedConversation(conversationId);
      setIsLoading(false);
      
      // Markiere Nachrichten als gelesen
      try {
        await fetch(`/api/messages/${conversationId}/read`, { method: 'POST' });
        
        // Aktualisiere auch die Konversationsliste, um ungelesene Nachrichten zu aktualisieren
        fetchConversations();
      } catch (readError) {
        console.error('Fehler beim Markieren der Nachrichten als gelesen:', readError);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nachrichten:', error);
      // Auth-Fehler unterdrücken, andere Fehler anzeigen
      if (error instanceof Error && !error.message.includes('Nicht autorisiert')) {
        setError(error.message);
      } else {
        console.log('Nachrichten konnten nicht geladen werden');
      }
      setIsLoading(false);
    }
  };

  // Sende eine neue Nachricht
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversation, content: newMessage }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Senden der Nachricht');
      }
      
      const newMsg = await response.json();
      
      // Füge die neue Nachricht zur Nachrichtenliste hinzu
      setMessages(prevMessages => [...prevMessages, newMsg]);
      
      // Leere das Eingabefeld
      setNewMessage('');
      
      // Aktualisiere die Konversationsliste, um die letzte Nachricht zu aktualisieren
      fetchConversations();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      // Auth-Fehler unterdrücken, andere Fehler anzeigen
      if (error instanceof Error && !error.message.includes('Nicht autorisiert')) {
        setError(error.message);
      } else {
        console.log('Nachricht konnte nicht gesendet werden');
      }
    }
  };

  // Zeige eine Vorschau der Nachricht in der Konversationsliste
  const getPreviewText = (text?: string) => {
    if (!text) return '';
    return text.length > 30 ? text.substring(0, 27) + '...' : text;
  };

  // Formatiere das Datum für die Anzeige
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    // Prüfe, ob die Nachricht von heute ist
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm');
    }
    
    // Prüfe, ob die Nachricht von gestern ist
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Gestern';
    }
    
    // Wenn die Nachricht älter ist, zeige Datum an
    return format(messageDate, 'dd.MM.yyyy', { locale: de });
  };

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

  return (
    <div className="min-h-[80vh] bg-white rounded-md shadow-sm">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          <button 
            className="ml-2 text-red-700" 
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex h-[calc(80vh-2rem)]">
        {/* Konversationsliste */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Nachrichten</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {isLoading && conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Konversationen werden geladen...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Keine Nachrichten vorhanden</div>
            ) : (
              conversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${selectedConversation === conversation.id ? 'bg-gray-100' : ''}`}
                  onClick={() => fetchMessages(conversation.id)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      {conversation.participantProfile?.profileImage ? (
                        <Image 
                          src={conversation.participantProfile.profileImage} 
                          alt={conversation.participantProfile.displayName || conversation.participantProfile.username} 
                          width={48} 
                          height={48} 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">
                            {(conversation.participantProfile?.displayName || conversation.participantProfile?.username || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {conversation.lastMessage && !conversation.lastMessage.isRead && conversation.participant1 === user?.id && (
                      <span className="absolute top-0 right-0 block w-3 h-3 bg-rose-700 rounded-full"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participantProfile?.displayName || conversation.participantProfile?.username}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatMessageDate(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${!conversation.lastMessage?.isRead && conversation.participant1 === user?.id ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                      {getPreviewText(conversation.lastMessage?.content)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Nachrichtenbereich */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Konversations-Header */}
              <div className="p-3 border-b border-gray-200 flex items-center">
                <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
                  {conversations.find(c => c.id === selectedConversation)?.participantProfile?.profileImage ? (
                    <Image 
                      src={conversations.find(c => c.id === selectedConversation)?.participantProfile?.profileImage || ''} 
                      alt={conversations.find(c => c.id === selectedConversation)?.participantProfile?.displayName || ''} 
                      width={32} 
                      height={32} 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">
                        {(conversations.find(c => c.id === selectedConversation)?.participantProfile?.displayName || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  {conversations.find(c => c.id === selectedConversation)?.participantProfile?.displayName || 
                   conversations.find(c => c.id === selectedConversation)?.participantProfile?.username}
                </h3>
              </div>
              
              {/* Nachrichtenverlauf */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
                {isLoading ? (
                  <div className="text-center text-gray-500">Nachrichten werden geladen...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">Keine Nachrichten vorhanden</div>
                ) : (
                  messages.map(message => {
                    const isCurrentUser = message.senderId === user?.id;
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-md px-4 py-2 ${isCurrentUser ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                        >
                          <div className="break-words">{message.content}</div>
                          <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-rose-100' : 'text-gray-500'}`}>
                            {format(new Date(message.createdAt), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Nachrichtenformular */}
              <div className="p-3 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="ml-2 bg-rose-700 text-white px-3 py-2 rounded-md text-sm disabled:bg-rose-300 disabled:cursor-not-allowed"
                  >
                    Senden
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>Wähle eine Konversation aus, um Nachrichten anzuzeigen</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
