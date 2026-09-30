import { isAdminRequest } from "@/app/admin-auth";
import { seedWeaponCatalog } from "@/lib/weapon-catalog";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  if (!(await isAdminRequest(request))) return Response.json({ error: "Сессия истекла. Войди в редактор снова." }, { status: 401 });
  try { return Response.json(await seedWeaponCatalog()); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Не удалось импортировать оружие" }, { status: 500 }); }
}
