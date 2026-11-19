import data from "@/data/catalog.json";

/**
 * Business facts from chimgeldei.com (Zochil shop 5587: shop settings, payment / delivery rules, delivery option),
 * read on 2026-11-19. Nothing here is invented; open points are in docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const city = shop.delivery.find((d) => d.title === "Улаанбаатар");

export const business = {
  name: "CHIMGELDEI",
  fullName: "CHIMGELDEI BEAUTY STORE",
  domain: "chimgeldei.com",
  /** The shop's own banner line. */
  tagline: "Супер бүсгүйчүүдэд супер арчилгаа",
  description: "Солонгос улсын баталгаатай, чанартай, үр дүн бүхий брэндүүдийг албан ёсны эрхтэйгээр худалдаалж байна.",
  phone: { display: "8808-2629", tel: "+97688082629" },
  email: shop.email,
  instagram: "https://instagram.com/chimgeldei",
  facebook: "https://www.facebook.com/profile.php?id=100066410901490",
  store: {
    address: "Улсын их дэлгүүрийн замын урд талд, 40 мянгатын зам дагуу",
    hours: "11:00–20:00",
    map: "https://www.google.com/maps/search/?api=1&query=%D0%A3%D0%BB%D1%81%D1%8B%D0%BD+%D0%B8%D1%85+%D0%B4%D1%8D%D0%BB%D0%B3%D2%AF%D2%AF%D1%80+Ulaanbaatar",
  },
  /** Zochil payment rule: QPay or bank transfer; confirmed 15–20 minutes after payment. */
  payments: [
    { id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө. Захиалга өгсний дараа төлбөрийн хуудас нээгдэнэ." },
    { id: "transfer", name: "Дансаар шилжүүлэх", note: "Захиалгын кодоо гүйлгээний утгад бичнэ." },
  ],
  bank: {
    bank: "Худалдаа Хөгжлийн Банк",
    account: "803026316",
    holder: "Чимгэлдэй Бьюти Стор ХХК",
    rule: "Гүйлгээний утгад зөвхөн захиалгын кодоо бичнэ үү. Нэр, утас гэх мэт өөр зүйл бичвэл хүргэлт баталгаажихгүй.",
  },
  /** Zochil delivery option «Улаанбаатар» (Үндсэн хүргэлт): 7,000₮, free above 300,000₮. The rule text says 6,000₮ in zones A–B: open question 1. */
  delivery: [{ id: "city", name: "Улаанбаатар хот", note: "Баталгаажсанаас хойш 48 цагт (баяр, хямдралын үед 72 цагт)", fee: city?.price ?? 7000, freeFrom: city?.freeFrom ?? 300000 }],
  rules: {
    payment: "Төлбөрөө төлснөөс хойш 15–20 минутын дараа захиалга баталгаажиж хүргэлтэд бэлтгэгдэнэ.",
    delivery: "Захиалга баталгаажсанаас хойш 48 цагийн дотор хүргэгдэнэ. Баярт өдрүүд, хямдрал урамшууллын үед 72 цаг.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
    countryside: "Одоогоор онлайнаар зөвхөн Улаанбаатар хотод хүргэнэ. Орон нутаг руу илгээх бол утсаар лавлана уу.",
  },
} as const;

export type DeliveryId = "city";
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id) ?? business.delivery[0];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil: 7,000₮, free when the goods subtotal is above 300,000₮. */
export function deliveryFee(id: DeliveryId, subtotal: number): number {
  const d = deliveryOption(id);
  return d.freeFrom && subtotal > d.freeFrom ? 0 : d.fee;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Хүлээгдэж байна", note: "Захиалга ирсэн, төлбөр хүлээгдэж байна" },
  { id: "confirmed", name: "Баталгаажсан", note: "Төлбөр орсноос 15–20 минутын дараа" },
  { id: "packing", name: "Бэлтгэж байна", note: "Савлаж, хүргэлтэд бэлтгэж байна" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "48 цагийн дотор (баяраар 72)" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Хүлээн авсан" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй эсвэл цуцалсан" },
] as const;
