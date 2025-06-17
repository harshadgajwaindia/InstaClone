import prisma from "@/lib/prisma";
import { getSessionUserIdOnly } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  req: Request,
  context: { params: Promise<{ postId: string }> }
) {
  const userId = await getSessionUserIdOnly(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorised User" }, { status: 401 });
  }

  const { postId } = await context.params;

  try {
    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: { userId, postId },
      });
    }

    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({ 
      liked: !existingLike, 
      likeCount 
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { message: "Error toggling like" },
      { status: 500 }
    );
  }
}


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const userId = await getSessionUserIdOnly(req);
  const { postId } = await context.params;

  try {
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    let liked = false;
    if (userId) {
      const existingLike = await prisma.like.findFirst({
        where: { userId, postId },
      });
      liked = !!existingLike;
    }

    return NextResponse.json({ likeCount, liked });
  } catch (error) {
    console.error("Error fetching like status:", error);
    return NextResponse.json(
      { message: "Failed to fetch like status" },
      { status: 500 }
    );
  }
}
