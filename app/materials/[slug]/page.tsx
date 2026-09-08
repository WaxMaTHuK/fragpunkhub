import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { listPosts } from "@/db/content";
import { DEFAULT_POSTS, TYPE_LABELS, type HubPost } from "@/lib/hub-content";
import { uploadedImageUrl, youtubeEmbedUrl } from "@/lib/video";
import { parseWeaponContent, WEAPON_FIRE_MODE_LABELS, type WeaponFields } from "@/lib/weapon-content";

export const dynamic = "force-dynamic";
async function getPost(slug: string): Promise<HubPost | undefined> { try { return (await listPosts(false)).find((post) => post.slug === slug); } catch { return DEFAULT_POSTS.map((post) => ({ ...post, updatedAt: new Date(0).toISOString() })).find((post) => post.slug === slug); } }

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug); if (!post) notFound();
  const weapon = post.type === "weapon" ? parseWeaponContent(post.content) : null; const content = weapon?.description || post.content;
  return <div className="site-shell"><header className="site-header"><div className="wrap header-row"><a className="brand" href="/" aria-label="FragPunk Hub — на главную"><span className="brand-mark" aria-hidden="true" /><span className="brand-text"><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a><nav className="main-nav" aria-label="Основная навигация"><a href="/#materials">Материалы</a><a href="/#sections">Разделы</a><a className="admin-link" href="/admin"><ShieldCheck size={17} /> Редактор</a></nav></div></header><main className="wrap material-page"><a className="back-link" href="/#materials"><ArrowLeft size={16} /> Все материалы</a><article className={`material-article accent-${post.accent}`}>
    {weapon && <div className="weapon-overview">{weapon.image ? <figure className="article-image weapon-hero-image"><img src={weapon.image} alt={post.title} /></figure> : <div className="weapon-hero-placeholder">Изображение оружия</div>}<WeaponStats weapon={weapon} /></div>}
    <div className="material-meta"><span>{TYPE_LABELS[post.type]}</span><i>·</i><span>{post.readTime}</span></div><h1>{post.title}</h1><p className="material-summary">{post.summary}</p>{weapon && weapon.lancers.length > 0 && <div className="lancer-match"><strong>Подходит лансерам</strong><div className="lancer-avatars">{weapon.lancers.map((image) => <img src={image} alt="Подходящий лансер" key={image} />)}</div></div>}
    <div className="article-body">{content.split("\n").filter(Boolean).map((paragraph, index) => { const line = paragraph.trim(); const videoUrl = youtubeEmbedUrl(line); const imageUrl = uploadedImageUrl(line); return videoUrl ? <div className="video-embed" key={index}><iframe src={videoUrl} title={`Видео: ${post.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : imageUrl ? <figure className="article-image" key={index}><img src={imageUrl} alt={`Иллюстрация: ${post.title}`} /></figure> : <p key={index}>{paragraph}</p>; })}{weapon?.video && youtubeEmbedUrl(weapon.video) && <div className="video-embed"><iframe src={youtubeEmbedUrl(weapon.video)!} title={`Видео: ${post.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>}</div><a className="material-back" href="/#materials">К материалам <ArrowUpRight size={16} /></a>
  </article></main><footer><div className="wrap footer-row"><p>Неофициальный русскоязычный информационный портал. FragPunk и связанные материалы принадлежат их правообладателям.</p><strong>Проект <span>WaxMaTHuK</span></strong></div></footer></div>;
}

function WeaponStats({ weapon }: { weapon: WeaponFields }) {
  const damage = [{ label: "Голова", values: weapon.damageHead }, { label: "Корпус", values: weapon.damageBody }, { label: "Конечности", values: weapon.damageLimbs }];
  const details = [["Стрельба", WEAPON_FIRE_MODE_LABELS[weapon.fireMode]], ["Магазин", [weapon.magazine, weapon.reserveAmmo].filter(Boolean).join(" / ")], ["Задержка при смене", weapon.equipTime], ["Приседание", weapon.crouchSpeed], ["Ходьба", weapon.walkSpeed], ["Бег", weapon.runSpeed], ["Скорострельность", weapon.fireRate], ["Приближение", weapon.zoom], ["Вход в прицел", weapon.adsTime]].filter((item) => item[1]);
  return <aside className="weapon-stats"><h2>Характеристики</h2><div className="damage-table"><div className="damage-head"><span>Урон</span><b>0–10 м</b><b>10–25 м</b><b>25–60 м</b></div>{damage.map((row) => <div className="damage-row" key={row.label}><strong>{row.label}</strong>{row.values.map((value, index) => <span key={index}>{value || "—"}</span>)}</div>)}</div><div className="weapon-stat-grid">{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></aside>;
}
