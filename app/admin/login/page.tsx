import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { hasAdminSession, isAdminAuthConfigured } from "../../admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasAdminSession()) redirect("/admin");
  const { error } = await searchParams;
  const configured = isAdminAuthConfigured();

  return <main className="admin-login-page">
    <section className="admin-login-card">
      <a className="admin-login-brand" href="/"><span className="brand-mark" aria-hidden="true" /><span><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a>
      <div className="admin-login-icon"><LockKeyhole /></div>
      <p className="eyebrow">Вход владельца</p>
      <h1>Редактор сайта</h1>
      <p className="admin-login-copy">Введите пароль, чтобы создавать и обновлять материалы.</p>
      {configured ? <form action="/api/admin/login" method="post" className="admin-login-form">
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" minLength={12} required autoComplete="current-password" autoFocus />
        <button type="submit">Войти в редактор</button>
      </form> : <div className="admin-login-notice">Вход ещё не настроен. Добавьте секреты владельца в настройках Cloudflare.</div>}
      {error === "invalid" && <div className="admin-login-error" role="alert">Неверный пароль. Попробуйте ещё раз.</div>}
      <a className="admin-login-back" href="/">← Вернуться на сайт</a>
    </section>
  </main>;
}
