import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  assertSlotBookable,
  dayBoundsMelbourne,
} from "@/lib/availability";
import { isAddonId, isPackageId, type AddonId } from "@/lib/booking";
import {
  fulfillPaidBooking,
  parseAddonIds,
} from "@/lib/fulfill-booking";
import { fetchBusyIntervals } from "@/lib/google-calendar";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  if (meta.fulfilled === "1") {
    return;
  }

  const packageId = meta.packageId;
  const date = meta.date;
  const time = meta.time;

  if (!packageId || !isPackageId(packageId)) {
    throw new Error("Webhook metadata missing packageId");
  }
  if (!date || !time) {
    throw new Error("Webhook metadata missing date/time");
  }

  const addonIds = parseAddonIds(meta.addonIds).filter(isAddonId) as AddonId[];
  const stripe = getStripe();

  let calendarEventId = meta.calendarEventId || "";

  if (!calendarEventId) {
    const { start, end } = dayBoundsMelbourne(date);
    const busy = await fetchBusyIntervals(start, end);

    try {
      assertSlotBookable(date, time, packageId, busy);
    } catch (err) {
      console.warn(
        "[stripe-webhook] Slot conflict after payment — still fulfilling",
        err,
      );
    }

    const result = await fulfillPaidBooking({
      packageId,
      addonIds,
      date,
      time,
      clientName: meta.clientName || session.customer_details?.name || "Client",
      clientEmail:
        meta.clientEmail ||
        session.customer_email ||
        session.customer_details?.email ||
        "",
      clientPhone: meta.clientPhone || "",
      location: meta.location || "",
      reason: meta.reason || "",
      source: meta.source || "",
      notes: meta.notes || undefined,
      social: meta.social || undefined,
      amountTotalCents: session.amount_total ?? undefined,
      stripeSessionId: session.id,
      skipEmail: true,
    });
    calendarEventId = result.calendarEventId;

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...meta,
        calendarEventId,
      },
    });
  }

  const { sendBookingConfirmationEmails } = await import("@/lib/email");
  await sendBookingConfirmationEmails({
    packageId,
    addonIds,
    date,
    time,
    clientName: meta.clientName || session.customer_details?.name || "Client",
    clientEmail:
      meta.clientEmail ||
      session.customer_email ||
      session.customer_details?.email ||
      "",
    clientPhone: meta.clientPhone || "",
    location: meta.location || "",
    reason: meta.reason || "",
    source: meta.source || "",
    notes: meta.notes || undefined,
    social: meta.social || undefined,
    amountTotalCents: session.amount_total ?? undefined,
    stripeSessionId: session.id,
  });

  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      ...meta,
      calendarEventId,
      fulfilled: "1",
    },
  });
}

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
        await handleCheckoutCompleted(session);
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
