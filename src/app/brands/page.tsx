import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Stars } from "@/components/deco";
import { ArrowIcon } from "@/components/icons";
import { brands, byPopularity, products } from "@/lib/catalog";

export const metadata: Metadata = { title: "Брэндүүд", description: "CHIMGELDEI-ийн албан ёсны эрхтэй Солонгос арьс арчилгааны брэндүүд.", alternates: { canonical: "/brands" } };

const TINTS = ["#ffd1ae", "#ffe596", "#ffc2e0", "#c9d3ff", "#ddd1ff", "#c9f0dd"];

export default function Brands() {
  const noBrand = products.filter((p) => !p.brand).length;
  return (
    <>
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-cobalt text-white">
        <span className="rays absolute -top-1/2 right-0 h-[220%] w-[70%] opacity-20" aria-hidden />
        <Stars />
        <div className="wrap relative py-12 md:py-16">
          <p className="tag text-sun">Албан ёсны эрхтэй</p>
          <h1 className="text-[44px] md:text-[68px]">Брэндүүд</h1>
          <p className="mt-2 max-w-xl text-white/85">Солонгос улсын баталгаатай, үр дүн бүхий {brands.length} брэнд. Брэнд бүрийн хамгийн их захиалсан бүтээгдэхүүн.</p>
        </div>
      </section>
      <div className="wrap mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b, i) => {
          const top = products.filter((p) => p.brand === b.id).sort(byPopularity).slice(0, 3);
          return (
            <Link key={b.id} href={`/shop?b=${b.id}`} className="panel tilt-hover group relative flex flex-col overflow-hidden p-6" style={{ background: TINTS[i % TINTS.length] }}>
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="display block text-[30px] leading-none">{b.name}</span>
                  <span className="mt-1 block text-[13.5px] font-bold text-ink-2">{b.count} бүтээгдэхүүн</span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border-[2.5px] border-ink bg-white transition group-hover:-rotate-12 group-hover:bg-sun">
                  <ArrowIcon size={18} />
                </span>
              </span>
              <span className="mt-6 flex gap-3">
                {top.map((p) => (
                  <span key={p.slug} className="relative aspect-square flex-1 overflow-hidden rounded-[12px] border-2 border-ink bg-white">
                    {p.images[0] && <Image src={p.images[0].thumb.src} alt="" fill sizes="120px" className="object-contain p-2" />}
                  </span>
                ))}
                {Array.from({ length: 3 - top.length }, (_, k) => (
                  <span key={k} className="flex-1" />
                ))}
              </span>
            </Link>
          );
        })}
      </div>
      {noBrand > 0 && <p className="wrap mt-6 text-[13.5px] text-ink-3">Брэнд ангилалгүй {noBrand} бүтээгдэхүүн дэлгүүрийн хэсэгт бий.</p>}
    </>
  );
}
