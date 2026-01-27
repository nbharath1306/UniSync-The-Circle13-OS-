import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force Node.js runtime (bcrypt doesn't work in Edge Runtime)
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
