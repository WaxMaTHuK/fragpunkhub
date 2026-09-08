import { asc, eq } from "drizzle-orm";
import { type HubPost, type PostType } from "@/lib/hub-content";
import { getDb } from ".";
import { posts } from "./schema";

function toHubPost(row: typeof posts.$inferSelect): HubPost {
  return { ...row, type: row.type as PostType };
}

export async function listPosts(includeDrafts: boolean): Promise<HubPost[]> {
  const db = getDb();
  const rows = includeDrafts
    ? await db.select().from(posts).orderBy(asc(posts.sortOrder), asc(posts.title))
    : await db.select().from(posts).where(eq(posts.published, true)).orderBy(asc(posts.sortOrder), asc(posts.title));
  return rows.map(toHubPost);
}

export async function savePost(input: Omit<HubPost, "id" | "slug" | "updatedAt"> & { id?: string }, authorId: string): Promise<HubPost> {
  const db = getDb();
  const now = new Date().toISOString();
  if (input.id) {
    const [updated] = await db.update(posts).set({ type: input.type, title: input.title, summary: input.summary, content: input.content, readTime: input.readTime, accent: input.accent, published: input.published, sortOrder: input.sortOrder, authorId, updatedAt: now }).where(eq(posts.id, input.id)).returning();
    if (!updated) throw new Error("Материал не найден");
    return toHubPost(updated);
  }
  const id = crypto.randomUUID();
  const slugBase = input.title.toLocaleLowerCase("ru-RU").replace(/[^a-zа-яё0-9]+/giu, "-").replace(/^-|-$/g, "").slice(0, 48) || "material";
  const [created] = await db.insert(posts).values({ id, slug: `${slugBase}-${id.slice(0, 6)}`, type: input.type, title: input.title, summary: input.summary, content: input.content, readTime: input.readTime, accent: input.accent, published: input.published, sortOrder: input.sortOrder, authorId, updatedAt: now }).returning();
  return toHubPost(created);
}

export async function deletePost(id: string): Promise<void> {
  const db = getDb();
  const deleted = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
  if (!deleted.length) throw new Error("Материал не найден");
}
