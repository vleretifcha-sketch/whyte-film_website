import { NextResponse } from "next/server";
import {
  assertSlotBookable,
  dayBoundsMelbourne,
} from "@/lib/availability";
import {
  isAddonId,
  isPackageId,
  type AddonId,
  type PackageId,
} from "@/lib/booking";
import { fetchBusyIntervals } from "@/lib/google-calendar";
import { buildCheckoutLineItems } from "@/lib/stripe-catalog";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

type CheckoutBody = {
  packageId?: string;
  addonIds?: string[];
  date?: string;
  time?: string;
  client?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    reason?: string;
    source?: string;
    notes?: string;
    social?: string;
    newsletter?: boolean;
  };
};

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const packageId = body.packageId;
  const date = body.date;
  const time = body.time;
  const client = body.client;

  if (!packageId || !isPackageId(packageId)) {
    return NextResponse.json({ error: "Invalid packageId" }, { status: 400 });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  }
  if (
    !client?.name?.trim() ||
    !client.email?.trim() ||
    !client.phone?.trim() ||
    !client.location?.trim() ||
    !client.reason?.trim() ||
    !client.source?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required client fields" },
      { status: 400 },
    );
  }

  const addonIds: AddonId[] = Array.isArray(body.addonIds)
    ? body.addonIds.filter(isAddonId)
    : [];

  try {
    const { start, end } = dayBoundsMelbourne(date);
    const busy = await fetchBusyIntervals(start, end);
    assertSlotBookable(date, time, packageId as PackageId, busy);

    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const lineItems = buildCheckoutLineItems(packageId, addonIds);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: client.email.trim(),
      line_items: lineItems,
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/book/client?cancelled=1`,
      metadata: {
        packageId,
        addonIds: addonIds.join(","),
        date,
        time,
        clientName: client.name.trim(),
        clientEmail: client.email.trim(),
        clientPhone: client.phone.trim(),
        location: client.location.trim(),
        reason: client.reason.trim(),
        source: client.source.trim(),
        notes: client.notes?.trim() ?? "",
        social: client.social?.trim() ?? "",
        newsletter: client.newsletter ? "1" : "0",
      },
      payment_intent_data: {
        metadata: {
          packageId,
          date,
          time,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    const conflict =
      message.includes("no longer available") ||
      message.includes("outside business hours");
    console.error("[checkout]", error);
    return NextResponse.json(
      { error: message },
      { status: conflict ? 409 : 500 },
    );
  }
}
