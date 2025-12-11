'use client';

import { getAuth, Auth } from "firebase/auth";
import { getApps } from "firebase/app";

let authInstance: Auth | undefined;

export const getFirebaseAuth = (): Auth => {
  if (typeof window === 'undefined') {
    throw new Error("Firebase Auth can only be used on the client side");
  }
  
  if (!authInstance) {
    const apps = getApps();
    if (apps.length === 0) {
      throw new Error("Firebase app not initialized");
    }
    authInstance = getAuth(apps[0]);
  }
  
  return authInstance;
};

export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : undefined as any;