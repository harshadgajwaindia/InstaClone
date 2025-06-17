"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConnectionsPage() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchConnections = async () => {
      const res = await fetch(`/api/user/connections?userId=${userId}`);
      const data = await res.json();
      setFollowers(data.followers);
      setFollowing(data.following);
    };

    fetchConnections();
  }, [userId]);

  const list = activeTab === "followers" ? followers : following;

  return (
    <div className="p-4">
      <div className="flex justify-around p-4 text-lg">
        <button
          className={`font-semibold hover:text-gray-400 ${
            activeTab === "followers" ? "underline" : ""
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`font-semibold hover:text-gray-400 ${
            activeTab === "following" ? "underline" : ""
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>

      <div className="space-y-4">
        {list.map((user: any) => (
          <div key={user.id} className="flex items-center gap-4">
            <img
              src={user.profilePic || "/default.jpg"}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
