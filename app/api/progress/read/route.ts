import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { posts } from "@/db/schema";
import { awardMaterialRead } from "@/db/profile";
import { getPlayerBySession } from "@/db/player-auth";

export async function POST(request: Request) {
  const user = await getPlayerBySession((await cookies()).get("fp_player")?.value);
  if (!user) return Response.json({ awarded: false });
  const body = await request.json().catch(() => null);
  const postId = typeof body?.postId === "string" ? body.postId.slice(0, 120) : "";
  if (!postId) return Response.json({ error: "Некорректный материал" }, { status: 400 });
  const post = await getDb().select({ id: posts.id }).from(posts).where(and(eq(posts.id, postId), eq(posts.published, true))).limit(1);
  if (!post[0]) return Response.json({ error: "Материал не найден" }, { status: 404 });
  const result = await awardMaterialRead(user.userId, postId);
  return Response.json(result);
}
