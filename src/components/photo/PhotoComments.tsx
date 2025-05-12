"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface PhotoCommentsProps {
  photoId: string;
}

const PhotoComments = ({ photoId }: PhotoCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Kommentare laden
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/photos/comment?photoId=${photoId}`);
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Kommentare');
        }
        
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Fehler beim Laden der Kommentare:', err);
        setError('Kommentare konnten nicht geladen werden');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (photoId) {
      fetchComments();
    }
  }, [photoId]);
  
  // Formatiert das Datum für die Anzeige
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Kommentar hinzufügen
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/photos/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoId, content: newComment })
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Hinzufügen des Kommentars');
      }
      
      const newCommentData = await response.json();
      
      // Neuen Kommentar zur Liste hinzufügen und Eingabefeld leeren
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Kommentars:', err);
      setError('Kommentar konnte nicht hinzugefügt werden');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kommentar löschen
  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/photos/comment?id=${commentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Kommentars');
      }
      
      // Kommentar aus der Liste entfernen
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Fehler beim Löschen des Kommentars:', err);
      setError('Kommentar konnte nicht gelöscht werden');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-4 w-full max-w-full">
      {/* Kommentar-Formular */}
      <form onSubmit={handleAddComment} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Schreibe einen Kommentar..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 disabled:bg-gray-300"
          >
            Senden
          </button>
        </div>
      </form>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Kommentarliste */}
      {comments.length > 0 ? (
        <ul className="divide-y divide-gray-100 bg-white rounded-md border border-gray-200 max-h-[400px] overflow-y-auto">
          {comments.map((comment) => (
            <li key={comment.id} className="p-3 border-b border-gray-100 last:border-0">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {comment.user.image ? (
                    <Image 
                      src={comment.user.image} 
                      alt={comment.user.name || 'Benutzer'} 
                      width={40} 
                      height={40} 
                      className="object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400 p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{comment.user.name || 'Anonym'}</h4>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
              {/* Löschen-Button für eigene Kommentare */}
              <div className="mt-2 flex justify-end">
                <button 
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Noch keine Kommentare. Sei der Erste!</p>
        </div>
      )}
    </div>
  );
};

export default PhotoComments;
