"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { business, deliveryFee, type PaymentId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLiteVariant } from "@/lib/lite";
import { localOrders } from "@/lib/local-orders";
import { DISTRICTS } from "@/lib/orders/places";
import type { OrderErrors } from "@/lib/orders/schema";
import { Star } from "./deco";
import { BagIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

const KEY = "chimgeldei.checkout-key";
/** One idempotency key per checkout attempt, kept until the order goes through. */
function checkoutKey() {
  try {
    const k = sessionStorage.getItem(KEY);
    if (k) return k;
    const n = crypto.randomUUID();
    sessionStorage.setItem(KEY, n);
    return n;
  } catch {
    return crypto.randomUUID();
  }
}

const city = business.delivery[0];

export function Checkout() {
  const items = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentId>("qpay");
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const lines = items.flatMap((i) => {
    const v = getLiteVariant(i.id);
    return v ? [{ ...i, v }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee("city", subtotal);
  const total = subtotal + fee;
  const toFree = subtotal <= city.freeFrom ? city.freeFrom - subtotal + 1 : 0;

  if (!lines.length)
    return (
      <div className="bubble mx-auto max-w-lg px-8 py-14 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-[3px] border-ink bg-sun">
          <BagIcon size={32} />
        </span>
        <p className="display mt-6 text-[34px]">Сагс хоосон</p>
        <p className="mt-2 text-ink-2">Арьсандаа тохирохоо Skin Quest-ээр олоорой.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-tang">
            Дэлгүүр
          </Link>
          <Link href="/skin-quest" className="btn btn-sun">
            ★ Skin Quest
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: checkoutKey(),
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery: "city",
          area: f.get("area"),
          khoroo: Number(f.get("khoroo")),
          address: f.get("address") ?? "",
          payment,
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.save({
          reference: json.reference,
          createdAt: new Date().toISOString(),
          subtotal: json.subtotal,
          deliveryFee: json.deliveryFee,
          total: json.total,
          lines: lines.map((l) => ({ name: [l.v.b, l.v.n].filter(Boolean).join(" "), label: l.v.z, qty: l.qty, total: l.v.p * l.qty })),
          method: json.method ?? payment,
          invoiceId: json.payment?.invoiceId ?? null,
          payUrl: json.payment?.url ?? null,
          status: json.payment ? "pending" : null,
        });
        try {
          sessionStorage.removeItem(KEY);
        } catch {}
        cart.clear();
        router.push(`/order/${json.reference}`);
        return;
      }
      if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалга одоогоор холбогдоогүй байна. Захиалгаа ${business.phone.display} дугаарт өгнө үү (лавлах код ${json.reference}, нийт ${formatPrice(json.total ?? total)}). Таны сагс хадгалагдсан.`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) =>
    errors[k] && (
      <p className="mt-1.5 text-[13.5px] font-bold text-tang-2" id={`e-${k}`}>
        {errors[k]}
      </p>
    );
  const step = (n: number, t: string, bg: string) => (
    <h2 className="flex items-center gap-3 normal-case">
      <span className="display grid h-11 w-11 -rotate-6 place-items-center rounded-[12px] border-[3px] border-ink text-[22px] shadow-[3px_3px_0_var(--color-ink)]" style={{ background: bg }}>
        {n}
      </span>
      <span className="display text-[28px]">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
      <div className="space-y-12">
        <section aria-label="Сагсны бараа">
          <ul className="space-y-3">
            {lines.map(({ id, qty, v }) => (
              <li key={id} className="panel-sm flex gap-4 bg-white p-3 md:p-4">
                <Link href={`/p/${v.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[12px] border-2 border-ink bg-paper-2 md:h-28 md:w-28">
                  {v.t && <Image src={v.t} alt="" fill sizes="112px" className="object-contain p-2 mix-blend-multiply" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  {v.b && <span className="tag text-[11px] text-cobalt">{v.b}</span>}
                  <Link href={`/p/${v.s}`} className="line-clamp-2 leading-snug font-bold hover:text-tang-2">
                    {v.n}
                  </Link>
                  <span className="text-[13px] text-ink-3">
                    {v.z ? `${v.z} · ` : ""}
                    {formatPrice(v.p)}
                  </span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-[10px] border-2 border-ink bg-paper">
                      <button type="button" onClick={() => cart.setQty(id, qty - 1)} className="grid h-9 w-9 place-items-center" aria-label="Цөөлөх">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-7 text-center font-bold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(id, qty + 1)} disabled={qty >= maxQty(id)} className="grid h-9 w-9 place-items-center disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <span className="display text-[20px] tabular-nums">{formatPrice(v.p * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(id, 0)} className="grid h-9 w-9 place-items-center rounded-[10px] text-ink-3 hover:bg-pink-2 hover:text-ink" aria-label={`${v.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          {step(1, "Захиалагч", "var(--color-sun)")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="label">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} className="field" />
              {err("name")}
            </label>
            <label className="label">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} className="field" />
              {err("phone")}
            </label>
            <label className="label sm:col-span-2">
              Имэйл <span className="font-normal text-ink-3">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section>
          {step(2, "Хүргэлт", "var(--color-pink)")}
          <div className="mt-5 flex items-start justify-between gap-4 rounded-[14px] border-[3px] border-ink bg-white p-4">
            <span>
              <b className="block">{city.name}</b>
              <span className="block text-[13.5px] text-ink-2">{city.note}</span>
            </span>
            <b className="display shrink-0 text-[20px]">{fee === 0 ? "Үнэгүй" : formatPrice(city.fee)}</b>
          </div>
          {toFree > 0 && (
            <p className="mt-3 flex items-center gap-2 text-[14px] font-bold text-ink-2">
              <Star size={16} /> Дахиад {formatPrice(toFree)} нэмбэл хүргэлт үнэгүй ({formatPrice(city.freeFrom)}-өөс дээш).
            </p>
          )}
          <p className="mt-2 text-[13.5px] text-ink-3">{business.rules.countryside}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <label className="label">
              Дүүрэг
              <select name="area" required defaultValue="" aria-invalid={!!errors.area} className="field">
                <option value="" disabled>
                  Сонгох
                </option>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {err("area")}
            </label>
            <label className="label">
              Хороо
              <input name="khoroo" type="number" inputMode="numeric" min={1} max={45} required aria-invalid={!!errors.khoroo} className="field" />
              {err("khoroo")}
            </label>
            <label className="label sm:col-span-2">
              Хаяг
              <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder="Байр, орц, давхар, тоот, орцны код" className="field" />
              {err("address")}
            </label>
          </div>
        </section>

        <section>
          {step(3, "Төлбөр, и-баримт", "var(--color-sky)")}
          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Төлбөрийн хэлбэр">
            {business.payments.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={payment === p.id} onClick={() => setPayment(p.id)} className={`rounded-[14px] border-[3px] border-ink p-4 text-left transition ${payment === p.id ? "bg-ink text-white shadow-[4px_4px_0_var(--color-tang)]" : "bg-white hover:-translate-y-0.5"}`}>
                <b className="display block text-[19px]">{p.name}</b>
                <span className="mt-1 block text-[13px] opacity-80">{p.note}</span>
              </button>
            ))}
          </div>
          {err("payment")}
          {payment === "transfer" && (
            <div className="mt-4 rounded-[14px] border-[3px] border-dashed border-ink bg-sun/40 p-4 text-[14px]">
              <b>{business.bank.bank}</b> · {business.bank.account} · {business.bank.holder}
              <p className="mt-1 text-ink-2">Захиалсны дараа захиалгын код гарна. {business.bank.rule}</p>
            </div>
          )}
          <div className="mt-6 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {text}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="label mt-4">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className="field" />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-ink-2">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="label mt-6">
            Нэмэлт тайлбар <span className="font-normal text-ink-3">(хүргэх цаг гэх мэт)</span>
            <textarea name="note" rows={2} className="field" />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="panel relative overflow-hidden bg-cobalt p-6 text-white md:p-8">
          <span className="halftone absolute inset-0 opacity-20" aria-hidden />
          <div className="relative">
            <p className="tag text-sun">Төлөх дүн</p>
            <dl className="mt-4 space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-white/75">Бараа</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/75">Хүргэлт</dt>
                <dd className="tabular-nums">{fee === 0 ? "Үнэгүй" : formatPrice(fee)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t-2 border-white/25 pt-4">
                <dt className="font-bold">Нийт</dt>
                <dd className="display text-[40px] text-sun tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[13px] leading-snug text-white/75">{business.rules.payment}</p>
            <p className="mt-2 text-[13px] leading-snug text-white/75">{business.rules.delivery}</p>
            {notice && (
              <p role="alert" className="mt-5 rounded-[12px] border-2 border-ink bg-white px-4 py-3 text-[14px] text-ink">
                {notice}
              </p>
            )}
            {errors.items && <p className="mt-4 rounded-[12px] border-2 border-ink bg-tang px-4 py-2.5 text-[14px]">{errors.items}</p>}
            <button type="submit" disabled={busy} className="btn btn-sun mt-6 h-14 w-full text-[17px]">
              {busy ? "Илгээж байна…" : payment === "qpay" ? "Захиалах, QPay-ээр төлөх" : "Захиалах, дансаар төлөх"}
            </button>
            <a href={`tel:${business.phone.tel}`} className="mt-5 inline-flex items-center gap-2 text-[14px] text-white/85 hover:text-sun">
              <PhoneIcon size={16} /> {business.phone.display}
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}
