import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, {params} : { params: {postId: string }}){
 try {
    const deletedPost = await prisma.post.delete({
    where: {id: await params.postId},
 });

 return NextResponse.json({success: true, deletedPost });

 } catch (error) {
    console.error("Error Deleting Post", error);
    
 }


}