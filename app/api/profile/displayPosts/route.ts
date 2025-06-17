import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

function getCookie(req: Request, name: string){
    const cookie = req.headers.get("cookie");
    if(!cookie)
        return null;

    const cookies = cookie.split(";").map(c => c.trim())
    for(const c of cookies){
        const [key, value] = c.split("=");
        if(key == name) 
            return decodeURIComponent(value);
    }
    return null;
}

export async function GET(req: Request){
   try {
    const sessionId = getCookie(req, "session");
    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessionRaw = await redis.get(`session:${sessionId}`);
    if (!sessionRaw) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    const session = typeof sessionRaw === "string" ? JSON.parse(sessionRaw) : sessionRaw;

    const posts = await prisma.post.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts, userId: session.id });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}