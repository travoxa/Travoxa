'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getFirebaseAuth } from '@/lib/firebaseAuth';
import { signOut as firebaseSignOut, deleteUser } from 'firebase/auth';
import { RiAlertLine, RiDeleteBin7Line, RiArrowLeftLine } from 'react-icons/ri';
import Link from 'next/link';

export default function DeleteAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [confirmationText, setConfirmationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (confirmationText.toUpperCase() !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }

    if (!session?.user?.email) {
      setError('You must be logged in to perform this action.');
      return;
    }

    if (!confirm('Final Warning: This will permanently delete your account and all associated data. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Delete from MongoDB via API
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/users/delete?email=${encodeURIComponent(session.user.email)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account data from server');
      }

      // 2. Delete from Firebase Auth (if possible from client)
      const auth = getFirebaseAuth();
      if (auth && auth.currentUser) {
        try {
          await deleteUser(auth.currentUser);
        } catch (firebaseError) {
          console.warn('Firebase user deletion failed (might need re-auth):', firebaseError);
          // We proceed even if firebase deletion fails, as MongoDB is already purged
          // and the user will be signed out from next-auth.
        }
      }

      // 3. Clear sessions and redirect
      await signOut({ callbackUrl: '/login' });

    } catch (err: any) {
      console.error('Deletion error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-6"
          >
            <RiArrowLeftLine className="mr-2" /> Back to Dashboard
          </Link>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <RiAlertLine size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Delete Account</h1>
            <p className="text-gray-500 text-sm">
              This action is permanent and cannot be undone. All your data will be wiped from our systems.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8">
            <h3 className="text-amber-800 font-semibold mb-2 text-sm flex items-center">
              <RiAlertLine className="mr-2" /> What you lose:
            </h3>
            <ul className="text-amber-700 text-xs space-y-2 list-disc pl-4">
              <li>Permanent removal of your profile and settings.</li>
              <li>Loss of all saved tours, activities, and attractions.</li>
              <li>Deletion of all trips and backpacker groups you created.</li>
              <li>Removal of your memberships in community groups.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-black uppercase">DELETE</span> to confirm
              </label>
              <input
                type="text"
                placeholder="Type here..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleDeleteAccount}
              disabled={loading || confirmationText.toUpperCase() !== 'DELETE'}
              className={`w-full py-4 rounded-xl flex items-center justify-center font-bold transition-all ${
                loading || confirmationText.toUpperCase() !== 'DELETE'
                  ? 'bg-red-200 text-white cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RiDeleteBin7Line className="mr-2" /> Delete My Account Permanently
                </>
              )}
            </button>

            {!loading && (
              <Link
                href="/dashboard"
                className="block text-center text-sm font-medium text-gray-500 hover:text-black py-2 transition-colors"
              >
                I changed my mind, keep my account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
