"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cartCount, useCart } from "@/lib/cart";
import { getLiteVariant } from "@/lib/lite";
import { useHearts } from "@/lib/wishlist";
import { BagIcon, CloseIcon, HeartIcon, SearchIcon } from "./icons";

const btn = "relative grid h-11 w-11 place-items-center rounded-[12px] border-[2.5px] border-ink bg-white shadow-[3px_3px_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-sun";

export function HeaderTools() {
  const items = useCart();
  const liked = useHearts();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const n = cartCount(items);

  useEffect(() => {
    let t: number | undefined;
    const onAdd = (e: Event) => {
      const v = getLiteVariant((e as CustomEvent<{ id: string }>).detail.id);
      setToast(v ? v.n : "Сагсанд нэмлээ");
      setBump((b) => b + 1);
      window.clearTimeout(t);
      t = window.setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener("chimgeldei:added", onAdd);
    return () => {
      window.removeEventListener("chimgeldei:added", onAdd);
      window.clearTimeout(t);
    };
  }, []);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  return (
    <div className="ml-auto flex items-center gap-2">
      {open ? (
        <form
          role="search"
          className="pow-in flex items-center gap-1 rounded-[12px] border-[2.5px] border-ink bg-white py-1 pr-1 pl-3 shadow-[3px_3px_0_var(--color-cobalt)]"
          style={{ ["--r" as string]: "0deg" }}
          onSubmit={(e) => {
            e.preventDefault();
            const q = input.current?.value.trim();
            setOpen(false);
            router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
          }}
        >
          <input ref={input} name="q" placeholder="Toner, PDRN, Torriden…" aria-label="Хайх" className="w-[36vw] max-w-[220px] bg-transparent text-[15px] outline-none" />
          <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-[8px] hover:bg-pink-2" aria-label="Хаах">
            <CloseIcon size={16} />
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={btn} aria-label="Хайх">
          <SearchIcon size={19} />
        </button>
      )}
      <Link href="/hearts" className={`${btn} ${open ? "hidden sm:grid" : ""}`} aria-label={`Хадгалсан (${liked.length})`}>
        <HeartIcon size={19} filled={liked.length > 0} className={liked.length ? "text-pink" : ""} />
      </Link>
      <Link href="/cart" className={`${btn} !bg-tang text-white`} aria-label={`Сагс (${n})`}>
        <BagIcon size={19} />
        {n > 0 && (
          <span key={bump} className="pow-in absolute -top-2.5 -right-2.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-ink bg-sun px-1 text-[12px] font-extrabold text-ink" style={{ ["--r" as string]: "0deg" }}>
            {n}
          </span>
        )}
      </Link>
      {toast && (
        <div role="status" className="pow-in panel-sm fixed top-[124px] right-4 z-50 flex max-w-[calc(100vw-32px)] items-center gap-3 bg-sun py-2.5 pr-3 pl-3 text-[14px]" style={{ ["--r" as string]: "-1deg" }}>
          <span className="display text-[20px]">Бам!</span>
          <span className="min-w-0">
            <b className="block">Сагсанд нэмлээ</b>
            <span className="block truncate text-ink-2">{toast}</span>
          </span>
          <Link href="/cart" className="btn btn-ink ml-1 !min-h-9 !px-3 !text-[13px]">
            Сагс
          </Link>
        </div>
      )}
    </div>
  );
}
