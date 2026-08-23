// Record a Buy Now purchase as paid, mark the carrier as sold-out, and create
// an income transaction. This endpoint is public (no JWT) because the buyer
// is not signed in; it only validates the purchase exists and is in the right
// state before invoking the atomic database function with the service role.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface Payload {
  purchaseId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { purchaseId } = (await req.json()) as Payload
    if (!purchaseId || typeof purchaseId !== 'string') {
      return new Response(JSON.stringify({ error: 'purchaseId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('id, carrier_id, amount, customer_name, status')
      .eq('id', purchaseId)
      .maybeSingle()

    if (purchaseError || !purchase) {
      console.error('Purchase lookup failed', purchaseError)
      return new Response(JSON.stringify({ error: 'purchase not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (purchase.status !== 'payment_claimed') {
      return new Response(
        JSON.stringify({ error: `purchase already processed: ${purchase.status}` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { error: rpcError } = await supabase.rpc('record_purchase_paid', {
      p_purchase_id: purchase.id,
      p_carrier_id: purchase.carrier_id,
      p_amount: purchase.amount,
      p_customer_name: purchase.customer_name,
    })

    if (rpcError) {
      console.error('record_purchase_paid failed', rpcError)
      return new Response(JSON.stringify({ error: rpcError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fire-and-forget notification — must never block or fail the response
    supabase.functions
      .invoke('notify-new-purchase', { body: { purchaseId } })
      .catch((err) => console.warn('notify-new-purchase failed', err))

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('record-purchase-paid error', err)
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
