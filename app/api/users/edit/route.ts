import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, createUser, updateUser } from "@/lib/mongodbUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Only require email, name, gender, and city (as specified)
    const {
      email, name, gender, city,
      // Optional fields - all others are optional
      phone, dateOfBirth, languages, bio, travelExperience, comfortLevel,
      emergencyContactName, emergencyContactPhone, medicalConditions, allergies,
      governmentIdUrl, hasBike, bikeModel, hasLicense, hasHelmet,
      preferredTravelMode, shareAccommodation, smokingPreference, drinkingPreference,
      foodPreference, activityInterests, weekdayAvailability, weekendAvailability,
      shortNoticeTravel, socialProfileLink, interests, authProvider,
      profileComplete
    } = body;

    // Validation: Only email, name, gender, and city are required
    if (!email || !name || !gender || !city) {
      return NextResponse.json(
        { error: "Missing required fields: email, name, gender, and city are required" },
        { status: 400 }
      );
    }

    // Build userData object with all fields (optional fields default to undefined/empty)
    const userData = {
      email,
      name,
      phone: phone || "",
      gender,
      dateOfBirth: dateOfBirth || "",
      city,
      languages: languages || [],
      bio: bio || "",
      travelExperience: travelExperience || "",
      comfortLevel: comfortLevel || [],
      emergencyContactName: emergencyContactName || "",
      emergencyContactPhone: emergencyContactPhone || "",
      medicalConditions: medicalConditions || "",
      allergies: allergies || "",
      governmentIdUrl: governmentIdUrl || "",
      hasBike: hasBike || false,
      bikeModel: bikeModel || "",
      hasLicense: hasLicense || false,
      hasHelmet: hasHelmet || false,
      preferredTravelMode: preferredTravelMode || [],
      shareAccommodation: shareAccommodation || false,
      smokingPreference: smokingPreference || "",
      drinkingPreference: drinkingPreference || "",
      foodPreference: foodPreference || "",
      activityInterests: activityInterests || [],
      weekdayAvailability: weekdayAvailability || false,
      weekendAvailability: weekendAvailability || true,
      shortNoticeTravel: shortNoticeTravel || false,
      socialProfileLink: socialProfileLink || "",
      interests: interests || [],
      authProvider: authProvider || "email",
      profileComplete: profileComplete || false,
    };

    // Check if user exists and update or create accordingly
    const exists = await checkUserExists(email);
    
    if (exists) {
      await updateUser(email, userData);
    } else {
      await createUser(userData);
    }

    return NextResponse.json(
      { message: "User profile saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in onboarding API:", error);
    return NextResponse.json(
      { error: "Failed to save user profile", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}