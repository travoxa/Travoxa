'use client';

import { FormEvent, useState } from "react";

interface CommentComposerProps {
  onSubmit: (text: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function CommentComposer({ onSubmit, isSubmitting }: CommentComposerProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      setError("Drop a message before sending");
      return;
    }
    setError(null);
    try {
      await onSubmit(text.trim());
      setText("");
    } catch {
      setError("Couldn't post the comment. Please retry.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white">
      <label className="text-xs uppercase tracking-[0.3em] text-white/60">Add to the thread</label>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white focus:outline-none"
        rows={4}
        placeholder="Ask about logistics, share prep tips, or hype the crew."
      />
      {error && <p className="mt-2 text-sm text-rose-200">{error}</p>}
      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Posting...' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
