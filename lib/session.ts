import { redis } from "./redis";

export async function getSessionUserId(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const sessionId = cookie
    .split(";")
    .find((c) => c.trim().startsWith("session="))
    ?.split("=")[1];

  if (!sessionId) return null;

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) return null;

  const userData =
    typeof sessionData === "string" ? JSON.parse(sessionData) : sessionData;
  return {
    user: {
      id: userData.id,
      profilePic: userData.profilePic,
    },
  };
}

export async function getSessionUserIdOnly(
  req: Request
): Promise<string | null> {
  const user = await getSessionUserId(req);
  if (!user || !user.user?.id) return null;
  return user.user.id;
}
