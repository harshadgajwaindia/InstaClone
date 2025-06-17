"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface StoryUploaderProps {
  profilePic: string;
}

export default function StoryUploader({ profilePic }: StoryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/stories", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Story uploaded!");
    } else {
      alert("Failed to upload story");
    }

    setUploading(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div
        onClick={openFileDialog}
        className="w-20 h-20 border-2 border-pink-500 rounded-full overflow-hidden cursor-pointer relative"
      >
        <Image
          src={profilePic || "/default-avatar.png"}
          alt="profile"
          width={76}
          height={76}
          className="object-cover"
        />

        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs">
            Uploading...
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs mt-1">Your Story</p>
    </div>
  );
}
