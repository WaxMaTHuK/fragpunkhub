import { ArrowLeft, ShieldCheck } from "lucide-react";

type Lancer = { name: string; role: string; initials: string; tone: string };
type Tier = { grade: string; label: string; description: string; lancers: Lancer[] };

const tiers: Tier[] = [
  {
    grade: "S", label: "Меняют ход раунда", description: "Сильны почти в любой ситуации",
    lancers: [
      { name: "Corona", role: "давление", initials: "C", tone: "pink" },
      { name: "Hollowpoint", role: "контроль", initials: "H", tone: "cyan" },
      { name: "Serket", role: "разведка", initials: "S", tone: "purple" },
    ],
  },
  {
    grade: "A", label: "Надёжный выбор", description: "Раскрываются в командной игре",
    lancers: [
      { name: "Nitro", role: "мобильность", initials: "N", tone: "acid" },
      { name: "Kismet", role: "информация", initials: "K", tone: "purple" },
      { name: "Axon", role: "инициация", initials: "A", tone: "pink" },
    ],
  },
  {
    grade: "B", label: "Ситуативно сильны", description: "Нужны карта, план и практика",
    lancers: [
      { name: "Pathojen", role: "поддержка", initials: "P", tone: "cyan" },
      { name: "Spider", role: "ловушки", initials: "S", tone: "acid" },
      { name: "Zephyr", role: "фланг", initials: "Z", tone: "purple" },
    ],
  },
  {
    grade: "C", label: "Для своего стиля", description: "Берите, когда знаете план на матч",
    lancers: [
      { name: "Broker", role: "защита", initials: "B", tone: "pink" },
    ],
  },
];

export const metadata = { title: "Тир-лист лансеров | FragPunk Hub" };

export default function TierListPage() {
  return <div className="site-shell tier-page">
    <header className="site-header"><div className="wrap header-row">
      <a className="brand" href="/" aria-label="FragPunk Hub — на главную"><span className="brand-mark" aria-hidden="true" /><span className="brand-text"><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a>
      <nav className="main-nav" aria-label="Основная навигация"><a href="/#materials">Материалы</a><a href="/#sections">Разделы</a><a className="tier-link active" href="/tier-list">Тир-лист</a><a className="admin-link" href="/admin"><ShieldCheck size={17} /> Редактор</a></nav>
    </div></header>
    <main className="wrap tier-main">
      <section className="tier-hero">
        <a className="back-link" href="/"><ArrowLeft size={16} /> На главную</a>
        <p className="eyebrow">Лансеры · версия 1</p>
        <h1>Тир-лист <span>FragPunk</span></h1>
        <p>Первый рейтинг для обычных и рейтинговых матчей. Это мнение редакции: после патчей и новых лансеров список будет обновляться.</p>
      </section>
      <section className="tier-board" aria-label="Тир-лист лансеров">
        {tiers.map((tier) => <div className={`tier-row tier-${tier.grade.toLowerCase()}`} key={tier.grade}>
          <div className="tier-grade"><strong>{tier.grade}</strong><span>{tier.label}</span><small>{tier.description}</small></div>
          <div className="lancer-grid">
            {tier.lancers.map((lancer) => <article className={`lancer-tile tone-${lancer.tone}`} key={lancer.name}>
              <span className="lancer-mark" aria-hidden="true">{lancer.initials}</span>
              <span><strong>{lancer.name}</strong><small>{lancer.role}</small></span>
            </article>)}
          </div>
        </div>)}
      </section>
      <p className="tier-note">Список — отправная точка для выбора. Если лансер подходит вашей роли и команде, он может быть сильнее любого места в таблице.</p>
    </main>
    <footer><div className="wrap footer-row"><p>Неофициальный русскоязычный информационный портал. FragPunk и связанные материалы принадлежат их правообладателям.</p><strong>Проект <span>WaxMaTHuK</span></strong></div></footer>
  </div>;
}
