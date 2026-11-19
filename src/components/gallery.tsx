"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { src: string; thumb: { src: string } };

export function Gallery({ images, alt, tint }: { images: Photo[]; alt: string; tint: string }) {
  const [i, setI] = useState(0);
  const cur = images[i];
  return (
    <div className="md:sticky md:top-36">
      <div className="panel relative aspect-square overflow-hidden" style={{ background: tint }}>
        <span className="halftone absolute inset-0 opacity-60" aria-hidden />
        <span className="absolute inset-[8%] rounded-full bg-white/90" aria-hidden />
        {cur && <Image key={cur.src} src={cur.src} alt={alt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="rise object-contain p-[10%] mix-blend-multiply" />}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((m, k) => (
            <button key={m.src} type="button" onClick={() => setI(k)} aria-label={`Зураг ${k + 1}`} aria-current={k === i} className={`relative h-20 w-20 overflow-hidden rounded-[12px] border-[2.5px] border-ink bg-white transition ${k === i ? "shadow-[4px_4px_0_var(--color-tang)]" : "opacity-70 hover:opacity-100"}`}>
              <Image src={m.thumb.src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
