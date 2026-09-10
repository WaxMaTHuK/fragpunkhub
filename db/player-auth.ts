import { and, eq, gt } from "drizzle-orm";
import { getDb } from ".";
import { playerAccounts, playerSessions } from "./schema";

const encoder = new TextEncoder();
async function hash(password: string, salt: string) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" }, material, 256);
  return Array.from(new Uint8Array(bits)).map((v) => v.toString(16).padStart(2, "0")).join("");
}
function token() { return crypto.randomUUID() + crypto.randomUUID(); }

export async function registerPlayer(email: string, password: string) {
  const db = getDb(); const normalized = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalized) || password.length < 8) throw new Error("Укажи почту и пароль от 8 символов");
  const exists = await db.select({ id: playerAccounts.id }).from(playerAccounts).where(eq(playerAccounts.email, normalized)).limit(1);
  if (exists[0]) throw new Error("Эта почта уже зарегистрирована");
  const id = crypto.randomUUID(), salt = crypto.randomUUID();
  await db.insert(playerAccounts).values({ id, email: normalized, passwordHash: await hash(password, salt), passwordSalt: salt });
  return createPlayerSession(id);
}
export async function loginPlayer(email: string, password: string) {
  const db = getDb(); const normalized = email.trim().toLowerCase();
  const rows = await db.select().from(playerAccounts).where(eq(playerAccounts.email, normalized)).limit(1); const player = rows[0];
  if (!player || player.passwordHash !== await hash(password, player.passwordSalt)) throw new Error("Неверная почта или пароль");
  return createPlayerSession(player.id);
}
async function createPlayerSession(userId: string) {
  const db = getDb(); const sessionToken = token(); const expiresAt = new Date(Date.now()+1000*60*60*24*30).toISOString();
  await db.insert(playerSessions).values({ token: sessionToken, userId, expiresAt });
  return { token: sessionToken, userId };
}
export async function getPlayerBySession(sessionToken: string | undefined) {
  if (!sessionToken) return null; const db=getDb();
  const rows=await db.select({ userId: playerSessions.userId }).from(playerSessions).where(and(eq(playerSessions.token,sessionToken),gt(playerSessions.expiresAt,new Date().toISOString()))).limit(1);
  return rows[0] ?? null;
}
export async function removePlayerSession(sessionToken: string | undefined) { if (!sessionToken) return; const db=getDb(); await db.delete(playerSessions).where(eq(playerSessions.token,sessionToken)); }
