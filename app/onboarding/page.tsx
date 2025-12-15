"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import { upsertUser, checkUserExistsByEmail } from "@/lib/userUtils";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  languages: string[];
  bio: string;
  travelExperience: string;
  comfortLevel: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions: string;
  allergies: string;
  governmentIdUrl: string;
  hasBike: boolean;
  bikeModel: string;
  hasLicense: boolean;
  hasHelmet: boolean;
  preferredTravelMode: string[];
  shareAccommodation: boolean;
  smokingPreference: string;
  drinkingPreference: string;
  foodPreference: string;
  activityInterests: string[];
  weekdayAvailability: boolean;
  weekendAvailability: boolean;
  shortNoticeTravel: boolean;
  socialProfileLink: string;
  interests: string[];
  authProvider: string;
}

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    languages: [],
    bio: "",
    travelExperience: "",
    comfortLevel: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalConditions: "",
    allergies: "",
    governmentIdUrl: "",
    hasBike: false,
    bikeModel: "",
    hasLicense: false,
    hasHelmet: false,
    preferredTravelMode: [],
    shareAccommodation: false,
    smokingPreference: "",
    drinkingPreference: "",
    foodPreference: "",
    activityInterests: [],
    weekdayAvailability: false,
    weekendAvailability: false,
    shortNoticeTravel: false,
    socialProfileLink: "",
    interests: [],
    authProvider: "google",
  });

  useEffect(() => {
    console.log("🔍 ONBOARDING DEBUG: Onboarding useEffect triggered");
    console.log("🔍 ONBOARDING DEBUG: Session data:", session);
    
    if (session?.user?.email) {
      console.log("🔍 ONBOARDING DEBUG: Email found in session, checking user existence");
      // Check if user already exists and redirect if they do
      checkUserExists();
    } else {
      console.log("🔍 ONBOARDING DEBUG: No email in session, redirecting to login");
      router.push("/login");
    }
  }, [session, router]);

  // Check if user exists in Firestore by email
  const checkUserExists = async () => {
    try {
      console.log("🔍 ONBOARDING DEBUG: Starting checkUserExists function");
      console.log("🔍 ONBOARDING DEBUG: Session user data:", session?.user);
      
      // Wait a bit to ensure Firebase auth is fully initialized
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userEmail = session?.user?.email;
      if (!userEmail) {
        console.log("⚠️ ONBOARDING DEBUG: No email in session");
        setFormData((prev) => ({
          ...prev,
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          authProvider: session?.user?.image ? "google" : "email",
        }));
        setLoading(false);
        return;
      }

      console.log("🔍 ONBOARDING DEBUG: Checking user existence for email:", userEmail);
      
      // Check if user exists in Firestore by email
      const userExists = await checkUserExistsByEmail(userEmail);
      console.log("🔍 ONBOARDING DEBUG: User exists check result:", userExists);

      if (userExists.exists && userExists.userData) {
        console.log("✅ ONBOARDING DEBUG: User exists in Firestore");
        console.log("🔍 ONBOARDING DEBUG: User data:", userExists.userData);
        
        // Check if profile is complete
        const isProfileComplete = userExists.userData.profileComplete !== false;
        console.log("🔍 ONBOARDING DEBUG: Profile complete status:", isProfileComplete);

        if (isProfileComplete) {
          console.log("✅ ONBOARDING DEBUG: Profile complete, redirecting to home");
          router.push("/");
          return;
        } else {
          console.log("⚠️ ONBOARDING DEBUG: Profile incomplete, staying on onboarding");
          // Pre-fill form with existing data
          setFormData((prev) => ({
            ...prev,
            ...userExists.userData,
          }));
        }
      } else {
        console.log("⚠️ ONBOARDING DEBUG: User doesn't exist in Firestore, creating basic document...");
        
        // Create a basic user document if it doesn't exist
        const auth = getFirebaseAuth();
        const firebaseUser = auth?.currentUser;
        const userUid = session?.user?.id || firebaseUser?.uid;
        
        console.log("🔍 ONBOARDING DEBUG: User UID for new document:", userUid);
        
        if (userUid) {
          const db = getFirestore();
          const userRef = doc(db, "Users", userUid);
          
          await setDoc(userRef, {
            name: session?.user?.name || "",
            email: userEmail,
            phone: "",
            gender: "",
            interests: [],
            hasBike: false,
            authProvider: session?.user?.image ? "google" : "email",
            profileComplete: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          
          console.log("✅ ONBOARDING DEBUG: Basic user document created");
        }
        
        // Pre-fill form with session data
        setFormData((prev) => ({
          ...prev,
          name: session?.user?.name || "",
          email: userEmail,
          authProvider: session?.user?.image ? "google" : "email",
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("❌ ONBOARDING ERROR: Error checking user:", error);
      setError("Failed to check user status. Please try again.");
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleComfortLevelToggle = (level: string) => {
    setFormData((prev) => ({
      ...prev,
      comfortLevel: prev.comfortLevel.includes(level)
        ? prev.comfortLevel.filter((c) => c !== level)
        : [...prev.comfortLevel, level],
    }));
  };

  const handleTravelModeToggle = (mode: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredTravelMode: prev.preferredTravelMode.includes(mode)
        ? prev.preferredTravelMode.filter((m) => m !== mode)
        : [...prev.preferredTravelMode, mode],
    }));
  };

  const handleActivityInterestToggle = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activityInterests: prev.activityInterests.includes(activity)
        ? prev.activityInterests.filter((a) => a !== activity)
        : [...prev.activityInterests, activity],
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.gender || !formData.city) {
      setError("Please fill in all required fields (name, email, gender, and city).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log("🔍 Saving onboarding data...");
      
      const auth = getFirebaseAuth();
      const firebaseUser = auth?.currentUser;
      
      // Get the Firebase UID from NextAuth session or Firebase Auth
      const userUid = session?.user?.id || firebaseUser?.uid;
      console.log("🔍 User UID:", userUid);
      
      if (!userUid) {
        throw new Error("No authenticated user found");
      }

      const db = getFirestore();
      const userRef = doc(db, "Users", userUid);
      
      // Check if user document exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        console.log("✅ ONBOARDING DEBUG: Updating existing user document");
        // Update existing user with profileComplete flag
        await updateDoc(userRef, {
          ...formData,
          profileComplete: true, // ✅ CRITICAL: Mark profile as complete
          updatedAt: new Date().toISOString(),
        });
        console.log("✅ ONBOARDING DEBUG: User document updated with profileComplete: true");
      } else {
        console.log("✅ ONBOARDING DEBUG: Creating new user document");
        // Create new user document
        await setDoc(userRef, {
          ...formData,
          profileComplete: true, // ✅ CRITICAL: Mark profile as complete
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log("✅ ONBOARDING DEBUG: New user document created with profileComplete: true");
      }
      
      console.log("✅ ONBOARDING DEBUG: Onboarding complete, redirecting to home");
      console.log("🔍 ONBOARDING DEBUG: About to call router.push('/')");
      router.push("/");
    } catch (error) {
      console.error("❌ Error saving user data:", error);
      setError("Failed to save user data. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-dots-svg px-4 py-24 text-black sm:px-6 lg:px-12">
          <div className="mx-auto max-w-4xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-lg">Checking your profile...</p>
            </div>
          </div>
        </div>
        <Footor />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dots-svg px-4 py-24 text-black sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-3 text-center Mont">
            <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">Welcome</p>
            <h1 className="text-[3.5vw] font-semibold leading-tight">
              Let's get you in...
            </h1>
            <p className="text-base text-black">
              Help us know you better so we can personalize your travel experience
            </p>
          </header>

          <div className="rounded-[12px] border border-black/10 bg-white p-6 shadow-2xl">
            {error && (
              <div className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-black/70">Full Name *</label>
                <input
                  type="text"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Email Address *</label>
                <input
                  type="email"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  disabled
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Phone Number</label>
                <input
                  type="tel"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Gender *</label>
                <select
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-black/70">Date of Birth / Age</label>
                <input
                  type="date"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  placeholder="Enter your date of birth"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">City / Location</label>
                <input
                  type="text"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Travel Experience Level</label>
                <select
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.travelExperience}
                  onChange={(e) => setFormData({ ...formData, travelExperience: e.target.value })}
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Emergency Contact Name</label>
                <input
                  type="text"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Emergency Contact Phone</label>
                <input
                  type="tel"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="Enter emergency contact phone"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Bike Model (if yes)</label>
                <input
                  type="text"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.bikeModel}
                  onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                  placeholder="Enter your bike model"
                  disabled={!formData.hasBike}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black/70">Social Profile Link</label>
                <input
                  type="url"
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.socialProfileLink}
                  onChange={(e) => setFormData({ ...formData, socialProfileLink: e.target.value })}
                  placeholder="Enter your social profile link"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70 mb-2 block">Languages Spoken</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["English", "Indian Languages", "Spanish", "French", "German", "Chinese", "Japanese", "Korean"].map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.languages.includes(language)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70 mb-2 block">Comfort Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["backpacking", "budget", "luxury", "mixed"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleComfortLevelToggle(level)}
                    className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.comfortLevel.includes(level)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70 mb-2 block">Preferred Travel Mode</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["bike", "car", "public-transport", "no-preference"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleTravelModeToggle(mode)}
                    className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.preferredTravelMode.includes(mode)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    {mode.replace("-", " ").charAt(0).toUpperCase() + mode.replace("-", " ").slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70 mb-2 block">Activity Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["hiking", "camping", "sightseeing", "shopping", "nightlife", "museums", "beach", "mountains"].map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleActivityInterestToggle(activity)}
                    className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.activityInterests.includes(activity)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    {activity.charAt(0).toUpperCase() + activity.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Willing to share accommodation?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, shareAccommodation: true })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.shareAccommodation
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, shareAccommodation: false })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      !formData.shareAccommodation
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Valid License?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasLicense: true })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.hasLicense
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasLicense: false })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      !formData.hasLicense
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Helmet Available?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasHelmet: true })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.hasHelmet
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasHelmet: false })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      !formData.hasHelmet
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Smoking Preference</label>
                <select
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.smokingPreference}
                  onChange={(e) => setFormData({ ...formData, smokingPreference: e.target.value })}
                >
                  <option value="">Select preference</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="occasionally">Occasionally</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Drinking Preference</label>
                <select
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.drinkingPreference}
                  onChange={(e) => setFormData({ ...formData, drinkingPreference: e.target.value })}
                >
                  <option value="">Select preference</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="occasionally">Occasionally</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Food Preference</label>
                <select
                  className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={formData.foodPreference}
                  onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
                >
                  <option value="">Select preference</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="vegan">Vegan</option>
                  <option value="no-matter">Doesn't Matter</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Weekday Availability</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weekdayAvailability: true })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.weekdayAvailability
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weekdayAvailability: false })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      !formData.weekdayAvailability
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Weekend Availability</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weekendAvailability: true })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.weekendAvailability
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weekendAvailability: false })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      !formData.weekendAvailability
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black/70 mb-2 block">Can travel on short notice?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, shortNoticeTravel: true })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.shortNoticeTravel
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, shortNoticeTravel: false })}
                    className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      !formData.shortNoticeTravel
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70">Short Bio (optional)</label>
              <textarea
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a bit about yourself"
                rows={3}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70">Medical Conditions (optional)</label>
              <textarea
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder="List any medical conditions"
                rows={2}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70">Allergies (optional)</label>
              <textarea
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="List any allergies"
                rows={2}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70">Government ID Upload (optional for verification)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Here you would typically upload the file to storage
                    // For now, just set a placeholder URL
                    setFormData({ ...formData, governmentIdUrl: "uploaded-file-url" });
                  }
                }}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70 mb-2 block">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["trekking", "biking", "cultural", "wellness", "photography", "adventure"].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black/5"
                    }`}
                  >
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-black/70 mb-2 block">Do you have a bike?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasBike: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                    formData.hasBike
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black/5"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasBike: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${
                    !formData.hasBike
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black/5"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-black/60">
                Your information helps us personalize your travel experience
              </div>
              
              <button
                onClick={handleSave}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Complete Setup"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footor />
    </>
  );
}