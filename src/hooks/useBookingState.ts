"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BOOKING_STORAGE_KEY,
  EMPTY_BOOKING,
  isAddonId,
  isPackageId,
  type AddonId,
  type BookingState,
  type PackageId,
} from "@/lib/booking";

function readStorage(): BookingState {
  if (typeof window === "undefined") return EMPTY_BOOKING;
  try {
    const raw = sessionStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return EMPTY_BOOKING;
    const parsed = JSON.parse(raw) as Partial<BookingState>;
    return {
      packageId:
        parsed.packageId && isPackageId(parsed.packageId)
          ? parsed.packageId
          : null,
      addonIds: Array.isArray(parsed.addonIds)
        ? parsed.addonIds.filter(isAddonId)
        : [],
      date: typeof parsed.date === "string" ? parsed.date : null,
      time: typeof parsed.time === "string" ? parsed.time : null,
    };
  } catch {
    return EMPTY_BOOKING;
  }
}

function writeStorage(state: BookingState) {
  sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(state));
}

export function useBookingState() {
  const [state, setState] = useState<BookingState>(EMPTY_BOOKING);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readStorage());
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<BookingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      writeStorage(next);
      return next;
    });
  }, []);

  const setPackage = useCallback(
    (packageId: PackageId) => {
      update({ packageId, addonIds: [], date: null, time: null });
    },
    [update],
  );

  const toggleAddon = useCallback((id: AddonId) => {
    setState((prev) => {
      const addonIds = prev.addonIds.includes(id)
        ? prev.addonIds.filter((a) => a !== id)
        : [...prev.addonIds, id];
      const next = { ...prev, addonIds };
      writeStorage(next);
      return next;
    });
  }, []);

  const clearBooking = useCallback(() => {
    writeStorage(EMPTY_BOOKING);
    setState(EMPTY_BOOKING);
  }, []);

  return {
    state,
    ready,
    update,
    setPackage,
    toggleAddon,
    clearBooking,
  };
}
