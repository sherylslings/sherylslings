// Notify the site admin when a new booking request is submitted.
// Currently sends a Telegram message; email channel is reserved for when
// a sender domain is configured. Failures in any channel are logged but
// never thrown — booking submission must remain unaffected.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { corsHeaders } from '@supabase/supabase-js/cors'

interface NotifyPayload {
  bookingId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingId } = (await req.json()) as NotifyPayload
    if (!bookingId || typeof bookingId !== 'string') {
      return new Response(JSON.stringify({ error: 'bookingId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    // Load booking + carrier + settings in parallel
    const [bookingRes, settingsRes] = await Promise.all([
      supabase.from('booking_requests').select('*').eq('id', bookingId).maybeSingle(),
      supabase.from('site_settings').select('*').limit(1).maybeSingle(),
    ])

    if (bookingRes.error || !bookingRes.data) {
      console.error('Booking lookup failed', bookingRes.error)
      return new Response(JSON.stringify({ error: 'booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const booking = bookingRes.data
    const settings = settingsRes.data

    const { data: carrier } = await supabase
      .from('carriers')
      .select('brand_name, model_name, weekly_rent, monthly_rent, refundable_deposit')
      .eq('id', booking.carrier_id)
      .maybeSingle()

    const carrierName = carrier
      ? `${carrier.brand_name} ${carrier.model_name}`
      : 'Unknown carrier'

    const rent =
      booking.duration === 'weekly'
        ? carrier?.weekly_rent ?? 0
        : booking.duration === 'biweekly'
          ? (carrier?.weekly_rent ?? 0) * 2
          : carrier?.monthly_rent ?? 0
    const deposit = carrier?.refundable_deposit ?? 0
    const total = rent + deposit

    const lines = [
      '🍼 *New Booking Request*',
      '',
      `*Carrier:* ${carrierName}`,
      `*Customer:* ${booking.customer_name}`,
      `*Phone:* ${booking.phone}`,
      `*Pincode:* ${booking.city}`,
      `*Address:* ${booking.address ?? '—'}`,
      '',
      `*Start:* ${booking.start_date}`,
      `*Duration:* ${booking.duration}`,
      `*Rent:* ₹${rent}`,
      `*Deposit:* ₹${deposit}`,
      `*Total:* ₹${total}`,
    ]
    const message = lines.join('\n')

    const results: Record<string, unknown> = {}

    // Telegram channel
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

    // Email channel (reserved — requires sender domain setup)
    if (settings?.notifications_enabled_email && settings?.admin_notification_email) {
      try {
        const { error } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'new-booking-notification',
            recipientEmail: settings.admin_notification_email,
            idempotencyKey: `booking-notify-${bookingId}`,
            templateData: {
              carrierName,
              customerName: booking.customer_name,
              phone: booking.phone,
              pincode: booking.city,
              address: booking.address ?? '—',
              startDate: booking.start_date,
              duration: booking.duration,
              rent,
              deposit,
              total,
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
    console.error('notify-new-booking error', err)
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
