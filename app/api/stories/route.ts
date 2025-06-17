import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const session = await getSessionUserId(req);
    const userId = session?.user?.id;
    if(!userId){
        return NextResponse.json({message: "unauthorized"}, {status:401})
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if(!file)
    {
        return NextResponse.json({message: "No file uploaded"}, {status: 400})
    }

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const upload = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {resource_type: "auto", folder: "stories" },
            (error, result) => {
                if(error) reject (error);
                    resolve (result);
            }
        )
        .end(buffer);
    });

    const story = await prisma.story.create({
        data: {
             userId: userId,
            mediaUrl: upload.secure_url,
            mediaType: upload.resource_type,
            expiresAt: new Date(Date.now() + 24*60*60*1000)
        }
    })

    return NextResponse.json(story);
}


export async function GET() {
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: { gt: now },
    },
    include: {
      user: {
        select: { name: true, profilePic: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(stories);
}