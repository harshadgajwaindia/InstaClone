import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (!name || !rest) return;
    cookies[name] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

async function getSessionUserId(req: Request) {
  const cookies = parseCookies(req);
  const sessionId = cookies["session"];
  if (!sessionId) return null;

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) return null;

  const userData =
    typeof sessionData === "string" ? JSON.parse(sessionData) : sessionData;
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
