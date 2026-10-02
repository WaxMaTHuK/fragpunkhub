"use client";

import { createElement, useEffect, useState } from "react";
import type { LancerSkin } from "@/lib/lancer-models";

export function LancerViewer({ name, skins }: { name: string; skins: LancerSkin[] }) {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!skins.length) return;
    let active = true;
    import("@google/model-viewer").then(() => { if (active) setReady(true); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [skins.length]);
  if (!skins.length) return null;
  const skin = skins[selected] ?? skins[0];
  return <section className="lancer-viewer" aria-label={`3D модель: ${name}`}>
    <div className="lancer-viewer-head"><h2>Модель лансера</h2><span>Перетаскивай для поворота · колесо мыши или жест для приближения</span></div>
    <div className="lancer-viewer-stage">
      {ready && createElement("model-viewer", {
        key: skin.model, src: skin.model, alt: `${name} — ${skin.name}`,
        "camera-controls": true, "auto-rotate": true, "auto-rotate-delay": "3000",
        "shadow-intensity": "1", "environment-image": "neutral", loading: "lazy",
        onError: () => setError(true), onLoad: () => setError(false),
        style: { width: "100%", height: "100%", background: "transparent" },
      })}
      {!ready && !error && <p className="lancer-viewer-message">Загружаем модель…</p>}
      {error && <p className="lancer-viewer-message">Модель пока не загрузилась. Попробуй обновить страницу.</p>}
    </div>
    {skins.length > 1 && <div className="lancer-skins" role="group" aria-label="Облики лансера">
      {skins.map((item, index) => <button key={`${item.name}-${index}`} type="button" className={index === selected ? "active" : ""} aria-pressed={index === selected} onClick={() => { setSelected(index); setError(false); }}>{item.name}</button>)}
    </div>}
  </section>;
}
