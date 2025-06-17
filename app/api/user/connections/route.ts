import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return NextResponse.json({ error: "missing userId" }, { status: 400 });

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    const followersList = followers.map((conn) => conn.follower);
    const followingList = following.map((conn) => conn.following);

    return NextResponse.json({
      followers: followersList,
      following: followingList,
    });
  } catch (error) {
    console.error("error fetching connections:", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
