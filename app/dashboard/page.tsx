import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

export default async function DashboardPage() {
  const session = await getServerSession();

  // Redirect to login if not authenticated
  if (!session?.user?.email) {
    redirect('/login');
  }

  return (
    <div className="bg-dots-svg">
      {/* Header Component */}
      <Header />

      {/* Dashboard Content */}
      <main className="min-h-screen mt-[50px] px-4 py-24 text-black sm:px-6 lg:px-12">
        <div className="mx-auto max-w-8xl space-y-10">
          <header className="space-y-3 text-center Mont">
            <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">Dashboard</p>
            <h1 className="text-[3.5vw] font-semibold leading-tight">
              Welcome to Your Dashboard, {session.user.name || 'User'}
            </h1>
            <p className="text-base text-black">
              Manage your bookings, listings, and profile in one place
            </p>
          </header>

          {/* Dashboard Container */}
          <DashboardContainer />
        </div>
      </main>

      {/* Footer */}
      <Footor />
    </div>
  );
}

