-- Run this in the Supabase SQL editor for your project.

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  stage text not null,        -- e.g. "Build", "Analyze", "Write", "Transact"
  title text not null,
  description text not null,
  tags text[] default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  summary text not null,
  url text,
  contact_name text,
  contact_phone text,
  category text not null default 'web',  -- web | data | writing
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  provider text not null,        -- 'paypal' | 'daraja'
  provider_ref text,             -- PayPal order id / Daraja CheckoutRequestID
  amount numeric not null,
  currency text not null,
  status text not null default 'pending',  -- pending | completed | failed
  payer_phone text,
  payer_email text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: public site can READ services/projects, nothing else.
alter table services enable row level security;
alter table projects enable row level security;
alter table leads enable row level security;
alter table payments enable row level security;

create policy "Public can read services" on services
  for select using (true);

create policy "Public can read projects" on projects
  for select using (true);

-- No public policies on leads/payments — only the server (service role key)
-- can write/read those, via API routes.

-- Seed data — edit freely from the /admin panel afterwards.
insert into services (sort_order, stage, title, description, tags) values
  (1, 'Build', 'Web Development',
   'Fast, well-structured websites and web apps — built to be easy to update, easy to find, and easy to extend.',
   array['Next.js','React','SEO-ready markup']),
  (2, 'Analyze', 'Data Analysis',
   'Turning raw business data into plain-language answers: what is working, what is not, and what to do next.',
   array['Excel/SQL','Dashboards','Reporting']),
  (3, 'Write', 'Content Writing',
   'SEO, technical, and academic writing that reads cleanly and holds up under scrutiny.',
   array['SEO copy','Technical docs','Academic writing']),
  (4, 'Transact', 'Payments & Systems Integration',
   'Wiring up real payment collection — M-Pesa (Daraja), PayPal, and other gateways — into a site or business system.',
   array['Daraja STK Push','PayPal','Pesapal / Paystack on request']);
