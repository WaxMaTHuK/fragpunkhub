import { env } from "cloudflare:workers";
import { russianText } from "@/lib/russian-content";
import { parseWeaponContent, makeWeaponContent } from "@/lib/weapon-content";
import { parseLancerContent, makeLancerContent } from "@/lib/lancer-models";
const release = "2026-10-02-russian-catalog-v1";
let pending: Promise<void> | undefined;
export function ensureRussianRefresh() {
 return pending ??= refresh().catch(error => { pending = undefined; throw error; });
}
async function refresh() {
 const db = env.DB;
 await db.prepare("CREATE TABLE IF NOT EXISTS content_imports (id TEXT PRIMARY KEY, imported_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 if (await db.prepare("SELECT id FROM content_imports WHERE id = ?").bind(release).first()) return;
 type Row = {id: string; title: string; summary: string; content: string; type: string};
 const {results} = await db.prepare("SELECT id, title, summary, content, type FROM posts").all<Row>();
 const changes = results.flatMap((row: Row) => {
  const title = russianText(row.title), summary = russianText(row.summary);
  let content = row.content;
  if (row.type === "weapon") {
   const fields = parseWeaponContent(content); fields.description = russianText(fields.description); content = makeWeaponContent(fields);
  } else if (row.type === "lancer") {
   const fields = parseLancerContent(content); fields.description = russianText(fields.description); fields.skins = fields.skins.map(skin => ({...skin, name:russianText(skin.name)})); content = makeLancerContent(fields);
  } else {
   // Preserve media URLs and editor mode metadata exactly.
   content = content.split("\n").map(line => /^\s*(?:https?:\/\/|\[shard-modes\])/.test(line) ? line : russianText(line)).join("\n");
  }
  if (title === row.title && summary === row.summary && content === row.content) return [];
  return [db.prepare("UPDATE posts SET title = ?, summary = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND content = ? AND title = ? AND summary = ? AND NOT EXISTS (SELECT 1 FROM content_imports WHERE id = ?)").bind(title,summary,content,row.id,row.content,row.title,row.summary,release)];
 });
 changes.push(db.prepare("INSERT INTO content_imports (id) VALUES (?) ON CONFLICT DO NOTHING").bind(release)); await db.batch(changes);
}
