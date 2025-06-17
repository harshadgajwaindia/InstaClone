"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
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
        setComments([comment, ...comments]); // prepend new comment
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
      {/* Comment List */}
      <div className="max-h-64 overflow-y-auto space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{comment.user.name}</span>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center space-x-2"
      >
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
          placeholder="Add a comment..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="text-blue-500 font-semibold text-sm hover:opacity-70"
        >
          Post
        </button>
      </form>
    </div>
  );
}
