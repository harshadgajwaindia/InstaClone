"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Skeleton for loading comments
function CommentSkeleton() {
  return (
    <div className="flex items-start space-x-3 animate-pulse mb-3">
      <div className="h-8 w-8 rounded-full bg-gray-300"></div>
      <div className="flex flex-col space-y-2">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-4 w-48 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment("");
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Comment post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-2">
      <div className="max-h-64 overflow-y-auto space-y-4">
        {fetching
          ? Array(1)
              .fill(0)
              .map((_, i) => <CommentSkeleton key={i} />)
          : comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {comment.user.name}
                  </span>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center space-x-2"
      >
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 text-sm outline-none border border-gray-700"
          placeholder="Add a comment..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="text-blue-500 font-semibold text-sm hover:opacity-70"
        >
          {loading ? "Posting.." : "Post"}
        </button>
      </form>
    </div>
  );
}
