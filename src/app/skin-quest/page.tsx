import type { Metadata } from "next";
import { Burst, Stars } from "@/components/deco";
import { SkinQuest } from "@/components/skin-quest";
import { issues, skins, steps } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Skin Quest",
  description: "Арьсны төрөл, асуудлаа сонгоод CHIMGELDEI-ийн бүтээгдэхүүнээс 6 алхамт routine-ээ гаргаарай.",
  alternates: { canonical: "/skin-quest" },
};

export default function SkinQuestPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b-[3px] border-ink bg-sun">
        <span className="rays rays-spin absolute top-1/2 left-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-30" aria-hidden />
        <Stars />
        <div className="wrap relative py-12 text-center md:py-16">
          <Burst size={86} color="var(--color-pink)" rotate={-12}>
            2
            <br />
            алхам
          </Burst>
          <h1 className="mega mt-4 text-[52px] leading-none md:text-[88px]">
            <span className="outline-ink text-white">Skin</span> Quest
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-bold">Арьсны төрөл, асуудлаа сонго. Бид дэлгүүрийн бараанаас алхам бүрт нэгийг сонгож өгье.</p>
        </div>
      </section>
      <div className="wrap mt-10">
        <SkinQuest skins={skins.map(({ id, name }) => ({ id, name }))} issues={issues.map(({ id, name }) => ({ id, name }))} steps={steps.map(({ id, name, line, tint }) => ({ id, name, line, tint }))} />
      </div>
    </>
  );
}
