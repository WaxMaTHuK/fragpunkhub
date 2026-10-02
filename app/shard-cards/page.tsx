import { listPosts } from "@/db/content";
import { ShardBrowser } from "./shard-browser";
export const dynamic = "force-dynamic";
export default async function ShardCardsPage() {
 const cards = (await listPosts(false)).filter(post => post.type === "shard");
 return <div className="site-shell"><header className="site-header"><div className="wrap header-row"><a className="brand" href="/"><span className="brand-mark" /><span className="brand-text"><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a><nav className="main-nav"><a href="/">На главную</a><a href="/admin">Редактор</a></nav></div></header><main className="wrap shard-page"><p className="eyebrow">База знаний FragPunk</p><h1>Фрагменты по режимам</h1><p className="shard-intro">Выбери режим, чтобы посмотреть его фрагменты и исключения. Проверка полных актуальных наборов продолжается.</p><ShardBrowser posts={cards} /></main></div>;
}
