"use client";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import StoryUploader from "@/components/StoryUploader";
import StoryFeed from "@/components/StoryFeed";
import PostSkeleton from "@/components/PostSkeleton"; // <--- import the skeleton
import { useEffect, useState } from "react";

export default function HomePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string>("/default-avatar.png");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts/HomePosts");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/stories/userProfile");
      const data = await res.json();

      if (data?.user?.profilePic) setProfilePic(data.user.profilePic);
    };
    fetchSession();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl p-4 flex flex-col gap-6">
        <div className="flex">
          <StoryUploader profilePic={profilePic} />
          <StoryFeed />
        </div>

        {loading
          ? Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
          : posts.map((post) => (
              <div key={post.id} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12">
                  <img
                    src={post.user.profilePic || "/default-avatar.png"}
                    className="rounded-full w-12 h-12 object-cover"
                    alt="avatar"
                  />
                  </div>
                  <p className="font-semibold">
                    {post.user?.name || "Unknown"}
                  </p>
                </div>

                <div className="w-full aspect-square overflow-hidden rounded-md">
                  {post.mediaType === "video" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      className="w-full h-full object-cover"
                      alt="post"
                    />
                  )}
                </div>

                <div className="mt-3">
                  <LikeButton
                    postId={post.id}
                    initialLiked={post.likedByMe}
                    initialLikeCount={post.likeCount}
                  />
                </div>

                <div className="mt-4">
                  <CommentSection postId={post.id} />
                </div>

                <p className="mt-2 text-sm">{post.caption}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
