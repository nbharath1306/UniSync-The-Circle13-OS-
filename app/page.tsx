import { redirect } from 'next/navigation';

export default async function Home() {
  // Always redirect to login page as the entry point
  // This avoids server-side session check that requires NEXTAUTH_SECRET
  redirect('/login');
}
