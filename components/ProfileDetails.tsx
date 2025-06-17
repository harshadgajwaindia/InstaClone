"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileImage({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user)
    return (
      <div className="flex space-x-4">
        <div className="px-6 w-16 h-16 bg-neutral-700 rounded-full"></div>
        <div className="mt-4 flex items-center justify-center px-6 h-8 bg-neutral-700 rounded w-1/3"></div>
      </div>
    );

  const handleNavigate = (tab: "followers" | "following") => {
    router.push(`/profile/connections?userId=${userId}&tab=${tab}`);
  };

  return (
    <>
      <div className="flex items-center p-8 gap-4">
        <Link href="/profile/upload">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border cursor-pointer hover:opacity-80 transition"
          />
        </Link>

        <div>
          <p className="font-bold text-xl p-5">{user.username}</p>
        </div>
      </div>

      <div className="flex items-center justify-around text-l">
        <div
          className="flex flex-col cursor-pointer hover:opacity-80 transition"
          onClick={() => handleNavigate("followers")}
        >
          <p>{user.followersCount}</p>
          <p className="text-gray-400">followers</p>
        </div>

        <div
          className="flex flex-col cursor-pointer hover:opacity-80 transition"
          onClick={() => handleNavigate("following")}
        >
          <p>{user.followingCount}</p>
          <p className="text-gray-400">following</p>
        </div>
      </div>
    </>
  );
}
