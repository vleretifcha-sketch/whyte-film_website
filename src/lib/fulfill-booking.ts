import { melbourneDateTime } from "@/lib/availability";
import {
  BOOKING_ADDONS,
  getPackage,
  type AddonId,
  type PackageId,
} from "@/lib/booking";
import { sendBookingConfirmationEmails } from "@/lib/email";
import { createBookingEvent } from "@/lib/google-calendar";

export type FulfilledBooking = {
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
  stripeSessionId: string;
  skipEmail?: boolean;
};

export async function fulfillPaidBooking(
  booking: FulfilledBooking,
): Promise<{ calendarEventId: string }> {
  const pkg = getPackage(booking.packageId);
  if (!pkg) throw new Error("Unknown package");

  const addons = BOOKING_ADDONS.filter((a) =>
    booking.addonIds.includes(a.id),
  );
  const start = melbourneDateTime(booking.date, booking.time);
  const end = start.plus({ minutes: pkg.durationMinutes });

  const description = [
    `Package: ${pkg.name}`,
    `Client: ${booking.clientName}`,
    `Email: ${booking.clientEmail}`,
    `Phone: ${booking.clientPhone}`,
    `Location: ${booking.location}`,
    `Reason: ${booking.reason}`,
    addons.length
      ? `Add-ons: ${addons.map((a) => a.title).join(", ")}`
      : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
    `Stripe: ${booking.stripeSessionId}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { eventId } = await createBookingEvent({
    summary: `Whyte Films — ${pkg.name} — ${booking.clientName}`,
    description,
    start: start.toJSDate(),
    end: end.toJSDate(),
    attendeeEmail: booking.clientEmail,
  });

  if (!booking.skipEmail) {
    await sendBookingConfirmationEmails({
      ...booking,
    });
  }

  return { calendarEventId: eventId };
}

export function parseAddonIds(raw: string | undefined | null): AddonId[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as AddonId[];
}
