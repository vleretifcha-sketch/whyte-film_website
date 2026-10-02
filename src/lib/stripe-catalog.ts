import {
  BOOKING_ADDONS,
  BOOKING_PACKAGES,
  type AddonId,
  type PackageId,
} from "@/lib/booking";

/**
 * Stripe Price IDs (Dashboard → Products). Set these in env for Live/Test.
 * If a Price ID is missing, Checkout falls back to inline `price_data`
 * using the amounts in BOOKING_PACKAGES / BOOKING_ADDONS.
 */
const PACKAGE_PRICE_ENV: Record<PackageId, string> = {
  focus: "STRIPE_PRICE_FOCUS",
  flex: "STRIPE_PRICE_FLEX",
  motion: "STRIPE_PRICE_MOTION",
  social: "STRIPE_PRICE_SOCIAL",
  gallery: "STRIPE_PRICE_GALLERY",
  studio: "STRIPE_PRICE_STUDIO",
};

const ADDON_PRICE_ENV: Record<AddonId, string> = {
  photos: "STRIPE_PRICE_ADDON_PHOTOS",
  reel: "STRIPE_PRICE_ADDON_REEL",
  fast: "STRIPE_PRICE_ADDON_FAST",
  drone: "STRIPE_PRICE_ADDON_DRONE",
};

export type StripeLineItem =
  | { price: string; quantity: number }
  | {
      price_data: {
        currency: "aud";
        unit_amount: number;
        product_data: { name: string; description?: string; metadata?: Record<string, string> };
      };
      quantity: number;
    };

function envPrice(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function packageStripeLineItem(packageId: PackageId): StripeLineItem {
  const pkg = BOOKING_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) throw new Error(`Unknown package: ${packageId}`);

  const priceId = envPrice(PACKAGE_PRICE_ENV[packageId]);
  if (priceId) return { price: priceId, quantity: 1 };

  return {
    quantity: 1,
    price_data: {
      currency: "aud",
      unit_amount: Math.round(pkg.price * 100),
      product_data: {
        name: `${pkg.name} Package`,
        description: pkg.includes,
        metadata: { packageId: pkg.id },
      },
    },
  };
}

export function addonStripeLineItem(addonId: AddonId): StripeLineItem {
  const addon = BOOKING_ADDONS.find((a) => a.id === addonId);
  if (!addon) throw new Error(`Unknown addon: ${addonId}`);

  const priceId = envPrice(ADDON_PRICE_ENV[addonId]);
  if (priceId) return { price: priceId, quantity: 1 };

  return {
    quantity: 1,
    price_data: {
      currency: "aud",
      unit_amount: Math.round(addon.price * 100),
      product_data: {
        name: addon.title,
        metadata: { addonId: addon.id },
      },
    },
  };
}

export function buildCheckoutLineItems(
  packageId: PackageId,
  addonIds: AddonId[],
): StripeLineItem[] {
  return [
    packageStripeLineItem(packageId),
    ...addonIds.map((id) => addonStripeLineItem(id)),
  ];
}

/** Reference list for creating Products in the Stripe Dashboard */
export const STRIPE_CATALOG_REFERENCE = {
  packages: BOOKING_PACKAGES.map((p) => ({
    id: p.id,
    name: `${p.name} Package`,
    amountAud: p.price,
    envVar: PACKAGE_PRICE_ENV[p.id],
  })),
  addons: BOOKING_ADDONS.map((a) => ({
    id: a.id,
    name: a.title,
    amountAud: a.price,
    envVar: ADDON_PRICE_ENV[a.id],
  })),
} as const;
