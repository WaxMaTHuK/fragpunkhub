// Default game images supplement empty metadata; editor-selected images take precedence.
// New PNGs: FragPunk base skins, sourced from RyusAceVA/fragpunk-assets.
const assetRoot = "https://raw.githubusercontent.com/WaxMaTHuK/fragpunkhub/main/public/";
const images: Record<string, string> = {};

function register(path: string, ...names: string[]) {
  for (const name of names) images[normalize(name)] = assetRoot + path;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/[()]/g, "").replace(/\s+/g, " ");
}

register("weapons/beshenyy-pes-s.png", "Бешеный пёс (S)", "Mad Dog-S");
register("weapons/distsiplina.png", "Дисциплина", "Discipline");
register("weapons/likhoradka.png", "Лихорадка", "Fever");
register("weapons/podavlenie.png", "Подавление", "Clampdown");
register("weapons/prizrachnyy-perets.png", "Призрачный перец", "Ghost Pepper");
register("images/weapons/bad-moon-s.png", "Кровавая луна (S)", "Bad Moon-S");
register("images/weapons/bad-reputation.png", "Плохая репутация", "Bad Reputation");
register("images/weapons/highlife.png", "Весёлая жизнь", "Highlife");
register("images/weapons/my-way.png", "Первопроходец", "My Way");
register("images/weapons/resolver.png", "Разрушитель", "Resolver");
register("images/weapons/smoker.png", "Дымовик", "Smoker");
register("images/weapons/burner.png", "Поджигатель", "Burner");
register("images/weapons/flasher.png", "Светлячок", "Flasher");
register("images/weapons/myasnik.jpg", "Мясник", "Meat Maker");

export function resolveWeaponImage(title: string, selectedImage?: string | null): string {
  return selectedImage?.trim() || images[normalize(title)] || "";
}
