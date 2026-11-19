"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Banner = { src: string; w: number; h: number; href: string | null; title: string };

/** The shop's own Zochil banners, first on the home page (rotate every 6 s when there are several). */
export function BannerDeck({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % banners.length), 6000);
    return () => window.clearInterval(id);
  }, [banners.length]);
  if (!banners.length) return null;
  return (
    <div className="panel relative overflow-hidden bg-tang" style={{ aspectRatio: `${banners[0].w} / ${banners[0].h}` }}>
      {banners.map((b, k) => (
        <div key={b.src} className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
          <Image src={b.src} alt="CHIMGELDEI: супер бүсгүйчүүдэд супер арчилгаа" fill priority={k === 0} sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
