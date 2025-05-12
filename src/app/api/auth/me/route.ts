import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // WICHTIG: Die automatische Erstellung eines Test-Benutzers wurde entfernt,
    // damit Logout korrekt funktioniert!
    console.log('GET /api/auth/me aufgerufen - Prüfe auth-token');


    // Produktionsmodus: Normale Authentifizierung
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      userId: string;
      email: string;
    };

    // Benutzer aus der Datenbank abrufen
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profiles: {
          select: {
            id: true,
            username: true,
            profileType: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
