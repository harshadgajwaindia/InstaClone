import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, context : { params: Promise<{postId: string }>}){
 try {
    const deletedPost = await prisma.post.delete({
    where: {id: (await context.params).postId},
 });

 return NextResponse.json({success: true, deletedPost });

 } catch (error) {
    console.error("Error Deleting Post", error);
    
 }


}