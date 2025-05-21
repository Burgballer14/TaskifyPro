import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard/tasks');
  // JSX return is required by Next.js, even if redirecting.
  // It won't be rendered if redirect happens successfully on the server.
  return null;
}
