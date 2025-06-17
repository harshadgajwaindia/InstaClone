"use client";

import { Camera } from "lucide-react";
import { useState } from "react";

export default function Posts() {
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!media) return alert("Missing file");

    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption);

    setUploading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    setUploading(false);

    if (data.success) {
      alert("Post Uploaded");
      setMedia(null);
      setCaption("");
    } else {
      alert("Upload Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <header className="bg-black py-5 shadow-md text-center">
        <h1 className="text-2xl font-semibold tracking-wide">
          Create New Post
        </h1>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center px-6 py-10 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center border-2 border-dashed border-gray-600 rounded-xl p-8 w-full bg-gray-800 shadow-lg transition">
          <Camera size={64} className="text-blue-500 mb-6" />
          <p className="mb-6 text-gray-400 font-medium">
            Drag photos and videos here
          </p>

          <input
            type="file"
            accept="image/*,video/*"
            className="mb-6 w-full text-sm text-gray-300 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer
                      hover:file:bg-blue-700 transition"
            onChange={(e) => {
              if (e.target.files?.[0]) setMedia(e.target.files[0]);
            }}
          />

          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption"
            className="mb-6 w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded py-2 text-white font-semibold transition"
            onClick={handleUpload}
            disabled={uploading || !media}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </main>
    </div>
  );
}
