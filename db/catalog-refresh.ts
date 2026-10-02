import { env } from "cloudflare:workers";
import { BASE_WEAPON_IMAGES } from "@/lib/base-weapon-images";
import { withoutSources } from "@/lib/content-display";
import { parseWeaponContent, makeWeaponContent } from "@/lib/weapon-content";
import { parseLancerContent, makeLancerContent } from "@/lib/lancer-models";
const release = "2026-10-02-catalog-refresh-v1";
let pending: Promise<void> | undefined;
export function ensureCatalogRefresh() {
  return pending ??= refresh().catch(error => { pending = undefined; throw error; });
}
async function refresh() {
  const db = env.DB;
  await db.prepare("CREATE TABLE IF NOT EXISTS content_imports (id TEXT PRIMARY KEY, imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  if (await db.prepare("SELECT id FROM content_imports WHERE id = ?").bind(release).first()) return;
  const { results } = await db.prepare("SELECT id, type, title, content FROM posts").all<{id: string; type: string; title: string; content: string}>();
  const changes = results.flatMap((row: {id: string; type: string; title: string; content: string}) => {
    let type = row.type, content = row.content;
    if (type === "lancer" && (row.id === "nitro-control" || row.id === "tier-list-september-2026" || row.id === "corona-guide")) type = "guide";
    if (row.type === "weapon") {
      const fields = parseWeaponContent(content);
      fields.description = withoutSources(fields.description);
      fields.image = BASE_WEAPON_IMAGES[row.title] || fields.image;
      content = makeWeaponContent(fields);
    } else if (row.type === "lancer") {
      const fields = parseLancerContent(content);
      fields.description = withoutSources(fields.description);
      content = makeLancerContent(fields);
    }
    if (content === row.content && type === row.type) return [];
    // Compare original content to avoid overwriting simultaneous editor changes.
    return [db.prepare("UPDATE posts SET type = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND content = ? AND NOT EXISTS (SELECT 1 FROM content_imports WHERE id = ?)").bind(type, content, row.id, row.content, release)];
  });
  changes.push(db.prepare("INSERT INTO content_imports (id) VALUES (?) ON CONFLICT DO NOTHING").bind(release));
  await db.batch(changes);
}
