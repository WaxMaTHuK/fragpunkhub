import { withoutSources } from "./content-display";
const replacements: Record<string, string> = {
 "Goddard’s Vengeance": "Месть Годдарда", "Smokestack Lightning": "Дымовая завеса", "Cherry Bomb": "Вишнёвая бомба",
 "Chug Chug": "Чух-чух", "The Wall": "Стена", "Mr. PewPew": "Мистер Пиу-пиу", "Meteora": "Метеора", "Paparazzi": "Папарацци",
 "Live Wire": "Под напряжением", "Electric Avenue": "Электрическое поле", "I Can See for Miles": "Дальнее зрение",
 "Fast Lane": "Быстрый рывок", "Hothead": "Горячая голова", "Ashes to Ashes": "Пепел к пеплу",
 "Station to Station": "Телепортационный маяк", "Gold Dust Woman": "Золотая пыль", "Dilemma": "Дилемма",
 "Emotional Rescue": "Лечебная помощь", "Shroom Wall": "Грибная стена", "Killer Queen": "Ядовитая ловушка",
 "Midnight Rambler": "Ночная невидимость", "Fade Away": "Зона скрытности", "Get Back": "Возвращение",
 "Hello, Goodbye": "Поиск противников", "Misery Angel": "Ангел страдания", "Walk On The Wild Side": "Уход в Пустоту",
 "Electric Guitar": "Электрогитара", "Sticky Fingers": "Липкие гранаты", "Super Freak": "Защита от ослепления",
 "Teleporter": "Телепорт", "Spirited Away": "Принудительное перемещение", "Spider Web": "Паутина",
 "Echolocation": "Эхолокация", "Sonic Surge": "Звуковая волна", "Sound of Silence": "Тихое перемещение",
 "Chomper": "Чомпер", "Explosive Bait": "Взрывная приманка", "Smoking Bait": "Дымовая приманка",
 "Cloning Incarnation": "Управляемый клон", "Mimic Trap": "Ловушка-двойник", "Shield Scales": "Защитная чешуя",
 "Cyclonic Storm": "Циклон", "Branching Lightning": "Ослепляющая молния", "Heroic Onslaught": "Героический прорыв",
 "Soul Beacon": "Маяк души", "Soul Guardian": "Защитник души", "Harmonic Tide": "Музыкальная волна",
 "Fight In a Cage": "Бой в клетке", "Gladiator": "Гладиатор", "Spear of Kukulkan": "Копьё Кукулькана", "Spear Of Kukulkan": "Копьё Кукулькана",
 "Thieves Like Us": "Мираж воровки", "Shadowplay": "Игра теней", "Boom Boom": "Взрывное оглушение",
 "Blowin’ in the Wind": "Рывок ветра", "Blade of Broken Dreams": "Ветряные клинки", "Gimme Shelter": "Ветряной щит",
 "Spray Paint": "Краска", "Wonderwall": "Одностороннее укрытие", "Coat of Many Colors": "Добавочное здоровье",
 "Bloodbane": "Кровавый ресурс", "Sympathy for the Devil": "Лечение за ресурс", "Angel of Death": "Ангел смерти", "Barbed Wire Kisses": "Колючая заросль",
 "Standard Blitzer": "Вихререз", "Standard Striker": "Рассекатель", "Bad Moon-S": "Кровавая луна (с глушителем)", "Mad Dog-S": "Бешеный пёс (с глушителем)",
 "Bad Reputation": "Плохая репутация", "Ghost Pepper": "Призрачный перец", "Cold Shoulder": "Безразличие", "Boom Broom": "Взрывной осколок", "Meat Maker": "Мясник", "Meat Marker": "Мясник", "Cure-All": "Панацея", "Highlife": "Весёлая жизнь", "My Way": "Первопроходец", "Discipline": "Дисциплина", "Fever": "Лихорадка", "Clampdown": "Подавление", "Resolver": "Разрушитель", "Smoker": "Дымовик", "Burner": "Поджигатель", "Flasher": "Светлячок", "Blaster": "Бластер", "Vicious": "Злоба", "Blitzer": "Вихререз", "Striker": "Рассекатель",
 "Frozen Kerplunk": "Замороженный гранатомёт", "Grenade Launcher": "Гранатомёт", "Kerplunk": "Гранатомёт", "Bow": "Лук",
 "Hollowpoint": "Холлоупойнт", "Pathojen": "Патоген", "Counterfeit": "Кейфи", "Windwalker": "Ветерок", "Wildstyle": "Вайлдстайл", "Calamity": "Каламити", "Hurricane": "Ураган", "Corona": "Корона", "Nitro": "Нитро", "Serket": "Серкет", "Broker": "Брокер", "Jaguar": "Ягуар", "Ixchel": "Ишчель", "Chum": "Чам", "Dex": "Дэкс", "Zephyr": "Зефир", "Aura": "Аура", "Kismet": "Кисмет", "Axon": "Аксон", "Spider": "Спайдер", "Sonar": "Сонар",
 "Shard Clash": "Бой фрагментов", "Chaos Clash": "Хаотичный бой", "Outbreak": "Эпидемия", "Toy Front Line": "Игрушечное наступление", "Endless Mode": "Выживание", "Deathmatch": "Бой насмерть", "Deck Gear Up": "Снаряжение колоды", "Hot Zone": "Захват точек", "Capture The Core": "Захват ядра", "Prop Hunt": "Прятки", "Mirror Clash": "Зеркальный бой", "Blitz Ballet": "Блиц-балет",
 "S-тир": "Высший уровень", "A-тир": "Сильный выбор", "B-тир": "Ситуативный выбор", "C-тир": "Для своего стиля", "KD": "соотношение убийств и смертей", "PvE": "Бой против окружения", "FragPunk": "ФрагПанк",
};
const pairs = Object.entries(replacements).sort((a,b) => b[0].length - a[0].length);
export function russianText(text: string): string {
 let value = withoutSources(text);
 for (const [english, russian] of pairs) value = value.split(english).join(russian);
 return value.replace(/\s*\((?:Dex|Hurricane|Aura|Ixchel|Counterfeit|Windwalker|Wildstyle|Calamity|Bow|Kerplunk|Grenade Launcher)\)/g, "")
  .replace(/\((Дэкс|Ураган|Аура|Ишчель|Кейфи|Ветерок|Вайлдстайл|Каламити|Лук)\)/g, "")
  .replace(/Гранатомёт\s*\(Гранатомёт(?: \/ Гранатомёт)?\)/g, "Гранатомёт")
  .replace(/Лук\s*\(Лук\)/g, "Лук")
  .replace(/\(S\)/g, "(с глушителем)")
  .replace(/Изображение взято из игровых файлов\.?\s*/g, "").trim();
}
