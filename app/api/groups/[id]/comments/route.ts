import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticateRequest, requireAuth } from "@/lib/authUtils";
import { getUser } from "@/lib/mongodbUtils";
import BackpackerGroup, { type IBackpackerGroup } from "@/lib/models/BackpackerGroup";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    // Try to find group by both MongoDB ObjectId and generated id field
    let group = await BackpackerGroup.findById(id);
    if (!group) {
      // If not found by ObjectId, try to find by generated id field
      group = await BackpackerGroup.findOne({ id });
    }
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    // Convert MongoDB comments to the expected format
    const comments = group.comments.map((comment: any) => ({
      id: comment.id,
      groupId: id,
      authorId: comment.authorId,
      authorName: comment.authorName,
      avatarColor: comment.avatarColor,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      likes: comment.likes,
      roleLabel: comment.roleLabel || "Explorer",
    }));
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Failed to fetch comments", error);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json({ error: "Missing required field: text is required" }, { status: 400 });
    }
    
    // Authenticate user
    const user = await authenticateRequest(request as any);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    await connectDB();
    
    // Try to find group by both MongoDB ObjectId and generated id field
    let group = await BackpackerGroup.findById(id);
    if (!group) {
      // If not found by ObjectId, try to find by generated id field
      group = await BackpackerGroup.findOne({ id });
    }
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    // Get user details from database
    const dbUser = await getUser(user.email);
    const authorName = dbUser?.name || user.name || user.email;
    const authorId = user.email; // Use email as unique identifier
    
    // Check if user is the host
    const isHost = group.creatorId === user.email;
    const avatarColor = isHost ? "#f59e0b" : "#34d399"; // Gold for host, green for regular users
    
    // Add role information for host differentiation
    const roleLabel = isHost ? "Host" : "Explorer";
    
    const newComment = {
      id: `cmt_${Date.now().toString(36)}`,
      authorId: authorId,
      authorName: authorName,
      avatarColor: avatarColor,
      text: text.trim(),
      createdAt: new Date(),
      likes: 0,
      roleLabel: roleLabel,
    };
    
    // Add comment to the group
    group.comments.unshift(newComment);
    await group.save();
    
    // Return the created comment
    const commentResponse = {
      id: newComment.id,
      groupId: id,
      authorId: newComment.authorId,
      authorName: newComment.authorName,
      avatarColor: newComment.avatarColor,
      text: newComment.text,
      createdAt: newComment.createdAt.toISOString(),
      likes: newComment.likes,
      roleLabel: newComment.roleLabel,
    };
    
    return NextResponse.json({ comment: commentResponse }, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment", error);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}