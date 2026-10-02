import { google } from "googleapis";
import type { BusyInterval } from "@/lib/availability";
import { TIMEZONE } from "@/lib/booking";

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID?.trim();
  if (!id) throw new Error("GOOGLE_CALENDAR_ID is not configured");
  return id;
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

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

  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
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
  attendeeEmail?: string;
};

/** Creates a busy event for the shoot only (buffer is not written to Calendar) */
export async function createBookingEvent(
  input: CalendarBookingEventInput,
): Promise<{ eventId: string; htmlLink?: string | null }> {
  if (!isGoogleCalendarConfigured()) {
    throw new Error("Google Calendar is not configured");
  }

  const calendar = getCalendarClient();
  const calendarId = getCalendarId();

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: {
        dateTime: input.start.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: input.end.toISOString(),
        timeZone: TIMEZONE,
      },
      transparency: "opaque",
      status: "confirmed",
      ...(input.attendeeEmail
        ? {
            attendees: [{ email: input.attendeeEmail }],
          }
        : {}),
    },
  });

  if (!res.data.id) {
    throw new Error("Google Calendar event create returned no id");
  }

  return { eventId: res.data.id, htmlLink: res.data.htmlLink };
}
