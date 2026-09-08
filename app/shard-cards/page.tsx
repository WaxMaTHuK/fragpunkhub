import { listPosts } from "@/db/content";
import { DEFAULT_POSTS } from "@/lib/hub-content";
import { uploadedImageUrl, youtubeEmbedUrl } from "@/lib/video";

export const dynamic = "force-dynamic";

export default async function ShardCardsPage() {
  let cards = DEFAULT_POSTS.filter((post) => post.type === "shard");
  try {
    cards = (await listPosts(false)).filter((post) => post.type === "shard");
  } catch {}

  return <div className="site-shell"><header className="site-header"><div className="wrap header-row"><a className="brand" href="/" aria-label="FragPunk Hub — на главную"><span className="brand-mark" aria-hidden="true" /><span className="brand-text"><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a><nav className="main-nav"><a href="/">На главную</a><a className="admin-link" href="/admin">Редактор</a></nav></div></header><main className="wrap shard-page"><p className="eyebrow">База знаний FragPunk</p><h1>Фрагмент карты</h1><p className="shard-intro">Эффекты карточек, лучшие сочетания с лансерами и примеры применения в раунде.</p>{cards.length ? <section className="shard-list">{cards.map((card) => {
    const lines = card.content.split("\n").map((line) => line.trim()).filter(Boolean);
    const images = lines.filter(uploadedImageUrl);
    const video = lines.find(youtubeEmbedUrl);
    const text = lines.filter((line) => !uploadedImageUrl(line) && !youtubeEmbedUrl(line));
    return <article className="shard-entry" key={card.id}><div className="shard-visual"><div className="shard-main-image">{images[0] ? <img src={images[0]} alt={card.title} /> : <span>Добавь изображение фрагмент карты<br />в редакторе</span>}</div>{images.length > 1 && <div className="lancer-match"><strong>Подходит лансерам</strong><div className="lancer-avatars">{images.slice(1).map((image) => <img key={image} src={image} alt="Подходящий лансер" />)}</div></div>}</div><div className="shard-details"><span className="post-meta"><b>ФРАГМЕНТ КАРТА</b><i>·</i>{card.readTime}</span><h2>{card.title}</h2><p className="shard-summary">{card.summary}</p>{text.map((line, index) => <p key={index}>{line}</p>)}{video && <div className="video-embed"><iframe src={youtubeEmbedUrl(video)!} title={`Видео: ${card.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}</div></article>;
  })}</section> : <div className="empty-card"><strong>В разделе пока нет карточек</strong><p>Создай материал в редакторе и выбери раздел «Фрагмент карты».</p></div>}</main></div>;
}
