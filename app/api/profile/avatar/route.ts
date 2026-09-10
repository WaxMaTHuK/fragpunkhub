import { env } from "cloudflare:workers";
import { cookies } from "next/headers";
import { getPlayerBySession } from "@/db/player-auth";
import { getOrCreateProfile, updateAvatar } from "@/db/profile";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
type UploadedImage = { type?: unknown; size?: unknown; arrayBuffer?: unknown };

async function ensureAvatarTable() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS profile_avatars (
    user_id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    bytes BLOB NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const user = await getPlayerBySession(cookieStore.get("fp_player")?.value);
    if (!user) return Response.json({ error: "Нужно войти в кабинет." }, { status: 401 });

    const form = await request.formData();
    const file = form.get("avatar") as UploadedImage | null;
    const type = typeof file?.type === "string" ? file.type : "";
    const size = typeof file?.size === "number" ? file.size : 0;
    if (!file || typeof file.arrayBuffer !== "function" || !allowed.has(type)) {
      return Response.json({ error: "Нужен файл PNG, JPG, WEBP или GIF." }, { status: 400 });
    }
    if (size > 2 * 1024 * 1024) return Response.json({ error: "Файл должен быть не больше 2 МБ." }, { status: 400 });

    await ensureAvatarTable();
    const bytes = await (file.arrayBuffer as () => Promise<ArrayBuffer>)();
    await env.DB.prepare(
      "INSERT INTO profile_avatars (user_id, content_type, bytes, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET content_type=excluded.content_type, bytes=excluded.bytes, updated_at=excluded.updated_at"
    ).bind(user.userId, type, bytes, new Date().toISOString()).run();
    await getOrCreateProfile(user.userId, "Лансер");
    const avatar = "/api/profile/avatar";
    await updateAvatar(user.userId, avatar);
    return Response.json({ avatar });
  } catch (error) {
    console.error("avatar upload failed", error);
    return Response.json({ error: "Не получилось сохранить аватар. Попробуйте ещё раз." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getPlayerBySession((await cookies()).get("fp_player")?.value);
    if (!user) return new Response(null, { status: 401 });
    await ensureAvatarTable();
    const row = await env.DB.prepare("SELECT content_type, bytes FROM profile_avatars WHERE user_id = ?").bind(user.userId).first<{ content_type: string; bytes: ArrayBuffer }>();
    if (!row?.bytes) return new Response(null, { status: 404 });
    return new Response(row.bytes, { headers: { "content-type": row.content_type, "cache-control": "private, max-age=3600" } });
  } catch (error) {
    console.error("avatar fetch failed", error);
    return new Response(null, { status: 500 });
  }
}
