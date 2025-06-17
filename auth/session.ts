import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export const SESSION_EXPIRATION_SECONDS = 60*60*24*7;

export async function createUserSession(sessionData: any)
{
    const sessionId = nanoid();
    await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), {ex: SESSION_EXPIRATION_SECONDS});

    return sessionId;
}