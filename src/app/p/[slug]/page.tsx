import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Star } from "@/components/deco";
import { Gallery } from "@/components/gallery";
import { ClockIcon, TruckIcon } from "@/components/icons";
import { ProductCard, tintOf } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, brands, byPopularity, getProduct, groups, issues, kinds, products, skins, sku, steps } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const name = [brands.find((b) => b.id === p.brand)?.name, p.title].filter(Boolean).join(" ");
  const desc = (p.intro[0] ?? "").slice(0, 160) || `${name}: ${formatPrice(p.variants[0].price)}`;
  return { title: name, description: desc, alternates: { canonical: `/p/${p.slug}` }, openGraph: { images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const brand = brands.find((b) => b.id === p.brand);
  const name = [brand?.name, p.title].filter(Boolean).join(" ");
  const step = steps.find((s) => p.steps.includes(s.id));
  const stepIndex = step ? steps.indexOf(step) : -1;
  const nextStep = stepIndex >= 0 && stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null;
  const group = groups.find((g) => g.id === p.group);
  const kind = kinds.find((k) => p.kinds.includes(k.id));
  const city = business.delivery[0];
  const v = p.variants[0];

  const related = products
    .filter((x) => x.slug !== p.slug && available(x))
    .map((x) => ({ x, score: (x.brand === p.brand ? 2 : 0) + x.issues.filter((c) => p.issues.includes(c)).length * 0.5 + (nextStep && x.steps.includes(nextStep.id) ? 3 : 0) + (x.group === p.group ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || byPopularity(a.x, b.x))
    .slice(0, 10)
    .map(({ x }) => x);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: sku(v.id),
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    image: p.images.map((m) => absoluteUrl(m.src)),
    description: p.intro[0] || undefined,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: v.price, sku: sku(v.id), availability: v.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-6 md:pt-10">
        <nav className="flex flex-wrap gap-x-1.5 text-[13px] font-bold text-ink-2" aria-label="Зам">
          <Link href="/shop" className="hover:text-tang-2">
            Дэлгүүр
          </Link>
          {group && (
            <>
              /
              <Link href={`/shop?g=${group.id}`} className="hover:text-tang-2">
                {group.name}
              </Link>
            </>
          )}
          {kind && (
            <>
              /
              <Link href={`/shop?k=${kind.id}`} className="hover:text-tang-2">
                {kind.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-5 grid gap-8 md:grid-cols-2 lg:gap-14">
          <Gallery images={p.images} alt={name} tint={tintOf(p)} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {brand && (
                <Link href={`/shop?b=${brand.id}`} className="tag rounded-[8px] border-[2.5px] border-ink bg-cobalt px-2.5 py-1 text-white hover:-rotate-2">
                  {brand.name}
                </Link>
              )}
              {step && (
                <Link href={`/shop?st=${step.id}`} className="tag rounded-[8px] border-[2.5px] border-ink px-2.5 py-1 hover:-rotate-2" style={{ background: step.tint }}>
                  Алхам {stepIndex + 1}: {step.name}
                </Link>
              )}
            </div>
            <h1 className="mt-4 text-[36px] md:text-[50px]">{p.title}</h1>
            {(p.spec.type || p.spec.size) && <p className="mt-2 text-[17px] font-bold text-ink-2">{[p.spec.type, p.spec.size].filter(Boolean).join(" · ")}</p>}

            {(p.skin.length > 0 || p.issues.length > 0) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {skins
                  .filter((s) => p.skin.includes(s.id))
                  .map((s) => (
                    <Link key={s.id} href={`/shop?s=${s.id}`} className="chip !min-h-8 !text-[13px]">
                      {s.name}
                    </Link>
                  ))}
                {issues
                  .filter((c) => p.issues.includes(c.id))
                  .map((c) => (
                    <Link key={c.id} href={`/shop?i=${c.id}`} className="chip !min-h-8 !bg-pink-2 !text-[13px]">
                      <Star size={12} /> {c.name}
                    </Link>
                  ))}
              </div>
            )}

            <div className="mt-6">
              <BuyBox slug={p.slug} v={v} />
            </div>

            <ul className="mt-5 grid gap-2 text-[14px]">
              <li className="flex items-start gap-3 rounded-[12px] border-2 border-ink bg-sky/50 px-4 py-3">
                <TruckIcon size={20} className="mt-0.5 shrink-0" />
                <span>
                  <b>Улаанбаатарт {formatPrice(city.fee)}</b>, {formatPrice(city.freeFrom)}-өөс дээш үнэгүй. {city.note}.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-[12px] border-2 border-ink bg-sun/50 px-4 py-3">
                <ClockIcon size={20} className="mt-0.5 shrink-0" />
                <span>
                  Дэлгүүр: {business.store.address}, {business.store.hours}.
                </span>
              </li>
            </ul>

            {p.intro.length > 0 && (
              <section className="mt-8">
                <h2 className="text-[26px]">Тайлбар</h2>
                <div className="prose-cg mt-3 text-[15.5px] text-ink-2">
                  {p.intro.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
                {p.spec.skin && (
                  <p className="mt-3 text-[15px]">
                    <b>Тохирох арьс:</b> {p.spec.skin}
                  </p>
                )}
                {p.spec.color && (
                  <p className="mt-2 text-[15px]">
                    <b>Өнгө:</b> {p.spec.color}
                  </p>
                )}
              </section>
            )}

            {p.ingredients.length > 0 && (
              <section className="mt-8">
                <h2 className="text-[26px]">Гол орц</h2>
                <ul className="mt-3 grid gap-2.5">
                  {p.ingredients.map((x) => (
                    <li key={x.name} className="panel-sm bg-white px-4 py-3">
                      <b className="block">{x.name}</b>
                      {x.what && <span className="text-[14px] text-ink-2">{x.what}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(p.howto || p.routine) && (
              <section className="mt-8 grid gap-3">
                {p.howto && (
                  <div className="panel-sm bg-paper-2 p-4">
                    <h2 className="display text-[20px]">Хэрэглэх заавар</h2>
                    <p className="mt-1 text-[15px] text-ink-2">{p.howto}</p>
                  </div>
                )}
                {p.routine && (
                  <div className="panel-sm bg-lilac/60 p-4">
                    <h2 className="display text-[20px]">Routine-д</h2>
                    <p className="mt-1 text-[15px] text-ink-2">{p.routine}</p>
                  </div>
                )}
              </section>
            )}
            {p.note && <p className="mt-6 rounded-[12px] border-2 border-ink bg-pink-2 px-4 py-3 text-[14px] font-bold">⚠ {p.note}</p>}
            <p className="mt-4 text-[12.5px] text-ink-3">Код: {sku(v.id)}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap mt-20">
          <p className="tag text-tang-2">{nextStep ? `Дараагийн алхам: ${nextStep.name}` : "Танд таалагдаж магадгүй"}</p>
          <h2 className="text-[34px] md:text-[48px]">Хамт хэрэглэвэл</h2>
          <Scroller label="Хамт хэрэглэвэл" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6 md:mx-0 md:gap-6 md:px-0">
            {related.map((x) => (
              <div key={x.slug} className="w-[46vw] max-w-[250px] shrink-0 snap-start sm:w-[220px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </>
  );
}
