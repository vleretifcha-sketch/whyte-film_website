import { NextResponse } from "next/server";
import { sendGroupShootRegistrationEmails } from "@/lib/email";
import { NEXT_GROUP_SHOOT } from "@/lib/group-shoot";

type GroupShootBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  marketingConsent?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTAGRAM_PATTERN = /^[A-Za-z0-9._]{1,30}$/;

function cleanInstagram(value: string): string {
  return value.trim().replace(/^@+/, "");
}

export async function POST(request: Request) {
  let body: GroupShootBody;
  try {
    body = (await request.json()) as GroupShootBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const instagram = cleanInstagram(body.instagram ?? "");
  const marketingConsent = body.marketingConsent === true;

  if (fullName.length < 2) {
    return NextResponse.json({ error: "Enter your full name" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }
  if (phone.length < 6) {
    return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
  }
  if (!INSTAGRAM_PATTERN.test(instagram)) {
    return NextResponse.json(
      { error: "Enter a valid Instagram handle" },
      { status: 400 },
    );
  }

  try {
    await sendGroupShootRegistrationEmails({
      fullName,
      email,
      phone,
      instagram,
      marketingConsent,
      sessionLabel: NEXT_GROUP_SHOOT.dateLabel,
      timeLabel: NEXT_GROUP_SHOOT.timeLabel,
      venue: NEXT_GROUP_SHOOT.venue,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send registration";
    const status = message.includes("RESEND_API_KEY") ? 503 : 502;
    return NextResponse.json(
      { error: "We couldn't send your registration. Please try again." },
      { status },
    );
  }

  return NextResponse.json({ ok: true });
}
