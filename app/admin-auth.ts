import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

const COOKIE_NAME = "fragpunkhub_admin_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

type AdminEnvironment = {
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
};

function getAdminEnvironment(): AdminEnvironment {
  return env as unknown as AdminEnvironment;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Uint8Array | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function hash(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export function isAdminAuthConfigured(): boolean {
  const { ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = getAdminEnvironment();
  return Boolean(ADMIN_PASSWORD && ADMIN_PASSWORD.length >= 12 && ADMIN_SESSION_SECRET && ADMIN_SESSION_SECRET.length >= 32);
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const configuredPassword = getAdminEnvironment().ADMIN_PASSWORD;
  if (!configuredPassword || configuredPassword.length < 12) return false;
  return constantTimeEqual(await hash(candidate), await hash(configuredPassword));
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = getAdminEnvironment().ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Вход владельца ещё не настроен");

  const payload = new TextEncoder().encode(JSON.stringify({
    version: 1,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS,
    nonce: crypto.randomUUID(),
  }));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await importSigningKey(secret), payload));
  return `${encodeBase64Url(payload)}.${encodeBase64Url(signature)}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  const secret = getAdminEnvironment().ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32 || !token) return false;

  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return false;
  const payload = decodeBase64Url(encodedPayload);
  const signature = decodeBase64Url(encodedSignature);
  if (!payload || !signature) return false;

  const validSignature = await crypto.subtle.verify("HMAC", await importSigningKey(secret), signature, payload);
  if (!validSignature) return false;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(payload)) as { version?: number; expiresAt?: number };
    return parsed.version === 1 && typeof parsed.expiresAt === "number" && parsed.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function readCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === COOKIE_NAME) return valueParts.join("=");
  }
  return undefined;
}

export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  return verifyAdminSessionToken(readCookieHeader(request.headers.get("cookie")));
}

export function adminSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_LIFETIME_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearedAdminSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}
