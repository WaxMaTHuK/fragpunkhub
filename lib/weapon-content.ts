export type WeaponRange = "close" | "medium" | "long";
export type WeaponStyle = "aggressive" | "balanced" | "careful";
export type WeaponControl = "easy" | "medium" | "hard";
export type WeaponRole = "entry" | "support" | "universal";
export type WeaponFireMode = "automatic" | "burst" | "single";

export type WeaponFields = {
  image: string;
  description: string;
  video: string;
  lancers: string[];
  range: WeaponRange;
  style: WeaponStyle;
  control: WeaponControl;
  role: WeaponRole;
  fireMode: WeaponFireMode;
};

const META_PREFIX = "[weapon-meta]";
const imagePattern = /^https:\/\/(raw\.githubusercontent\.com|[^\s]+)\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i;
const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;

export const DEFAULT_WEAPON_FIELDS: WeaponFields = {
  image: "", description: "", video: "", lancers: [], range: "medium",
  style: "balanced", control: "easy", role: "universal", fireMode: "automatic",
};

export function parseWeaponContent(content: string): WeaponFields {
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  const metaLine = lines.find((line) => line.startsWith(META_PREFIX));
  let meta: Partial<WeaponFields> = {};
  if (metaLine) {
    try { meta = JSON.parse(metaLine.slice(META_PREFIX.length)); } catch { meta = {}; }
  }
  const plainLines = lines.filter((line) => line !== metaLine);
  const images = plainLines.filter((line) => imagePattern.test(line));
  return {
    ...DEFAULT_WEAPON_FIELDS,
    ...meta,
    image: meta.image || images[0] || "",
    lancers: Array.isArray(meta.lancers) ? meta.lancers : images.slice(1),
    video: meta.video || plainLines.find((line) => youtubePattern.test(line)) || "",
    description: meta.description || plainLines.filter((line) => !imagePattern.test(line) && !youtubePattern.test(line)).join("\n"),
  };
}

export function makeWeaponContent(fields: WeaponFields): string {
  return `${META_PREFIX}${JSON.stringify(fields)}`;
}
