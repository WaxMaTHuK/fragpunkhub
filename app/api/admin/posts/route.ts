import { z } from "zod";
import { deletePost, savePost } from "@/db/content";
import { POST_TYPES } from "@/lib/hub-content";
import { isAdminRequest } from "@/app/admin-auth";

const postSchema = z.object({
  id: z.string().max(100).optional().or(z.literal("")), type: z.enum(POST_TYPES), title: z.string().trim().min(2).max(140),
  summary: z.string().trim().max(260), content: z.string().trim().min(1).max(30000), readTime: z.string().trim().min(1).max(30),
  accent: z.enum(["purple", "pink", "acid", "cyan", "red"]), published: z.boolean(), sortOrder: z.number().int().min(0).max(10000),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  if (!(await isAdminRequest(request))) return Response.json({ error: "Сессия истекла. Войди в редактор снова." }, { status: 401 });
  try {
    const parsed = postSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Проверь заполненные поля" }, { status: 400 });
    const post = await savePost({ ...parsed.data, id: parsed.data.id || undefined }, "site-owner");
    return Response.json({ post });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Не удалось сохранить" }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  if (!(await isAdminRequest(request))) return Response.json({ error: "Сессия истекла. Войди в редактор снова." }, { status: 401 });
  try {
    const parsed = z.object({ id: z.string().min(1).max(100) }).safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Материал не выбран" }, { status: 400 });
    await deletePost(parsed.data.id);
    return Response.json({ ok: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Не удалось удалить материал" }, { status: 500 }); }
}
