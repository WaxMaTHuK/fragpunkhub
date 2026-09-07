"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, FilePlus2, Link, Loader2, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TYPE_LABELS, type HubPost, type PostType } from "@/lib/hub-content";

type Draft = Omit<HubPost, "slug" | "updatedAt"> & { id: string };
function makeDraft(post?: HubPost): Draft { return post ? { id: post.id, type: post.type, title: post.title, summary: post.summary, content: post.content, readTime: post.readTime, accent: post.accent, published: post.published, sortOrder: post.sortOrder } : { id: "", type: "lancer", title: "", summary: "", content: "", readTime: "5 мин", accent: "purple", published: true, sortOrder: 100 }; }

export function AdminClient({ initialPosts, userName, signOutPath }: { initialPosts: HubPost[]; userName: string; signOutPath: string }) {
  const [posts, setPosts] = useState(initialPosts); const [draft, setDraft] = useState<Draft>(() => makeDraft(initialPosts[0])); const [saving, setSaving] = useState(false); const [message, setMessage] = useState("");
  const selected = useMemo(() => posts.find((post) => post.id === draft.id), [posts, draft.id]);
  function choose(post: HubPost) { setDraft(makeDraft(post)); setMessage(""); }
  function update<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => ({ ...current, [key]: value })); setMessage(""); }
  function addImageLink() {
    const url = window.prompt("Вставь прямую ссылку на картинку из GitHub (raw.githubusercontent.com):");
    if (!url?.trim()) return;
    if (!/^https:\/\/raw\.githubusercontent\.com\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(url.trim())) { setMessage("Нужна прямая ссылка raw.githubusercontent.com на JPG, PNG или WEBP."); return; }
    update("content", `${draft.content.trim()}${draft.content.trim() ? "\n\n" : ""}${url.trim()}\n`);
    setMessage("Ссылка на картинку добавлена. Сохрани материал, чтобы опубликовать её.");
  }
  async function save() {
    if (!draft.title.trim()) { setMessage("Добавь название материала."); return; }
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/admin/posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
      if (response.status === 401) { window.location.assign("/admin/login"); return; }
      const payload = await response.json() as { post?: HubPost; error?: string }; if (!response.ok || !payload.post) throw new Error(payload.error || "Не удалось сохранить");
      setPosts((current) => current.some((post) => post.id === payload.post!.id) ? current.map((post) => post.id === payload.post!.id ? payload.post! : post) : [...current, payload.post!]);
      setDraft(makeDraft(payload.post)); setMessage("Опубликовано. Посетители увидят изменения после обновления страницы.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Не удалось сохранить"); } finally { setSaving(false); }
  }
  return <main className="admin-page">
    <header className="admin-topbar"><div><a href="/"><ArrowLeft size={17} /> На сайт</a><span className="admin-badge"><ShieldCheck size={16} /> Редактор</span></div><div><span>{userName}</span><a href={signOutPath} target="_top">Выйти</a></div></header>
    <div className="admin-layout"><aside className="admin-list"><div className="admin-list-head"><div><p>Материалы</p><span>{posts.length} записей</span></div><Button type="button" size="icon" onClick={() => { setDraft(makeDraft()); setMessage(""); }} aria-label="Новый материал"><FilePlus2 /></Button></div><div className="admin-items">{posts.map((post) => <Button key={post.id} type="button" variant="ghost" className={draft.id === post.id ? "admin-item selected" : "admin-item"} onClick={() => choose(post)}><span className={`mini-accent color-${post.accent}`} /><span><strong>{post.title}</strong><small>{TYPE_LABELS[post.type]} · {post.published ? "На сайте" : "Черновик"}</small></span></Button>)}</div></aside>
      <section className="editor-panel"><div className="editor-heading"><div><p className="eyebrow">{selected ? "Редактирование" : "Новый материал"}</p><h1>{selected?.title || "Создай материал"}</h1></div><Button type="button" onClick={save} disabled={saving}>{saving ? <Loader2 className="spin" /> : <Save />} Сохранить и опубликовать</Button></div>
        <div className="editor-grid"><div className="field field-wide"><Label htmlFor="title">Название</Label><Input id="title" value={draft.title} onChange={(e) => update("title", e.target.value)} placeholder="Например: Лучший билд Короны" /></div>
          <div className="field"><Label>Раздел</Label><Select value={draft.type} onValueChange={(value) => update("type", value as PostType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(TYPE_LABELS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          <div className="field"><Label htmlFor="readTime">Время чтения</Label><Input id="readTime" value={draft.readTime} onChange={(e) => update("readTime", e.target.value)} /></div>
          <div className="field field-wide"><Label htmlFor="summary">Короткое описание</Label><Input id="summary" value={draft.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Одна понятная строка для карточки" /></div>
          <div className="field field-wide"><div className="field-label-row"><Label htmlFor="content">Текст материала</Label><Button type="button" variant="outline" size="sm" onClick={addImageLink}><Link /> Добавить картинку</Button></div><Textarea id="content" value={draft.content} onChange={(e) => update("content", e.target.value)} placeholder="Напиши описание и добавь ссылки на картинки или YouTube…" rows={12} /><p className="field-help">Для карты осколка: первая картинка — сама карта, следующие картинки — аватарки подходящих лансеров. Ссылку YouTube вставь отдельной строкой.</p></div>
          <div className="field"><Label>Цвет карточки</Label><Select value={draft.accent} onValueChange={(value) => update("accent", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="purple">Фиолетовый</SelectItem><SelectItem value="pink">Розовый</SelectItem><SelectItem value="acid">Кислотный</SelectItem><SelectItem value="cyan">Голубой</SelectItem><SelectItem value="red">Красный</SelectItem></SelectContent></Select></div>
          <div className="field"><Label htmlFor="order">Порядок</Label><Input id="order" type="number" value={draft.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} /></div>
          <div className="publish-row field-wide"><div><Label htmlFor="published">Показывать посетителям</Label><p>Отключи, чтобы сохранить материал как черновик.</p></div><Switch id="published" checked={draft.published} onCheckedChange={(checked) => update("published", checked)} /></div>
        </div>{message && <div className={message.startsWith("Опубликовано") ? "save-message success" : "save-message"}>{message.startsWith("Опубликовано") && <Check size={17} />}{message}</div>}
      </section></div>
  </main>;
}
