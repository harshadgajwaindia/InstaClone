"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function ProfileImageUploader({
  onUploadComplete,
}: {
  onUploadComplete?: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (onUploadComplete) onUploadComplete(data.url);
      alert("Upload successful!");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-neutral-800 rounded-xl shadow-md w-full max-w-sm mx-auto">
      <div className="relative">
        <div className="w-40 h-40 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <Camera size={50} className="text-gray-400" />
          )}
        </div>

        <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Camera size={20} className="text-white" />
        </label>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
