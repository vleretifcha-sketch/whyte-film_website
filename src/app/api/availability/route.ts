import { NextResponse } from "next/server";
import {
  availableSlotsForPackage,
  dayBoundsMelbourne,
} from "@/lib/availability";
import { isPackageId } from "@/lib/booking";
import { fetchBusyIntervals } from "@/lib/google-calendar";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const packageId = searchParams.get("packageId");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Query param `date` (YYYY-MM-DD) is required" },
      { status: 400 },
    );
  }
  if (!packageId || !isPackageId(packageId)) {
    return NextResponse.json(
      { error: "Query param `packageId` is required" },
      { status: 400 },
    );
  }

  try {
    const { start, end } = dayBoundsMelbourne(date);
    const busy = await fetchBusyIntervals(start, end);
    const slots = availableSlotsForPackage(date, packageId, busy);

    return NextResponse.json({
      date,
      packageId,
      slots,
      timezone: "Australia/Melbourne",
    });
  } catch (error) {
    console.error("[availability]", error);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 },
    );
  }
}
