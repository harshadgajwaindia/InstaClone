"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  postId: string;
  initialLiked: boolean;
  initialLikeCount: number;
};

export default function LikeButton({
  postId,
  initialLiked,
  initialLikeCount,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        }
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };

    fetchLikeStatus();
  }, [postId]);

  const toggleLike = async () => {
    setLoading(true);
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={toggleLike} className="flex items-center gap-2 group" disabled={loading}>
        {liked ? (
          <Heart
            className={`text-red-500 fill-red-500 transition-all ${loading ? "animate-pulse" : ""}`}
          />
        ) : (
          <Heart
            className={`text-gray-500 transition-all ${loading ? "animate-pulse" : ""}`}
          />
        )}
        <span>{likeCount}</span>
      </button>
    </div>
  );
}
