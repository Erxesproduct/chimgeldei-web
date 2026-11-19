import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-8 pb-10 md:pt-12">
      <p className="tag text-tang-2">Бараг л болчихлоо</p>
      <h1 className="mb-8 text-[44px] md:text-[60px]">Сагс, захиалга</h1>
      <Checkout />
    </div>
  );
}
