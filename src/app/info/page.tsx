import type { Metadata } from "next";
import { Stars } from "@/components/deco";
import { ClockIcon, PhoneIcon, PinIcon, TruckIcon } from "@/components/icons";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, дэлгүүр",
  description: "CHIMGELDEI: Улаанбаатарт 48 цагт хүргэлт, QPay болон дансаар төлбөр, и-баримт, дэлгүүрийн хаяг, цагийн хуваарь.",
  alternates: { canonical: "/info" },
};

export default function Info() {
  return (
    <>
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-pink">
        <span className="halftone absolute inset-0 opacity-30" aria-hidden />
        <Stars />
        <div className="wrap relative py-12 md:py-16">
          <p className="tag text-cobalt">Хамгийн хэрэгтэй нь</p>
          <h1 className="text-[44px] md:text-[64px]">Хүргэлт, төлбөр, дэлгүүр</h1>
        </div>
      </section>

      <div className="wrap mt-10 grid gap-5 md:grid-cols-2">
        <section id="delivery" className="panel scroll-mt-36 bg-sky/60 p-7 md:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-[12px] border-[2.5px] border-ink bg-white">
            <TruckIcon size={24} />
          </span>
          <h2 className="mt-4 text-[30px]">Хүргэлт</h2>
          <ul className="mt-4 space-y-3">
            {business.delivery.map((d) => (
              <li key={d.id} className="flex items-start justify-between gap-4 rounded-[12px] border-2 border-ink bg-white px-4 py-3">
                <span>
                  <b className="block">{d.name}</b>
                  <span className="text-[14px] text-ink-2">{d.note}</span>
                </span>
                <span className="display shrink-0 text-right text-[20px]">
                  {formatPrice(d.fee)}
                  <span className="block text-[12px] font-bold text-ink-2 normal-case">{formatPrice(d.freeFrom)}-өөс дээш үнэгүй</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14.5px]">{business.rules.delivery}</p>
          <p className="mt-2 text-[14.5px] font-bold">{business.rules.countryside}</p>
        </section>

        <section id="payment" className="panel scroll-mt-36 bg-sun/70 p-7 md:p-9">
          <span className="display grid h-12 w-12 place-items-center rounded-[12px] border-[2.5px] border-ink bg-white text-[20px]">₮</span>
          <h2 className="mt-4 text-[30px]">Төлбөр, и-баримт</h2>
          <ul className="mt-4 space-y-3">
            {business.payments.map((p) => (
              <li key={p.id} className="rounded-[12px] border-2 border-ink bg-white px-4 py-3">
                <b className="block">{p.name}</b>
                <span className="text-[14px] text-ink-2">{p.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14.5px]">
            <b>Данс:</b> {business.bank.bank} {business.bank.account} ({business.bank.holder}). {business.bank.rule}
          </p>
          <p className="mt-2 text-[14.5px]">{business.rules.payment}</p>
          <p className="mt-2 text-[14.5px] text-ink-2">{business.rules.ebarimt}</p>
        </section>
      </div>

      <section id="status" className="wrap mt-14 scroll-mt-36">
        <h2 className="text-[34px] md:text-[44px]">Захиалгын явц</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER_STATUSES.map((s, i) => (
            <li key={s.id} className="panel-sm flex items-start gap-3 bg-white p-4">
              <span className="display grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border-[2.5px] border-ink bg-tang text-white">{i + 1}</span>
              <span>
                <b className="block">{s.name}</b>
                <span className="text-[13.5px] text-ink-2">{s.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="store" className="wrap mt-14 grid scroll-mt-36 gap-5 md:grid-cols-2">
        <a href={business.store.map} target="_blank" rel="noopener noreferrer" className="panel tilt-hover flex flex-col bg-white p-6">
          <span className="grid h-12 w-12 place-items-center rounded-[12px] border-[2.5px] border-ink bg-tang text-white">
            <PinIcon size={22} />
          </span>
          <b className="display mt-4 text-[26px]">Дэлгүүр</b>
          <span className="mt-1 text-[15px] text-ink-2">{business.store.address}</span>
          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-[8px] border-2 border-ink bg-sun px-3 py-1 text-[13px] font-bold">
            <ClockIcon size={14} /> {business.store.hours}
          </span>
          <span className="mt-4 text-[14px] font-bold text-tang-2">Газрын зураг →</span>
        </a>
        <div className="panel flex flex-col bg-lilac p-6">
          <b className="display text-[26px]">Асуух зүйл байна уу?</b>
          <p className="mt-2 text-[15px]">Бүтээгдэхүүн, захиалга, хүргэлтийн талаар утсаар эсвэл Facebook, Instagram-аар бичээрэй.</p>
          <div className="mt-auto flex flex-wrap gap-3 pt-5">
            <a href={`tel:${business.phone.tel}`} className="btn btn-ink">
              <PhoneIcon size={16} /> {business.phone.display}
            </a>
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
              Facebook
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="wrap mt-14">
        <div className="bubble p-7 md:p-10">
          <p className="tag text-tang-2">Бидний тухай</p>
          <p className="display mt-2 text-[28px] md:text-[36px]">{business.tagline}</p>
          <p className="mt-3 text-[16px] text-ink-2">{business.description}</p>
        </div>
      </section>
    </>
  );
}
