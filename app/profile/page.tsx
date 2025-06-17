"use client";

import FollowButton from "@/components/FollowButton";
import ProfileImage from "@/components/ProfileDetails";
import ProfilePageSkeleton from "@/components/ProfilePageSkeleton";
import { Grid } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/profile/displayPosts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setUserId(data.userId);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <ProfilePageSkeleton />;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:justify-between mb-8 gap-6">
        <ProfileImage userId={userId} />
        <FollowButton targetUserId={userId} />
      </div>

      <h2 className="flex items-center gap-2 text-xl font-semibold border-t border-b border-gray-300 pt-4 pb-2 uppercase tracking-wide text-gray-600 mb-6">
        <Grid size={20} />
        Posts
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
              {post.mediaType === "video" ? (
                <video src={post.mediaUrl} controls className="object-cover" />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="object-cover"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
