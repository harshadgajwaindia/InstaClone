import prisma from "@/lib/prisma";
import { getSessionUserIdOnly } from "@/lib/session";  // updated import
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
    const userId = await getSessionUserIdOnly(req);
    
    if (!userId)
        return NextResponse.json({ message: "Unauthorised User" }, { status: 401 });

    const postId = params.postId;

    try {
        const existingLike = await prisma.like.findFirst({
            where: { userId, postId }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id }
            });

            const likeCount = await prisma.like.count({
                where: { postId },
            });

            return NextResponse.json({ liked: false, likeCount });
        } else {
            await prisma.like.create({
                data: { userId, postId },
            });

            const likeCount = await prisma.like.count({
                where: { postId },
            });

            return NextResponse.json({ liked: true, likeCount });
        }
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json({ message: "Error toggling like" }, { status: 500 });
    }
}
