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

## 1.4 Delivery zones, fees and order statuses

Website (done), from Zochil shop 5587:

| Option | Fee | Rule |
| --- | --- | --- |
| Улаанбаатар хот | 7,000₮, free when goods are above 300,000₮ | within 48 h of confirmation (72 h on holidays / sales); district, khoroo 1–45, address |

- Countryside is not offered online: Zochil has no countryside delivery option. The site says to call (open question 2).
- Fees and limits live in `src/content/business.ts`; change them there and in the erxes delivery product.

erxes:

1. Import `docs/erxes/chimgeldei-delivery.csv` (`CG-DELIVERY-438` Улаанбаатар, 7,000₮).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website order page):
   Хүлээгдэж байна → Баталгаажсан → Бэлтгэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Хүлээгдэж байна» for every submission.
   Staff move it to «Баталгаажсан» when the erxes invoice shows paid or the bank transfer with that code arrived.

## 1.5 Test order from cart to receipt

**Verified on a local production build:** `npm run test:order -- http://127.0.0.1:3418` passes **27 checks** (empty
cart, unknown product, quantity limit, the browser's price ignored, 7,000₮ fee, free above 300,000₮, countryside
refused, district / khoroo / address, QPay and transfer accepted, unknown payment refused, phone, email, company
registry, same checkout key → same reference, payment check 400 / 503). Without erxes the order returns
`503 not_configured`; the checkout then shows the phone number and keeps the cart. `--send` was **not run** (env vars
not set). No payment was made.

Steps for the real test (authorized credentials only):

1. **Frontline → Forms → Create** «Вэбсайт захиалга» with fields Нэр, Утас, Имэйл, Захиалга; copy the form id and the
   field ids into `ERXES_ORDER_FORM_ID` / `ERXES_ORDER_FIELD_IDS`. Set `ERXES_API_URL`, `ERXES_PAYMENT_IDS`. Redeploy.
2. `npm run test:order -- https://<production url> --send`: one order, two items + delivery.
3. Pay the invoice only with QPay's test merchant or with explicit authorization for a real charge; check that
   `/order/<reference>` shows «Төлбөр төлөгдлөө», move the card, issue the eBarimt, mark delivered, void the test.

## Permissions (erxes)

- Staff who handle orders: Sales (cards), Forms (submissions), Payments (view invoices), eBarimt (issue).
- Only the owner: Settings → Payments, Settings → eBarimt, product import.
- The website uses only public erxes mutations; it needs no admin token.

---

## Open questions for CHIMGELDEI

1. **Delivery fee**: the Zochil delivery option charges **7,000₮** (free above 300,000₮); the shop's delivery rule
   text says **6,000₮** in city zones A and B. The site uses 7,000₮. Which is right, and what about other zones?
2. **Countryside**: Zochil has the countryside flag on but no countryside option. Offer it online, and at what fee?
3. **StorePay / Pocket / minu QR**: add them in erxes as extra payment methods?
4. **Order code**: Zochil asked for a 7-digit order code in the transfer note; website orders use `CG-yymmdd-XXXXXX`.
   Is that fine for the bank statement check, and who checks it?
5. **Brands**: 27 products have no brand on Zochil; fill them in?
6. **Skin types**: 106 products have no skin type category, so Skin Quest can't match them by skin type.
7. **TIN / PosAPI** for eBarimt, **QPay merchant** outside Zochil.
8. **Domain**: point chimgeldei.com at the new site when ready.
