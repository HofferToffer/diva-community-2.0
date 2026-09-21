import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

interface CartItemInput {
  priceId: string;
  quantity: number;
}

// Cash-on-pickup orders: no Stripe payment, order is stored for manual handling.
// Prices are resolved server-side from Stripe (lookup_keys) so totals can't be tampered with.
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
    const { items, customerName, email, phone, environment } = body as {
      items?: CartItemInput[];
      customerName?: string;
      email?: string;
      phone?: string;
      environment?: StripeEnv;
    };

    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("Invalid environment");
    }
    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2 || customerName.length > 100) {
      throw new Error("Zadajte meno");
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      throw new Error("Zadajte platný e-mail");
    }
    if (phone && (typeof phone !== "string" || phone.length > 30)) {
      throw new Error("Neplatné telefónne číslo");
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      throw new Error("Košík je prázdny");
    }
    for (const item of items) {
      if (!item?.priceId || !/^[a-zA-Z0-9_-]+$/.test(item.priceId)) {
        throw new Error("Invalid priceId");
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
        throw new Error("Invalid quantity");
      }
    }

    // Resolve real prices server-side
    const stripe = createStripeClient(environment);
    const lookupKeys = items.map((i) => i.priceId);
    const prices = await stripe.prices.list({ lookup_keys: lookupKeys, limit: 20 });
    if (prices.data.length !== lookupKeys.length) {
      throw new Error("Produkt sa nenašiel");
    }
    const byLookup = new Map(prices.data.map((p) => [p.lookup_key, p]));

    let subtotalCents = 0;
    const orderItems = [];
    for (const item of items) {
      const price = byLookup.get(item.priceId)!;
      const unitAmount = price.unit_amount ?? 0;
      subtotalCents += unitAmount * item.quantity;
      const productId = typeof price.product === "string" ? price.product : price.product.id;
      const product = await stripe.products.retrieve(productId);
      orderItems.push({
        priceId: item.priceId,
        name: product.name,
        quantity: item.quantity,
        unit_amount_cents: unitAmount,
      });
    }

    const shippingCents = 0; // osobný odber je zadarmo
    const totalCents = subtotalCents + shippingCents;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        items: orderItems,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        delivery_method: "osobny_odber",
        payment_method: "hotovost",
        status: "nova",
      })
      .select("id")
      .single();

    if (error) {
      console.error("insert error:", error);
      throw new Error("Objednávku sa nepodarilo uložiť");
    }

    // Send order summary email to the shop owner (fire-and-forget: never block the order on email).
    try {
      await sendTransactionalTemplate(
        "order-notification",
        {
          orderId: data.id,
          customerName: customerName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || "",
          items: orderItems,
          totalCents,
          paymentMethod: "hotovost",
          deliveryMethod: "osobny_odber",
        },
        `order-${data.id}`,
      );
    } catch (emailErr) {
      console.error("order notification email failed:", emailErr);
    }

    return new Response(JSON.stringify({ orderId: data.id, totalCents }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("create-order error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
