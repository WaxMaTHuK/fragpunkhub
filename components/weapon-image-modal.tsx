"use client";

import { useEffect, useState } from "react";
import { Expand, X } from "lucide-react";

type WeaponImageModalProps = { src: string; alt: string; fallbackSrc?: string };

export function WeaponImageModal({ src, alt, fallbackSrc }: WeaponImageModalProps) {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return <>
    <button className="weapon-image-button" type="button" onClick={() => setOpen(true)} aria-label={`Открыть изображение: ${alt}`}>
      <img src={imageSrc} alt={alt} onError={() => { if (fallbackSrc && imageSrc !== fallbackSrc) setImageSrc(fallbackSrc); }} />
      <span><Expand size={18} /> Открыть изображение</span>
    </button>
    {open && <div className="image-modal" role="dialog" aria-modal="true" aria-label={`Большое изображение: ${alt}`} onClick={() => setOpen(false)}>
      <div className="image-modal-content" onClick={(event) => event.stopPropagation()}>
        <button className="image-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Закрыть"><X size={22} /></button>
        <img src={imageSrc} alt={alt} />
      </div>
    </div>}
  </>;
}
