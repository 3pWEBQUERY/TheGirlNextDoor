'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface VideoCommentsProps {
  videoId: string;
}

const VideoComments = ({ videoId }: VideoCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kommentare laden
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/videos/comment?videoId=${videoId}`);
      
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

  // Kommentare beim ersten Rendern laden
  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId, fetchComments]);

  // Kommentar absenden
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/videos/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, content: newComment.trim() }),
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Absenden des Kommentars');
      }
      
      const newCommentData = await response.json();
      
      // Neuen Kommentar zur Liste hinzufügen und Eingabefeld leeren
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Fehler beim Absenden des Kommentars:', err);
      setError('Kommentar konnte nicht gesendet werden');
    } finally {
      setIsLoading(false);
    }
  };

  // Kommentar löschen
  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/videos/comment?commentId=${commentId}`, {
        method: 'DELETE',
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

  // Datum formatieren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Kommentare ({comments.length})</h3>
      
      {/* Kommentar-Formular */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            {/* Platzhalter-Avatar oder Benutzeravatar */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400 p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-grow">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Schreibe einen Kommentar..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button 
                type="submit" 
                disabled={isLoading || !newComment.trim()}
                className={`px-4 py-2 ${isLoading || !newComment.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white rounded-md transition-colors`}
              >
                {isLoading ? "Wird gesendet..." : "Kommentieren"}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Kommentarliste */}
      {isLoading && comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Kommentare werden geladen...</p>
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="p-3 border-b border-gray-100 last:border-0">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {comment.user.image ? (
                    <Image 
                      src={comment.user.image} 
                      alt={comment.user.name || "Benutzer"} 
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
                    <h4 className="font-medium text-gray-900">{comment.user.name || "Anonym"}</h4>
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

export default VideoComments;
