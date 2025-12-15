import { doc, getDoc, setDoc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getFirebaseAuth } from "./firebaseAuth";

export interface User {
  name: string;
  email: string;
  phone?: string;
  gender: string;
  dateOfBirth?: string;
  city?: string;
  languages?: string[];
  bio?: string;
  travelExperience?: string;
  comfortLevel?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
  allergies?: string;
  governmentIdUrl?: string;
  hasBike: boolean;
  bikeModel?: string;
  hasLicense?: boolean;
  hasHelmet?: boolean;
  preferredTravelMode?: string[];
  shareAccommodation?: boolean;
  smokingPreference?: string;
  drinkingPreference?: string;
  foodPreference?: string;
  activityInterests?: string[];
  weekdayAvailability?: boolean;
  weekendAvailability?: boolean;
  shortNoticeTravel?: boolean;
  socialProfileLink?: string;
  interests: string[];
  authProvider: string;
  profileComplete?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const checkUserExists = async (uid: string): Promise<boolean> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "Users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error("Error checking user exists:", error);
    throw new Error("Failed to check user existence");
  }
};

// New function to check if user exists by email
export const checkUserExistsByEmail = async (email: string): Promise<{ exists: boolean; uid?: string; userData?: User }> => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        exists: true,
        uid: docSnap.id,
        userData: docSnap.data() as User
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error("Error checking user by email:", error);
    throw new Error("Failed to check user existence by email");
  }
};

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "Users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user data");
  }
};

export const createUser = async (uid: string, userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "Users", uid);
    const now = new Date().toISOString();
    
    await setDoc(userRef, {
      ...userData,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const updateUser = async (email: string, updates: Partial<User>): Promise<void> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "Users", email);
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

export const upsertUser = async (uid: string, userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    const exists = await checkUserExists(uid);
    
    if (exists) {
      await updateUser(uid, userData);
    } else {
      await createUser(uid, userData);
    }
  } catch (error) {
    console.error("Error upserting user:", error);
    throw new Error("Failed to save user data");
  }
};

// Helper function to get current user's UID and check if they exist in Firestore