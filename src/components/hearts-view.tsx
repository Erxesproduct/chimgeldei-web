"use client";

import Image from "next/image";
import Link from "next/link";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts } from "@/lib/lite";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, PlusIcon } from "./icons";

export function HeartsView() {
  const slugs = useHearts();
  const list = slugs.flatMap((s) => liteProducts.filter((p) => p.s === s));
  if (!list.length)
    return (
      <div className="bubble mx-auto mt-12 max-w-md p-8 text-center">
        <p className="display text-[30px]">Одоохондоо хоосон</p>
        <p className="mt-2 text-ink-2">Таалагдсан бүтээгдэхүүн дээрх ♥-г дараад энд хадгалаарай. Энэ төхөөрөмж дээр хадгалагдана.</p>
        <Link href="/shop" className="btn btn-tang mt-6">
          Дэлгүүр
        </Link>
      </div>
    );
  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p) => (
        <li key={p.s} className="panel-sm flex gap-4 bg-white p-3">
          <Link href={`/p/${p.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[10px] border-2 border-ink bg-pink-2">
            {p.t && <Image src={p.t} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            {p.b && <span className="tag text-[11px] text-cobalt">{p.b}</span>}
            <Link href={`/p/${p.s}`} className="line-clamp-2 leading-snug font-bold hover:text-tang-2">
              {p.n}
            </Link>
            <span className="mt-auto flex items-center gap-2 pt-1">
              <b className="display mr-auto text-[18px]">{formatPrice(p.p)}</b>
              <button type="button" onClick={() => hearts.toggle(p.s)} className="grid h-9 w-9 place-items-center rounded-[8px] border-2 border-ink bg-pink" aria-label="Хасах">
                <HeartIcon size={16} filled />
              </button>
              {p.a ? (
                <button type="button" onClick={() => cart.add(p.v)} className="grid h-9 w-9 place-items-center rounded-[8px] border-2 border-ink bg-tang text-white" aria-label="Сагсанд нэмэх">
                  <PlusIcon size={16} />
                </button>
              ) : (
                <span className="tag">Дууссан</span>
              )}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
