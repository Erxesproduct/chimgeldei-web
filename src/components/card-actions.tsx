"use client";

import { cart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, PlusIcon } from "./icons";

/** Heart and quick add on the product panel. */
export function CardActions({ slug, variantId }: { slug: string; variantId: string | null }) {
  const liked = useHearts().includes(slug);
  const b = "grid h-10 w-10 place-items-center rounded-[10px] border-[2.5px] border-ink shadow-[2px_2px_0_var(--color-ink)] transition hover:-translate-y-0.5";
  return (
    <div className="absolute top-2.5 right-2.5 flex flex-col gap-2">
      <button type="button" onClick={() => hearts.toggle(slug)} aria-pressed={liked} aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"} className={`${b} ${liked ? "bg-pink" : "bg-white"}`}>
        <HeartIcon size={18} filled={liked} />
      </button>
      {variantId && (
        <button type="button" onClick={() => cart.add(variantId)} aria-label="Сагсанд нэмэх" className={`${b} bg-tang text-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100`}>
          <PlusIcon size={18} />
        </button>
      )}
    </div>
  );
}
