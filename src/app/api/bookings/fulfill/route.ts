import { NextResponse } from "next/server";
import { fulfillPaidCheckoutSession } from "@/lib/fulfill-checkout";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Manual recovery for a paid Checkout Session that missed calendar/email.
 *
 * POST /api/bookings/fulfill
 * Authorization: Bearer <BOOKING_FULFILL_SECRET or STRIPE_WEBHOOK_SECRET>
 * Body: { "sessionId": "cs_live_..." }
 */
export async function POST(request: Request) {
  const expected =
    process.env.BOOKING_FULFILL_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      { error: "Fulfill secret is not configured" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization")?.trim() ?? "";
  const token = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  let body: { sessionId?: string };
  try {
    body = (await request.json()) as { sessionId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId?.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: `Session is not paid (${session.payment_status})` },
        { status: 409 },
      );
    }

    const result = await fulfillPaidCheckoutSession(session);
    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("[bookings/fulfill]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Fulfillment failed",
      },
      { status: 500 },
    );
  }
}
