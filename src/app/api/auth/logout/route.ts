import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Logout API aufgerufen - Cookie wird gelöscht');
  
  // Bestehenden Token für Logs abrufen
  const token = request.cookies.get('auth-token')?.value;
  console.log('Vorhandenes Token zum Löschen:', token ? 'Ja' : 'Nein');

  // Cookie löschen mit expliziter Erfolgsantwort
  const response = NextResponse.json({ 
    success: true, 
    message: 'Erfolgreich abgemeldet', 
    timestamp: new Date().toISOString() 
  }, { status: 200 });
  
  // Auth-Token Cookie gründlich entfernen mit allen erforderlichen Einstellungen
  // Das Setzen eines leeren Werts mit einem abgelaufenen Datum entfernt das Cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  console.log('Cookie gelöscht, Abmeldung abgeschlossen');
  return response;
}
