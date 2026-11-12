# DigiHut website

**Local pehchaan, online dukaan.** The official website for DigiHut — React + Vite + Tailwind CSS, Hindi/English, with Supabase for enquiries.

## Quick start

```bash
npm install
cp .env.example .env      # then fill in your values
npm run dev               # http://localhost:5173
npm run build             # production files in /dist
```

Requires Node.js 20.19 or newer.

## What to configure before launch

All settings live in `.env` (see `.env.example`). Until they are filled in, the site shows a small **"Setup"** reminder in the bottom-left corner and never pretends a form was sent.

| Setting | What it does | If missing |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` (set: 9755307900) | Every WhatsApp button opens a chat with this number, with a pre-written message | WhatsApp buttons explain the number isn't added yet and point to Instagram |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Saves enquiries and callbacks; powers the team login | The form says it isn't connected and offers to send the details on WhatsApp instead |
| `VITE_CONTACT_EMAIL` | Shown in the Contact section | Defaults to digihutsupport@gmail.com |
| `VITE_CONTACT_PHONE` | Optional calling number | Hidden; only WhatsApp is shown |
| `VITE_INSTAGRAM_HANDLE` | Instagram links | Defaults to `digihut_cg` |
| `VITE_TURNSTILE_SITE_KEY` | Spam check on the form (see Spam protection) | Database limits still apply |

Other things to replace:

- **Founders** — names and roles in `src/content/en.js` and `src/content/hi.js` (`about.founders`); photos in `public/founders/` and their paths in `FOUNDER_PHOTOS` in `src/content/data.js`.
- **Legal pages** — `legal` in both content files are drafts. Have them reviewed before launch.
- **Portfolio** — the projects are clearly labelled demo concepts. Replace them with real work (with client permission) in `PORTFOLIO` (`src/content/data.js`) and `portfolio.items` in the content files.
- **Domain** — update `public/sitemap.xml` and `public/robots.txt` with your real domain.

## Supabase setup (enquiries + team login)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it. This creates the `leads` table with Row Level Security: visitors can only *add* enquiries; only admins can read them.
3. Copy **Project URL** and **anon public key** (Project Settings → API) into `.env`. Never use the `service_role` key in the website.
4. In **Authentication → Users**, add a team member (email + password). Copy their user id and run:
   ```sql
   insert into public.admins (user_id) values ('PASTE-USER-ID-HERE');
   ```
5. In **Authentication → Providers → Email**, turn off "Allow new users to sign up" so only people you add can log in.
6. Visit `/#/admin` (or "Team login" in the footer) to see enquiries, call or WhatsApp leads, update their status and export CSV.

## Spam protection

There are two layers.

**1. Always on (no setup):** the database itself rejects badly formed enquiries, more than 3 enquiries from the same phone number in 24 hours, and more than 15 enquiries site-wide in 5 minutes (`supabase/schema.sql`). The form also has a hidden trap field for simple bots.

**2. Recommended before you promote the site:** Cloudflare Turnstile plus the `submit-lead` Edge Function. Every enquiry then has to pass a spam check, and each visitor is limited to 5 enquiries an hour.

1. In Cloudflare → **Turnstile**, add a site for your domain. Copy the **site key** and **secret key**.
2. Install the Supabase CLI, then from this folder run:
   ```bash
   supabase link --project-ref YOUR-PROJECT-REF
   supabase functions deploy submit-lead
   supabase secrets set TURNSTILE_SECRET_KEY=your-secret-key IP_HASH_SALT=any-long-random-text ALLOWED_ORIGINS=https://your-domain.in
   ```
3. Add `VITE_TURNSTILE_SITE_KEY=your-site-key` to `.env` and redeploy the website.
4. Submit one test enquiry and check it appears in the admin page.
5. Run `supabase/lockdown.sql` in the SQL Editor. Direct API inserts now stop working, so bots can't skip the spam check.

## Security headers

`public/_headers` (Netlify, Cloudflare Pages), `vercel.json` (Vercel) and `public/.htaccess` (Hostinger and other Apache hosts) set browser security headers: they block the site from being shown inside other websites, stop scripts from unknown sites, and force HTTPS. If you add a new outside service (for example analytics), add its domain to the `Content-Security-Policy` line in the file for your host, or it will be blocked.

## Account security checklist

The code can't protect these; please do them yourself:

- Turn on 2-step verification for Gmail, GitHub, your hosting, your domain registrar, Supabase, Cloudflare, Instagram and WhatsApp.
- Supabase sign-ups: "My Shop" lets shop owners create an account, so "Allow new users to sign up" must stay **on** for that to work. This is safe: a shop-owner account can only see its own shop, never enquiries (only people in the `admins` table can). If you do not want shop accounts, turn sign-ups off and the rest of the site still works.
- Use long, unique passwords for team logins. Remove people from `public.admins` when they leave.
- Never put the Supabase `service_role` key or the Turnstile secret in `.env` or anywhere in the website code.
- Free Supabase projects pause after about a week with no activity. Log in weekly or upgrade once enquiries start.
- Run `npm audit` and update packages every few months.

## Phone experience and accessibility

- **Bottom bar (phones and tablets):** Home, Services, Free check, Free Tools and WhatsApp chat, always within thumb reach. Edit the tabs in `src/components/BottomBar.jsx`.
- **Menu:** all sections, quick actions (free check, packages, FAQs), text size, consultation and WhatsApp buttons (`src/components/Navbar.jsx`).
- **Text size:** visitors can choose Normal, Large or Extra large (menu and footer). The choice is remembered on their device.
- **Animations:** sections rise in gently as you scroll (`src/hooks/useReveal.js`). Only opacity and movement are animated, so it stays smooth on low-end phones, and it switches off for visitors who turn on "reduce motion".
- **Free Tools section:** `src/sections/Tools.jsx`. The outside links and search words are in `src/content/data.js` (`TOOL_LINKS`, `IDEA_KINDS`, `INDUSTRY_SEARCH`).

## My Shop (advice for each shop owner)

`/#/my-shop` asks what kind of business the visitor runs and what they sell, then shows tips for their field, services that fit their goals, and design ideas. Only the business type is required; everything else is optional.

- Answers are saved on the visitor's phone. Nothing is sent to DigiHut unless they tap "Send my details" or the WhatsApp button.
- With Supabase connected, visitors can also create an account (email and password) so their shop and progress follow them to a new phone. Rows live in the `shop_profiles` table; each owner sees only their own row, and DigiHut admins can read all of them in the Supabase table editor.
- If "Confirm email" is on in Supabase, new users must click the email link before signing in. For a simpler start, turn it off under Authentication → Providers → Email.
- Tips are in `shop.tips` in `src/content/en.js` and `hi.js`, one list per business type. Goal-to-service matching is in `src/lib/shop.js`.

## Demo portfolio images

The portfolio mock-ups are drawn in code (`src/sections/PortfolioArt.jsx`); the words inside each one come from `d` in `PORTFOLIO` (`src/content/data.js`). To show a real photo or AI-generated image instead, put the file in `public/portfolio/` and add `image: '/portfolio/your-file.jpg'` to that project. Use 1000 x 700 px, under 150 KB.

## Editing content

All text is in `src/content/en.js` (English) and `src/content/hi.js` (Hindi). Both files have the same structure — change one, change the other. Language-independent data (icons, audit scoring, portfolio list) is in `src/content/data.js`.

**Digital audit scoring** — `AUDIT_WEIGHTS` in `data.js` (adds up to 100; "Partly" earns half). `AUDIT_GAP_SERVICE` decides which service is recommended for each gap.

**Package contents** — `pricing.tiers` and `pricing.rows` in the content files. No prices are shown; every package asks for a custom quote.

## Project structure

```
src/
  content/      en.js, hi.js, data.js — all copy and data
  sections/     Hero, Services, Industries, WhyUs, Process, Portfolio, Pricing, Audit, About, Contact, FAQ
  components/   Navbar, Footer, Logo, Modal (sheet), Sheets, WhatsAppButton, LanguageToggle, …
  pages/        Home, Legal (privacy/terms), Admin, NotFound
  lib/          supabase.js (REST, no SDK), whatsapp.js, validation.js, scroll.js
  i18n/         LanguageContext — remembers the visitor's language
  ui/           UIContext — opens service/industry sheets, pre-fills the contact form
supabase/schema.sql
```

Routes use the URL hash (`/#/privacy`, `/#/terms`, `/#/admin`), so the site works on any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages or Hostinger — without server rewrite rules.

## Performance notes

- No images to download: the hero, portfolio and logo are inline SVG.
- One short page-load animation (the shop shutter rolling up); it is skipped for visitors who prefer reduced motion.
- Fonts: Anek Latin / Anek Devanagari (headings) and Mukta (body), all with Hindi support, loaded with `display=swap`.
