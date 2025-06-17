"use client";

import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

interface DeletePostButtonProps {
  postId: string;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");

    if (!confirmed) return;

    const res = await fetch(`/api/posts/delete/${postId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Post Deleted Successfully");
      router.push("/profile");
    } else {
      alert("Delete failed");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="py-2 text-red-600 hover:text-red-400"
    >
      <Trash size={25} />
    </button>
  );
}
