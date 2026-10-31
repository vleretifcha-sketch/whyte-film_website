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

export type FulfillCheckoutResult = {
  alreadyFulfilled: boolean;
  emailSent: boolean;
  calendarEventId: string | null;
  calendarError: string | null;
};

/**
 * Creates the Whyte Films calendar event + confirmation emails for a paid
 * Checkout Session. Safe to retry: skips steps already recorded in metadata.
 */
export async function fulfillPaidCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<FulfillCheckoutResult> {
  const meta = session.metadata ?? {};
  if (meta.fulfilled === "1") {
    return {
      alreadyFulfilled: true,
      emailSent: meta.emailSent === "1",
      calendarEventId: meta.calendarEventId || null,
      calendarError: null,
    };
  }

  const packageId = meta.packageId;
  const date = meta.date;
  const time = meta.time;

  if (!packageId || !isPackageId(packageId)) {
    throw new Error("Checkout metadata missing packageId");
  }
  if (!date || !time) {
    throw new Error("Checkout metadata missing date/time");
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
  let calendarError: string | null = null;

  if (!calendarEventId) {
    const { start, end } = dayBoundsMelbourne(date);
    const busy = await fetchBusyIntervals(start, end).catch((err) => {
      console.warn("[fulfill-checkout] freebusy failed — continuing", err);
      return [];
    });

    try {
      assertSlotBookable(date, time, packageId, busy);
    } catch (err) {
      console.warn(
        "[fulfill-checkout] Slot conflict after payment — still fulfilling",
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
          calendarError: "",
        },
      });
    } catch (err) {
      calendarError =
        err instanceof Error ? err.message.slice(0, 450) : "calendar failed";
      console.error("[fulfill-checkout] calendar create failed", err);
    }
  }

  if (!emailSent) {
    if (!clientEmail) {
      throw new Error("Checkout missing client email for confirmation");
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
        ...(calendarError ? { calendarError } : {}),
        emailSent: "1",
      },
    });
  }

  // Mark complete when email is sent. Calendar may still be missing — do not
  // 500 the Stripe webhook after a successful email (that made "Renvoyer"
  // look like nothing happened).
  await stripe.checkout.sessions.update(session.id, {
    metadata: {
      ...meta,
      ...(calendarEventId ? { calendarEventId } : {}),
      ...(calendarError ? { calendarError } : { calendarError: "" }),
      emailSent: "1",
      fulfilled: calendarEventId ? "1" : "email_only",
    },
  });

  return {
    alreadyFulfilled: false,
    emailSent,
    calendarEventId: calendarEventId || null,
    calendarError,
  };
}
