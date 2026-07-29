// Supabase Edge Function: emails accounts@carebearbooks.com whenever a new
// row is inserted into public.leads. Triggered by a Database Webhook
// (Database -> Webhooks in the Supabase dashboard), not called directly.
//
// Sends via the Gmail account carebearbooks4@gmail.com over SMTP, using an
// App Password (not the account's real password). Configure before use:
//
//   npx supabase secrets set GMAIL_USER=carebearbooks4@gmail.com GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
//   npx supabase functions deploy notify-new-lead
//
// Then create the webhook: Database -> Webhooks -> New webhook
//   Table: leads, Events: Insert, Type: Supabase Edge Functions,
//   Function: notify-new-lead

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const GMAIL_USER = Deno.env.get('GMAIL_USER') ?? ''
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD') ?? ''
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') ?? 'accounts@carebearbooks.com'

const fieldLabels: [string, string][] = [
  ['name', 'Name'],
  ['business_name', 'Business name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['financing_need', 'Financing need'],
  ['estimated_amount', 'Estimated amount'],
  ['timeline', 'Timeline'],
  ['notes', 'Message'],
  ['created_at', 'Submitted'],
]

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('GMAIL_USER / GMAIL_APP_PASSWORD secrets are not configured')
    return new Response(JSON.stringify({ ok: false, error: 'Email is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = await req.json()
    const lead = payload?.record ?? {}

    const textLines = fieldLabels.map(([key, label]) => `${label}: ${lead[key] ?? '—'}`)
    const htmlRows = fieldLabels
      .map(([key, label]) => `<p><strong>${label}:</strong> ${lead[key] ?? '—'}</p>`)
      .join('')

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
      },
    })

    await client.send({
      from: GMAIL_USER,
      to: NOTIFY_TO,
      subject: `New financing lead: ${lead.name ?? 'Unknown'} (${lead.financing_need ?? 'n/a'})`,
      content: textLines.join('\n'),
      html: `<h2>New financing lead submitted</h2>${htmlRows}`,
    })

    await client.close()

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
