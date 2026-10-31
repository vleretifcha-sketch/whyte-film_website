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

  if (!payload.clientEmail?.trim()) {
    throw new Error("Missing client email for booking confirmation");
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const businessResult = await resend.emails.send({
    from,
    to: business,
    subject: subjectBusiness,
    text: body,
  });
  if (businessResult.error) {
    throw new Error(businessResult.error.message);
  }

  const clientResult = await resend.emails.send({
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
  if (clientResult.error) {
    throw new Error(clientResult.error.message);
  }
}

export const GROUP_SHOOT_NOTIFY_EMAIL = "management@whytefilms.com.au";

export type GroupShootRegistration = {
  fullName: string;
  email: string;
  phone: string;
  instagram: string;
  marketingConsent: boolean;
  sessionLabel: string;
  timeLabel: string;
  venue: string;
};

export async function sendGroupShootRegistrationEmails(
  payload: GroupShootRegistration,
): Promise<void> {
  const instagram = payload.instagram.startsWith("@")
    ? payload.instagram
    : `@${payload.instagram}`;
  const consent = payload.marketingConsent ? "Yes" : "No";
  const details = [
    "New group shoot registration",
    "",
    `Session: ${payload.sessionLabel}`,
    `Time: ${payload.timeLabel}`,
    `Venue: ${payload.venue}`,
    "",
    `Full name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Instagram: ${instagram}`,
    `Marketing consent: ${consent}`,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.BOOKING_FROM_EMAIL?.trim() ||
    "Whyte Films Bookings <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const notify = await resend.emails.send({
    from,
    to: GROUP_SHOOT_NOTIFY_EMAIL,
    replyTo: payload.email,
    subject: `Group shoot registration — ${payload.fullName}`,
    text: details,
  });

  if (notify.error) {
    throw new Error(notify.error.message);
  }

  const client = await resend.emails.send({
    from,
    to: payload.email,
    subject: "You're registered for the Whyte Films group shoot",
    text: [
      `Hi ${payload.fullName},`,
      "",
      "You're registered for the next Whyte Films group shoot.",
      "",
      payload.sessionLabel,
      payload.timeLabel,
      payload.venue,
      "",
      "See you there,",
      "Whyte Films",
    ].join("\n"),
  });

  if (client.error) {
    console.error("[group-shoot] client confirmation failed", client.error.message);
  }
}
