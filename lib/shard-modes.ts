export const SHARD_MODES = [
  { id: "standard", label: "Бой фрагментов: Стандартный" },
  { id: "capture-points", label: "Захват точек" },
  { id: "ranked", label: "Бой фрагментов: Рейтинговый" },
  { id: "chaos", label: "Хаотичный бой" },
  { id: "outbreak", label: "Эпидемия" },
  { id: "hide-and-seek", label: "Прятки" },
  { id: "team-standard", label: "Командный бой насмерть: Стандарт" },
  { id: "team-chaos", label: "Командный бой насмерть: Хаос" },
  { id: "kill-confirmed", label: "Подтверждение убийства" },
  { id: "deathmatch", label: "Бой насмерть" },
  { id: "team-deck", label: "Командный бой насмерть: Колода" },
  { id: "capture-core", label: "Захват ядра" },
  { id: "toy", label: "Игрушечное наступление" },
  { id: "endless", label: "Игрушечное наступление: Выживание" },
] as const;
export type ShardMode = typeof SHARD_MODES[number]["id"];
export function shardModes(content: string): ShardMode[] {
 const line = content.split("\n").find(line => line.startsWith("[shard-modes]"));
 try { const data = JSON.parse(line?.slice(13) || "[]"); return Array.isArray(data) ? data.filter(id => SHARD_MODES.some(mode => mode.id === id)) : []; } catch { return []; }
}
