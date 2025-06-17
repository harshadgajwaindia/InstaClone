import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          profilePic: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}
