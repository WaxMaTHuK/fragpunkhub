"use client";
import { useMemo, useState } from "react";
import catalog from "@/lib/shard-catalog.json";
import { SHARD_MODES, shardModes } from "@/lib/shard-modes";
import type { HubPost } from "@/lib/hub-content";
import { uploadedImageUrl } from "@/lib/video";
type Card = { name: string; image: string; description: string; modes: Partial<Record<string, {status: string; date: string}>>; href?: string };
export function ShardBrowser({ posts }: { posts: HubPost[] }) {
 const [mode, setMode] = useState("standard"), [query, setQuery] = useState(""), [archive, setArchive] = useState(false);
 const cards = useMemo(() => {
  const data: Card[] = catalog;
  const merged = new Map(data.map(card => [card.name.toLowerCase(), card]));
  for (const post of posts) {
   const modes = shardModes(post.content); if (!modes.length) continue;
   const lines = post.content.split("\n").filter(line => !line.startsWith("[shard-modes]"));
   merged.set(post.title.toLowerCase(), { name: post.title, image: lines.find(uploadedImageUrl) || "", description: post.summary, modes: Object.fromEntries(modes.map(id => [id, {status: "added", date: "Редактор"}])), href: `/materials/${post.slug}` });
  }
  return [...merged.values()];
 }, [posts]);
 const selected = SHARD_MODES.find(item => item.id === mode);
 const visible = cards.filter(card => (mode === "catalog" ? true : card.modes[mode]?.status === (archive ? "removed" : "added")) && `${card.name} ${card.description}`.toLowerCase().includes(query.toLowerCase().trim()));
 return <><div className="filter-row shard-mode-tabs" aria-label="Режим игры">{SHARD_MODES.map(item => <button className={`filter-chip ${mode === item.id ? "active" : ""}`} type="button" aria-pressed={mode === item.id} key={item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}<button type="button" className={`filter-chip ${mode === "catalog" ? "active" : ""}`} onClick={() => setMode("catalog")}>Справочник · {cards.length}</button></div><p className="shard-mode-note">{selected?.note || "Общий справочник названий. Наличие в справочнике не означает доступность в выбранном режиме. Английские названия сохранены для точного поиска в игре."}</p><div className="shard-tools"><input aria-label="Поиск фрагмента" placeholder="Найти фрагмент…" value={query} onChange={event => setQuery(event.target.value)} />{mode !== "catalog" && <label><input type="checkbox" checked={archive} onChange={event => setArchive(event.target.checked)} /> Показать удалённые из режима</label>}<span>{visible.length} фрагментов</span></div>{visible.length ? <section className="shard-catalog-grid">{visible.map(card => <article key={card.name} className="shard-catalog-card">{card.image && <img loading="lazy" src={card.image} alt={card.name} onError={event => { event.currentTarget.style.display = "none"; }} />}<div><h2>{card.href ? <a href={card.href}>{card.name}</a> : card.name}</h2><p>{card.description || "Описание эффекта уточняется."}</p>{mode !== "catalog" && <small>{archive ? "Удалён из режима" : "Добавление подтверждено"} · {card.modes[mode]?.date}</small>}</div></article>)}</section> : <div className="empty-card"><strong>{query ? "Ничего не найдено" : archive ? "Подтверждённых удалений пока нет" : "Полный набор ещё уточняется"}</strong><p>Фрагменты из других режимов сюда автоматически не переносятся.</p></div>}</>;
}
