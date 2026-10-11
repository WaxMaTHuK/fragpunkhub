import "@/app/tier-list/tier.css";
import { readTierList } from '@/db/tier-list';
import { TierBoard } from '@/components/tier-board';
export const dynamic='force-dynamic';
export const metadata={title:'Тир-лист лансеров | FragPunk Hub'};
export default async function TierListPage(){let value;try{value=await readTierList(true);}catch{return <main className="wrap tier-main"><a href="/">← На главную</a><h1>Тир-лист временно недоступен</h1><p>Попробуй открыть страницу позже.</p></main>;}return <div className="site-shell fp-tier-page"><header className="site-header"><div className="wrap header-row"><a className="brand" href="/">FRAGPUNK HUB</a><nav className="main-nav"><a href="/">На главную</a><a href="/admin/tier-list">Редактор</a></nav></div></header><main className="wrap tier-main"><p className="eyebrow">FRAGPUNK / LANCER RANKING</p><h1>{value.title}</h1>{value.published?<><div className="fp-tier-meta"><span>{value.mode}</span>{value.patch && <span>Патч {value.patch}</span>}<span>Мнение редакции</span></div><p>{value.description}</p><TierBoard value={value}/></>:<p>Рейтинг готовится. После публикации здесь появятся лансеры в рангах S, A, B, C и D.</p>}</main></div>;}

