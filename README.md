# Ẹwà — Events with Abby

The full client-facing app: hero, AI Style Concierge, 3D Visualizer (balloons/flowers/mixed),
filterable portfolio (photos + video), Services & Pricing, About, Testimonials, Inquiry form,
and an owner Ledger.

## What works out of the box
- Every page, the 3D visualizer, and all images/videos (now real files in `/public`, not
  base64 — this alone makes the app load much faster than the Claude-artifact version).
- **Inquiry storage** — wired to Supabase. Clients submitting the form writes a real row;
  the Ledger reads, updates, and deletes from the same table.
- **Ledger password gate** — the Ledger page is locked behind a password, checked server-side
  via `/api/ledger-auth`, so the real password is never shipped to the browser.

## What still needs wiring before this is production-ready
The AI Concierge and email alerts are **not yet connected** in this codebase — they were tied
to the Claude artifact environment and need real equivalents:

1. **AI Concierge** — currently has no working API call. Add a `/app/api/concierge/route.js`
   that calls Anthropic server-side using `ANTHROPIC_API_KEY`, and point the concierge's fetch
   call at `/api/concierge` instead.
2. **Email alerts** — add a Resend call right after a successful Supabase insert (in
   `submitInquiry`) so Abby gets notified of every new inquiry.
3. **Supabase table + env vars** — you still need to create the `inquiries` table and set
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `LEDGER_PASSWORD` — the code
   is ready, it just needs those three things to exist.

Full step-by-step instructions for all of the above are in `DEPLOYMENT.md`.

## Local development
```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

## Structure
```
app/
  layout.jsx        — fonts + page metadata
  page.jsx           — renders the app
components/
  EwaApp.jsx          — the entire app (all views, the 3D visualizer, everything)
public/
  images/             — logo, portfolio photos, founder photos
  videos/             — portfolio video clips + poster thumbnails
```
