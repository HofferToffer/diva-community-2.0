import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { sendTransactionalTemplate } from "../_shared/transactional-email-templates/send.ts";

// Called from the checkout return page after a successful card payment.
// Records the paid order and sends the summary email to the shop owner.
// Idempotent: a Stripe session can only ever create one order row.
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
    const { sessionId, environment } = await req.json() as {
      sessionId?: string;
      environment?: StripeEnv;
    };

    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("Invalid environment");
    }
    if (!sessionId || typeof sessionId !== "string" || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
      throw new Error("Invalid sessionId");
    }

    const stripe = createStripeClient(environment);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product", "shipping_cost.shipping_rate", "customer_details"],
    });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ status: session.payment_status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ orderId: existing.id, status: "paid" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderItems = (session.line_items?.data ?? []).map((li) => {
      const price = li.price;
      const product = price && typeof price.product !== "string" ? price.product : null;
      return {
        priceId: (price?.lookup_key as string | null) ?? price?.id ?? "",
        name: (product && "name" in product ? product.name : li.description) ?? "Produkt",
        quantity: li.quantity ?? 1,
        unit_amount_cents: price?.unit_amount ?? 0,
      };
    });

    const shippingCents = session.shipping_cost?.amount_total ?? 0;
    const totalCents = session.amount_total ?? 0;
    const subtotalCents = Math.max(totalCents - shippingCents, 0);

    const shippingRate = session.shipping_cost?.shipping_rate;
    const shippingName =
      shippingRate && typeof shippingRate !== "string"
        ? shippingRate.display_name ?? ""
        : "";
    const deliveryMethod = shippingCents === 0 ? "osobny_odber" : "packeta";

    const customerName =
      session.customer_details?.name ??
      (session.collected_information?.shipping_details as { name?: string } | undefined)?.name ??
      "Zákazník";
    const email = session.customer_details?.email ?? "";
    const phone = session.customer_details?.phone ?? null;
    const shippingAddress =
      (session.collected_information?.shipping_details as unknown) ??
      session.customer_details?.address ??
      null;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        email: email.toLowerCase(),
        phone,
        items: orderItems,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        delivery_method: deliveryMethod,
        payment_method: "karta",
        status: "zaplatena",
        stripe_session_id: session.id,
        shipping_address: shippingAddress,
      })
      .select("id")
      .single();

    if (error) {
      console.error("insert error:", error);
      throw new Error("Objednávku sa nepodarilo uložiť");
    }

    // Owner notification email (never block the order on email delivery)
    try {
      await sendTransactionalTemplate(
        "order-notification",
        {
          orderId: data.id,
          customerName,
          email: email.toLowerCase(),
          phone: phone ?? "",
          items: orderItems,
          totalCents,
          paymentMethod: "karta",
          deliveryMethod: shippingName || deliveryMethod,
        },
        `order-${data.id}`,
      );
    } catch (emailErr) {
      console.error("order notification email failed:", emailErr);
    }

    return new Response(JSON.stringify({ orderId: data.id, status: "paid" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("confirm-order error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
