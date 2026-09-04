import { adminSessionCookie, createAdminSessionToken, isAdminAuthConfigured, verifyAdminPassword } from "@/app/admin-auth";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) return new Response("Недопустимый источник запроса", { status: 403 });
  if (!isAdminAuthConfigured()) return new Response("Вход владельца не настроен", { status: 503 });

  const formData = await request.formData();
  const password = formData.get("password");
  if (typeof password !== "string" || !(await verifyAdminPassword(password))) {
    return Response.redirect(new URL("/admin/login?error=invalid", requestUrl), 303);
  }

  const token = await createAdminSessionToken();
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin",
      "Set-Cookie": adminSessionCookie(token),
      "Cache-Control": "no-store",
    },
  });
}
