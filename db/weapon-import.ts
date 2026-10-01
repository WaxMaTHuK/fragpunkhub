import { env } from "cloudflare:workers";
import { SPECIAL_WEAPONS } from "@/lib/special-weapons";

const release = "2026-10-01-special-weapons";
let importPromise: Promise<void> | undefined;

// A recorded, atomic content import runs once after publishing this release.
// Keeping a durable marker preserves subsequent editor changes and deletions.
export function ensureWeaponImport(): Promise<void> {
  if (!importPromise) importPromise = importWeapons().catch((error) => {
    importPromise = undefined;
    throw error;
  });
  return importPromise;
}

async function importWeapons(): Promise<void> {
  const db = env.DB;
  if (!db) throw new Error("Weapon import requires the DB binding");
  await db.prepare("CREATE TABLE IF NOT EXISTS content_imports (id TEXT PRIMARY KEY, imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  if (await db.prepare("SELECT id FROM content_imports WHERE id = ?").bind(release).first()) return;
  const statements = SPECIAL_WEAPONS.map((weapon) => db.prepare(`
    INSERT INTO posts (id, slug, type, title, summary, content, read_time, accent, published, sort_order, author_id)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (SELECT 1 FROM content_imports WHERE id = ?)
      AND NOT EXISTS (SELECT 1 FROM posts WHERE id = ? OR slug = ? OR title COLLATE NOCASE IN (${weapon.aliases.map(() => "?").join(",")}))
    ON CONFLICT DO NOTHING
  `).bind(weapon.id, weapon.slug, weapon.type, weapon.title, weapon.summary, weapon.content, weapon.readTime, weapon.accent, 1, weapon.sortOrder, "site-owner", release, weapon.id, weapon.slug, ...weapon.aliases));
  statements.push(db.prepare("INSERT INTO content_imports (id) VALUES (?) ON CONFLICT DO NOTHING").bind(release));
  await db.batch(statements);
}
