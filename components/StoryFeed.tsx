"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: string;
  user: {
    name: string;
    profilePic: string;
  };
}

export default function StoryFeed() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data);
    };
    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 50);

      const timer = setTimeout(() => {
        setSelectedStory(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [selectedStory]);

  return (
    <>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center">
            <div
              className="w-20 h-20 border-2 border-pink-500 rounded-full overflow-hidden cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <Image
                src={story.user.profilePic || "/default-avatar.png"}
                alt="profile"
                width={64}
                height={64}
                className="w-20 h-20 object-cover"
              />
            </div>
            <p className="text-xs mt-1">{story.user.name}</p>
          </div>
        ))}
      </div>

      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
            <div
              className="h-full bg-white transition-all duration-50"
              style={{ width: `${(progress / 100) * 100}%` }}
            />
          </div>

          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setSelectedStory(null)}
            >
              <X size={32} />
            </button>

            {selectedStory.mediaType === "video" ? (
              <video
                src={selectedStory.mediaUrl}
                autoPlay
                controls
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            ) : (
              <Image
                src={selectedStory.mediaUrl}
                alt="story"
                width={500}
                height={800}
                className="rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
