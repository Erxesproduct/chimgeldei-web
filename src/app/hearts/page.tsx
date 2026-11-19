import type { Metadata } from "next";
import { HeartsView } from "@/components/hearts-view";

export const metadata: Metadata = { title: "Хадгалсан", robots: { index: false } };

export default function HeartsPage() {
  return (
    <div className="wrap pt-8 md:pt-12">
      <p className="tag text-pink">♥ Миний жагсаалт</p>
      <h1 className="text-[44px] md:text-[60px]">Хадгалсан</h1>
      <HeartsView />
    </div>
  );
}
