"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, FilePlus2, Image, Link, Loader2, Plus, Save, ShieldCheck, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TYPE_LABELS, type HubPost, type PostType } from "@/lib/hub-content";

type Draft = Omit<HubPost, "slug" | "updatedAt"> & { id: string };
function makeDraft(post?: HubPost): Draft { return post ? { id: post.id, type: post.type, title: post.title, summary: post.summary, content: post.content, readTime: post.readTime, accent: post.accent, published: post.published, sortOrder: post.sortOrder } : { id: "", type: "lancer", title: "", summary: "", content: "", readTime: "5 мин", accent: "purple", published: true, sortOrder: 100 }; }

const imagePattern = /^https:\/\/raw\.githubusercontent\.com\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i;
const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;
type ShardFields = { image: string; description: string; video: string; lancers: string[] };
function parseShardContent(content: string): ShardFields {
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  const images = lines.filter((line) => imagePattern.test(line));
  return { image: images[0] || "", lancers: images.slice(1), video: lines.find((line) => youtubePattern.test(line)) || "", description: lines.filter((line) => !imagePattern.test(line) && !youtubePattern.test(line)).join("\n") };
}
function makeShardContent(fields: ShardFields) { return [fields.image, fields.description, ...fields.lancers, fields.video].map((line) => line.trim()).filter(Boolean).join("\n\n"); }

export function AdminClient({ initialPosts, userName, signOutPath }: { initialPosts: HubPost[]; userName: string; signOutPath: string }) {
  const [posts, setPosts] = useState(initialPosts); const [draft, setDraft] = useState<Draft>(() => makeDraft(initialPosts[0])); const [saving, setSaving] = useState(false); const [message, setMessage] = useState("");
  const selected = useMemo(() => posts.find((post) => post.id === draft.id), [posts, draft.id]);
  function choose(post: HubPost) { setDraft(makeDraft(post)); setMessage(""); }
  function update<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => ({ ...current, [key]: value })); setMessage(""); }
  function updateShard(changes: Partial<ShardFields>) { const fields = { ...parseShardContent(draft.content), ...changes }; update("content", makeShardContent(fields)); }
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
          {draft.type === "shard" ? <ShardCardEditor fields={parseShardContent(draft.content)} onChange={updateShard} /> : <div className="field field-wide"><div className="field-label-row"><Label htmlFor="content">Текст материала</Label><Button type="button" variant="outline" size="sm" onClick={addImageLink}><Link /> Добавить картинку</Button></div><Textarea id="content" value={draft.content} onChange={(e) => update("content", e.target.value)} placeholder="Напиши гайд, новость или описание…" rows={12} /><p className="field-help">Загрузи картинку в GitHub, затем вставь её прямую ссылку. Её можно перенести на нужное место в тексте.</p></div>}
          <div className="field"><Label>Цвет карточки</Label><Select value={draft.accent} onValueChange={(value) => update("accent", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="purple">Фиолетовый</SelectItem><SelectItem value="pink">Розовый</SelectItem><SelectItem value="acid">Кислотный</SelectItem><SelectItem value="cyan">Голубой</SelectItem><SelectItem value="red">Красный</SelectItem></SelectContent></Select></div>
          <div className="field"><Label htmlFor="order">Порядок</Label><Input id="order" type="number" value={draft.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} /></div>
          <div className="publish-row field-wide"><div><Label htmlFor="published">Показывать посетителям</Label><p>Отключи, чтобы сохранить материал как черновик.</p></div><Switch id="published" checked={draft.published} onCheckedChange={(checked) => update("published", checked)} /></div>
        </div>{message && <div className={message.startsWith("Опубликовано") ? "save-message success" : "save-message"}>{message.startsWith("Опубликовано") && <Check size={17} />}{message}</div>}
      </section></div>
  </main>;
}

function ShardCardEditor({ fields, onChange }: { fields: ShardFields; onChange: (changes: Partial<ShardFields>) => void }) {
  function addLancer() { const url = window.prompt("Вставь прямую ссылку на аватарку лансера:"); if (url?.trim()) onChange({ lancers: [...fields.lancers, url.trim()] }); }
  function changeLancer(index: number, value: string) { onChange({ lancers: fields.lancers.map((item, itemIndex) => itemIndex === index ? value : item) }); }
  function removeLancer(index: number) { onChange({ lancers: fields.lancers.filter((_, itemIndex) => itemIndex !== index) }); }
  return <div className="field-wide shard-editor"><div className="shard-editor-title"><div><p className="eyebrow">Расширенный редактор</p><h2>Карта осколка</h2></div><span>Все поля появятся в каталоге автоматически</span></div><div className="shard-editor-grid"><div className="field field-wide"><Label htmlFor="shard-image"><Image size={16} /> Изображение карты</Label><Input id="shard-image" value={fields.image} onChange={(event) => onChange({ image: event.target.value })} placeholder="https://raw.githubusercontent.com/.../card.png" /><p className="field-help">Вставь прямую ссылку на изображение из папки public/images.</p></div><div className="field field-wide"><Label htmlFor="shard-description">Полное описание эффекта</Label><Textarea id="shard-description" value={fields.description} onChange={(event) => onChange({ description: event.target.value })} placeholder="Что делает карта, когда её лучше выбирать и как использовать…" rows={8} /></div><div className="field field-wide"><Label htmlFor="shard-video"><Video size={17} /> Видео с примером</Label><Input id="shard-video" value={fields.video} onChange={(event) => onChange({ video: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></div><div className="field field-wide lancer-editor"><div className="field-label-row"><div><Label>Подходящие лансеры</Label><p className="field-help">Добавь прямые ссылки на их маленькие аватарки.</p></div><Button type="button" variant="outline" size="sm" onClick={addLancer}><Plus /> Добавить лансера</Button></div>{fields.lancers.length ? <div className="lancer-editor-list">{fields.lancers.map((lancer, index) => <div className="lancer-editor-row" key={index}>{lancer && imagePattern.test(lancer) ? <img src={lancer} alt="" /> : <span className="lancer-placeholder">{index + 1}</span>}<Input value={lancer} onChange={(event) => changeLancer(index, event.target.value)} placeholder="Ссылка на аватарку лансера" /><Button type="button" variant="ghost" size="icon" onClick={() => removeLancer(index)} aria-label="Удалить лансера"><Trash2 /></Button></div>)}</div> : <div className="lancer-editor-empty">Подходящие лансеры пока не добавлены</div>}</div></div></div>;
}
