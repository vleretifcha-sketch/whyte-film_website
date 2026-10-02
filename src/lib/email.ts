import {
  BOOKING_ADDONS,
  formatAud,
  formatBookingDateTime,
  getPackage,
  type AddonId,
  type PackageId,
} from "@/lib/booking";

export type BookingEmailPayload = {
  packageId: PackageId;
  addonIds: AddonId[];
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location: string;
  reason: string;
  source: string;
  notes?: string;
  social?: string;
  amountTotalCents?: number;
  stripeSessionId?: string;
};

function notifyEmail(): string {
  return (
    process.env.BOOKING_NOTIFY_EMAIL?.trim() || "management@whytefilms.com.au"
  );
}

function buildBody(payload: BookingEmailPayload): string {
  const pkg = getPackage(payload.packageId);
  const addons = BOOKING_ADDONS.filter((a) =>
    payload.addonIds.includes(a.id),
  );
  const when = formatBookingDateTime(payload.date, payload.time);
  const total =
    payload.amountTotalCents != null
      ? formatAud(payload.amountTotalCents / 100)
      : undefined;

  const lines = [
    `Package: ${pkg?.name ?? payload.packageId}`,
    `When: ${when} (Australia/Melbourne)`,
    `Duration: ${pkg?.durationLabel ?? ""}`,
    addons.length
      ? `Add-ons: ${addons.map((a) => a.title).join("; ")}`
      : "Add-ons: none",
    total ? `Paid: ${total}` : null,
    "",
    `Client: ${payload.clientName}`,
    `Email: ${payload.clientEmail}`,
    `Phone: ${payload.clientPhone}`,
    `Location: ${payload.location}`,
    `Reason: ${payload.reason}`,
    `Heard about us: ${payload.source}`,
    payload.social ? `Social: ${payload.social}` : null,
    payload.notes ? `Notes: ${payload.notes}` : null,
    payload.stripeSessionId ? `Stripe session: ${payload.stripeSessionId}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function sendBookingConfirmationEmails(
  payload: BookingEmailPayload,
): Promise<void> {
  const pkg = getPackage(payload.packageId);
  const business = notifyEmail();
  const body = buildBody(payload);
  const subjectBusiness = `Paid booking confirmed — ${pkg?.name ?? "Package"} — ${payload.clientName}`;
  const subjectClient = `Your Whyte Films booking is confirmed`;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.BOOKING_FROM_EMAIL?.trim() ||
    "Whyte Films Bookings <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("[booking-email] RESEND_API_KEY missing — logging only");
    console.info(subjectBusiness, "\n", body);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: business,
    subject: subjectBusiness,
    text: body,
  });

  await resend.emails.send({
    from,
    to: payload.clientEmail,
    subject: subjectClient,
    text: [
      `Hi ${payload.clientName},`,
      "",
      "Thanks for booking with Whyte Films. Your payment was received and your session is confirmed.",
      "",
      body,
      "",
      "See you soon,",
      "Whyte Films",
    ].join("\n"),
  });
}
