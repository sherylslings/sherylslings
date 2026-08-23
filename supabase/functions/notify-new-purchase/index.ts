// Notify the site admin when a new Buy Now purchase is claimed/paid.
// Currently sends a Telegram message; email channel is reserved for when
// a sender domain is configured. Failures in any channel are logged but
// never thrown — purchase completion must remain unaffected.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface NotifyPayload {
  purchaseId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { purchaseId } = (await req.json()) as NotifyPayload
    if (!purchaseId || typeof purchaseId !== 'string') {
      return new Response(JSON.stringify({ error: 'purchaseId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const [purchaseRes, settingsRes] = await Promise.all([
      supabase.from('purchases').select('*').eq('id', purchaseId).maybeSingle(),
      supabase.from('site_settings').select('*').limit(1).maybeSingle(),
    ])

    if (purchaseRes.error || !purchaseRes.data) {
      console.error('Purchase lookup failed', purchaseRes.error)
      return new Response(JSON.stringify({ error: 'purchase not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const purchase = purchaseRes.data
    const settings = settingsRes.data

    const { data: carrier } = await supabase
      .from('carriers')
      .select('brand_name, model_name')
      .eq('id', purchase.carrier_id)
      .maybeSingle()

    const carrierName = carrier
      ? `${carrier.brand_name} ${carrier.model_name}`
      : 'Unknown carrier'

    const lines = [
      '🛒 *New Buy Now Purchase*',
      '',
      `*Carrier:* ${carrierName}`,
      `*Customer:* ${purchase.customer_name}`,
      `*Phone:* ${purchase.phone}`,
      `*Pincode:* ${purchase.pincode}`,
      `*Address:* ${purchase.address ?? '—'}`,
      '',
      `*Amount:* ₹${purchase.amount}`,
      `*Status:* ${purchase.status}`,
    ]
    const message = lines.join('\n')

    const results: Record<string, unknown> = {}

    if (settings?.notifications_enabled_telegram && settings?.admin_telegram_chat_id) {
      const token = Deno.env.get('TELEGRAM_BOT_TOKEN')
      if (!token) {
        console.warn('TELEGRAM_BOT_TOKEN not set')
        results.telegram = 'token_missing'
      } else {
        try {
          const tgRes = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: settings.admin_telegram_chat_id,
                text: message,
                parse_mode: 'Markdown',
              }),
            },
          )
          const tgData = await tgRes.json()
          if (!tgRes.ok || !tgData.ok) {
            console.error('Telegram send failed', tgData)
            results.telegram = `failed: ${tgData.description ?? tgRes.status}`
          } else {
            results.telegram = 'sent'
          }
        } catch (err) {
          console.error('Telegram exception', err)
          results.telegram = 'exception'
        }
      }
    } else {
      results.telegram = 'skipped'
    }

    if (settings?.notifications_enabled_email && settings?.admin_notification_email) {
      try {
        const { error } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'new-purchase-notification',
            recipientEmail: settings.admin_notification_email,
            idempotencyKey: `purchase-notify-${purchaseId}`,
            templateData: {
              carrierName,
              customerName: purchase.customer_name,
              phone: purchase.phone,
              pincode: purchase.pincode,
              address: purchase.address ?? '—',
              amount: purchase.amount,
              status: purchase.status,
            },
          },
        })
        results.email = error ? `failed: ${error.message}` : 'sent'
      } catch (err) {
        console.error('Email send exception', err)
        results.email = 'exception'
      }
    } else {
      results.email = 'skipped'
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('notify-new-purchase error', err)
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
