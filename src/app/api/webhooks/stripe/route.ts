import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { fulfillPaidCheckoutSession } from "@/lib/fulfill-checkout";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[stripe-webhook] signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        const result = await fulfillPaidCheckoutSession(session);
        if (result.calendarError) {
          console.error(
            "[stripe-webhook] email ok, calendar still failing:",
            result.calendarError,
          );
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe-webhook] handler", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
