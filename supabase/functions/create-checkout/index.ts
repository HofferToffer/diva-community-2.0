import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

interface CartItemInput {
  priceId: string;
  quantity: number;
}

async function createCartCheckout(options: {
  items: CartItemInput[];
  returnUrl: string;
  environment: StripeEnv;
  /** Website language — Stripe's form and the shipping names follow it. */
  language?: "sk" | "en";
}) {
  const en = options.language === "en";
  const stripe = createStripeClient(options.environment);

  const lookupKeys = options.items.map((i) => i.priceId);
  const prices = await stripe.prices.list({ lookup_keys: lookupKeys, limit: 20 });
  if (prices.data.length !== lookupKeys.length) {
    throw new Error("Price not found");
  }

  const byLookup = new Map(prices.data.map((p) => [p.lookup_key, p]));
  const lineItems = options.items.map((item) => {
    const price = byLookup.get(item.priceId);
    if (!price) throw new Error("Price not found");
    return { price: price.id, quantity: item.quantity };
  });

  // Product names for the payment description (shown in the payments dashboard)
  const productIds = [...new Set(prices.data.map((p) =>
    typeof p.product === "string" ? p.product : p.product.id
  ))];
  const productNames: string[] = [];
  for (const productId of productIds) {
    const product = await stripe.products.retrieve(productId);
    productNames.push(product.name);
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    ui_mode: "embedded_page",
    ...(options.language ? { locale: options.language } : {}),
    return_url: options.returnUrl,
    automatic_tax: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["SK", "CZ", "AT", "HU", "PL", "DE", "HR", "SI", "RO", "IT", "FR", "ES", "PT", "NL", "BE", "GB", "CH", "IE", "DK", "SE", "NO", "FI"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "eur" },
          display_name: en ? "Pickup in person" : "Osobný odber",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 3 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 500, currency: "eur" },
          display_name: en ? "Packeta (pickup point)" : "Packeta (výdajné miesto)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    payment_intent_data: { description: productNames.join(", ") },
  });

  return session.client_secret;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { items, returnUrl, environment, language } = body as {
      items?: CartItemInput[];
      returnUrl?: string;
      environment?: StripeEnv;
      language?: string;
    };

    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("Invalid environment");
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      throw new Error("Cart is empty");
    }
    for (const item of items) {
      if (!item?.priceId || !/^[a-zA-Z0-9_-]+$/.test(item.priceId)) {
        throw new Error("Invalid priceId");
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        throw new Error("Invalid quantity");
      }
    }
    if (!returnUrl || typeof returnUrl !== "string") {
      throw new Error("Missing returnUrl");
    }

    const clientSecret = await createCartCheckout({
      items,
      returnUrl,
      environment,
      language: language === "en" || language === "sk" ? language : undefined,
    });

    return new Response(JSON.stringify({ clientSecret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("create-checkout error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
