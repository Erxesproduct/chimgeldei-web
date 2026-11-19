import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** Zochil product id. erxes product code CG-<id>. */
  id: string;
  label: string | null;
  price: number;
  compareAt: number | null;
  /** null: not counted on Zochil (orderable) */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Product = {
  id: number;
  slug: string;
  title: string;
  zochilName: string;
  brand: string | null;
  group: string;
  kinds: string[];
  steps: string[];
  /** Zochil «Арьсны төрөл» categories */
  skin: string[];
  /** Zochil «Арьсны асуудал» categories */
  issues: string[];
  variants: Variant[];
  orders: number;
  featured: boolean;
  createdAt: string;
  intro: string[];
  spec: { type: string | null; size: string | null; skin: string | null; color: string | null };
  ingredients: { name: string; what: string | null }[];
  howto: string | null;
  routine: string | null;
  note: string | null;
  images: Photo[];
};
export type Facet = { id: string; name: string; count: number };
export type Step = Facet & { line: string; tint: string };
export type Kind = Facet & { step: string | null };

export const products = data.products as Product[];
export const groups = data.groups as Facet[];
export const steps = data.steps as Step[];
export const skins = data.skins as Facet[];
export const issues = data.issues as Facet[];
export const kinds = data.kinds as Kind[];
export const brands = data.brands as Facet[];
export const banners = data.banners as { src: string; w: number; h: number; href: string | null; title: string }[];
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const brandName = (id: string | null) => (id ? (brands.find((b) => b.id === id)?.name ?? null) : null);
export const sku = (id: string) => `CG-${id}`;

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => p.variants[0].price;
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);

/** In stock first, then most ordered on Zochil. */
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || b.orders - a.orders || Number(b.featured) - Number(a.featured);
export const popular = [...products].sort(byPopularity);
