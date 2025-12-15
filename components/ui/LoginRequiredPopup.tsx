'use client';

import { useState } from 'react';
import { FiX, FiLogIn } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface LoginRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  triggerAction?: () => void;
}

export default function LoginRequiredPopup({ isOpen, onClose, triggerAction }: LoginRequiredPopupProps) {
  const { data: session } = useSession();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    if (triggerAction) {
      triggerAction();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#ffffff90] bg-opacity-40 transition-opacity"
        onClick={onClose}/>
      
      {/* Modal */}
      <div className="relative bg-white rounded-[20px] shadow-2xl max-w-2xl w-full mx-6 p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full p-2 shadow-md hover:shadow-lg"
        >
          <FiX size={28} />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <FiLogIn size={40} className="text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            You need to be logged in
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
            Please log in to continue. This feature requires authentication to ensure your data is secure and personalized.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleLogin}
              className="flex-1 bg-green-600 text-white px-8 py-4 rounded-[14px] font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-3 text-lg"
            >
              <FiLogIn size={24} />
              Continue to Login
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-[14px] font-semibold hover:bg-gray-50 transition-colors text-lg"
            >
              Cancel
            </button>
          </div>

          {/* Decorative image */}
          <div className="mt-8">
            <Image
              src="/logo.png"
              alt="Travoxa"
              width={120}
              height={120}
              className="mx-auto opacity-15"
            />
          </div>
        </div>
      </div>
    </div>
  );
}