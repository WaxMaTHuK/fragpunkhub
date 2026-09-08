"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TYPE_LABELS, type HubPost, type PostType } from "@/lib/hub-content";
import { parseWeaponContent } from "@/lib/weapon-content";

const filters: { value: "all" | PostType; label: string }[] = [
  { value: "all", label: "Все" }, { value: "lancer", label: "Лансеры" }, { value: "weapon", label: "Оружие" },
  { value: "shard", label: "Фрагмент карты" }, { value: "map", label: "Карты" }, { value: "update", label: "Патчи" },
];
const categoryCards: { type: PostType; code: string; title: string; copy: string }[] = [
  { type: "lancer", code: "L", title: "Лансеры", copy: "Способности и советы" },
  { type: "weapon", code: "W", title: "Оружие", copy: "Характеристики и выбор" },
  { type: "shard", code: "S", title: "Фрагмент карты", copy: "Комбинации и тактика" },
  { type: "map", code: "M", title: "Карты", copy: "Точки и раскидки" },
];

function weaponPreview(post: HubPost) {
  if (post.type !== "weapon") return "";
  if (post.slug === "мясник-1fe0ee") return "https://raw.githubusercontent.com/WaxMaTHuK/fragpunkhub/main/public/images/weapons/myasnik.png";
  return parseWeaponContent(post.content).image;
}

export function HubClient({ initialPosts, storageUnavailable = false }: { initialPosts: HubPost[]; storageUnavailable?: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | PostType>("all");
  const visiblePosts = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ru-RU");
    return initialPosts.filter((post) => (filter === "all" || post.type === filter) && (!needle || `${post.title} ${post.summary} ${post.content}`.toLocaleLowerCase("ru-RU").includes(needle)));
  }, [filter, initialPosts, query]);

  return <div className="site-shell">
    <header className="site-header"><div className="wrap header-row">
      <a className="brand" href="#top" aria-label="FragPunk Hub — на главную"><span className="brand-mark" aria-hidden="true" /><span className="brand-text"><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a>
      <nav className="main-nav" aria-label="Основная навигация"><a href="#materials">Материалы</a><a className="admin-link" href="/admin"><ShieldCheck size={17} /> Редактор</a></nav>
    </div></header>
    <main className="wrap main-content" id="top">
      {storageUnavailable && <div className="storage-notice">Материалы временно показаны из резервной копии. Редактирование скоро снова будет доступно.</div>}
      <section className="hero-grid">
        <div className="finder-card"><p className="eyebrow">Русская база знаний</p><h1>Играй <span>умнее</span></h1><p className="hero-copy">Лансеры, оружие, фрагмент карты и понятные гайды без лишней воды.</p><label className="search-box"><span className="sr-only">Поиск по базе</span><Search size={21} aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти лансера, оружие или гайд…" /></label></div>
        <aside className="season-card"><div className="season-status"><span /> Сейчас в игре</div><div className="season-copy"><h2>Shard Voyagers</h2><p>Сезон 6, глава 1. Новый этап начался 27 августа.</p><a href="https://www.fragpunk.com/news/" target="_blank" rel="noreferrer">Официальная новость <ArrowUpRight size={16} /></a></div></aside>
      </section>
      <section className="section-block" id="sections"><div className="section-title"><div><h2>Выбери раздел</h2><p>Самое нужное — в один клик.</p></div></div><div className="category-grid">
        {categoryCards.map((category) => category.type === "shard" ? <a key={category.type} className={`category-card accent-${category.type}`} href="/shard-cards"><span className="category-code">{category.code}</span><span><strong>{category.title}</strong><small>{category.copy}</small></span></a> : <Button key={category.type} type="button" className={`category-card accent-${category.type}`} onClick={() => { setFilter(category.type); document.querySelector("#materials")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-code">{category.code}</span><span><strong>{category.title}</strong><small>{category.copy}</small></span></Button>)}
      </div></section>
      <section className="section-block" id="materials"><div className="section-title"><div><h2>Материалы</h2><p>{query ? `Результаты по запросу «${query}»` : "Подборка для быстрого старта"}</p></div><span>{visiblePosts.length} материалов</span></div>
        <div className="filter-row" aria-label="Фильтр материалов">{filters.map((item) => <Button key={item.value} type="button" variant="outline" className={filter === item.value ? "filter-chip active" : "filter-chip"} onClick={() => setFilter(item.value)}>{item.label}</Button>)}</div>
        {visiblePosts.length ? <div className="post-grid">{visiblePosts.map((post) => { const preview = weaponPreview(post); return <a key={post.id} className={`post-card color-${post.accent}${preview ? " has-preview" : ""}`} href={`/materials/${post.slug}`}><span className="post-arrow"><ArrowUpRight size={17} /></span><span className="post-meta"><b>{TYPE_LABELS[post.type]}</b><i>·</i>{post.readTime}</span><strong>{post.title}</strong><small>{post.summary}</small>{preview ? <img className="post-weapon-preview" src={preview} alt="" /> : <span className="post-letter" aria-hidden="true">{post.title.charAt(0)}</span>}</a>; })}</div> : <div className="empty-card"><Zap /><strong>Ничего не найдено</strong><p>Попробуй другой запрос или выбери все материалы.</p></div>}
      </section>
    </main>
    <footer><div className="wrap footer-row"><p>Неофициальный русскоязычный информационный портал. FragPunk и связанные материалы принадлежат их правообладателям.</p><strong>Проект <span>WaxMaTHuK</span></strong></div></footer>
  </div>;
}
