# CHIMGELDEI BEAUTY STORE: erxes manual steps

Owner of every step below: **Terbish**, with CHIMGELDEI for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → chimgeldei-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for CHIMGELDEI yet ("erxes 3.0: NOT SET"). Create the workspace first.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 196 products imported from Zochil | import the CSVs (section 1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin; bank transfer with the order code | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Ulaanbaatar 7,000₮, free above 300,000₮; address form; status list | delivery product, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (27 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: chimgeldei.com (Zochil shop 5587), read 2026-11-19: **196 products**, one price each (no options),
MNT prices 3,800₮–148,800₮, 511 photos (pre-sized WebP on the website), 1 banner.

- Groups from the Zochil category tree: skin care 147, makeup 24, body 14, sets 10, tools 1.
- Kinds (cleansers, toners, serums, creams, sun, masks, …) and the 6-step routine (cleanse, prep, boost, moisturise,
  protect, mask) come from the Zochil sub-categories.
- Skin types (dry, normal, combination, oily, sensitive) and skin issues (spots, dryness, pores, wrinkles, oil,
  redness, scars) are the shop's own Zochil categories «Арьсны төрөл» / «Арьсны асуудал». The Skin Quest page only
  filters by them; it is labelled as a shortcut, not a diagnosis. 106 products have no skin type set.
- Brands (18) from the Zochil brand field / name start; **27 products have no brand** (open question 5).
- Product descriptions are split into intro, type / size / skin, key ingredients, how to use, routine and warnings.
- Prices: Zochil price. No sale price was active when the catalog was read (the old campaign had ended).
- Stock: only 2 products track stock on Zochil (Turn On Light Finish Blusher 90, Derma Synergy Wrapping Mask
  Retinol X LHA 10); the others are orderable (not counted).
- Old Zochil URLs (`/products/<category>/<id>`, 66 category pages, `/about`, `/checkout`, …) redirect to the new pages.

Files (made by `npm run export:erxes` from `src/data/catalog.json`):

- `docs/erxes/chimgeldei-categories.csv`: 42 rows, parent `CG`, groups `CG-SKINCARE`, `CG-MAKEUP`, …, kinds under
  them, `CG-DELIVERY`.
- `docs/erxes/chimgeldei-products.csv`: 196 rows, code `CG-<zochilId>`, name, category, unit price, brand, size,
  Zochil stock, skin types, skin issues, photo path.

Steps:

1. **Products & services → Categories**: import `chimgeldei-categories.csv` (parents first; already ordered).
2. **Settings → Import & Export → Import → Products**: upload `chimgeldei-products.csv`. Map `code → Code`,
   `name → Name`, `category code → Category code`, `unit price → Unit price`, `type → Type`. Keep the codes: website
   orders name every line with its `CG-…` code.
3. Brands: **Products & services → Brands** (or a product property «Брэнд») from the `brand` column.
4. **Inventories → Remainders**: enter real stock for the store.
5. Photos: upload from `public/images/p/` (path in the CSV) if erxes should show them too.

## 1.2 Payment (QPay and bank transfer)

Zochil payment rule: **QPay** or **bank transfer** to Худалдаа Хөгжлийн Банк 803026316 (Чимгэлдэй Бьюти Стор ХХК),
with only the order code as the transaction note; the order is confirmed 15–20 minutes after payment.
StorePay, Pocket and minu QR are also switched on in Zochil but are not offered on the website yet (open question 3).

How the website uses erxes (verified in the erxes 3.0 source, `backend/plugins/payment_api`):

- QPay: `generateInvoiceUrl` (public) creates the invoice after the order is saved in erxes; the customer pays on the
  erxes payment page and returns to `/order/<reference>`. `invoicesCheck` (public) is asked every 5 s there.
- Bank transfer: no invoice. The order page shows the bank, account, holder, amount and the order code with copy
  buttons. Staff match the bank statement to the code and move the card to «Баталгаажсан».
- No order is sent to QPay unless it was first recorded in erxes (no money asked for an order staff cannot see).

Steps:

1. Get CHIMGELDEI's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`); ask QPay / Zochil
   whether the current merchant can be used outside Zochil.
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`. If StorePay / Pocket are added in erxes later,
   add their ids too: the erxes payment page then lets the customer choose.
4. Bank transfer: decide who checks the ХХБ statement and how often (open question 4).
5. **Not yet tested**: nothing has been run against a real QPay merchant. Do not call payments working until step 2
   and section 1.5 pass with authorized credentials.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff (or the POS) after payment.

1. Collect from CHIMGELDEI: company TIN (Zochil has no `regno`), district code, VAT status, product classification
   codes (cosmetics).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline and the
   store POS.
4. For every paid order: issue the receipt once (check the card first) and send the lottery number by SMS / email.
