import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true, deletedPost });
  } catch (error) {
    console.error("Error Deleting Post:", error);
    return NextResponse.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}
