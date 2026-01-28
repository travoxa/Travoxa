import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { RiArrowDownSLine, RiArrowUpSLine, RiPencilLine } from 'react-icons/ri';
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
  const [showDetails, setShowDetails] = useState(false);

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
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        <div className="text-center mt-4 text-gray-600 font-medium italic">Saving...</div>
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
      {!editing ? (
        <>
          {/* MOBILE LAYOUT */}
          <div className="md:hidden space-y-2.5">
            {/* Layer 1: Greeting & Simple Actions */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Hey {formData.name?.split(' ')[0] || 'Traveler'}!
              </h1>

              <button
                onClick={() => setEditing(true)}
                className="relative p-1.5 text-gray-500 hover:text-black transition-colors"
              >
                <RiPencilLine size={17} />
                {/* Red Dot if profile incomplete */}
                {(!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio) && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>

            {/* Layer 2: Percentage Circle (Progress Box) - Moved from Layer 3 */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center gap-5 relative overflow-hidden">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-50" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - (() => {
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
                    className="text-black transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-bold">
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
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h4 className={`font-bold text-sm truncate ${(!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio) ? 'text-gray-900' : 'text-green-600'}`}>
                  {(!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio) ? 'Profile Incomplete' : 'Profile Active'}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  {(!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio)
                    ? 'Fill details to unlock all features.'
                    : 'Your identity is fully verified!'}
                </p>

                {(!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio) && (
                  <div className="mt-3 flex justify-start">
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-all"
                    >
                      Complete Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Layer 3: Accordion for Details (Detailed Information) - Moved from Layer 2 */}
            <div className="bg-white rounded-xl overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-[10px] text-gray-700 uppercase tracking-tight">Detailed Information</span>
                <div className={`w-6 h-6 rounded-full bg-white border border-gray-50/50 md:border-gray-50 flex items-center justify-center transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>
                  <RiArrowDownSLine size={14} />
                </div>
              </button>

              {showDetails && (
                <div className="px-4 py-4 pt-0 animate-fade-in-down">
                  <div className="space-y-3">
                    {[
                      { label: 'Email', value: formData.email },
                      { label: 'Phone', value: formData.phone },
                      { label: 'City', value: formData.city },
                      { label: 'Birth Date', value: formData.dateOfBirth },
                      { label: 'Gender', value: formData.gender },
                      { label: 'Experience', value: formData.travelExperience },
                      { label: 'Bio', value: formData.bio },
                      { label: 'Languages', value: formData.languages.join(", ") },
                      { label: 'Interests', value: formData.interests.join(", ") },
                      { label: 'Activities', value: formData.activityInterests.join(", ") },
                      { label: 'Comfort', value: formData.comfortLevel.join(", ") },
                      { label: 'Travel Mode', value: formData.preferredTravelMode.join(", ") },
                      { label: 'Has Bike', value: formData.hasBike ? formData.bikeModel || "Yes" : "No" },
                      { label: 'Smoking', value: formData.smokingPreference },
                      { label: 'Drinking', value: formData.drinkingPreference },
                      { label: 'Food', value: formData.foodPreference },
                      { label: 'Social', value: formData.socialProfileLink },
                      { label: 'Emergency', value: `${formData.emergencyContactName} (${formData.emergencyContactPhone})` },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                        <span className="text-xs font-medium text-gray-800 break-words line-clamp-2">
                          {item.value || <span className="text-gray-300 italic">Not set</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Box 1: Basic Info */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 md:col-span-1 flex flex-col justify-center">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                        {formData.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="font-medium text-lg truncate text-gray-900">{formData.name}</p>
                    <p className="text-sm text-gray-500 truncate" title={formData.email}>{formData.email}</p>
                    <p className="text-sm text-gray-500 uppercase text-[10px] font-bold tracking-wider mt-1">{formData.gender}</p>
                  </div>
                </div>
              </div>

              {/* Box 2: Actions & Warning with Progress Circle */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 md:col-span-2 flex justify-between items-center">
                <div className="flex flex-col items-start gap-4">
                  {!formData.phone || !formData.city || !formData.dateOfBirth || !formData.travelExperience || !formData.bio ? (
                    <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-yellow-700">Detailed profile helps in better matching.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg border border-green-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-green-700">Your profile is looking great!</span>
                    </div>
                  )}

                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold active:scale-95"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Circular Progress Bar */}
                <div className="relative w-24 h-24 flex-shrink-0 ml-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - (() => {
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
                      className="text-black transition-all duration-1000 ease-out" strokeLinecap="round" />
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

            {/* Box 3: Detailed Information Card */}
            <div className="bg-white px-3 py-4 rounded-xl border border-gray-200 text-xs mb-6">
              <h3 className="text-sm font-bold mb-4 text-gray-800">Detailed Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {/* Column 1 */}
                <div className="space-y-3">
                  {[
                    { label: 'Phone', value: formData.phone },
                    { label: 'City', value: formData.city },
                    { label: 'Date of Birth', value: formData.dateOfBirth },
                    { label: 'Experience', value: formData.travelExperience },
                    { label: 'Languages', value: formData.languages.join(", ") },
                    { label: 'Interests', value: formData.interests.join(", ") },
                    { label: 'Activities', value: formData.activityInterests.join(", ") },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-1">
                      <span className="font-semibold text-gray-600">{item.label}:</span>
                      <span className="text-gray-800">{item.value || 'Not set'}</span>
                    </div>
                  ))}
                </div>

                {/* Column 2 */}
                <div className="space-y-3">
                  {[
                    { label: 'Comfort Level', value: formData.comfortLevel.join(", ") },
                    { label: 'Travel Mode', value: formData.preferredTravelMode.join(", ") },
                    { label: 'Bike', value: formData.hasBike ? (formData.bikeModel || "Yes") : "No" },
                    { label: 'Smoking', value: formData.smokingPreference },
                    { label: 'Drinking', value: formData.drinkingPreference },
                    { label: 'Food', value: formData.foodPreference },
                    { label: 'Social Profile', value: formData.socialProfileLink },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-1">
                      <span className="font-semibold text-gray-600">{item.label}:</span>
                      <span className="text-gray-800 truncate max-w-[200px]" title={item.value}>{item.value || 'Not set'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* EDIT MODE */
        <div className="space-y-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-black">Edit Your Profile</h3>
              <p className="text-sm text-gray-600">Update your information</p>
            </div>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black border border-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full px-6 py-4 rounded-xl font-bold transition-all ${saving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 active:scale-[0.98]"
                }`}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;