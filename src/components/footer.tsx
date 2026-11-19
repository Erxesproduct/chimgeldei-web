import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Star } from "./deco";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t-3 border-ink bg-cobalt text-paper">
      <div className="halftone-fade absolute inset-0" aria-hidden />
      <div className="wrap relative grid gap-10 pt-14 pb-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Image src="/brand/logo-white.png" alt="CHIMGELDEI" width={700} height={102} className="h-7 w-auto" />
          <p className="display slant mt-6 text-[36px] leading-none text-sun md:text-[44px]">{business.tagline}</p>
          <p className="mt-4 max-w-sm text-[15px] text-paper/80">{business.description}</p>
          <div className="mt-6 flex gap-3">
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-[12px] border-[2.5px] border-ink bg-paper text-ink shadow-[3px_3px_0_var(--color-ink)] transition hover:bg-sun" aria-label="Facebook">
              <FacebookIcon size={19} />
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-[12px] border-[2.5px] border-ink bg-paper text-ink shadow-[3px_3px_0_var(--color-ink)] transition hover:bg-pink" aria-label="Instagram">
              <InstagramIcon size={19} />
            </a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href={business.store.map} target="_blank" rel="noopener noreferrer" className="panel tilt-hover bg-paper p-5 text-ink sm:col-span-2">
            <span className="flex items-center gap-2">
              <PinIcon size={20} className="text-tang" />
              <span className="display text-[20px]">Дэлгүүр</span>
            </span>
            <span className="mt-1 block text-[15px]">{business.store.address}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] border-2 border-ink bg-sun px-2.5 py-0.5 text-[13px] font-bold">
              <ClockIcon size={14} /> Өдөр бүр {business.store.hours}
            </span>
          </a>
          <a href={`tel:${business.phone.tel}`} className="panel tilt-hover flex items-center gap-4 bg-tang p-5 text-white">
            <PhoneIcon size={26} />
            <span>
              <span className="tag block opacity-90">Утас</span>
              <span className="display block text-[28px] leading-none">{business.phone.display}</span>
            </span>
          </a>
          <a href={`mailto:${business.email}`} className="panel tilt-hover flex items-center gap-4 bg-pink p-5 text-ink">
            <MailIcon size={26} />
            <span className="min-w-0">
              <span className="tag block">Имэйл</span>
              <span className="block truncate text-[15.5px] font-bold">{business.email}</span>
            </span>
          </a>
        </div>
      </div>
      <div className="wrap relative flex flex-wrap items-center gap-x-6 gap-y-2 border-t-2 border-paper/20 py-6 text-[14px] text-paper/80">
        {[
          ["/shop", "Дэлгүүр"],
          ["/skin-quest", "Skin Quest"],
          ["/brands", "Брэндүүд"],
          ["/info", "Хүргэлт, төлбөр"],
        ].map(([h, t]) => (
          <Link key={h} href={h} className="hover:text-sun">
            {t}
          </Link>
        ))}
        <span className="ml-auto flex items-center gap-2">
          © {new Date().getFullYear()} {business.fullName} <Star size={14} />
        </span>
      </div>
    </footer>
  );
}
