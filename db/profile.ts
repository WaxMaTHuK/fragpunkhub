import { eq } from "drizzle-orm";
import { getDb } from ".";
import { profiles } from "./schema";

export async function getOrCreateProfile(userId: string, suggestedName: string) {
  const db = getDb();
  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db.insert(profiles).values({ userId, nickname: suggestedName.slice(0, 24) || "Лансер" }).returning();
  return created;
}

export async function updateProfile(userId: string, input: { nickname: string; avatar: string; frame: string; gameRank: string }) {
  const db = getDb();
  const nickname = input.nickname.trim().slice(0, 24) || "Лансер";
  const [updated] = await db.update(profiles).set({ nickname, avatar: input.avatar.slice(0, 180), frame: input.frame.slice(0, 40), gameRank: input.gameRank.slice(0, 40), updatedAt: new Date().toISOString() }).where(eq(profiles.userId, userId)).returning();
  if (!updated) throw new Error("Профиль не найден");
  return updated;
}

export async function updateAvatar(userId: string, avatar: string) {
  const db = getDb();
  const [updated] = await db.update(profiles).set({ avatar: avatar.slice(0, 180), updatedAt: new Date().toISOString() }).where(eq(profiles.userId, userId)).returning();
  if (!updated) throw new Error("Профиль не найден");
  return updated;
}
