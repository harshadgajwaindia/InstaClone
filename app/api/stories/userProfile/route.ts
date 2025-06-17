import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSessionUserId(req);
  
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      profilePic: session.user.profilePic,
    }
  });
}
