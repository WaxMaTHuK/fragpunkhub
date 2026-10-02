import { russianText } from "./russian-content";
import { DEFAULT_WEAPON_FIELDS, makeWeaponContent } from "./weapon-content";

// Confirmed game assets: https://fragpunkskins.com/weapons (GW003, GW002).
// Kerplunk is also named in the official August 27, 2026 patch notes.
const imageRoot = "https://raw.githubusercontent.com/WaxMaTHuK/fragpunkhub/main/public/images/weapons/";
export const SPECIAL_WEAPONS = [
  {
    id: "weapon-special-bow", slug: "luk-bow", title: "Лук", aliases: ["Лук", "Bow"],
    summary: "Специальное оружие, стреляющее стрелами.", image: "bow.png",
    description: "Лук (Bow) — специальное оружие FragPunk. Его доступность зависит от игрового режима и действующих фрагментов карты. Изображение взято из игровых файлов. Числовые характеристики пока не подтверждены.",
  },
  {
    id: "weapon-special-kerplunk", slug: "granatomyot-kerplunk", title: "Гранатомёт (Kerplunk)", aliases: ["Гранатомёт", "Гранатомет", "Гранатомёт (Kerplunk)", "Kerplunk", "Grenade Launcher"],
    summary: "Специальное оружие с взрывными снарядами.", image: "grenade-launcher.png",
    description: "Гранатомёт (Kerplunk / Grenade Launcher) — специальное оружие FragPunk. Его доступность и эффекты зависят от игрового режима и действующих фрагментов карты. Например, фрагмент Frozen Kerplunk даёт модификацию с замораживающими гранатами, наносящими взрывной урон и замедляющими противников. Числовые характеристики пока не подтверждены.",
  },
].map((weapon, index) => ({
  ...weapon,
  title: russianText(weapon.title), summary: russianText(weapon.summary),
  type: "weapon" as const, readTime: "2 мин", accent: index === 0 ? "cyan" : "purple",
  published: true, sortOrder: 1100 + index,
  content: makeWeaponContent({ ...DEFAULT_WEAPON_FIELDS, category: "special", image: imageRoot + weapon.image, description: russianText(weapon.description) }),
}));
