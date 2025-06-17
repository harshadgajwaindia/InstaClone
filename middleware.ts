import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";



export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  

  
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|_static|favicon.ico|login|signup|api/login|api/signup).*)",
  ],
};
