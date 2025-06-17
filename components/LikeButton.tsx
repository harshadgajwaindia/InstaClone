"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

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
  initialLikeCount = 0;
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const toggleLike = async () => {
    const res = await fetch(`api/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    }
  };

  return (
    <button onClick={toggleLike} className="flex items-center gap-2 group">
      {liked ? (
        <Heart className="text-red-500 fill-red-500 transition-all" />
      ) : (
        <Heart className="text-gray-500 transition-all" />
      )}
      <span>{likeCount}</span>
    </button>
  );
}
