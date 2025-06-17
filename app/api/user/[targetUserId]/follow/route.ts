import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

async function getSessionUserId(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const sessionId = cookie
    .split(";")
    .find((c) => c.trim().startsWith("session="))
    ?.split("=")[1];
  if (!sessionId) return null;

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) return null;

  const userData = JSON.parse(sessionData as string);
  return userData.id;
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return NextResponse.json({
        message: "Unfollowed successfully",
        isFollowing: false,
      });
    } else {
      await prisma.follow.create({
        data: {
          id: nanoid(),
          followerId: userId,
          followingId: targetUserId,
        },
      });
      return NextResponse.json({
        message: "Followed successfully",
        isFollowing: true,
      });
    }
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    return NextResponse.json(
      { error: "Failed to process follow/unfollow" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const targetUserId = new URL(request.url).searchParams.get("targetUserId");
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Get follow status error:", error);
    return NextResponse.json(
      { error: "Failed to get follow status" },
      { status: 500 }
    );
  }
}
