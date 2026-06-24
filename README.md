# Portfolio — Web Development, Data Analysis & Content Writing

A self-hosted portfolio with an editable CMS panel, a working AI chat
assistant, a contact form, and two live payment options (M-Pesa Daraja and
PayPal). Built with Next.js, deployed on Vercel, backed by Supabase.

## 1. One-time setup

### a) Supabase (database)
1. Create a free project at https://supabase.com
2. Open the SQL editor, paste the contents of `supabase/schema.sql`, run it.
3. Then paste the contents of `supabase/migration_2_extended_cms.sql` and run
   that too — it adds the settings, stats, testimonials, and process-step
   tables behind the expanded CMS panel (safe to run even on a project
   that already has the first schema in place; it only adds things).
4. Go to Project Settings -> API and copy the Project URL, anon public key,
   and service_role key (Supabase has also started calling these the
   "Publishable key" and "Secret key" on newer projects -- either naming
   works, they're the same two values).

### b) Resend (contact form emails)
1. Create a free account at https://resend.com
2. Verify a sending domain (or use their shared `onboarding@resend.dev` sender
   while testing), then create an API key.

### c) Anthropic (AI chat widget)
1. Create an API key at https://console.anthropic.com

### d) PayPal
1. Create a REST app at https://developer.paypal.com/dashboard/applications
2. Start with the Sandbox client ID/secret to test, switch to Live once
   you're ready to take real payments.

### e) M-Pesa Daraja
1. Register at https://developer.safaricom.co.ke and create an app to get a
   sandbox Consumer Key/Secret.
2. The sandbox shortcode (174379) and its passkey are published on the Daraja
   portal under "Lipa Na M-Pesa Online" -- use those for testing.
3. Going live requires applying for a production shortcode (Till/Paybill)
   through Safaricom -- a real business approval process, separate from this
   code.

## 2. Local development

    cp .env.example .env.local   # then fill in every value
    npm install
    npm run dev

Visit http://localhost:3000. Visit http://localhost:3000/admin to sign in to
the CMS panel with the password you set as ADMIN_PASSWORD.

## 3. Deploying to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at https://vercel.com/new
3. Add every variable from `.env.example` under Project -> Settings ->
   Environment Variables.
4. Deploy. Then go back into Safaricom's Daraja portal and set your
   DARAJA_CALLBACK_URL to https://<your-vercel-domain>/api/payments/daraja/callback
   (M-Pesa requires a real public HTTPS URL -- it cannot call back to
   localhost).

## 4. Day-to-day use

- Edit everything: sign in at /admin, use the tabs across the top —
  Settings (your name, tagline, contact info, "why this combination" story,
  availability), Services, Projects, Stats, Testimonials, Process. Edit,
  click Save. Changes appear on the homepage immediately (no redeploy
  needed).
- Leads: every contact-form submission is both emailed to you and saved
  in the leads table in Supabase, so nothing is lost if email delivery
  ever fails.
- Payments: every attempt (M-Pesa or PayPal) is logged in the payments
  table with its status, so you always have a record independent of the
  provider's own dashboard.

## 5. What's deliberately NOT here

- No card storage of any kind -- both gateways host the actual payment step,
  this app only initiates and records it.
- The admin panel is a single shared password, suited to a one-person
  business. If you ever bring on staff, swap it for per-user accounts
  (Supabase Auth supports this with light changes to src/lib/auth.ts).
