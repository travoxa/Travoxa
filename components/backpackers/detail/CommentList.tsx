import type { GroupComment } from "@/data/backpackers";

interface CommentListProps {
  comments: GroupComment[];
  likedCommentIds: Set<string>;
  onToggleLike: (commentId: string, like: boolean) => Promise<void>;
  likeBusyId: string | null;
}

const formatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function CommentList({ comments, likedCommentIds, onToggleLike, likeBusyId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
        <p className="text-sm">No comments yet. Be the first to ask something!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        const isLiked = likedCommentIds.has(comment.id);
        return (
          <li key={comment.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-black">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold" style={{ backgroundColor: comment.avatarColor }}>
                {comment.authorName.replace(/^@/, "").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{comment.authorName}</p>
                <p className="text-xs text-gray-600">{formatter.format(new Date(comment.createdAt))}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-700">{comment.text}</p>

            <div className="mt-4 flex items-center gap-3 text-xs text-gray-600">
              <button
                type="button"
                disabled={likeBusyId === comment.id}
                onClick={() => onToggleLike(comment.id, !isLiked)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold transition ${
                  isLiked ? "border-green-400/50 bg-green-400/10 text-green-700" : "border-gray-200 bg-white hover:border-gray-400"
                } ${likeBusyId === comment.id ? "opacity-70" : ""}`}
              >
                <span>{isLiked ? "♥" : "♡"}</span>
                <span>{isLiked ? "Liked" : "Like"}</span>
              </button>
              <span>{comment.likes + (isLiked && likeBusyId === null ? 0 : 0)} likes</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
