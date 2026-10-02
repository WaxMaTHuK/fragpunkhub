"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import catalog from "@/lib/shard-catalog.json";
import { SHARD_MODES, shardModes } from "@/lib/shard-modes";
import type { HubPost } from "@/lib/hub-content";
import { uploadedImageUrl } from "@/lib/video";
type Card = { id: string; name: string; image: string; description: string; modes: string[]; sprite?: {column: number; row: number; columns: number; rows: number}; href?: string };
function CardImage({card}: {card: Card}) {
 if (!card.sprite) return <img className="shard-single-image" loading="lazy" src={card.image} alt={card.name} />;
 const s = card.sprite;
 return <div className="shard-game-image" role="img" aria-label={`Фрагмент «${card.name}» из игры`} style={{ backgroundImage: `url("${card.image}")`, backgroundSize: `${s.columns * 100}% ${s.rows * 100}%`, backgroundPosition: `${s.column / (s.columns - 1) * 100}% ${s.row / (s.rows - 1) * 100}%` }} />;
}
export function ShardBrowser({ posts }: { posts: HubPost[] }) {
 const [mode, setMode] = useState("standard"), [query, setQuery] = useState("");
 const [selected, setSelected] = useState<Card | null>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => { if (selected) dialog.current?.showModal(); else dialog.current?.close(); }, [selected]);
 const cards = useMemo(() => {
  const data: Card[] = catalog;
  const merged = new Map(data.map(card => [card.name.toLocaleLowerCase("ru-RU"), card]));
  for (const post of posts) {
   const modes = shardModes(post.content); if (!modes.length) continue;
   const image = post.content.split("\n").find(uploadedImageUrl);
   const key = post.title.toLocaleLowerCase("ru-RU"); const old = merged.get(key);
   if (!image && !old?.image) continue;
   merged.set(key, {...old, id: post.id, name: post.title, image: image || old!.image, sprite: image ? undefined : old?.sprite, description: post.summary, modes, href: `/materials/${post.slug}`});
  }
  return [...merged.values()];
 }, [posts]);
 const visible = cards.filter(card => card.modes.includes(mode) && `${card.name} ${card.description}`.toLocaleLowerCase("ru-RU").includes(query.toLocaleLowerCase("ru-RU").trim()));
 const total = cards.filter(card => card.modes.includes(mode)).length;
 return <><div className="filter-row shard-mode-tabs" aria-label="Режим игры">{SHARD_MODES.map(item => <button className={`filter-chip ${mode === item.id ? "active" : ""}`} type="button" aria-pressed={mode === item.id} key={item.id} onClick={() => {setMode(item.id);setQuery("");}}>{item.label}</button>)}</div><div className="shard-mode-heading"><div><h2>{SHARD_MODES.find(item => item.id === mode)?.label}</h2><p>{mode === "standard" ? "228 фрагментов из коллекции игры · сезон 6, глава 1 · проверено 2 октября 2026" : "Отдельная коллекция фрагментов этого режима"}</p></div><span>{total} фрагментов</span></div><div className="shard-tools"><input aria-label="Поиск фрагмента" placeholder="Название или эффект…" value={query} onChange={event => setQuery(event.target.value)} />{query && <span>Найдено: {visible.length}</span>}</div>{visible.length ? <section className="shard-catalog-grid">{visible.map(card => <article key={card.id} className="shard-catalog-card"><button type="button" className="shard-image-button" onClick={() => setSelected(card)} aria-label={`Открыть карточку «${card.name}»`}><CardImage card={card} /><span>Увеличить</span></button><div><h3>{card.href ? <a href={card.href}>{card.name}</a> : card.name}</h3><p>{card.description}</p></div></article>)}</section> : <div className="empty-card"><strong>{query ? "Ничего не найдено" : "Карточки этого режима пока не добавлены"}</strong><p>{query ? "Попробуй другое название или часть описания." : "Фрагменты стандартного боя сюда не переносятся: для этого режима нужен отдельный список."}</p></div>}<dialog ref={dialog} className="shard-card-dialog" onClose={() => setSelected(null)} onClick={event => {if (event.target === event.currentTarget) setSelected(null);}}>{selected && <><button type="button" className="shard-dialog-close" onClick={() => setSelected(null)} aria-label="Закрыть карточку">×</button><CardImage card={selected} /><h2>{selected.name}</h2><p>{selected.description}</p></>}</dialog></>;
}
