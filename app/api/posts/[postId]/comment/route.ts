import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context : { params: Promise<{ postId: string }> }
) {
  const session = await getSessionUserId(req);
  if (!session || !session.user)
    return NextResponse.json({ message: "unauthorised" }, { status: 401 });

  const { content } = await req.json();
  if (!content || content.trim() === "")
    return NextResponse.json(
      { message: "Comment cannot be empty" },
      { status: 400 }
    );

    const ID = (await context.params).postId

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        postId: ID,
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


export async function GET(req: Request, {params} : {params : {postId : string}})
{
  const param = await params
  const ID = param.postId
    try {
        const comments = await prisma.comment.findMany({
            where: {postId: ID},
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({message: "failed to load comments"}, {status: 500})
    }
}