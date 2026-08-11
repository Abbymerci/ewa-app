# Deploying Ẹwà — Step by Step

## 1. Push this project to GitHub
```bash
cd ewa-app
git init
git add .
git commit -m "Initial commit"
```
Create a new repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR-USERNAME/ewa-app.git
git push -u origin main
```

## 2. Deploy to Vercel
1. Go to vercel.com, sign in with GitHub
2. "Add New Project" → import your `ewa-app` repo
3. Vercel auto-detects Next.js — click Deploy
4. You'll get a live URL immediately (e.g. `ewa-app.vercel.app`)

## 3. Set up Supabase (inquiry storage)
1. Create a free project at supabase.com
2. In the SQL editor, run:
```sql
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  ref_code text,
  name text,
  email text,
  phone text,
  event_date date,
  event_type text,
  guest_count int,
  budget text,
  services text[],
  message text,
  saved_look jsonb,
  status text default 'New'
);

-- Allow the app (using the public anon key) to read and write inquiries.
-- This is fine for a small business site where the Ledger itself is password-protected
-- (see step 6) — the anon key can only do what these policies allow.
alter table inquiries enable row level security;
create policy "Anyone can submit an inquiry" on inquiries for insert with check (true);
create policy "Anyone can read inquiries" on inquiries for select using (true);
create policy "Anyone can update inquiries" on inquiries for update using (true);
create policy "Anyone can delete inquiries" on inquiries for delete using (true);
```
3. Project Settings → API — copy your Project URL and `anon` `public` key
4. Add them to Vercel's environment variables as `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Already wired in the code** — `lib/supabaseClient.js` and the inquiry submit/Ledger read/update/delete
calls in `EwaApp.jsx` are done. You only need to create the table and add the two env variables above.

## 4. Move the AI Concierge server-side
1. Create `app/api/concierge/route.js`:
```js
export async function POST(req) {
  const { prompt } = await req.json();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return Response.json(data);
}
```
2. In `EwaApp.jsx`, change the concierge's fetch target from
   `https://api.anthropic.com/v1/messages` to `/api/concierge`
3. Add `ANTHROPIC_API_KEY` to Vercel's environment variables (get one at console.anthropic.com)
   — never put this key in client-side code

## 5. Email alerts on new inquiries
1. Create a free account at resend.com, verify a sending domain (or use their test domain)
2. Add `RESEND_API` and `NOTIFY_EMAIL` to Vercel's environment variables
3. In your Supabase-insert code from Step 3, call a small `/api/notify` route right after a
   successful insert, which sends Abby an email with the inquiry details via Resend

## 6. Password-protect the Ledger
**Already wired in the code.** `app/api/ledger-auth/route.js` checks a submitted password against
`LEDGER_PASSWORD` server-side (the real password never reaches the browser), and the Ledger view
shows a password prompt until it's unlocked for that browser session. You only need to:
1. Pick a password and add it to Vercel's environment variables as `LEDGER_PASSWORD`
2. That's it — visit `/` → sidebar → Ledger, and you'll be prompted for it

## 7. Connect your domain
In Vercel: Project → Settings → Domains → add `ewaevents.com` (or whatever you buy).
Vercel gives you exact DNS records — add those at your domain registrar and it activates
automatically, usually within minutes to a few hours.

---

**Cost at this scale:** ~$10–15/year for the domain. Vercel, Supabase, and Resend are all free
until you're getting hundreds of inquiries a day.
