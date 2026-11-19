// node scripts/export-erxes.mjs → docs/erxes/chimgeldei-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `CG-${id.toUpperCase()}`;

// categories: groups (parent CG) → kinds (parent = the group most of their products are in)
const groupOfKind = (k) => {
  const n = {};
  for (const p of c.products) if (p.kinds.includes(k)) n[p.group] = (n[p.group] ?? 0) + 1;
  return Object.entries(n).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "skincare";
};
const cats = [["code", "name", "parent code"], ["CG", "CHIMGELDEI", ""]];
for (const g of c.groups) cats.push([code(g.id), g.name, "CG"]);
for (const k of c.kinds) if (!c.groups.some((g) => g.id === k.id)) cats.push([code(k.id), k.name, code(groupOfKind(k.id))]);
cats.push(["CG-DELIVERY", "Хүргэлт", "CG"]);
writeFileSync(path.join(out, "chimgeldei-categories.csv"), csv(cats));

const bName = Object.fromEntries(c.brands.map((b) => [b.id, b.name]));
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "brand", "size", "stock (Zochil)", "skin types", "skin issues", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `CG-${v.id}`,
      [bName[p.brand], p.title, v.label].filter(Boolean).join(" ").slice(0, 200),
      p.kinds[0] && !c.groups.some((g) => g.id === p.kinds[0]) ? code(p.kinds[0]) : code(p.group),
      "product",
      v.price,
      v.compareAt ?? "",
      bName[p.brand] ?? "",
      p.spec.size ?? "",
      v.stock ?? "",
      p.skin.join(" "),
      p.issues.join(" "),
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "chimgeldei-products.csv"), csv(rows));

const d = c.shop.delivery;
writeFileSync(
  path.join(out, "chimgeldei-delivery.csv"),
  csv([["code", "name", "category code", "type", "unit price", "free above (goods total)", "source"], ...d.map((x) => [`CG-DELIVERY-${x.id}`, `Хүргэлт: ${x.title}`, "CG-DELIVERY", "service", x.price, x.freeFrom ?? "", `Zochil delivery option ${x.id}`])]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery ${d.length}`);
