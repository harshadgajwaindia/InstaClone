import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { tmpdir } from "os";
import path from "path";

export async function POST(req: Request) {
  try {
    const sessionUser = await getSessionUserId(req);
    if (!sessionUser?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionUser.user.id;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(tmpdir(), `${randomUUID()}.png`);
    await writeFile(tempPath, buffer);

    const upload = await cloudinary.uploader.upload(tempPath, {
      folder: "profile_pics",
      public_id: userId,
      overwrite: true,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { profilePic: upload.secure_url },
    });

    return NextResponse.json({ url: upload.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
