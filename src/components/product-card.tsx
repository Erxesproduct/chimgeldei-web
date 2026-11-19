import Image from "next/image";
import Link from "next/link";
import { available, brandName, onSale, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";
import { Burst } from "./deco";

/** Panel colour per routine step / group: the grid reads like a comic page. */
const TINT: Record<string, string> = {
  cleanse: "#ffd1ae",
  prep: "#ffe596",
  boost: "#ffc2e0",
  moist: "#c9d3ff",
  shield: "#ffcba4",
  mask: "#ddd1ff",
  makeup: "#ffc2e0",
  body: "#c9f0dd",
  sets: "#ffe596",
  tools: "#e8e2da",
};
export const tintOf = (p: Product) => TINT[p.steps[0]] ?? TINT[p.group] ?? "#ffe8cf";

export function ProductCard({ p, priority = false, rank }: { p: Product; priority?: boolean; rank?: number }) {
  const v = p.variants[0];
  const img = p.images[0];
  const ok = available(p);
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/p/${p.slug}`} className="panel tilt-hover relative block aspect-[4/5] overflow-hidden" style={{ background: tintOf(p) }}>
        <span className="halftone absolute inset-0 opacity-60" aria-hidden />
        <span className="absolute inset-[10%] rounded-full bg-white/85 transition duration-500 group-hover:scale-110" aria-hidden />
        {img && <Image src={img.thumb.src} alt={`${brandName(p.brand) ?? ""} ${p.title}`.trim()} fill priority={priority} sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className={`object-contain p-[13%] mix-blend-multiply transition duration-500 group-hover:-rotate-3 group-hover:scale-105 ${ok ? "" : "opacity-50 grayscale"}`} />}
        <span className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {rank != null && (
            <Burst size={58} color={rank === 1 ? "var(--color-sun)" : "var(--color-pink)"} rotate={-10}>
              #{rank}
              <br />
              ХИТ
            </Burst>
          )}
          {onSale(p) && ok && <span className="tag -rotate-3 rounded-[8px] border-2 border-ink bg-tang px-2 py-0.5 text-white">Хямдрал</span>}
          {!ok && <span className="tag rounded-[8px] border-2 border-ink bg-white px-2 py-0.5">Дууссан</span>}
        </span>
      </Link>
      <CardActions slug={p.slug} variantId={ok ? v.id : null} />
      <div className="mt-4 flex flex-1 flex-col px-0.5">
        {p.brand && <span className="tag text-[11px] text-cobalt">{brandName(p.brand)}</span>}
        <Link href={`/p/${p.slug}`} className="mt-0.5 line-clamp-2 text-[15.5px] leading-snug font-bold hover:text-tang-2">
          {p.title}
        </Link>
        {p.spec.size && <span className="mt-0.5 text-[13px] text-ink-3">{p.spec.size}</span>}
        <span className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="display text-[20px] leading-none">{formatPrice(v.price)}</span>
          {v.compareAt && <s className="text-[13px] text-ink-3">{formatPrice(v.compareAt)}</s>}
        </span>
      </div>
    </article>
  );
}
