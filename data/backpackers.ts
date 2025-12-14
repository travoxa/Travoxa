const coverPool = [
  "/Destinations/Des1.jpeg",
  "/Destinations/Des2.jpg",
  "/Destinations/Des3.webp",
  "/Destinations/Des4.jpeg",
  "/Destinations/Des5.jpeg",
  "/Destinations/Des6.webp",
  "/Destinations/Des7.jpeg",
];

export interface GroupMember {
  id: string;
  name: string;
  avatarColor: string;
  role: "host" | "co-host" | "member";
  expertise: string;
}

export interface Badge {
  label: string;
  theme: "emerald" | "amber" | "sky" | "rose" | string;
}

export interface HostProfile {
  id: string;
  handle: string;
  verificationLevel: string;
  pastTripsHosted: number;
  testimonials: string[];
  bio: string;
  avatarColor: string;
}

export interface BackpackerGroup {
  id: string;
  groupName: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  maxMembers: number;
  avgBudget: number;
  budgetRange: string;
  pickupLocation: string;
  accommodationType: string;
  approvalCriteria: {
    minAge: number;
    genderPreference: "any" | "male" | "female";
    trekkingExperience: "beginner" | "intermediate" | "advanced";
    mandatoryRules: string[];
  };
  plan: {
    overview: string;
    itinerary: string[];
    activities: string[];
    estimatedCosts: Record<string, number>;
  };
  tripType: "trek" | "bike" | "cultural" | "wellness" | string;
  bikerRequirements?: {
    licenseRequired: boolean;
    ridingGearRequired: boolean;
    speedRules: string;
  };
  documentsRequired: {
    aadhaar: boolean;
    passport: boolean;
    emergencyContact: boolean;
  };
  creatorId: string;
  currentMembers: number;
  coverImage: string;
  members: GroupMember[];
  hostProfile: HostProfile;
  badges: Badge[];
}

export interface GroupDetail {
  id: string;
  groupName: string;
  destination: string;
  coverImage: string;
  tripWindow: string;
  pickupLocation: string;
  accommodationType: string;
  duration: number;
  budgetRange: string;
  currentMembers: number;
  maxMembers: number;
  tripType: BackpackerGroup["tripType"];
  approvalCriteria: BackpackerGroup["approvalCriteria"];
  documentsRequired: BackpackerGroup["documentsRequired"];
  plan: BackpackerGroup["plan"];
  host: {
    id: string;
    handle: string;
    verificationLevel: string;
    pastTripsHosted: number;
    testimonials: string[];
    bio: string;
    avatarColor: string;
  };
  badges: Badge[];
  members: GroupMember[];
}

export interface GroupComment {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  avatarColor: string;
  text: string;
  createdAt: string;
  likes: number;
}

export type JoinRequestStatus = "pending" | "approved" | "rejected";

export interface JoinRequest {
  id: string;
  groupId: string;
  userId: string;
  status: JoinRequestStatus;
  createdAt: string;
  userName?: string;
  note?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export const backpackerGroups: BackpackerGroup[] = [
  {
    id: "leh-ladakh-ride",
    groupName: "Himalayan Biker Collective",
    destination: "Leh - Nubra - Pangong",
    startDate: "2025-04-05",
    endDate: "2025-04-14",
    duration: 10,
    maxMembers: 12,
    avgBudget: 52000,
    currentMembers: 8,
    budgetRange: "₹45k - ₹55k",
    pickupLocation: "Manali Mall Road",
    accommodationType: "Boutique homestays",
    approvalCriteria: {
      minAge: 21,
      genderPreference: "any",
      trekkingExperience: "intermediate",
      mandatoryRules: [
        "Respect the speed cap of 60 kmph",
        "No littering in high-altitude zones",
        "Mandatory acclimatization walk on Day 2",
      ],
    },
    plan: {
      overview:
        "10-day circuit covering Manali, Sarchu, Leh, Nubra Valley and Pangong with sunrise rides.",
      itinerary: [
        "Day 1: Meet-up + bike check at Manali",
        "Day 3: Khardung La summit attempt",
        "Day 5: Pangong Lake sunset circle",
      ],
      activities: ["Night sky photography", "Monastery walk", "Cafe crawl"],
      estimatedCosts: { stay: 24000, fuel: 8000, permits: 3000, meals: 9000 },
    },
    tripType: "bike",
    bikerRequirements: {
      licenseRequired: true,
      ridingGearRequired: true,
      speedRules: "Cap at 60 kmph on mountain passes",
    },
    documentsRequired: {
      aadhaar: true,
      passport: false,
      emergencyContact: true,
    },
    creatorId: "user_ajay",
    coverImage: "/Destinations/Des1.jpeg",
    members: [
      { id: "user_ajay", name: "Ajay", avatarColor: "#34d399", role: "host", expertise: "10y riding" },
      { id: "user_maya", name: "Maya", avatarColor: "#60a5fa", role: "co-host", expertise: "Trail medic" },
      { id: "user_rahul", name: "Rahul", avatarColor: "#f472b6", role: "member", expertise: "Moto vlogger" },
      { id: "user_kriti", name: "Kriti", avatarColor: "#f97316", role: "member", expertise: "Photographer" },
      { id: "user_ishan", name: "Ishan", avatarColor: "#a855f7", role: "member", expertise: "Mechanic" },
      { id: "user_neha", name: "Neha", avatarColor: "#facc15", role: "member", expertise: "Yoga coach" },
      { id: "user_zeeshan", name: "Zeeshan", avatarColor: "#38bdf8", role: "member", expertise: "Drone pilot" },
      { id: "user_ridhi", name: "Ridhi", avatarColor: "#fb7185", role: "member", expertise: "Chef" },
    ],
    hostProfile: {
      id: "user_ajay",
      handle: "@ajayrides",
      verificationLevel: "KYC + Host interview",
      pastTripsHosted: 18,
      testimonials: [
        "Always has a backup plan for high passes",
        "Keeps the crew motivated on long riding days",
      ],
      bio: "Ex-army rider curating mindful Himalayan convoys.",
      avatarColor: "#34d399",
    },
    badges: [
      { label: "Himalayan Ride", theme: "emerald" },
      { label: "Gear check included", theme: "sky" },
    ],
  },
  {
    id: "spiti-backpackers",
    groupName: "Spiti Explorer Pack",
    destination: "Spiti Valley, Himachal",
    startDate: "2025-05-11",
    endDate: "2025-05-20",
    duration: 9,
    maxMembers: 10,
    avgBudget: 36000,
    currentMembers: 5,
    budgetRange: "₹32k - ₹40k",
    pickupLocation: "Shimla ISBT",
    accommodationType: "Hostels + local stays",
    approvalCriteria: {
      minAge: 20,
      genderPreference: "any",
      trekkingExperience: "beginner",
      mandatoryRules: [
        "Carry reusable bottles only",
        "Follow guide instructions during treks",
      ],
    },
    plan: {
      overview: "Backpacker-friendly loop with focus on culture and slow travel.",
      itinerary: [
        "Day 1: Shimla briefing",
        "Day 4: Chitkul village hop",
        "Day 7: Key Monastery meditation",
      ],
      activities: ["River crossing", "Village stays", "Cafe nights"],
      estimatedCosts: { stay: 15000, transport: 12000, food: 8000 },
    },
    tripType: "trek",
    documentsRequired: {
      aadhaar: true,
      passport: false,
      emergencyContact: true,
    },
    creatorId: "user_rhea",
    coverImage: "/Destinations/Des4.jpeg",
    members: [
      { id: "user_rhea", name: "Rhea", avatarColor: "#34d399", role: "host", expertise: "Culture scout" },
      { id: "user_daksh", name: "Daksh", avatarColor: "#60a5fa", role: "co-host", expertise: "Mountain guide" },
      { id: "user_zara", name: "Zara", avatarColor: "#f472b6", role: "member", expertise: "Filmmaker" },
      { id: "user_luca", name: "Luca", avatarColor: "#f97316", role: "member", expertise: "Barista" },
      { id: "user_saanvi", name: "Saanvi", avatarColor: "#a855f7", role: "member", expertise: "Artist" },
    ],
    hostProfile: {
      id: "user_rhea",
      handle: "@rhea.altitude",
      verificationLevel: "KYC + Field check",
      pastTripsHosted: 11,
      testimonials: [
        "Introduced us to hidden monasteries",
        "Super patient with first-time high altitude travellers",
      ],
      bio: "Slow-travel evangelist focused on community homestays in Spiti.",
      avatarColor: "#34d399",
    },
    badges: [
      { label: "Culture-first", theme: "amber" },
      { label: "Beginner friendly", theme: "emerald" },
    ],
  },
  {
    id: "goa-creative-retreat",
    groupName: "Goa Creative Co-Travelers",
    destination: "South Goa",
    startDate: "2025-03-21",
    endDate: "2025-03-26",
    duration: 6,
    maxMembers: 14,
    avgBudget: 22000,
    currentMembers: 11,
    budgetRange: "₹18k - ₹24k",
    pickupLocation: "Madgaon Station",
    accommodationType: "Design hostel",
    approvalCriteria: {
      minAge: 18,
      genderPreference: "any",
      trekkingExperience: "beginner",
      mandatoryRules: [
        "Quiet hours after 11 PM",
        "Only eco-friendly toiletries",
      ],
    },
    plan: {
      overview: "Slow mornings, coworking-friendly afternoons and sunset jam sessions.",
      itinerary: [
        "Day 2: Secret beach picnic",
        "Day 3: Latin quarter art crawl",
        "Day 5: Island kayak session",
      ],
      activities: ["Surf basics", "Open-mic", "Yoga flow"],
      estimatedCosts: { stay: 9000, cowork: 3000, localTravel: 4500, food: 6000 },
    },
    tripType: "cultural",
    documentsRequired: {
      aadhaar: true,
      passport: false,
      emergencyContact: true,
    },
    creatorId: "user_sam",
    coverImage: "/Destinations/Des7.jpeg",
    members: [
      { id: "user_sam", name: "Sam", avatarColor: "#34d399", role: "host", expertise: "Experience designer" },
      { id: "user_meera", name: "Meera", avatarColor: "#60a5fa", role: "co-host", expertise: "Sound healer" },
      { id: "user_adi", name: "Adi", avatarColor: "#f472b6", role: "member", expertise: "Musician" },
      { id: "user_tara", name: "Tara", avatarColor: "#f97316", role: "member", expertise: "Yoga" },
      { id: "user_jai", name: "Jai", avatarColor: "#a855f7", role: "member", expertise: "Surfer" },
      { id: "user_priya", name: "Priya", avatarColor: "#facc15", role: "member", expertise: "Writer" },
      { id: "user_kabir", name: "Kabir", avatarColor: "#38bdf8", role: "member", expertise: "Chef" },
      { id: "user_alia", name: "Alia", avatarColor: "#fb7185", role: "member", expertise: "Illustrator" },
      { id: "user_dev", name: "Dev", avatarColor: "#c084fc", role: "member", expertise: "DJ" },
      { id: "user_milind", name: "Milind", avatarColor: "#f472b6", role: "member", expertise: "Photographer" },
      { id: "user_ayesha", name: "Ayesha", avatarColor: "#86efac", role: "member", expertise: "Breathwork" },
    ],
    hostProfile: {
      id: "user_sam",
      handle: "@sam.designs",
      verificationLevel: "KYC + Host interview",
      pastTripsHosted: 9,
      testimonials: [
        "Curated the best musical evenings",
        "Great balance between work and play",
      ],
      bio: "Designs creative retreats for indie makers across India.",
      avatarColor: "#34d399",
    },
    badges: [
      { label: "Creators only", theme: "rose" },
      { label: "Jam sessions", theme: "sky" },
    ],
  },
];

export const groupComments: GroupComment[] = [
  {
    id: "cmt_1",
    groupId: "leh-ladakh-ride",
    authorId: "user_kriti",
    authorName: "Kriti",
    avatarColor: "#f97316",
    text: "What bikes are most comfortable for the passes?",
    createdAt: new Date().toISOString(),
    likes: 3,
  },
  {
    id: "cmt_2",
    groupId: "leh-ladakh-ride",
    authorId: "user_ajay",
    authorName: "Ajay (Host)",
    avatarColor: "#34d399",
    text: "400cc+ is ideal but 250cc bikes have done fine with tune ups.",
    createdAt: new Date().toISOString(),
    likes: 6,
  },
  {
    id: "cmt_3",
    groupId: "spiti-backpackers",
    authorId: "user_rhea",
    authorName: "Rhea (Host)",
    avatarColor: "#34d399",
    text: "Expect single-digit temps at night, layer up!",
    createdAt: new Date().toISOString(),
    likes: 2,
  },
];

export const joinRequests: JoinRequest[] = [
  {
    id: "req_1",
    groupId: "leh-ladakh-ride",
    userId: "user_kriti",
    status: "pending",
    createdAt: new Date().toISOString(),
    userName: "Kriti",
  },
  {
    id: "req_2",
    groupId: "spiti-backpackers",
    userId: "user_luca",
    status: "approved",
    createdAt: new Date().toISOString(),
    userName: "Luca",
  },
];

export const groupMessages: GroupMessage[] = [
  {
    id: "msg_1",
    groupId: "leh-ladakh-ride",
    senderId: "user_ajay",
    senderName: "Ajay (Host)",
    text: "Welcome riders! Share your bike cc so we can plan spares.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "msg_2",
    groupId: "leh-ladakh-ride",
    senderId: "user_kriti",
    senderName: "Kriti",
    text: "I'm on a 390 ADV, adding rain liners this time!",
    timestamp: new Date().toISOString(),
  },
];

export function getGroupById(id: string) {
  return backpackerGroups.find((group) => group.id === id) ?? null;
}

const formatTripWindow = (startDate: string, endDate: string) => {
  const formatter = new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" });
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${formatter.format(start)} – ${formatter.format(end)}`;
};

export function getGroupDetail(id: string): GroupDetail | null {
  const group = getGroupById(id);
  if (!group) return null;

  return {
    id: group.id,
    groupName: group.groupName,
    destination: group.destination,
    coverImage: group.coverImage,
    tripWindow: formatTripWindow(group.startDate, group.endDate),
    pickupLocation: group.pickupLocation,
    accommodationType: group.accommodationType,
    duration: group.duration,
    budgetRange: group.budgetRange,
    currentMembers: group.currentMembers,
    maxMembers: group.maxMembers,
    tripType: group.tripType,
    approvalCriteria: group.approvalCriteria,
    documentsRequired: group.documentsRequired,
    plan: group.plan,
    host: {
      id: group.hostProfile.id,
      handle: group.hostProfile.handle,
      verificationLevel: group.hostProfile.verificationLevel,
      pastTripsHosted: group.hostProfile.pastTripsHosted,
      testimonials: group.hostProfile.testimonials,
      bio: group.hostProfile.bio,
      avatarColor: group.hostProfile.avatarColor,
    },
    badges: group.badges,
    members: group.members,
  };
}

export function listGroups() {
  return backpackerGroups;
}

export function listMessagesByGroup(groupId: string) {
  return groupMessages.filter((message) => message.groupId === groupId);
}

export function listComments(groupId: string) {
  return groupComments.filter((comment) => comment.groupId === groupId);
}

export function addComment({
  groupId,
  authorId,
  authorName,
  avatarColor,
  text,
}: {
  groupId: string;
  authorId: string;
  authorName: string;
  avatarColor: string;
  text: string;
}) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Comment text required");

  const comment: GroupComment = {
    id: `cmt_${Date.now().toString(36)}`,
    groupId,
    authorId,
    authorName,
    avatarColor,
    text: trimmed,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  groupComments.unshift(comment);
  return comment;
}

export function removeComment(groupId: string, commentId: string, requesterId: string) {
  const index = groupComments.findIndex((comment) => comment.id === commentId && comment.groupId === groupId);
  if (index === -1) return null;
  const comment = groupComments[index];
  if (comment.authorId !== requesterId) {
    throw new Error("Not authorized to delete this comment");
  }
  groupComments.splice(index, 1);
  return comment;
}

export function toggleCommentLike(groupId: string, commentId: string, like: boolean) {
  const comment = groupComments.find((item) => item.id === commentId && item.groupId === groupId);
  if (!comment) return null;
  comment.likes = Math.max(0, comment.likes + (like ? 1 : -1));
  return comment;
}

export interface CreateGroupPayload {
  groupName: string;
  destination: string;
  startDate: string;
  endDate: string;
  maxMembers: number;
  budgetRange: string;
  pickupLocation: string;
  accommodationType: string;
  minAge: number;
  genderPreference: "any" | "male" | "female";
  trekkingExperience: "beginner" | "intermediate" | "advanced";
  mandatoryRules: string[];
  planOverview: string;
  itinerary: string[];
  activities: string[];
  estimatedCosts: Record<string, number>;
  tripType: string;
  creatorId?: string;
}

export function createBackpackerGroup(payload: CreateGroupPayload) {
  const start = new Date(payload.startDate);
  const end = new Date(payload.endDate);
  const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalCost = Object.values(payload.estimatedCosts).reduce((sum, value) => sum + value, 0);
  const id = payload.groupName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat("-", Date.now().toString(36));

  const creatorId = payload.creatorId ?? "user_host";
  const hostMember: GroupMember = {
    id: creatorId,
    name: creatorId.replace("user_", "").replace(/(^|-)?\w/g, (c) => c.toUpperCase()),
    avatarColor: "#34d399",
    role: "host",
    expertise: "Trip curator",
  };

  const hostProfile: HostProfile = {
    id: creatorId,
    handle: `@${hostMember.name.toLowerCase().replace(/\s+/g, "")}`,
    verificationLevel: "Pending verification",
    pastTripsHosted: 0,
    testimonials: [],
    bio: "Host will update their bio soon.",
    avatarColor: hostMember.avatarColor,
  };

  const defaultBadges: Badge[] = [
    { label: "Community beta", theme: "emerald" },
    { label: `${payload.tripType ?? "trip"} crew`, theme: "sky" },
  ];

  const newGroup: BackpackerGroup = {
    id,
    groupName: payload.groupName,
    destination: payload.destination,
    startDate: payload.startDate,
    endDate: payload.endDate,
    duration,
    maxMembers: payload.maxMembers,
    avgBudget: totalCost,
    currentMembers: 1,
    budgetRange: payload.budgetRange,
    pickupLocation: payload.pickupLocation,
    accommodationType: payload.accommodationType,
    approvalCriteria: {
      minAge: payload.minAge,
      genderPreference: payload.genderPreference,
      trekkingExperience: payload.trekkingExperience,
      mandatoryRules: payload.mandatoryRules,
    },
    plan: {
      overview: payload.planOverview,
      itinerary: payload.itinerary,
      activities: payload.activities,
      estimatedCosts: payload.estimatedCosts,
    },
    tripType: payload.tripType,
    documentsRequired: {
      aadhaar: true,
      passport: false,
      emergencyContact: true,
    },
    creatorId,
    coverImage: coverPool[Math.floor(Math.random() * coverPool.length)],
    members: [hostMember],
    hostProfile,
    badges: defaultBadges,
  };

  backpackerGroups.push(newGroup);
  return newGroup;
}

export function requestToJoinGroup({
  groupId,
  userId,
  userName,
  note,
}: {
  groupId: string;
  userId: string;
  userName?: string;
  note?: string;
}) {
  const request: JoinRequest = {
    id: `req_${Date.now().toString(36)}`,
    groupId,
    userId,
    status: "pending",
    createdAt: new Date().toISOString(),
    userName,
    note,
  };
  joinRequests.push(request);
  return request;
}

export function handleJoinApproval(requestId: string, status: Exclude<JoinRequestStatus, "pending">) {
  const request = joinRequests.find((item) => item.id === requestId);
  if (!request) return null;
  request.status = status;
  if (status === "approved") {
    const group = backpackerGroups.find((g) => g.id === request.groupId);
    if (group && group.currentMembers < group.maxMembers) {
      group.currentMembers += 1;
      group.members.push({
        id: request.userId,
        name: request.userId.replace("user_", "@"),
        avatarColor: "#c084fc",
        role: "member",
        expertise: "Explorer",
      });
    }
  }
  return request;
}

export function sendMessageToGroup(groupId: string, sender: { id: string; name: string; text: string }) {
  const message: GroupMessage = {
    id: `msg_${Date.now().toString(36)}`,
    groupId,
    senderId: sender.id,
    senderName: sender.name,
    text: sender.text,
    timestamp: new Date().toISOString(),
  };
  groupMessages.push(message);
  return message;
}
