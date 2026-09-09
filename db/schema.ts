import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  readTime: text("read_time").notNull().default("5 мин"),
  accent: text("accent").notNull().default("purple"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  authorId: text("author_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(),
  nickname: text("nickname").notNull().default("Лансер"),
  avatar: text("avatar").notNull().default("⚡"),
  frame: text("frame").notNull().default("acid"),
  gameRank: text("game_rank").notNull().default("Новичок"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  articlesRead: integer("articles_read").notNull().default(0),
  videosWatched: integer("videos_watched").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const playerAccounts = sqliteTable("player_accounts", {
  id: text("id").primaryKey(), email: text("email").notNull().unique(), passwordHash: text("password_hash").notNull(), passwordSalt: text("password_salt").notNull(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const playerSessions = sqliteTable("player_sessions", {
  token: text("token").primaryKey(), userId: text("user_id").notNull(), expiresAt: text("expires_at").notNull(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
