import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from '@/lib/local-db';

// Force Node.js runtime (bcrypt doesn't work in Edge Runtime)
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, section } = await request.json();

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = getUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (also creates initial status)
    const user = createUser(email, passwordHash, fullName, section || '');

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        section: user.section
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
