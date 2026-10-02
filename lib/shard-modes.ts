export const SHARD_MODES = [
  { id: "ranked", label: "Рейтинговый", note: "Отдельный пул рейтинга. Подтверждённые исключения показаны в архиве; полный актуальный набор ещё уточняется." },
  { id: "standard", label: "Стандартный бой", note: "Shard Clash. Подтверждённые изменения пула; полный актуальный набор ещё уточняется." },
  { id: "chaos", label: "Хаотичный бой", note: "Chaos Clash. Пул проверяется отдельно от стандартного боя." },
  { id: "deathmatch", label: "Бой насмерть", note: "Deathmatch. Подтверждённые изменения, включая обновление от 27 августа 2026." },
  { id: "outbreak", label: "Вспышка · Outbreak", note: "Режим с паразитами. Отдельный пул, не объединённый с PvE." },
  { id: "toy", label: "PvE · Игрушечное наступление", note: "Toy Front Line. Полный набор и уровни PvE-фрагментов ещё уточняются." },
  { id: "endless", label: "PvE · Выживание", note: "Бесконечный режим Toy Front Line. Фрагменты выпадают во время игры и улучшаются объединением. Полный набор ещё уточняется." },
  { id: "deck", label: "Deck Gear Up", note: "Отдельные колоды фракций. Полный состав ещё уточняется." },
  { id: "other", label: "Другие режимы", note: "Горячая зона, захват ядра, зеркальный бой и временные режимы: актуальные наборы проверяются отдельно." },
] as const;
export type ShardMode = typeof SHARD_MODES[number]["id"];
export function shardModes(content: string): ShardMode[] {
 const line = content.split("\n").find(line => line.startsWith("[shard-modes]"));
 try { const data = JSON.parse(line?.slice(13) || "[]"); return Array.isArray(data) ? data.filter(id => SHARD_MODES.some(mode => mode.id === id)) : []; } catch { return []; }
}
