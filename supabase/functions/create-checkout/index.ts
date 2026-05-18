import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { productBySlug, toCents } from "../_shared/products.ts";

type CartLine = {
  slug: string;
  quantity: number;
};

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";
const CURRENCY = "usd";
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 695;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  const siteUrl = Deno.env.get("SITE_URL") ?? req.headers.get("origin") ?? "http://localhost:4321";

  if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
    return jsonResponse({ error: "Missing Supabase or Stripe server environment variables" }, 500);
  }

  let payload: { items?: CartLine[] };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const requestedItems = payload.items ?? [];
  const items = requestedItems
    .map((item) => ({
      product: productBySlug.get(item.slug),
      quantity: Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1))),
    }))
    .filter((item): item is { product: NonNullable<typeof item.product>; quantity: number } => Boolean(item.product));

  if (!items.length) {
    return jsonResponse({ error: "Cart is empty or contains unsupported products" }, 400);
  }

  const subtotalAmount = items.reduce((sum, item) => sum + toCents(item.product.price) * item.quantity, 0);
  const shippingAmount = subtotalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const totalAmount = subtotalAmount + shippingAmount;

  const orderPayload = {
    status: "pending",
    currency: CURRENCY,
    items: items.map((item) => ({
      slug: item.product.slug,
      name: item.product.name,
      unit_amount: toCents(item.product.price),
      quantity: item.quantity,
      image: item.product.image,
    })),
    subtotal_amount: subtotalAmount,
    shipping_amount: shippingAmount,
    tax_amount: 0,
    total_amount: totalAmount,
    metadata: {
      source: "pawkasa-site",
    },
  };

  const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(orderPayload),
  });

  if (!orderRes.ok) {
    return jsonResponse({ error: "Could not create order", details: await orderRes.text() }, 500);
  }

  const [order] = await orderRes.json();

  const orderItemsRes = await fetch(`${supabaseUrl}/rest/v1/order_items`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items.map((item) => ({
      order_id: order.id,
      product_slug: item.product.slug,
      product_name: item.product.name,
      unit_amount: toCents(item.product.price),
      quantity: item.quantity,
      image: item.product.image,
    }))),
  });

  if (!orderItemsRes.ok) {
    return jsonResponse({ error: "Could not create order items", details: await orderItemsRes.text() }, 500);
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("ui_mode", "embedded");
  params.set("client_reference_id", order.id);
  params.set("return_url", `${siteUrl.replace(/\/$/, "")}/order/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("billing_address_collection", "auto");
  params.set("phone_number_collection[enabled]", "true");
  params.set("shipping_address_collection[allowed_countries][0]", "US");
  params.set("metadata[order_id]", order.id);
  params.set("metadata[source]", "pawkasa-site");

  items.forEach((item, index) => {
    const imageUrl = item.product.image.startsWith("http")
      ? item.product.image
      : `${siteUrl.replace(/\/$/, "")}${item.product.image}`;
    params.set(`line_items[${index}][quantity]`, String(item.quantity));
    params.set(`line_items[${index}][price_data][currency]`, CURRENCY);
    params.set(`line_items[${index}][price_data][unit_amount]`, String(toCents(item.product.price)));
    params.set(`line_items[${index}][price_data][product_data][name]`, item.product.name);
    params.set(`line_items[${index}][price_data][product_data][images][0]`, imageUrl);
  });

  params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shippingAmount));
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", CURRENCY);
  params.set(
    "shipping_options[0][shipping_rate_data][display_name]",
    shippingAmount === 0 ? "Free US Shipping" : "Standard US Shipping",
  );

  const stripeRes = await fetch(STRIPE_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const stripeSession = await stripeRes.json();

  if (!stripeRes.ok) {
    await updateOrder(supabaseUrl, serviceRoleKey, order.id, { status: "checkout_failed", metadata: { stripe_error: stripeSession } });
    return jsonResponse({ error: "Could not create Stripe Checkout session", details: stripeSession }, 500);
  }

  await updateOrder(supabaseUrl, serviceRoleKey, order.id, {
    stripe_session_id: stripeSession.id,
    metadata: {
      stripe_session_id: stripeSession.id,
      source: "pawkasa-site",
    },
  });

  return jsonResponse({
    orderId: order.id,
    clientSecret: stripeSession.client_secret,
  });
});

async function updateOrder(supabaseUrl: string, serviceRoleKey: string, orderId: string, payload: Record<string, unknown>) {
  await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
