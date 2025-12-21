import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/authUtils";
import BackpackerGroup, { type IBackpackerGroup } from "@/lib/models/BackpackerGroup";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  try {
    const { id, commentId } = await params;
    const body = await request.json();
    const { like } = body;
    
    if (typeof like !== 'boolean') {
      return NextResponse.json({ error: "Invalid like parameter. Must be boolean." }, { status: 400 });
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
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    const comment = group.comments.find((c: any) => c.id === commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    
    // Update likes count
    comment.likes = Math.max(0, comment.likes + (like ? 1 : -1));
    await group.save();
    
    // Return the updated comment
    const commentResponse = {
      id: comment.id,
      groupId: id,
      authorId: comment.authorId,
      authorName: comment.authorName,
      avatarColor: comment.avatarColor,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      likes: comment.likes,
    };
    
    return NextResponse.json({ comment: commentResponse });
  } catch (error) {
    console.error("Failed to update comment like", error);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}