import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import BackpackerGroup from '@/lib/models/BackpackerGroup';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.email) {
    redirect('/login');
  }

  await connectDB();
  const dbUser = await User.findOne({ email: session.user.email }).lean();

  if (!dbUser) {
    // Handle edge case where session exists but user not in DB (shouldn't happen)
    redirect('/login');
  }

  // Fetch groups created by this user, joined by this user, or requested by this user
  const userId = dbUser._id.toString();

  const allUserGroups = await BackpackerGroup.find({
    $or: [
      { creatorId: userId },
      { creatorId: dbUser.email },
      { "members.id": userId },
      { "requests": { $elemMatch: { userId: userId, status: "pending" } } }
    ]
  })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize groups and determine relationship status
  // Also collect all user IDs from pending requests to fetch their details
  const pendingRequestUserIds = new Set<string>();
  allUserGroups.forEach((group: any) => {
    group.requests?.forEach((r: any) => {
      if (r.status === 'pending') {
        pendingRequestUserIds.add(r.userId);
      }
    });

  });

  // Fetch user details for pending requests
  const requestUsersMap = new Map();
  if (pendingRequestUserIds.size > 0) {
    const allIds = Array.from(pendingRequestUserIds);
    const validObjectIds = allIds.filter(id => mongoose.isValidObjectId(id));

    // Construct query conditions safely
    const conditions = [];
    if (validObjectIds.length > 0) {
      conditions.push({ _id: { $in: validObjectIds } });
    }
    conditions.push({ email: { $in: allIds } });

    const requestUsers = await User.find({
      $or: conditions
    }).select('name image email').lean();

    requestUsers.forEach((u: any) => {
      requestUsersMap.set(u._id.toString(), u);
      requestUsersMap.set(u.email, u);
    });
  }

  const createdGroups = allUserGroups.map((group: any) => {
    let status = 'created'; // default

    // Check specific relationship
    const isCreator = group.creatorId === userId || group.creatorId === dbUser.email;
    const isMember = group.members.some((m: any) => m.id === userId);
    const hasPendingRequest = group.requests?.some((r: any) => r.userId === userId && r.status === 'pending');

    if (isCreator) {
      status = 'created';
    } else if (isMember) {
      status = 'joined';
    } else if (hasPendingRequest) {
      status = 'requested';
    }

    const pendingRequestCount = isCreator
      ? group.requests?.filter((r: any) => r.status === 'pending').length || 0
      : 0;

    // Map requests with user details if creator
    const requestsWithDetails = isCreator && group.requests
      ? group.requests
        .filter((r: any) => r.status === 'pending')
        .map((r: any) => {
          const userDetails = requestUsersMap.get(r.userId) || { name: 'Unknown User', image: null };
          return {
            id: r._id ? r._id.toString() : r.id,
            userId: r.userId,
            status: r.status,
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
            note: r.note,
            userName: userDetails.name || 'Unknown User',
            userImage: userDetails.image,
          };
        })
      : [];

    return {
      id: group._id.toString(),
      groupName: group.groupName,
      destination: group.destination,
      startDate: group.startDate,
      endDate: group.endDate,
      coverImage: group.coverImage,
      verified: group.verified,
      tripType: group.tripType,
      currentMembers: group.currentMembers,
      maxMembers: group.maxMembers,
      userStatus: status, // 'created' | 'joined' | 'requested'
      pendingRequestCount,
      requests: requestsWithDetails,
    };
  });

  // Pass plain object to client component
  // We need to serialize the MongoDB object (dates, _id)
  const user = {
    name: dbUser.name,
    email: dbUser.email,
    image: session.user.image, // Prefer session image if available (e.g. google profile pic updates)
    id: dbUser._id.toString(),
    notifications: dbUser.notifications ? dbUser.notifications.map((n: any) => ({
      ...n,
      _id: n._id.toString(),
      createdAt: n.createdAt.toISOString()
    })) : []
  };

  return <DashboardClient user={user} createdGroups={createdGroups} />;
}
