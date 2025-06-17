import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { userId: string } }) {
  const { userId } = await context.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: true,
      following: true,
    },
  });

  if (!user)
    return NextResponse.json({ error: "user not found" }, { status: 404 });

  return NextResponse.json({
    username: user?.username,
    profilePic: user?.profilePic,
    followersCount: user?.followers.length,
    followingCount: user?.following.length,
  });
}
