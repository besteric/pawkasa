import { jsonResponse } from "../_shared/cors.ts";

type StripeCheckoutSession = {
  id: string;
  client_reference_id?: string | null;
  metadata?: Record<string, string> | null;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
  } | null;
  shipping_details?: unknown;
  amount_total?: number | null;
  payment_intent?: string | null;
  payment_status?: string | null;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!supabaseUrl || !serviceRoleKey || !webhookSecret) {
    return jsonResponse({ error: "Missing webhook environment variables" }, 500);
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return jsonResponse({ error: "Missing Stripe signature" }, 400);
  }

  const verified = await verifyStripeSignature(body, signature, webhookSecret);
  if (!verified) {
    return jsonResponse({ error: "Webhook signature verification failed" }, 400);
  }

  const event = JSON.parse(body);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as StripeCheckoutSession;
    const orderId = session.client_reference_id ?? session.metadata?.order_id;

    if (orderId) {
      await updateOrder(supabaseUrl, serviceRoleKey, orderId, {
        status: "paid",
        customer_email: session.customer_details?.email ?? session.customer_email ?? null,
        customer_name: session.customer_details?.name ?? null,
        customer_phone: session.customer_details?.phone ?? null,
        shipping_address: session.shipping_details ?? null,
        total_amount: session.amount_total ?? 0,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent ?? null,
        metadata: {
          stripe_customer_id: session.customer ?? null,
          payment_status: session.payment_status,
          webhook_event_id: event.id,
        },
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as StripeCheckoutSession;
    const orderId = session.client_reference_id ?? session.metadata?.order_id;
    if (orderId) {
      await updateOrder(supabaseUrl, serviceRoleKey, orderId, {
        status: "expired",
        metadata: {
          webhook_event_id: event.id,
        },
      });
    }
  }

  return jsonResponse({ received: true });
});

async function verifyStripeSignature(body: string, signatureHeader: string, secret: string) {
  const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
    const [key, value] = part.split("=", 2);
    return [key, value];
  }));

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signedPayload = `${timestamp}.${body}`;
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function updateOrder(supabaseUrl: string, serviceRoleKey: string, orderId: string, payload: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Failed to update order", orderId, await response.text());
  }
}
