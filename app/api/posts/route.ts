import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { IncomingForm } from "formidable";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

function toNodeReadable(readable: ReadableStream<Uint8Array>): Readable {
  const reader = readable.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(Buffer.from(value));
    },
  });
}

const parseForm = async (
  req: Request
): Promise<{ fields: any; files: any }> => {
  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  return new Promise((resolve, reject) => {
    const nodeReq = toNodeReadable(req.body!);
    (nodeReq as any).headers = Object.fromEntries(req.headers.entries());
    (nodeReq as any).method = "POST";
    (nodeReq as any).url = req.url;

    form.parse(nodeReq as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

function getCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const cookies = cookie.split(";").map((c) => c.trim());
  for (const c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const sessionId = getCookie(req, "session");
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const sessionRaw = await redis.get(`session:${sessionId}`);
    console.log("Raw session from Redis:", sessionRaw);
    console.log("Type of session:", typeof sessionRaw);

    if (!sessionRaw) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 401 }
      );
    }

    let sessionData: { id: string };
    try {
      sessionData =
        typeof sessionRaw === "string" ? JSON.parse(sessionRaw) : sessionRaw;
      console.log("Parsed session data:", sessionData);
      console.log("User ID from session:", sessionData.id);
    } catch (e) {
      console.error("Invalid session data:", e);
      return NextResponse.json(
        { success: false, error: "Invalid session format" },
        { status: 401 }
      );
    }

    if (!sessionData.id) {
      return NextResponse.json(
        { success: false, error: "Invalid session data" },
        { status: 401 }
      );
    }

    const { fields, files } = await parseForm(req);
    const caption = fields.caption?.[0] || "";
    const file = Array.isArray(files.media) ? files.media[0] : files.media;

    if (!file || !(file as any).filepath) {
      return NextResponse.json(
        { success: false, error: "Missing media file" },
        { status: 400 }
      );
    }

    const uploadResult = await cloudinary.uploader.upload(
      (file as any).filepath,
      {
        resource_type: "auto",
        folder: "instagram",
      }
    );

    const newPost = await prisma.post.create({
      data: {
        caption,
        mediaUrl: uploadResult.secure_url,
        mediaType: uploadResult.resource_type,
        userId: sessionData.id,
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Post upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
