import Image from "next/image";
import Link from "next/link";
import { Burst, Star, Stars, Zoom } from "@/components/deco";
import { BannerDeck } from "@/components/hero";
import { ClockIcon, PhoneIcon, PinIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, banners, brands, issues, popular, products, skins, steps } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const shelf = "no-bar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6 md:mx-0 md:gap-6 md:px-0";
const cell = "w-[46vw] max-w-[260px] shrink-0 snap-start sm:w-[230px]";

export default function Home() {
  const hits = popular.slice(0, 12);
  const fresh = [...products].filter(available).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12);
  const masks = popular.filter((p) => p.steps.includes("mask")).slice(0, 12);
  const sets = popular.filter((p) => p.group === "sets" || p.group === "makeup").slice(0, 12);
  const heroPics = popular.filter((p) => p.images[0]).slice(0, 3);
  const city = business.delivery[0];

  return (
    <>
      <section className="wrap pt-5 md:pt-8">
        <BannerDeck banners={banners} />
      </section>

      {/* comic hero */}
      <section className="wrap mt-8">
        <div className="panel relative overflow-hidden bg-cobalt text-white">
          <span className="rays rays-spin absolute top-1/2 left-[70%] h-[220%] w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-30" aria-hidden />
          <span className="halftone-fade absolute inset-0" aria-hidden />
          <Stars />
          <div className="relative grid items-center gap-8 p-6 md:grid-cols-[1.15fr_1fr] md:p-12">
            <div>
              <p className="bubble inline-block -rotate-2 px-4 py-2 text-[15px] font-bold text-ink">Солонгосын албан ёсны брэндүүд ✦</p>
              <h1 className="mt-6 text-white">
                <span className="mega outline-ink block text-[52px] leading-[0.9] text-sun sm:text-[72px] lg:text-[92px]">Супер</span>
                <span className="display block text-[clamp(26px,8.6vw,38px)] leading-[0.95] sm:text-[56px] lg:text-[68px]">бүсгүйчүүдэд</span>
                <span className="mega block text-[40px] leading-[0.95] sm:text-[56px] lg:text-[64px]">
                  супер <span className="text-tang">арчилгаа</span>
                </span>
              </h1>
              <p className="mt-5 max-w-md text-[16px] text-white/90">{business.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/skin-quest" className="btn btn-sun h-14 px-7 text-[17px]">
                  ★ Skin Quest эхлэх
                </Link>
                <Link href="/shop" className="btn btn-paper h-14 px-7 text-[17px]">
                  Дэлгүүр →
                </Link>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <span className="burst absolute inset-0 bg-ink" aria-hidden />
              <span className="burst absolute inset-[6px] bg-sun" aria-hidden />
              {heroPics.map((p, i) => (
                <Link key={p.slug} href={`/p/${p.slug}`} className="panel-sm tilt-hover absolute overflow-hidden bg-white" style={{ width: "44%", aspectRatio: "4/5", left: ["6%", "50%", "28%"][i], top: ["14%", "8%", "44%"][i], transform: `rotate(${[-8, 7, -2][i]}deg)` }}>
                  <Image src={p.images[0].thumb.src} alt={p.title} fill sizes="200px" className="object-contain p-3" priority={i === 0} />
                </Link>
              ))}
              <Burst size={92} color="var(--color-pink)" className="absolute -right-1 bottom-4" rotate={12}>
                {products.length}+
                <br />
                бараа
              </Burst>
            </div>
          </div>
        </div>
      </section>

      {/* facts ticker */}
      <div className="mt-10 overflow-hidden border-y-[3px] border-ink bg-sun py-3" aria-hidden>
        <div className="ticker flex w-max whitespace-nowrap">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="display flex items-center gap-10 pr-10 text-[22px]">
              <span>Хүргэлт {formatPrice(city.fee)}</span>
              <Star size={22} color="var(--color-tang)" />
              <span>{formatPrice(city.freeFrom)}-өөс дээш үнэгүй</span>
              <Star size={22} color="var(--color-pink)" />
              <span>48 цагт хүргэнэ</span>
              <Star size={22} color="var(--color-cobalt)" />
              <span>{brands.length} солонгос брэнд</span>
              <Star size={22} color="var(--color-tang)" />
              <span>QPay · Дансаар</span>
              <Star size={22} color="var(--color-pink)" />
            </span>
          ))}
        </div>
      </div>

      {/* skin types */}
      <section className="wrap mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="tag text-tang-2">Чиний арьс аль нь вэ?</p>
            <h2 className="text-[38px] md:text-[56px]">Арьсаараа сонго</h2>
          </div>
          <Link href="/skin-quest" className="btn btn-sun">
            ★ Skin Quest
          </Link>
        </div>
        <Scroller label="Арьсны төрөл" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6 md:mx-0 md:px-0">
          {skins.map((s, i) => (
            <Link key={s.id} href={`/shop?s=${s.id}`} className="panel tilt-hover relative flex h-44 w-[58vw] max-w-[240px] shrink-0 snap-start flex-col justify-between overflow-hidden p-5 sm:w-[220px]" style={{ background: ["#ffd1ae", "#ffe596", "#ffc2e0", "#c9d3ff", "#ddd1ff"][i % 5] }}>
              <span className="halftone absolute inset-0 opacity-40" aria-hidden />
              <span className="display relative text-[30px] leading-none sm:text-[32px]">{s.name}</span>
              <span className="relative flex items-center justify-between text-[14px] font-bold">
                {s.count} бараа <span className="display text-[24px]">→</span>
              </span>
            </Link>
          ))}
        </Scroller>
      </section>

      {/* hits */}
      <section className="wrap mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="tag text-cobalt">Хамгийн их захиалсан</p>
            <h2 className="text-[38px] md:text-[56px]">Хит бараа</h2>
          </div>
          <Link href="/shop" className="btn btn-paper">
            Бүгд
          </Link>
        </div>
        <Scroller label="Хит бараа" className={`${shelf} mt-6`}>
          {hits.map((p, i) => (
            <div key={p.slug} className={cell}>
              <ProductCard p={p} rank={i < 3 ? i + 1 : undefined} />
            </div>
          ))}
        </Scroller>
      </section>

      {/* routine steps */}
      <section className="mt-16 border-y-[3px] border-ink bg-pink">
        <div className="wrap relative py-14">
          <Zoom className="absolute top-6 right-4 hidden h-24 w-24 opacity-70 md:block" />
          <p className="tag">6 алхамт routine</p>
          <h2 className="text-[38px] md:text-[56px]">Алхам алхмаар</h2>
          <Scroller label="Алхам" className="no-bar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6 md:mx-0 md:px-0">
            {steps.map((s, i) => (
              <Link key={s.id} href={`/shop?st=${s.id}`} className="panel tilt-hover relative flex h-52 w-[62vw] max-w-[250px] shrink-0 snap-start flex-col overflow-hidden bg-white p-5 sm:w-[230px]">
                <span className="mega text-[64px] leading-none" style={{ color: s.tint, WebkitTextStroke: "2.5px var(--color-ink)" }}>
                  {i + 1}
                </span>
                <span className="display mt-auto text-[23px] leading-none">{s.name}</span>
                <span className="mt-1 text-[13.5px] text-ink-2">{s.line}</span>
                <span className="tag mt-2 text-[11px] text-cobalt">{s.count} бараа →</span>
              </Link>
            ))}
          </Scroller>
        </div>
      </section>

      {/* issues */}
      <section className="wrap mt-16">
        <p className="tag text-tang-2">Асуудлаа шийд</p>
        <h2 className="text-[38px] md:text-[56px]">Юу засах вэ?</h2>
        <Scroller label="Арьсны асуудал" small className="no-bar mt-6 flex gap-3 overflow-x-auto py-2">
          {issues.map((x, i) => (
            <Link key={x.id} href={`/shop?i=${x.id}`} className={`btn shrink-0 ${["btn-tang", "btn-cobalt", "btn-sun", "btn-pink", "btn-paper"][i % 5]}`}>
              {x.name} <span className="opacity-70">{x.count}</span>
            </Link>
          ))}
        </Scroller>
      </section>

      {masks.length > 0 && (
        <section className="wrap mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="tag text-cobalt">Өдөр бүр нэг маск</p>
              <h2 className="text-[38px] md:text-[56px]">Маскын диваажин</h2>
            </div>
            <Link href="/shop?st=mask" className="btn btn-paper">
              Бүх маск
            </Link>
          </div>
          <Scroller label="Маск" className={`${shelf} mt-6`}>
            {masks.map((p) => (
              <div key={p.slug} className={cell}>
                <ProductCard p={p} />
              </div>
            ))}
          </Scroller>
        </section>
      )}

      {/* brands */}
      <section className="wrap mt-14">
        <div className="panel relative overflow-hidden bg-ink p-6 text-white md:p-10">
          <span className="halftone absolute inset-0 opacity-10" aria-hidden />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[38px] text-sun md:text-[56px]">Брэндүүд</h2>
            <Link href="/brands" className="btn btn-sun">
              Бүгд
            </Link>
          </div>
          <Scroller label="Брэнд" small className="no-bar relative mt-6 flex gap-3 overflow-x-auto py-2">
            {brands.map((b) => (
              <Link key={b.id} href={`/shop?b=${b.id}`} className="display shrink-0 rounded-[12px] border-[3px] border-white px-5 py-3 text-[22px] transition hover:-rotate-2 hover:bg-tang">
                {b.name}
              </Link>
            ))}
          </Scroller>
        </div>
      </section>

      {fresh.length > 0 && (
        <section className="wrap mt-14">
          <p className="tag text-tang-2">Дөнгөж ирсэн</p>
          <h2 className="text-[38px] md:text-[56px]">Шинэ</h2>
          <Scroller label="Шинэ" className={`${shelf} mt-6`}>
            {fresh.map((p) => (
              <div key={p.slug} className={cell}>
                <ProductCard p={p} />
              </div>
            ))}
          </Scroller>
        </section>
      )}

      {sets.length > 0 && (
        <section className="wrap mt-14">
          <p className="tag text-cobalt">Багц ба будалт</p>
          <h2 className="text-[38px] md:text-[56px]">Гоё нэмэлт</h2>
          <Scroller label="Багц ба будалт" className={`${shelf} mt-6`}>
            {sets.map((p) => (
              <div key={p.slug} className={cell}>
                <ProductCard p={p} />
              </div>
            ))}
          </Scroller>
        </section>
      )}

      {/* store + delivery */}
      <section className="wrap mt-16 grid gap-5 md:grid-cols-3">
        <a href={business.store.map} target="_blank" rel="noopener noreferrer" className="panel tilt-hover bg-sun p-6 md:col-span-2">
          <PinIcon size={28} />
          <p className="display mt-3 text-[30px] leading-none">Дэлгүүр дээр ирээрэй</p>
          <p className="mt-2 text-[15px]">{business.store.address}</p>
          <p className="mt-3 flex items-center gap-2 text-[14px] font-bold">
            <ClockIcon size={16} /> Өдөр бүр {business.store.hours}
          </p>
        </a>
        <div className="panel bg-white p-6">
          <TruckIcon size={28} />
          <p className="display mt-3 text-[30px] leading-none">Хүргэлт</p>
          <p className="mt-2 text-[15px]">
            Улаанбаатарт {formatPrice(city.fee)}, {formatPrice(city.freeFrom)}-өөс дээш үнэгүй. {city.note}.
          </p>
          <a href={`tel:${business.phone.tel}`} className="mt-3 inline-flex items-center gap-2 font-bold text-tang-2">
            <PhoneIcon size={16} /> {business.phone.display}
          </a>
        </div>
      </section>
    </>
  );
}
