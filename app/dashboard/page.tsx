import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Pass plain object to client component
  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    id: session.user.id
  };

  return <DashboardClient user={user} />;
}
