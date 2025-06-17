import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> } // ❗ Make it a Promise
) {
  const session = await getSessionUserId(req);

  if (!session || !session.user) {
    return NextResponse.json({ message: "unauthorised" }, { status: 401 });
  }

  const { content } = await req.json();

  if (!content || content.trim() === "") {
    return NextResponse.json(
      { message: "Comment cannot be empty" },
      { status: 400 }
    );
  }

  const { postId } = await context.params; 

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        postId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json(
      { message: "Failed to add comment" },
      { status: 500 }
    );
  }
}


export async function GET(
  req: Request,
  context: { params: Promise<{ postId: string }> } 
) {
  const { postId } = await context.params; 

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { message: "Failed to load comments" },
      { status: 500 }
    );
  }
}
