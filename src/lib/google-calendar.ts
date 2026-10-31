import { google } from "googleapis";
import { DateTime } from "luxon";
import type { BusyInterval } from "@/lib/availability";
import { TIMEZONE } from "@/lib/booking";

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID?.trim();
  if (!id) throw new Error("GOOGLE_CALENDAR_ID is not configured");
  return id;
}

/** Vercel often stores the PEM as one line, with quotes, or with literal `\n`. */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n").replace(/\r/g, "").trim();

  const match = key.match(
    /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/,
  );
  if (!match) return key;

  const label = match[1];
  const body = match[2].replace(/[^A-Za-z0-9+/=]/g, "");
  const lines = body.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    ? normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)
    : "";

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Google Calendar credentials missing (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)",
    );
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

function getCalendarClient() {
  return google.calendar({ version: "v3", auth: getAuth() });
}

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID?.trim() &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim(),
  );
}

/** FreeBusy busy blocks for the given UTC range */
export async function fetchBusyIntervals(
  timeMin: Date,
  timeMax: Date,
): Promise<BusyInterval[]> {
  if (!isGoogleCalendarConfigured()) {
    // Dev / preview without credentials: treat calendar as empty
    return [];
  }

  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  const calendarResult = res.data.calendars?.[calendarId];
  if (calendarResult?.errors?.length) {
    const reason = calendarResult.errors
      .map((error) => error.reason)
      .filter(Boolean)
      .join(", ");
    throw new Error(
      reason
        ? `Google Calendar refused the request (${reason})`
        : "Google Calendar refused the request",
    );
  }

  const busy = calendarResult?.busy ?? [];
  return busy
    .filter((b): b is { start: string; end: string } => Boolean(b.start && b.end))
    .map((b) => ({
      start: new Date(b.start),
      end: new Date(b.end),
    }));
}

export type CalendarBookingEventInput = {
  summary: string;
  description: string;
  start: Date;
  end: Date;
};

/** Local wall-clock RFC3339 without offset — paired with timeZone for Google Calendar. */
function toMelbourneDateTime(date: Date): string {
  return DateTime.fromJSDate(date, { zone: TIMEZONE }).toFormat(
    "yyyy-MM-dd'T'HH:mm:ss",
  );
}

/**
 * Creates a busy event on the Whyte Films calendar (buffer is not written).
 *
 * Do not add attendees here: Google service accounts cannot invite guests
 * without Domain-Wide Delegation, and including attendees makes the whole
 * insert fail — so the shoot never appears on the business calendar.
 */
export async function createBookingEvent(
  input: CalendarBookingEventInput,
): Promise<{ eventId: string; htmlLink?: string | null }> {
  if (!isGoogleCalendarConfigured()) {
    throw new Error("Google Calendar is not configured");
  }

  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  try {
    const res = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: input.summary,
        description: input.description,
        start: {
          dateTime: toMelbourneDateTime(input.start),
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: toMelbourneDateTime(input.end),
          timeZone: TIMEZONE,
        },
        transparency: "opaque",
        status: "confirmed",
      },
    });

    if (!res.data.id) {
      throw new Error("Google Calendar event create returned no id");
    }

    return { eventId: res.data.id, htmlLink: res.data.htmlLink };
  } catch (error) {
    throw new Error(`Google Calendar insert failed: ${formatGoogleError(error)}`, {
      cause: error,
    });
  }
}

function formatGoogleError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return String(error);
  }

  const err = error as {
    message?: string;
    response?: { status?: number; data?: { error?: { message?: string; status?: string } } };
    errors?: Array<{ message?: string }>;
  };

  const apiMessage =
    err.response?.data?.error?.message ||
    err.errors?.map((e) => e.message).filter(Boolean).join("; ") ||
    err.message;

  const status = err.response?.status || err.response?.data?.error?.status;
  if (status && apiMessage) return `${status}: ${apiMessage}`;
  return apiMessage || "unknown Google Calendar error";
}
