"use client";

import { useRef, useState } from "react";
import { Award, BookOpen, Crown, Edit3, Flame, ImageUp, LockKeyhole, Play, Save, Sparkles, Trophy, UserRound } from "lucide-react";

type Profile = { nickname: string; avatar: string; frame: string; gameRank: string; xp: number; level: number; articlesRead: number; videosWatched: number; };
type Frame = { id: string; label: string; color: string };

const avatars = ["⚡", "🎯", "🦊", "👾", "🛡️", "🔥"];
const ranks = [
  { name: "Бронза", image: "/api/rank?v=3&rank=bronze", tone: "bronze" },
  { name: "Серебро", image: "/api/rank?v=3&rank=silver", tone: "silver" },
  { name: "Золото", image: "/api/rank?v=3&rank=gold", tone: "gold" },
  { name: "Платина", image: "/api/rank?v=3&rank=platinum", tone: "platinum" },
  { name: "Алмаз", image: "/api/rank?v=3&rank=diamond", tone: "diamond" },
  { name: "Мастер", image: "/api/rank?v=3&rank=master", tone: "master" },
  { name: "Ас", image: "/api/rank?v=3&rank=ace", tone: "ace" },
  { name: "Панк-мастер", image: "/api/rank?v=3&rank=punk-master", tone: "punkmaster" },
] as const;
const frames: Frame[] = [
  {id:"acid",label:"Лайм",color:"#dcff3f"},{id:"violet",label:"Фиолетовый",color:"#9c56ff"},
  {id:"cyan",label:"Голубой",color:"#56e9ff"},{id:"pink",label:"Розовый",color:"#ff4aa2"},
  {id:"red",label:"Красный",color:"#ff5757"},{id:"orange",label:"Оранжевый",color:"#ff8a3d"},
  {id:"gold",label:"Золотой",color:"#ffd447"},{id:"lemon",label:"Лимонный",color:"#fff36b"},
  {id:"emerald",label:"Изумрудный",color:"#37e69b"},{id:"mint",label:"Мятный",color:"#70ffd0"},
  {id:"teal",label:"Бирюзовый",color:"#25c9c2"},{id:"sky",label:"Небесный",color:"#62b8ff"},
  {id:"blue",label:"Синий",color:"#5376ff"},{id:"indigo",label:"Индиго",color:"#6c54d9"},
  {id:"lavender",label:"Лаванда",color:"#bc9cff"},{id:"orchid",label:"Орхидея",color:"#db78ff"},
  {id:"magenta",label:"Малиновый",color:"#ff3cc7"},{id:"rose",label:"Роза",color:"#ff7395"},
  {id:"coral",label:"Коралл",color:"#ff7866"},{id:"peach",label:"Персик",color:"#ffb180"},
  {id:"copper",label:"Медь",color:"#c97845"},{id:"chocolate",label:"Бронза",color:"#8f5738"},
  {id:"white",label:"Белый",color:"#f8f5ff"},{id:"smoke",label:"Серебристый",color:"#b7bccb"},
  {id:"graphite",label:"Графит",color:"#77808e"},{id:"black",label:"Чёрный",color:"#151515"},
  {id:"rainbow",label:"Спектр",color:"linear-gradient(135deg,#ff4aa2,#ffcf4a,#dcff3f,#56e9ff,#9c56ff)"},
  {id:"aurora",label:"Аврора",color:"linear-gradient(135deg,#dcff3f,#56e9ff,#9c56ff)"},
  {id:"sunset",label:"Закат",color:"linear-gradient(135deg,#ffdf54,#ff6b52,#ff45aa)"},
  {id:"nebula",label:"Туманность",color:"linear-gradient(135deg,#4e4eff,#c359ff,#ff4aa2)"},
];

function isImage(value: string) { return value.startsWith("/api/profile/avatar") || value.startsWith("https://") || value.startsWith("data:image/"); }
async function makeCompactAvatar(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxSide = 512;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.84);
}
function frameStyle(id: string) { return frames.find((x) => x.id === id)?.color ?? "#dcff3f"; }

export function ProfileClient({ initialProfile }: { initialProfile: Profile }) {
  const [profile,setProfile]=useState(initialProfile);
  const [edit,setEdit]=useState(false); const [saving,setSaving]=useState(false); const [notice,setNotice]=useState("");
  const fileInput=useRef<HTMLInputElement>(null);
  const nextXp = Math.max(100, profile.level * 100);
  const rank = ranks.find((x)=>x.name===profile.gameRank) ?? ranks[0];

  async function save(){
    setSaving(true); setNotice("");
    const r=await fetch("/api/profile",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(profile)});
    setSaving(false); if(r.ok) setEdit(false); setNotice(r.ok?"Профиль сохранён":"Не удалось сохранить профиль");
  }
  async function uploadAvatar(file?: File) {
    if(!file) return;
    if(!file.type.startsWith("image/")) { setNotice("Выберите изображение: PNG, JPG, WEBP или GIF."); return; }
    if(file.size > 2 * 1024 * 1024) { setNotice("Аватар должен быть не больше 2 МБ."); return; }
    setSaving(true); setNotice("Загружаю аватар…");
    const form=new FormData(); form.set("avatar",file);
    const r=await fetch("/api/profile/avatar",{method:"POST",body:form});
    const data=await r.json().catch(()=>null); setSaving(false);
    if(r.ok && data?.avatar) { setProfile((p)=>({...p,avatar:data.avatar})); setNotice("Аватар загружен. Нажмите «Сохранить»."); return; }
    try {
      const avatar = await makeCompactAvatar(file);
      const fallback = await fetch("/api/profile",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...profile,avatar})});
      if (fallback.ok) { setProfile((p)=>({...p,avatar})); setNotice("Аватар загружен."); return; }
    } catch {}
    setNotice(data?.error || "Не удалось загрузить аватар. Попробуйте ещё раз.");
  }
  return <div className="site-shell profile-shell"><header className="site-header"><div className="wrap header-row"><a className="brand" href="/" aria-label="На главную"><span className="brand-mark"/><span className="brand-text"><strong>FRAGPUNK</strong><small>HUB.RU</small></span></a><nav className="main-nav"><a href="/">Материалы</a><a className="profile-link active" href="/profile"><UserRound size={17}/> Кабинет</a><a className="admin-link" href="/admin">Редактор</a></nav></div></header><main className="wrap profile-main">
    <div className="profile-topline"><a href="/">← Все материалы</a><span>Игрок сайта</span></div>
    <section className="profile-hero"><div className="profile-avatar-wrap"><span className="site-level">Ур. {profile.level}</span><div className="profile-avatar" style={{"--profile-frame":frameStyle(profile.frame)} as React.CSSProperties}>{isImage(profile.avatar)?<img src={profile.avatar} alt="Аватар игрока"/>:profile.avatar || "⚡"}</div><span className={"game-rank-mark rank-"+rank.tone} title={rank.name}><img src={rank.image} alt={rank.name}/></span></div><div className="profile-intro"><p className="eyebrow">Личный кабинет</p><div className="profile-name-row"><h1>{profile.nickname}</h1><button onClick={()=>setEdit(!edit)} aria-label="Редактировать профиль"><Edit3 size={18}/></button></div><p><span className="rank-name">{rank.name}</span> · игровой ранг FragPunk</p><div className="xp-line"><span style={{width:`${Math.min(100,profile.xp/nextXp*100)}%`}}/></div><small>{profile.xp} / {nextXp} XP до следующего уровня</small></div><div className="profile-rank"><Crown/><span>Звание сайта</span><strong>Разведчик</strong><small>Открой 3 материала для нового звания</small></div></section>
    {edit&&<section className="profile-edit"><label>Никнейм<input value={profile.nickname} maxLength={24} onChange={e=>setProfile({...profile,nickname:e.target.value})}/></label><label>Звание в игре<select value={rank.name} onChange={e=>setProfile({...profile,gameRank:e.target.value})}>{ranks.map(x=><option key={x.name}>{x.name}</option>)}</select></label><div className="avatar-control"><b>Аватар</b><div className="choice-row avatar-choices">{avatars.map(x=><button key={x} className={profile.avatar===x?"chosen":""} onClick={()=>setProfile({...profile,avatar:x})}>{x}</button>)}<button className="avatar-upload" onClick={()=>fileInput.current?.click()} aria-label="Загрузить свою аватарку"><ImageUp size={18}/></button><input ref={fileInput} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>uploadAvatar(e.target.files?.[0])}/></div><small>Своя картинка: PNG, JPG, WEBP или GIF до 2 МБ.</small></div><div><b>Рамка — {frames.find(x=>x.id===profile.frame)?.label ?? "Лайм"}</b><div className="frame-grid">{frames.map(x=><button key={x.id} title={x.label} aria-label={x.label} style={{"--frame-choice":x.color} as React.CSSProperties} className={"frame-choice "+(profile.frame===x.id?"chosen":"")} onClick={()=>setProfile({...profile,frame:x.id})}/>)}</div></div><button className="save-profile" disabled={saving} onClick={save}><Save size={17}/>{saving?"Сохраняю…":"Сохранить"}</button></section>}
    {notice&&<p className="profile-notice">{notice}</p>}
    <section className="profile-grid"><article className="progress-panel"><div className="panel-title"><span><Sparkles/> Прогресс</span><small>Как получать XP?</small></div><div className="progress-actions"><div><BookOpen/><strong>Статьи</strong><b>{profile.articlesRead}</b><small>+20 XP за прочтение</small></div><div><Play/><strong>Ролики</strong><b>{profile.videosWatched}</b><small>+35 XP за просмотр</small></div><div><Flame/><strong>Серия</strong><b>0 дней</b><small>Скоро добавим</small></div></div></article><article className="achievements-panel"><div className="panel-title"><span><Award/> Достижения</span><small>0 / 6</small></div><div className="achievement-list"><p><LockKeyhole/> Первый материал <span>Прочитать статью</span></p><p><LockKeyhole/> Знаток оружия <span>5 материалов об оружии</span></p><p><LockKeyhole/> Видеогайд <span>Посмотреть ролик</span></p></div></article></section>
    <section className="future-panel"><div><p className="eyebrow">Скоро</p><h2>Коллекция и онлайн-бои</h2><p>Карты, колоды, редкие рамки и рейтинг игроков появятся здесь. Завтра вместе настроим правила и награды.</p></div><Trophy size={54}/></section>
  </main></div>;
}