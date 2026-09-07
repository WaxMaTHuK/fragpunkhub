export const POST_TYPES = ["lancer", "weapon", "shard", "map", "update"] as const;
export type PostType = (typeof POST_TYPES)[number];

export type HubPost = {
  id: string;
  slug: string;
  type: PostType;
  title: string;
  summary: string;
  content: string;
  readTime: string;
  accent: string;
  published: boolean;
  sortOrder: number;
  updatedAt: string;
};

export const TYPE_LABELS: Record<PostType, string> = {
  lancer: "Лансер",
  weapon: "Оружие",
  shard: "Осколки",
  map: "Карты",
  update: "Патч",
};

export const DEFAULT_POSTS: Omit<HubPost, "updatedAt">[] = [
  { id: "tier-list-september-2026", slug: "tier-list-september-2026", type: "lancer", title: "Тир-лист лансеров — сентябрь 2026", summary: "Редакторский рейтинг лансеров: обновляй после патчей и новых героев.", content: "S-тир: Corona, Hollowpoint, Serket\n\nA-тир: Nitro, Kismet, Axon\n\nB-тир: Pathojen, Spider, Zephyr\n\nC-тир: Broker\n\nЭто рабочая версия тир-листа. Меняй места лансеров после патчей, своего опыта и матчей сообщества.", readTime: "3 мин", accent: "acid", published: true, sortOrder: 5 },
  { id: "corona-guide", slug: "corona-guide", type: "lancer", title: "Корона: полный разбор", summary: "Способности, позиционка и советы для входа на точку.", content: "Разбор мобильности Короны, выбора позиции и безопасного выхода после агрессивного входа. Здесь можно разместить подробный гайд, игровые примеры и видео.", readTime: "5 мин", accent: "pink", published: true, sortOrder: 10 },
  { id: "first-weapon", slug: "first-weapon", type: "weapon", title: "Как выбрать первое оружие", summary: "Простой выбор без таблиц на десять экранов.", content: "Короткая схема выбора оружия под дистанцию, темп игры и уверенность в стрельбе. Сюда можно добавить точные характеристики и сравнения.", readTime: "4 мин", accent: "acid", published: true, sortOrder: 20 },
  { id: "shard-cards", slug: "shard-cards", type: "shard", title: "Карты осколков без хаоса", summary: "Что выбирать и как строить комбинации всей командой.", content: "Как быстро оценить предложенные правила раунда и выбрать карту, которая усиливает план команды. Дополняй материал своими комбинациями.", readTime: "7 мин", accent: "cyan", published: true, sortOrder: 30 },
  { id: "new-map-round", slug: "new-map-round", type: "map", title: "Первый раунд на новой карте", summary: "Базовый план для атаки и защиты.", content: "Где собрать информацию, как не растянуть команду и когда менять направление атаки. Позже сюда можно добавить схемы точек и раскидки.", readTime: "6 мин", accent: "purple", published: true, sortOrder: 40 },
  { id: "nitro-control", slug: "nitro-control", type: "lancer", title: "Нитро: контроль точки", summary: "Как подготовить защиту и не потратить всё слишком рано.", content: "Подготовка позиции, безопасная установка инструментов и сохранение ресурсов на ретейк. Материал можно редактировать из панели управления.", readTime: "5 мин", accent: "pink", published: true, sortOrder: 50 },
  { id: "patch-2026-09-02", slug: "patch-2026-09-02", type: "update", title: "Обновление от 2 сентября", summary: "Главное из свежих официальных заметок.", content: "Краткая русская выжимка официального обновления. Замени этот текст подробным переводом и отметь изменения, влияющие на матчи.", readTime: "3 мин", accent: "red", published: true, sortOrder: 60 },
];
