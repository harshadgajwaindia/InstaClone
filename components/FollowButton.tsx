"use client";

import { useEffect, useState } from "react";

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(`/api/follow?targetUserId=${targetUserId}`);
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Failed to fetch follow status", err);
      }
    };

    fetchFollowStatus();
  }, [targetUserId]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("Failed to follow/unfollow", err);
    }
    setLoading(false);
  };

  if (isFollowing === null) {
    return (
      <button disabled>
        <div className="h-4 bg-neutral-700 rounded w-1/3" />
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handleFollowToggle}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md ${
          isFollowing
            ? "bg-gray-700 hover:bg-gray-800"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Please wait..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}
