"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts, type LiteProduct } from "@/lib/lite";
import { Burst, Star } from "./deco";
import { PlusIcon } from "./icons";

type Facet = { id: string; name: string };
type Step = Facet & { line: string; tint: string };

const SKIN_LINE: Record<string, string> = {
  dry: "Татагдана, хальсална",
  normal: "Тэнцвэртэй, асуудал багатай",
  combo: "T бүс тослог, хацар хуурай",
  oily: "Гялалзана, нүх томорно",
  sensitive: "Амархан улайж, хорсоно",
};

/**
 * Skin type + up to two issues → one product per routine step. Uses only the shop's own Zochil categories
 * («Арьсны төрөл», «Арьсны асуудал»): the picks are a shortcut through the catalog, not a diagnosis.
 */
export function SkinQuest({ skins, issues, steps }: { skins: Facet[]; issues: Facet[]; steps: Step[] }) {
  const [skin, setSkin] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [added, setAdded] = useState(false);

  const toggle = (id: string) => setPicked((l) => (l.includes(id) ? l.filter((x) => x !== id) : l.length >= 2 ? [l[1], id] : [...l, id]));

  const score = (p: LiteProduct) => (skin && p.sk.includes(skin) ? 3 : 0) + picked.filter((i) => p.is.includes(i)).length * 2 + Math.min(p.r, 50) / 50;
  // one product per step, never the same product twice (some are filed under two steps)
  const used = new Set<string>();
  const routine = steps.map((s) => {
    const pool = liteProducts.filter((p) => p.a && !used.has(p.s) && p.st.includes(s.id) && (!skin || p.sk.includes(skin) || !p.sk.length));
    const best = [...pool].sort((a, b) => score(b) - score(a))[0] ?? null;
    if (best) used.add(best.s);
    return { step: s, p: best };
  });
  const found = routine.filter((r) => r.p) as { step: Step; p: LiteProduct }[];
  const total = found.reduce((s, r) => s + r.p.p, 0);
  const q = new URLSearchParams();
  if (skin) q.set("s", skin);
  if (picked[0]) q.set("i", picked[0]);

  return (
    <div className="space-y-10">
      <section className="panel bg-white p-6 md:p-8">
        <h2 className="flex items-center gap-3 normal-case">
          <Burst size={56} color="var(--color-sun)">
            1
          </Burst>
          <span className="display text-[28px] md:text-[34px]">Арьсны төрөл</span>
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" role="radiogroup" aria-label="Арьсны төрөл">
          {skins.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={skin === s.id}
              onClick={() => {
                setSkin(s.id);
                setDone(false);
              }}
              className={`rounded-[14px] border-[3px] border-ink p-4 text-left transition ${skin === s.id ? "bg-tang text-white shadow-[4px_4px_0_var(--color-ink)]" : "bg-paper hover:-translate-y-0.5"}`}
            >
              <b className="display block text-[22px]">{s.name}</b>
              <span className="mt-1 block text-[13px] opacity-80">{SKIN_LINE[s.id]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel bg-white p-6 md:p-8">
        <h2 className="flex items-center gap-3 normal-case">
          <Burst size={56} color="var(--color-pink)">
            2
          </Burst>
          <span className="display text-[28px] md:text-[34px]">Юу засмаар байна?</span>
          <span className="text-[14px] font-bold text-ink-3">(2 хүртэл)</span>
        </h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {issues.map((i) => (
            <button
              key={i.id}
              type="button"
              aria-pressed={picked.includes(i.id)}
              onClick={() => {
                toggle(i.id);
                setDone(false);
              }}
              className="chip !min-h-12 !px-5 !text-[15px]"
            >
              {i.name}
            </button>
          ))}
        </div>
        <button type="button" disabled={!skin} onClick={() => setDone(true)} className="btn btn-cobalt mt-8 min-h-14 w-full px-6 py-3 text-center text-[16px] !whitespace-normal sm:w-auto sm:px-8 sm:text-[17px]">
          {skin ? "Миний routine-г гарга ★" : "Эхлээд арьсны төрлөө сонго"}
        </button>
      </section>

      {done && skin && (
        <section className="pow-in" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="tag text-tang-2">Таны супер routine</p>
              <h2 className="text-[34px] md:text-[48px]">
                {skins.find((s) => s.id === skin)?.name} арьс
                {picked.length > 0 && ` + ${picked.map((i) => issues.find((x) => x.id === i)?.name).join(", ")}`}
              </h2>
            </div>
            <Link href={`/shop?${q}`} className="btn btn-paper">
              Бүх тохирох бараа →
            </Link>
          </div>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {found.map(({ step, p }, k) => (
              <li key={step.id} className="panel rise relative flex h-full flex-col overflow-hidden bg-white" style={{ animationDelay: `${k * 60}ms` }}>
                <div className="relative flex items-center gap-3 border-b-[3px] border-ink px-4 py-3" style={{ background: step.tint }}>
                  <span className="display grid h-9 w-9 place-items-center rounded-[8px] border-[2.5px] border-ink bg-white text-[18px]">{k + 1}</span>
                  <span>
                    <b className="display block text-[19px] leading-none">{step.name}</b>
                    <span className="text-[12px] font-bold">{step.line}</span>
                  </span>
                </div>
                <Link href={`/p/${p.s}`} className="flex flex-1 gap-4 p-4 hover:bg-paper">
                  <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[12px] border-2 border-ink bg-paper-2">
                    {p.t && <Image src={p.t} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    {p.b && <span className="tag text-[11px] text-cobalt">{p.b}</span>}
                    <span className="line-clamp-3 min-h-[4.1em] leading-snug font-bold">{p.n}</span>
                    <span className="display mt-auto pt-1 text-[19px]">{formatPrice(p.p)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="panel mt-8 flex flex-wrap items-center justify-between gap-4 bg-sun p-5 md:p-6">
            <p className="flex items-center gap-3">
              <Star size={30} color="var(--color-tang)" />
              <span>
                <b className="display block text-[24px]">Бүгд: {formatPrice(total)}</b>
                <span className="text-[13.5px]">Дэлгүүрийн «Арьсны төрөл / асуудал» ангиллаар сонгосон. Эмзэг бол утсаар зөвлөгөө аваарай.</span>
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                found.forEach((r) => cart.add(r.p.v));
                setAdded(true);
              }}
              className="btn btn-ink min-h-14 w-full px-7 sm:w-auto"
            >
              <PlusIcon size={18} /> {added ? "Сагсанд нэмэгдлээ!" : "Бүгдийг сагсанд"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
