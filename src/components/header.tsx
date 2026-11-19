import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Star } from "./deco";
import { HeaderTools } from "./header-tools";
import { Scroller } from "./scroller";

export const NAV = [
  { href: "/shop?g=skincare", label: "Арьс арчилгаа" },
  { href: "/shop?st=mask", label: "Маск" },
  { href: "/shop?g=makeup", label: "Нүүр будалт" },
  { href: "/shop?g=body", label: "Бие" },
  { href: "/shop?g=sets", label: "Багц" },
  { href: "/brands", label: "Брэнд" },
  { href: "/skin-quest", label: "Skin Quest", hot: true },
];

export function Header() {
  const city = business.delivery[0];
  const tick = [`${formatPrice(city.freeFrom)}-өөс дээш хүргэлт үнэгүй`, "Солонгосын албан ёсны брэндүүд", "48 цагт хүргэнэ", "QPay · дансаар", business.tagline];
  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden border-b-3 border-ink bg-ink py-1.5 text-paper" aria-label="Мэдээлэл">
        <div className="ticker flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-8 pr-8" aria-hidden={k ? true : undefined}>
              {tick.map((t) => (
                <span key={t} className="tag flex items-center gap-8">
                  {t} <Star size={14} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="border-b-3 border-ink bg-paper">
        <div className="wrap flex h-[66px] items-center gap-4 md:h-[76px]">
          <Link href="/" className="shrink-0" aria-label={`${business.fullName}: нүүр хуудас`}>
            <Image src="/brand/logo.png" alt="CHIMGELDEI" width={690} height={100} priority className="h-[22px] w-auto md:h-[26px]" />
          </Link>
          <nav aria-label="Үндсэн цэс" className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((n) =>
              n.hot ? (
                <Link key={n.href} href={n.href} className="display ml-2 -rotate-2 rounded-[10px] border-[2.5px] border-ink bg-sun px-3 py-1 text-[15px] shadow-[3px_3px_0_var(--color-ink)] transition hover:rotate-0">
                  ★ {n.label}
                </Link>
              ) : (
                <Link key={n.href} href={n.href} className="display-n rounded-[10px] px-3 py-2 text-[15px] transition hover:bg-pink-2">
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <HeaderTools />
        </div>
        <Scroller as="nav" label="Ангилал" small className="no-bar wrap flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`chip shrink-0 ${n.hot ? "!bg-sun" : ""}`}>
              {n.hot && "★"} {n.label}
            </Link>
          ))}
        </Scroller>
      </div>
    </header>
  );
}
