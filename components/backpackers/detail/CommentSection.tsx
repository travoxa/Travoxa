'use client';

import { useState } from 'react';

import type { GroupComment } from '@/data/backpackers';

import CommentComposer from './CommentComposer';
import CommentList from './CommentList';

interface CommentSectionProps {
  groupId: string;
  initialComments: GroupComment[];
}

const fallbackUser = {
  id: 'user_guest',
  name: 'Guest Explorer',
  avatarColor: '#34d399',
};

export default function CommentSection({ groupId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<GroupComment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const [likeBusyId, setLikeBusyId] = useState<string | null>(null);

  const handleSubmit = async (text: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, authorId: fallbackUser.id, authorName: fallbackUser.name, avatarColor: fallbackUser.avatarColor }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setComments((prev) => [data.comment, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string, like: boolean) => {
    setLikeBusyId(commentId);
    try {
      const response = await fetch(`/api/groups/${groupId}/comments/${commentId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ like }),
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? data.comment : comment)));
      setLikedCommentIds((prev) => {
        const next = new Set(prev);
        if (like) {
          next.add(commentId);
        } else {
          next.delete(commentId);
        }
        return next;
      });
    } finally {
      setLikeBusyId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 text-black">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Community thread</p>
          <h2 className="text-2xl font-semibold">Ask hosts or past travellers</h2>
        </div>
        <span className="rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-600">{comments.length} comments</span>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CommentComposer onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        <div className="space-y-4">
          <CommentList
            comments={comments}
            likedCommentIds={likedCommentIds}
            onToggleLike={handleToggleLike}
            likeBusyId={likeBusyId}
          />
        </div>
      </div>
    </section>
  );
}
