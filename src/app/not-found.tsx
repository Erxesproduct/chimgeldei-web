import Link from "next/link";
import { Burst } from "@/components/deco";

export default function NotFound() {
  return (
    <div className="wrap py-20 text-center">
      <Burst size={140} color="var(--color-tang)" rotate={-10} className="bob">
        <span className="text-white">404</span>
      </Burst>
      <h1 className="mt-6 text-[44px] md:text-[60px]">Уупс! Олдсонгүй</h1>
      <p className="mt-2 text-ink-2">Хаяг буруу эсвэл бүтээгдэхүүн шилжсэн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-tang">
          Дэлгүүр
        </Link>
        <Link href="/" className="btn btn-paper">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
