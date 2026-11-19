"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, MinusIcon, PlusIcon } from "./icons";

type V = { id: string; price: number; compareAt: number | null; stock: number | null };

export function BuyBox({ slug, v }: { slug: string; v: V }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const liked = useHearts().includes(slug);
  const out = v.stock === 0;
  const cap = out ? 0 : Math.min(10, v.stock ?? 10);

  return (
    <div className="panel bg-white p-5 md:p-6">
      <div className="flex items-baseline gap-3">
        <span className="display text-[44px] leading-none">{formatPrice(v.price)}</span>
        {v.compareAt && <s className="text-[17px] text-ink-3">{formatPrice(v.compareAt)}</s>}
      </div>
      {out ? (
        <p className="mt-5 rounded-[12px] border-2 border-ink bg-paper-2 px-4 py-3 font-bold">Одоогоор дууссан. Ирэх хугацааг утсаар лавлаарай.</p>
      ) : (
        <div className="mt-5 grid grid-cols-[auto_1fr_auto] gap-3">
          <div className="flex h-[52px] items-center rounded-[14px] border-[3px] border-ink bg-paper">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center" aria-label="Цөөлөх">
              <MinusIcon size={16} />
            </button>
            <span className="display w-7 text-center text-[20px]" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(cap, q + 1))} disabled={qty >= cap} className="grid h-full w-11 place-items-center disabled:opacity-30" aria-label="Нэмэх">
              <PlusIcon size={16} />
            </button>
          </div>
          <button type="button" onClick={() => cart.add(v.id, qty)} className="btn btn-tang">
            Сагсанд
          </button>
          <button type="button" onClick={() => hearts.toggle(slug)} aria-pressed={liked} aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"} className={`btn !px-0 w-[52px] ${liked ? "btn-pink" : "btn-paper"}`}>
            <HeartIcon size={20} filled={liked} />
          </button>
          <button
            type="button"
            onClick={() => {
              cart.add(v.id, qty);
              router.push("/cart");
            }}
            className="btn btn-cobalt col-span-3"
          >
            Шууд захиалах →
          </button>
        </div>
      )}
    </div>
  );
}
