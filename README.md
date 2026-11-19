# CHIMGELDEI BEAUTY STORE web store

Next.js 16 storefront that replaces the Zochil shop at chimgeldei.com. «Super Glow» comic pop design, 196 Korean
skin care products, Skin Quest routine picker, checkout with QPay (through erxes) or bank transfer, eBarimt details.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (add --send for one real test order in erxes)
npm run export:erxes   # docs/erxes/chimgeldei-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (server) and `src/data/lite.json` (cart / hearts / Skin Quest), built from Zochil
  shop 5587. Photos in `public/images/p/`.
- Business rules (delivery fee, payments, bank account, statuses): `src/content/business.ts`.
- Orders: `POST /api/orders` validates against catalog prices, records the order in erxes (form → Sales card), then
  creates the QPay invoice in erxes. Bank transfer orders get no invoice. Env vars: `.env.example`.
- erxes admin work (payments, eBarimt, pipeline, import) and open questions: `docs/erxes/MANUAL-STEPS.md`.
