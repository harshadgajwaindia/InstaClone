"use client";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className="p-6 h-screen flex justify-center items-center">
      <ProfileImageUploader
        onUploadComplete={() => {
          alert("Upload successful!");
          router.back();
        }}
      />
    </div>
  );
}
