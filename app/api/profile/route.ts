import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getOrCreateProfile, updateProfile } from "@/db/profile";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Нужен вход" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "Некорректные данные" }, { status: 400 });
  await getOrCreateProfile(user.id, user.fullName ?? user.email.split("@")[0] ?? "Лансер");
  const profile = await updateProfile(user.id, { nickname: String(body.nickname ?? ""), avatar: String(body.avatar ?? "⚡"), frame: String(body.frame ?? "acid"), gameRank: String(body.gameRank ?? "Новичок") });
  return Response.json(profile);
}
