import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Loading from '@/components/ui/components/Loading';
import { getFirebaseAuth } from '@/lib/firebaseAuth';
import { signOut as firebaseSignOut } from "firebase/auth";



interface UserFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  city: string;
  languages: string[];
  bio: string;
  travelExperience: string;
  comfortLevel: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions: string;
  allergies: string;
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
}

const UserProfileCard: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: null,
    city: "",
    languages: [],
    bio: "",
    travelExperience: "",
    comfortLevel: [],
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalConditions: "",
    allergies: "",
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
    weekendAvailability: true,
    shortNoticeTravel: false,
    socialProfileLink: "",
    interests: [],
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users?email=${encodeURIComponent(session?.user?.email || '')}`);
      if (response.ok) {
        const data = await response.json();

        if (data.exists && data.userData) {
          // Normalize data to ensure consistent types and prevent controlled input errors
          const normalizedData = {
            ...data.userData,
            // Ensure all string fields are empty strings instead of undefined
            name: data.userData.name || "",
            email: data.userData.email || "",
            phone: data.userData.phone || "",
            gender: data.userData.gender || "",
            dateOfBirth: data.userData.dateOfBirth || "",
            city: data.userData.city || "",
            bio: data.userData.bio || "",
            travelExperience: data.userData.travelExperience || "",
            emergencyContactName: data.userData.emergencyContactName || "",
            emergencyContactPhone: data.userData.emergencyContactPhone || "",
            medicalConditions: data.userData.medicalConditions || "",
            allergies: data.userData.allergies || "",
            bikeModel: data.userData.bikeModel || "",
            socialProfileLink: data.userData.socialProfileLink || "",
            // Ensure array fields are arrays instead of undefined
            languages: data.userData.languages || [],
            comfortLevel: data.userData.comfortLevel || [],
            preferredTravelMode: data.userData.preferredTravelMode || [],
            activityInterests: data.userData.activityInterests || [],
            interests: data.userData.interests || [],
            // Ensure boolean fields have proper defaults
            hasBike: data.userData.hasBike || false,
            hasLicense: data.userData.hasLicense || false,
            hasHelmet: data.userData.hasHelmet || false,
            shareAccommodation: data.userData.shareAccommodation || false,
            weekdayAvailability: data.userData.weekdayAvailability || false,
            weekendAvailability: data.userData.weekendAvailability !== false, // Keep existing logic
            shortNoticeTravel: data.userData.shortNoticeTravel || false,
            // Keep other fields as-is
            smokingPreference: data.userData.smokingPreference || "",
            drinkingPreference: data.userData.drinkingPreference || "",
            foodPreference: data.userData.foodPreference || "",
          };

          setFormData(normalizedData);
        } else {
          setFormData(prev => ({
            ...prev,
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
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

    try {
      setError(null);
      setSuccess(null);
      setSaving(true);

      const response = await fetch('/api/users/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: session?.user?.email!,
          authProvider: session?.user?.email?.includes('gmail.com') ? 'google' :
            session?.user?.email?.includes('github') ? 'github' : 'email',
          profileComplete: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      setSuccess("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save user data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const firebaseAuth = getFirebaseAuth();
      if (!firebaseAuth) {
        console.warn("Firebase Auth not initialized; skipping Firebase sign-out.");
      } else {
        // Sign out from Firebase Auth (for email/password users)
        await firebaseSignOut(firebaseAuth);
      }

      // Sign out from NextAuth (handles both Google and email/password sessions)
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if Firebase sign out fails, still sign out from NextAuth
      await signOut({ callbackUrl: '/login' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 Mont relative">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 Mont relative">
        <Loading />
        <div className="text-center mt-4 text-gray-600">Saving profile...</div>
      </div>
    );
  }

  return (

    <div className="Mont">
      {/* Success message - positioned at top but only shows when not editing to avoid overlay effect */}
      {!editing && success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded animate-fade-in">
          {success}
        </div>
      )}

      {/* Only show profile showcase when NOT editing */}
      {/* Only show profile showcase when NOT editing */}
      {!editing && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Box 1: Basic Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-light">User Profile</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                  {/* You might want to render user image here if available in formData or session */}
                  {/* For now keeping the placeholder style */}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-xl truncate">{formData.name}</p>
                  <p className="text-sm text-gray-500 truncate" title={formData.email}>Email: {formData.email}</p>
                  <p className="text-sm text-gray-500">Gender: {formData.gender}</p>
                </div>
              </div>
            </div>

            {/* Box 2: Actions & Warning with Progress Circle */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 flex justify-between items-center">
              <div className="flex flex-col items-start gap-4">
                {!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio ? (
                  <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-yellow-700">Some profile details are incomplete</span>
                  </div>
                ) : null}

                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              </div>

              {/* Circular Progress Bar */}
              <div className="relative w-24 h-24 flex-shrink-0 ml-4">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (() => {
                      const totalFields = 20; // Approximate number of tracked fields
                      let filledFields = 0;
                      if (formData.name) filledFields++;
                      if (formData.email) filledFields++;
                      if (formData.phone) filledFields++;
                      if (formData.gender) filledFields++;
                      if (formData.dateOfBirth) filledFields++;
                      if (formData.city) filledFields++;
                      if (formData.bio) filledFields++;
                      if (formData.travelExperience) filledFields++;
                      if (formData.emergencyContactName) filledFields++;
                      if (formData.emergencyContactPhone) filledFields++;
                      if (formData.medicalConditions) filledFields++; // Optional but counts if filled? Or maybe strict required fields. 
                      // Let's stick to the "incomplete" logic used for the warning + some major ones
                      // Actually, let's make a comprehensive count based on the formData keys that are relevant
                      if (formData.languages.length > 0) filledFields++;
                      if (formData.comfortLevel.length > 0) filledFields++;
                      if (formData.preferredTravelMode.length > 0) filledFields++;
                      if (formData.activityInterests.length > 0) filledFields++;
                      if (formData.interests.length > 0) filledFields++;
                      if (formData.hasBike) {
                        // If has bike, model should be filled, but we count hasBike itself as a field data point
                        filledFields++;
                        if (formData.bikeModel) filledFields++;
                      } else {
                        // If no bike, model doesn't matter, but "hasBike: false" is a valid state. 
                        // However, usually we want to encourage filling things out.
                        // For simplicity let's count explicitly potentially empty strings.
                        filledFields++; // Counting the boolean choice
                      }

                      // Let's simplify and just use a quick inline calculation function for better readability or externalize it
                      // Given I can't easily add a function outside easily in this replacement, I'll do a robust inline calculation 
                      // based on the previous simple check:

                      // Re-calculating properly:
                      let filled = 0;
                      let total = 0;

                      const check = (val: any) => {
                        total++;
                        if (Array.isArray(val)) return val.length > 0;
                        if (typeof val === 'string') return val.trim().length > 0;
                        if (typeof val === 'boolean') return true; // Booleans are always "set" in this form
                        return !!val;
                      };

                      if (check(formData.name)) filled++;
                      if (check(formData.email)) filled++;
                      if (check(formData.phone)) filled++;
                      if (check(formData.gender)) filled++;
                      if (check(formData.dateOfBirth)) filled++;
                      if (check(formData.city)) filled++;
                      if (check(formData.bio)) filled++;
                      if (check(formData.travelExperience)) filled++;

                      // Arrays
                      if (check(formData.languages)) filled++;
                      if (check(formData.comfortLevel)) filled++;
                      if (check(formData.preferredTravelMode)) filled++;
                      if (check(formData.activityInterests)) filled++;
                      if (check(formData.interests)) filled++;

                      // Emergency
                      if (check(formData.emergencyContactName)) filled++;
                      if (check(formData.emergencyContactPhone)) filled++;

                      // Others (Preferences) - assuming these are strings that start empty
                      if (check(formData.smokingPreference)) filled++;
                      if (check(formData.drinkingPreference)) filled++;
                      if (check(formData.foodPreference)) filled++;

                      // Social
                      check(formData.socialProfileLink); if (formData.socialProfileLink) filled++;

                      // We can just define the raw percentage based on the exact same logic as the warning 
                      // or just make a robust one.

                      // Let's stick to a simpler known list to avoid "total" fluctuating weirdly
                      const fieldsToCheck = [
                        formData.name, formData.email, formData.phone, formData.gender,
                        formData.dateOfBirth, formData.city, formData.bio, formData.travelExperience,
                        formData.emergencyContactName, formData.emergencyContactPhone,
                        formData.languages.length ? 'ok' : '',
                        formData.comfortLevel.length ? 'ok' : '',
                        formData.preferredTravelMode.length ? 'ok' : '',
                        formData.activityInterests.length ? 'ok' : '',
                        formData.interests.length ? 'ok' : '',
                        formData.socialProfileLink
                      ];

                      const completed = fieldsToCheck.filter(f => f && f.toString().length > 0).length;
                      return completed / fieldsToCheck.length;
                    })())}
                    className="text-black transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                  {Math.round((() => {
                    const fieldsToCheck = [
                      formData.name, formData.email, formData.phone, formData.gender,
                      formData.dateOfBirth, formData.city, formData.bio, formData.travelExperience,
                      formData.emergencyContactName, formData.emergencyContactPhone,
                      formData.languages.length ? 'ok' : '',
                      formData.comfortLevel.length ? 'ok' : '',
                      formData.preferredTravelMode.length ? 'ok' : '',
                      formData.activityInterests.length ? 'ok' : '',
                      formData.interests.length ? 'ok' : '',
                      formData.socialProfileLink
                    ];
                    const completed = fieldsToCheck.filter(f => f && f.toString().length > 0).length;
                    return (completed / fieldsToCheck.length) * 100;
                  })())}%
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: User Information in Key:Value Format */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-light mb-6 border-b border-gray-100 pb-3">Detailed Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Phone:</span>
                  <span className="text-sm text-gray-600">{formData.phone || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">City:</span>
                  <span className="text-sm text-gray-600">{formData.city || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
                  <span className="text-sm text-gray-600">{formData.dateOfBirth ? formData.dateOfBirth : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Travel Experience:</span>
                  <span className="text-sm text-gray-600">{formData.travelExperience || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Languages:</span>
                  <span className="text-sm text-gray-600">{formData.languages.length > 0 ? formData.languages.join(", ") : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Interests:</span>
                  <span className="text-sm text-gray-600">{formData.interests.length > 0 ? formData.interests.join(", ") : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Activity Interests:</span>
                  <span className="text-sm text-gray-600">{formData.activityInterests.length > 0 ? formData.activityInterests.join(", ") : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Comfort Level:</span>
                  <span className="text-sm text-gray-600">{formData.comfortLevel.length > 0 ? formData.comfortLevel.join(", ") : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Preferred Travel Mode:</span>
                  <span className="text-sm text-gray-600">{formData.preferredTravelMode.length > 0 ? formData.preferredTravelMode.join(", ") : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Bike:</span>
                  <span className="text-sm text-gray-600">{formData.hasBike ? (formData.bikeModel || "Yes") : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">License:</span>
                  <span className="text-sm text-gray-600">{formData.hasLicense ? 'Yes' : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Helmet:</span>
                  <span className="text-sm text-gray-600">{formData.hasHelmet ? 'Yes' : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Shares Accommodation:</span>
                  <span className="text-sm text-gray-600">{formData.shareAccommodation ? 'Yes' : 'undefined'}</span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Smoking Preference:</span>
                  <span className="text-sm text-gray-600">{formData.smokingPreference || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Drinking Preference:</span>
                  <span className="text-sm text-gray-600">{formData.drinkingPreference || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Food Preference:</span>
                  <span className="text-sm text-gray-600">{formData.foodPreference || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Weekday Availability:</span>
                  <span className="text-sm text-gray-600">{formData.weekdayAvailability ? 'Yes' : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Weekend Availability:</span>
                  <span className="text-sm text-gray-600">{formData.weekendAvailability ? 'Yes' : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Short Notice Travel:</span>
                  <span className="text-sm text-gray-600">{formData.shortNoticeTravel ? 'Yes' : 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Social Profile:</span>
                  <span className="text-sm text-gray-600">{formData.socialProfileLink || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Emergency Contact:</span>
                  <span className="text-sm text-gray-600">{formData.emergencyContactName || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Emergency Phone:</span>
                  <span className="text-sm text-gray-600">{formData.emergencyContactPhone || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Medical Conditions:</span>
                  <span className="text-sm text-gray-600">{formData.medicalConditions || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Allergies:</span>
                  <span className="text-sm text-gray-600">{formData.allergies || 'undefined'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-700">Bio:</span>
                  <span className="text-sm text-gray-600">{formData.bio || 'undefined'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Mode - Show only the edit form */}
      {editing && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-black">Edit Your Profile</h3>
            <p className="text-sm text-gray-600">Update your information and click Save Changes</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-black/70">Full Name *</label>
              <input
                type="text"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black/70">Email Address *</label>
              <input
                type="email"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black"
                value={formData.email}
                disabled
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-black/70">Phone Number</label>
              <input
                type="tel"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                value={formData.dateOfBirth || ""}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black/70">City / Location *</label>
              <input
                type="text"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-black/70">Emergency Contact Phone</label>
              <input
                type="tel"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black/70">Bike Model (if yes)</label>
              <input
                type="text"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.bikeModel}
                onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                disabled={!formData.hasBike}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-black/70">Social Profile Link</label>
              <input
                type="url"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.socialProfileLink}
                onChange={(e) => setFormData({ ...formData, socialProfileLink: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black/70">Medical Conditions</label>
              <input
                type="text"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-black/70">Allergies</label>
              <input
                type="text"
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black/70">Has Bike?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasBike: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.hasBike
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasBike: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.hasBike
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-black/70">Has License?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasLicense: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.hasLicense
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasLicense: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.hasLicense
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-black/70">Has Helmet?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasHelmet: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.hasHelmet
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasHelmet: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.hasHelmet
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-black/70">Share Accommodation?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shareAccommodation: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.shareAccommodation
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shareAccommodation: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.shareAccommodation
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-black/70">Smoking Preference</label>
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
              <label className="text-sm font-medium text-black/70">Drinking Preference</label>
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
              <label className="text-sm font-medium text-black/70">Food Preference</label>
              <select
                className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                value={formData.foodPreference}
                onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value })}
              >
                <option value="">Select preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="no-restriction">No Restriction</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-black/70">Weekday Availability</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, weekdayAvailability: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.weekdayAvailability
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, weekdayAvailability: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.weekdayAvailability
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-black/70">Weekend Availability</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, weekendAvailability: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.weekendAvailability
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, weekendAvailability: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.weekendAvailability
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-black/70">Can travel on short notice?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shortNoticeTravel: true })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.shortNoticeTravel
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, shortNoticeTravel: false })}
                  className={`px-6 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${!formData.shortNoticeTravel
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
            <label className="text-sm font-medium text-black/70 mb-2 block">Languages Spoken</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["English", "Indian Languages", "Spanish", "French", "German", "Chinese", "Japanese", "Korean"].map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageToggle(language)}
                  className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.languages.includes(language)
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
              {["budget", "mid-range", "luxury"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleComfortLevelToggle(level)}
                  className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.comfortLevel.includes(level)
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
              {["bike", "car", "public-transport", "hiking", "trekking"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleTravelModeToggle(mode)}
                  className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.preferredTravelMode.includes(mode)
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
              {["photography", "hiking", "camping", "sightseeing", "adventure", "culture", "food", "shopping", "relaxation"].map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => handleActivityInterestToggle(activity)}
                  className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.activityInterests.includes(activity)
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/5"
                    }`}
                >
                  {activity.charAt(0).toUpperCase() + activity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-black/70 mb-2 block">Interests</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["trekking", "biking", "cultural", "wellness", "photography", "adventure"].map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-[8px] border border-black/20 text-sm font-medium transition-all ${formData.interests.includes(interest)
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
            <label className="text-sm font-medium text-black/70">Short Bio (optional)</label>
            <textarea
              className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-black/70">Medical Conditions (optional)</label>
            <textarea
              className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              rows={2}
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-black/70">Allergies (optional)</label>
            <textarea
              className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              rows={2}
            />
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-black/70">Social Profile Link</label>
            <input
              type="url"
              className="w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
              value={formData.socialProfileLink}
              onChange={(e) => setFormData({ ...formData, socialProfileLink: e.target.value })}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-lg transition-colors ${saving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className={`px-6 py-3 rounded-lg transition-colors ${saving
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border border-gray-300 text-black hover:bg-gray-50"
                }`}
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;