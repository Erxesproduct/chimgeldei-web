"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { localOrders, useLocalOrders } from "@/lib/local-orders";
import { CheckIcon, ClockIcon, CloseIcon, PhoneIcon } from "./icons";

const LABEL: Record<string, { title: string; text: string; tone: "ok" | "wait" | "bad" }> = {
  paid: { title: "Төлбөр төлөгдлөө", text: "Захиалга баталгаажлаа. 48 цагийн дотор (баяр, хямдралын үед 72 цагт) хүргэнэ.", tone: "ok" },
  pending: { title: "Төлбөр хүлээгдэж байна", text: "QPay-ээр төлсний дараа энэ хуудас автоматаар шинэчлэгдэнэ.", tone: "wait" },
  failed: { title: "Төлбөр амжилтгүй", text: "Төлбөр хийгдсэнгүй. Дахин оролдох эсвэл бидэнтэй холбогдоно уу.", tone: "bad" },
  cancelled: { title: "Нэхэмжлэл цуцлагдсан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  rejected: { title: "Төлбөр татгалзсан", text: "Банк төлбөрийг татгалзсан. Бидэнтэй холбогдоно уу.", tone: "bad" },
  expired: { title: "Нэхэмжлэлийн хугацаа дууссан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  refunded: { title: "Төлбөр буцаагдсан", text: "Төлбөрийг буцаан шилжүүлсэн.", tone: "bad" },
};
const TERMINAL = ["paid", "failed", "cancelled", "rejected", "expired", "refunded"];
const TONE = { ok: "bg-[#c9f0dd]", wait: "bg-sun/60", bad: "bg-pink-2" };

export function OrderStatus({ reference }: { reference: string }) {
  const orders = useLocalOrders();
  const order = orders.find((o) => o.reference === reference) ?? null;
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const tries = useRef(0);

  const check = useCallback(async () => {
    const o = localOrders.get(reference);
    if (!o?.invoiceId) return;
    setChecking(true);
    try {
      const res = await fetch("/api/payments/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId: o.invoiceId }) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.setStatus(reference, json.status);
        setCheckError(null);
      } else setCheckError(json?.error === "not_configured" ? "Төлбөрийн систем холбогдоогүй байна." : "Төлбөр шалгахад алдаа гарлаа.");
    } catch {
      setCheckError("Интернэт холболтоо шалгана уу.");
    } finally {
      setChecking(false);
    }
  }, [reference]);

  // check on arrival (also when coming back from the QPay page), then every 5 s while pending and visible, for 10 min
  const status = order?.status ?? null;
  useEffect(() => {
    if (!order?.invoiceId || (status && TERMINAL.includes(status))) return;
    const first = window.setTimeout(check, 300);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (++tries.current > 120) return window.clearInterval(id);
      check();
    }, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [order?.invoiceId, status, check]);

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(text);
        window.setTimeout(() => setCopied(null), 1600);
      },
      () => {},
    );
  };

  if (!order)
    return (
      <div className="bubble mx-auto max-w-xl p-8 text-center md:p-12">
        <p className="display text-[32px]">{reference}</p>
        <p className="mt-3 text-ink-2">Энэ захиалга энэ төхөөрөмж дээр хадгалагдаагүй байна. Захиалгынхаа явцыг утсаар лавлана уу.</p>
        <a href={`tel:${business.phone.tel}`} className="btn btn-tang mt-8">
          <PhoneIcon size={16} /> {business.phone.display}
        </a>
      </div>
    );

  const transfer = order.method === "transfer";
  const s = status ? (LABEL[status] ?? LABEL.pending) : null;
  const paid = status === "paid";
  const row = (k: string, v: string) => (
    <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink/20 py-2.5 last:border-0">
      <dt className="text-[13.5px] text-ink-2">{k}</dt>
      <dd className="flex min-w-0 items-center gap-2">
        <b className="truncate">{v}</b>
        <button type="button" onClick={() => copy(v)} className="tag shrink-0 rounded-[6px] border-2 border-ink bg-white px-1.5 py-0.5 text-[10px]">
          {copied === v ? "Хуулсан" : "Хуулах"}
        </button>
      </dd>
    </div>
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="panel pow-in overflow-hidden bg-white">
        <div className="relative overflow-hidden bg-tang p-8 text-white md:p-10">
          <span className="rays absolute -top-1/2 -right-1/4 h-[200%] w-[80%] opacity-25" aria-hidden />
          <p className="tag relative text-sun">Захиалга хүлээн авлаа</p>
          <h1 className="relative mt-1 text-[48px] md:text-[64px]">Бам! Баярлалаа</h1>
          <p className="relative mt-2 text-white/90">
            Захиалгын код: <b className="display text-[22px] text-sun">{order.reference}</b>
          </p>
        </div>
        <div className="p-8 md:p-10">
          {transfer ? (
            <div className="rounded-[14px] border-[3px] border-ink bg-sun/40 p-5" role="status">
              <b className="display block text-[20px]">Дансаар шилжүүлнэ үү</b>
              <dl className="mt-3">
                {row("Банк", business.bank.bank)}
                {row("Данс", business.bank.account)}
                {row("Хүлээн авагч", business.bank.holder)}
                {row("Дүн", String(order.total))}
                {row("Гүйлгээний утга", order.reference)}
              </dl>
              <p className="mt-3 text-[13.5px] font-bold">{business.bank.rule}</p>
              <p className="mt-1 text-[13.5px] text-ink-2">{business.rules.payment}</p>
            </div>
          ) : s ? (
            <div className={`flex gap-4 rounded-[14px] border-[3px] border-ink p-4 ${TONE[s.tone]}`} role="status" aria-live="polite">
              <span className="mt-0.5">{s.tone === "ok" ? <CheckIcon size={20} /> : s.tone === "bad" ? <CloseIcon size={20} /> : <ClockIcon size={20} />}</span>
              <span>
                <span className="block font-bold">{s.title}</span>
                <span className="block text-[14px] text-ink-2">{s.text}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-[14px] border-[3px] border-ink bg-sun/50 p-4 text-[14px]" role="status">
              <b className="block">Төлбөрийн нэхэмжлэл үүсээгүй</b>
              Захиалга бүртгэгдсэн. QPay нэхэмжлэлийг бид таны утас руу илгээнэ, эсвэл {business.phone.display} дугаарт залгана уу.
            </div>
          )}
          {!transfer && order.payUrl && !paid && status && !TERMINAL.includes(status) && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={order.payUrl} className="btn btn-tang">
                QPay-ээр төлөх
              </a>
              <button type="button" onClick={check} disabled={checking} className="btn btn-paper">
                {checking ? "Шалгаж байна…" : "Төлбөр шалгах"}
              </button>
            </div>
          )}
          {checkError && <p className="mt-3 text-[13.5px] font-bold text-tang-2">{checkError}</p>}

          <ul className="mt-8 space-y-2.5 text-[14.5px]">
            {order.lines.map((l) => (
              <li key={`${l.name}|${l.label}`} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name}
                  {l.label ? ` (${l.label})` : ""} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">Хүргэлт</span>
              <span className="tabular-nums">{order.deliveryFee === 0 ? "Үнэгүй" : formatPrice(order.deliveryFee)}</span>
            </li>
            <li className="display flex justify-between gap-4 border-t-[3px] border-ink pt-4 text-[26px]">
              <span>Нийт</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[13.5px] text-ink-2">{business.rules.ebarimt}</p>
        </div>
      </div>
      <aside className="panel self-start bg-pink-2 p-8 md:p-10">
        <p className="tag text-cobalt">Захиалгын явц</p>
        <ol className="mt-6 space-y-5">
          {ORDER_STATUSES.filter((x) => x.id !== "cancelled").map((x, i) => {
            const reached = i === 0 || (paid && i === 1);
            return (
              <li key={x.id} className="flex gap-4">
                <span className={`display mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border-[2.5px] border-ink text-[15px] ${reached ? "bg-ink text-sun" : "bg-white text-ink-3"}`}>{i + 1}</span>
                <span>
                  <span className={`block text-[15px] ${reached ? "font-bold" : "text-ink-2"}`}>{x.name}</span>
                  <span className="block text-[13px] text-ink-3">{x.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-[13px] text-ink-2">Төлбөрөөс хойших шатуудыг (савлах, хүргэлтэд гарах) бид утсаар мэдэгдэнэ.</p>
        <Link href="/shop" className="btn btn-paper mt-8">
          Дэлгүүр хэсэх →
        </Link>
      </aside>
    </div>
  );
}
