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

  const clientName =
    meta.clientName || session.customer_details?.name || "Client";
  const clientEmail =
    meta.clientEmail ||
    session.customer_email ||
    session.customer_details?.email ||
    "";
  const clientPhone = meta.clientPhone || "";
  const location = meta.location || "";
  const reason = meta.reason || "";
  const source = meta.source || "";
  const notes = meta.notes || undefined;
  const social = meta.social || undefined;
  const amountTotalCents = session.amount_total ?? undefined;

  let calendarEventId = meta.calendarEventId || "";
  let emailSent = meta.emailSent === "1";
  let calendarFailed = false;

  // Calendar and email are independent: a Google failure must not block confirmation mail.
  if (!calendarEventId) {
    const { start, end } = dayBoundsMelbourne(date);
    const busy = await fetchBusyIntervals(start, end).catch((err) => {
      console.warn("[stripe-webhook] freebusy failed — continuing", err);
      return [];
    });

    try {
      assertSlotBookable(date, time, packageId, busy);
    } catch (err) {
      console.warn(
        "[stripe-webhook] Slot conflict after payment — still fulfilling",
        err,
      );
    }

    try {
      const result = await fulfillPaidBooking({
        packageId,
        addonIds,
        date,
        time,
        clientName,
        clientEmail,
        clientPhone,
        location,
        reason,
        source,
        notes,
        social,
        amountTotalCents,
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
    } catch (err) {
      calendarFailed = true;
      console.error("[stripe-webhook] calendar create failed", err);
    }
  }

  if (!emailSent) {
    if (!clientEmail) {
      throw new Error("Webhook missing client email for confirmation");
    }

    const { sendBookingConfirmationEmails } = await import("@/lib/email");
    await sendBookingConfirmationEmails({
      packageId,
      addonIds,
      date,
      time,
      clientName,
      clientEmail,
      clientPhone,
      location,
      reason,
      source,
      notes,
      social,
      amountTotalCents,
      stripeSessionId: session.id,
    });
    emailSent = true;

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...meta,
        ...(calendarEventId ? { calendarEventId } : {}),
        emailSent: "1",
      },
    });
  }

  if (calendarFailed && !calendarEventId) {
    // Email is done; ask Stripe to retry so the calendar event can still be created.
    throw new Error("Booking email sent but Google Calendar event failed");
  }

  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      ...meta,
      calendarEventId,
      emailSent: "1",
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
