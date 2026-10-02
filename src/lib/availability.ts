import { DateTime } from "luxon";
import {
  TIMEZONE,
  getPackage,
  type PackageId,
} from "@/lib/booking";

/** Client rule: available 7 days, 9am–5pm Melbourne */
export const BUSINESS_START_MINUTES = 9 * 60;
export const BUSINESS_END_MINUTES = 17 * 60;
/** Client rule: 30 minute buffer either side of any busy event / appointment */
export const BUFFER_MINUTES = 30;
/** Generated start times every 30 minutes */
export const SLOT_STEP_MINUTES = 30;

export type BusyInterval = {
  start: Date;
  end: Date;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function minutesToTimeLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

export function melbourneDateTime(date: string, time: string): DateTime {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone: TIMEZONE });
  if (!dt.isValid) {
    throw new Error(`Invalid Melbourne datetime: ${date} ${time}`);
  }
  return dt;
}

export function dayBoundsMelbourne(date: string): { start: Date; end: Date } {
  const start = melbourneDateTime(date, "00:00").toJSDate();
  const end = melbourneDateTime(date, "00:00").plus({ days: 1 }).toJSDate();
  return { start, end };
}

/**
 * Candidate start times for a package on a given Melbourne calendar day.
 * Shoot must fit entirely within 9:00–17:00 (end ≤ 17:00).
 */
export function candidateStartTimes(
  date: string,
  durationMinutes: number,
): string[] {
  const day = DateTime.fromISO(date, { zone: TIMEZONE });
  if (!day.isValid) return [];

  const lastStart = BUSINESS_END_MINUTES - durationMinutes;
  if (lastStart < BUSINESS_START_MINUTES) return [];

  const slots: string[] = [];
  for (
    let minutes = BUSINESS_START_MINUTES;
    minutes <= lastStart;
    minutes += SLOT_STEP_MINUTES
  ) {
    slots.push(minutesToTimeLabel(minutes));
  }
  return slots;
}

function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * A slot is free if [start − buffer, end + buffer] does not overlap any busy interval.
 * Calendar events store shoot only; buffer is applied here around every busy block.
 */
export function isSlotFree(
  date: string,
  time: string,
  durationMinutes: number,
  busy: BusyInterval[],
  now: Date = new Date(),
): boolean {
  const start = melbourneDateTime(date, time);
  const end = start.plus({ minutes: durationMinutes });

  if (end.toMillis() <= now.getTime()) return false;

  const windowStart = start.minus({ minutes: BUFFER_MINUTES }).toMillis();
  const windowEnd = end.plus({ minutes: BUFFER_MINUTES }).toMillis();

  for (const block of busy) {
    if (
      intervalsOverlap(
        windowStart,
        windowEnd,
        block.start.getTime(),
        block.end.getTime(),
      )
    ) {
      return false;
    }
  }
  return true;
}

export function availableSlotsForPackage(
  date: string,
  packageId: PackageId,
  busy: BusyInterval[],
  now: Date = new Date(),
): string[] {
  const pkg = getPackage(packageId);
  if (!pkg) return [];

  const todayMelbourne = DateTime.now().setZone(TIMEZONE).toISODate();
  if (todayMelbourne && date < todayMelbourne) return [];

  return candidateStartTimes(date, pkg.durationMinutes).filter((time) =>
    isSlotFree(date, time, pkg.durationMinutes, busy, now),
  );
}

export function assertSlotBookable(
  date: string,
  time: string,
  packageId: PackageId,
  busy: BusyInterval[],
  now: Date = new Date(),
): void {
  const pkg = getPackage(packageId);
  if (!pkg) throw new Error("Unknown package");

  const candidates = candidateStartTimes(date, pkg.durationMinutes);
  if (!candidates.includes(time)) {
    throw new Error("Selected time is outside business hours for this package");
  }
  if (!isSlotFree(date, time, pkg.durationMinutes, busy, now)) {
    throw new Error("Selected time is no longer available");
  }
}
