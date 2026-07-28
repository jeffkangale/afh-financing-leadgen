# AFH Financing Lead-Generation Landing Page

A simple, responsive single-page site for adult family home owners seeking either:

1. **Purchase financing** to acquire an AFH property.
2. **Construction or renovation financing** for a property they already own or control.

The public interest form inserts submissions into Supabase. Leads are reviewed directly in the Supabase dashboard; this project does not include an admin dashboard or user authentication.

## Stack

- React + Vite
- Supabase Database
- Vercel deployment

## 1. Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run the contents of `supabase/schema.sql`.
4. Confirm the `leads` table appears in **Table Editor**.

### Security model

- The public `anon` role can only insert rows into `public.leads`.
- Public users cannot select, update, or delete leads.
- Review submissions through **Supabase → Table Editor → leads**.
- Never expose a Supabase secret or `service_role` key in the frontend.

## 2. Local development

```bash
npm install
cp .env.example .env.local
```

Set the values in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Run the site:

```bash
npm run dev
```

Open the local URL shown by Vite.

## 3. Vercel deployment

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Add these environment variables in **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Vercel should detect Vite automatically.

## Commands

```bash
npm run dev      # local development
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint source files
```

## Lead fields

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | Generated automatically |
| `created_at` | timestamptz | Generated automatically |
| `name` | text | Required |
| `contact` | text | Phone or email, required |
| `financing_need` | text | `purchase`, `construction_renovation`, or `not_sure` |
| `notes` | text | Optional |
