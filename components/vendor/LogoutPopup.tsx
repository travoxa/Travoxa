'use client';

import { FiLogOut, FiX } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LogoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutPopup({ isOpen, onClose }: LogoutPopupProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    onClose();
    // After logout, the page should refresh or the state should update
    // The parent component should handle the redirection or refresh
  };

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[24px] shadow-2xl max-w-md w-full mx-6 p-8 overflow-hidden transform transition-all">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
        >
          <FiX size={24} />
        </button>

        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
              <FiLogOut size={40} className="text-orange-600" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900 Mont">
              Session Conflict
            </h2>
            <p className="text-gray-600 text-sm Mont px-2">
              You are currently logged in as a <strong>normal user</strong>. 
              To access the vendor portal, you must logout from your current session first.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleLogout}
              className="w-full bg-black text-white px-6 py-4 rounded-[12px] font-bold Mont hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <FiLogOut size={20} />
              Logout from Session
            </button>
            
            <button
              onClick={handleClose}
              className="w-full border border-gray-200 text-gray-500 px-6 py-4 rounded-[12px] font-medium Mont hover:bg-gray-50 transition-all flex items-center justify-center active:scale-[0.98]"
            >
              Go Back Home
            </button>
          </div>

          {/* Branding */}
          <div className="pt-4 border-t border-gray-100 mt-6 flex justify-center">
            <Image
              src="/logo.png"
              alt="Travoxa"
              width={100}
              height={30}
              className="opacity-30 grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
