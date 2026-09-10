import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import { getPlayerBySession } from "@/db/player-auth";
import { getOrCreateProfile, updateAvatar } from "@/db/profile";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = await getPlayerBySession(cookieStore.get("fp_player")?.value);
  if (!user) return Response.json({ error: "Нужно войти в кабинет." }, { status: 401 });
  if (!env.BUCKET) return Response.json({ error: "Хранилище аватаров ещё подключается. Попробуйте через минуту." }, { status: 503 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("avatar");
  if (!(file instanceof File) || !allowed.has(file.type)) return Response.json({ error: "Нужен файл PNG, JPG, WEBP или GIF." }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return Response.json({ error: "Файл должен быть не больше 2 МБ." }, { status: 400 });
  const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : file.type === "image/webp" ? "webp" : "gif";
  const key = "avatars/" + user.userId + "-" + crypto.randomUUID() + "." + extension;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  await getOrCreateProfile(user.userId, "Лансер");
  const avatar = "/api/profile/avatar?key=" + encodeURIComponent(key);
  await updateAvatar(user.userId, avatar);
  return Response.json({ avatar });
}
