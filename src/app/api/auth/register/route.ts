import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProfileType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, confirmPassword, accountType } = await request.json();

    // Validierung
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Alle Felder müssen ausgefüllt werden' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Die Passwörter stimmen nicht überein' },
        { status: 400 }
      );
    }

    // überprüfen, ob die E-Mail bereits verwendet wird
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse wird bereits verwendet' },
        { status: 400 }
      );
    }

    // überprüfen, ob der Benutzername bereits verwendet wird
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Dieser Benutzername wird bereits verwendet' },
        { status: 400 }
      );
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kontotyp festlegen (ESCORT oder MITGLIED)
    const profileType = accountType === 'escort' ? ProfileType.ESCORT : ProfileType.MITGLIED;

    // Benutzer erstellen
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: username,
        profiles: {
          create: {
            username,
            profileType,
          },
        },
      },
      include: {
        profiles: true,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          profiles: user.profiles 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Bei der Registrierung ist ein Fehler aufgetreten' },
      { status: 500 }
    );
  }
}
