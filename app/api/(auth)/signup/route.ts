import { generateSalt, hashPassword } from "@/auth/passwordHasher";
import { createUserSession, SESSION_EXPIRATION_SECONDS } from "@/auth/session";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        salt,
        hashedPassword,
      },
    });

    if(!email || !password)
        {
            return NextResponse.json(
            {message: "incorrect email or password"},
            {status: 400}
        );
        }

    const sessionData = { name, email, id: user.id };
    const sessionId = await createUserSession(sessionData);

    const response = NextResponse.json({ message: "User Registered" });

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
      maxAge: SESSION_EXPIRATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.log("signup error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
