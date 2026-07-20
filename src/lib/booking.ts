export type PackageId =
  | "focus"
  | "flex"
  | "motion"
  | "social"
  | "gallery"
  | "studio";

export type AddonId = "photos" | "reel" | "fast" | "drone";

export type BookingPackage = {
  id: PackageId;
  name: string;
  includes: string;
  durationLabel: string;
  durationMinutes: number;
  price: number;
};

export type BookingAddon = {
  id: AddonId;
  title: string;
  price: number;
  label: string;
  image: string;
};

export const BOOKING_PACKAGES: BookingPackage[] = [
  {
    id: "focus",
    name: "Focus",
    includes: "1 × 30min one-on-one videography session",
    durationLabel: "30 mins",
    durationMinutes: 30,
    price: 229,
  },
  {
    id: "flex",
    name: "Flex",
    includes: "1 × 45min one-on-one videography session",
    durationLabel: "1 hr",
    durationMinutes: 60,
    price: 415,
  },
  {
    id: "motion",
    name: "Motion",
    includes: "1 × 60min one-on-one videography session",
    durationLabel: "1 hr",
    durationMinutes: 60,
    price: 775,
  },
  {
    id: "social",
    name: "Social",
    includes: "1 × 120min one-on-one photography session",
    durationLabel: "2 hr",
    durationMinutes: 120,
    price: 1033,
  },
  {
    id: "gallery",
    name: "Gallery",
    includes: "1 × 60min one-on-one photography session",
    durationLabel: "1 hr",
    durationMinutes: 60,
    price: 465,
  },
  {
    id: "studio",
    name: "Studio",
    includes:
      "2 hours exclusive studio hire · 50 × premium edited action shots",
    durationLabel: "2 hr",
    durationMinutes: 120,
    price: 1495,
  },
];

export const BOOKING_ADDONS: BookingAddon[] = [
  {
    id: "photos",
    title: "Add 10 × Premium Edited Photos",
    price: 100,
    label: "PHOTOS",
    image: "/assets/about-1.jpg",
  },
  {
    id: "reel",
    title: "Add 1 × Social Media Reel (15–30secs, Portrait)",
    price: 99,
    label: "REEL",
    image: "/assets/service-2.jpg",
  },
  {
    id: "fast",
    title: "Add “Fast Turnaround” (24HRS)",
    price: 199,
    label: "24HRS",
    image: "/assets/about-2.jpg",
  },
  {
    id: "drone",
    title: "Add Drone Footage",
    price: 49,
    label: "DRONE",
    image: "/assets/hero.jpg",
  },
];

export const BOOKING_STEPS = [
  { id: "packages", label: "Packages", href: "/packages" },
  { id: "addons", label: "Service add-ons", href: "/book/addons" },
  { id: "time", label: "Time", href: "/book/time" },
  { id: "client", label: "Client", href: "/book/client" },
] as const;

export type BookingStepId = (typeof BOOKING_STEPS)[number]["id"];

export const TIMEZONE = "Australia/Melbourne";

/** Demo availability — weekdays get more slots */
export const TIME_SLOTS = ["09:00", "12:30", "17:30"] as const;

export type BookingState = {
  packageId: PackageId | null;
  addonIds: AddonId[];
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:mm
};

export const EMPTY_BOOKING: BookingState = {
  packageId: null,
  addonIds: [],
  date: null,
  time: null,
};

export const BOOKING_STORAGE_KEY = "whyte-films-booking";

export function getPackage(id: string | null | undefined) {
  if (!id) return undefined;
  return BOOKING_PACKAGES.find((p) => p.id === id);
}

export function getAddon(id: AddonId) {
  return BOOKING_ADDONS.find((a) => a.id === id);
}

export function formatAud(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

export function bookingSubtotal(state: BookingState) {
  const pkg = getPackage(state.packageId);
  if (!pkg) return 0;
  const addons = state.addonIds.reduce((sum, id) => {
    const addon = getAddon(id);
    return sum + (addon?.price ?? 0);
  }, 0);
  return pkg.price + addons;
}

export function isPackageId(value: string): value is PackageId {
  return BOOKING_PACKAGES.some((p) => p.id === value);
}

export function isAddonId(value: string): value is AddonId {
  return BOOKING_ADDONS.some((a) => a.id === value);
}

export function formatSlotLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatBookingDateTime(date: string, time: string) {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const value = new Date(y, mo - 1, d, h, mi);
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(value);
}

export function melbourneNowLabel() {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date());
}

/** Past dates unavailable; Sundays closed in demo */
export function isDateBookable(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  if (day < today) return false;
  if (day.getDay() === 0) return false;
  return true;
}

export function slotsForDate(date: string | null): string[] {
  if (!date) return [];
  const [y, mo, d] = date.split("-").map(Number);
  const value = new Date(y, mo - 1, d);
  if (!isDateBookable(value)) return [];
  // Saturday: fewer slots
  if (value.getDay() === 6) return ["09:00", "12:30"];
  return [...TIME_SLOTS];
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
