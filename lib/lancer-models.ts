export type LancerSkin = { name: string; model: string };
export type LancerContent = { description: string; skins: LancerSkin[] };

const marker = /\n?<!-- lancer-skins:v1 ([\s\S]*?) -->\s*$/;

export function validModelUrl(url: string): boolean {
  if (/^\/models\/[a-z0-9/_\-.]+\.(glb|gltf)$/i.test(url)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && /\.(glb|gltf)$/i.test(parsed.pathname);
  } catch { return false; }
}

export function parseLancerContent(content: string): LancerContent {
  const match = content.match(marker);
  const description = content.replace(marker, "").trim();
  if (!match) return { description, skins: [] };
  try {
    const data: unknown = JSON.parse(match[1]);
    if (!Array.isArray(data)) return { description, skins: [] };
    const skins = data.filter((skin): skin is LancerSkin =>
      typeof skin === "object" && skin !== null &&
      typeof skin.name === "string" && typeof skin.model === "string");
    return { description, skins: skins.slice(0, 100) };
  } catch { return { description, skins: [] }; }
}

export function makeLancerContent({ description, skins }: LancerContent): string {
  const ready = skins.map((skin) => ({ name: skin.name.trim(), model: skin.model.trim() }))
    .filter((skin) => skin.name || skin.model);
  return `${description.trim()}${ready.length ? `\n\n<!-- lancer-skins:v1 ${JSON.stringify(ready)} -->` : ""}`;
}
