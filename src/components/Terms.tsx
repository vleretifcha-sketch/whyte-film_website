import { SectionHeader } from "./SectionHeader";

const sections = [
  {
    title: "1. Scope",
    body: [
      "These Terms & Conditions (“Terms”) apply to all packages, sessions, add-ons and related services offered by Whyte Films (“we”, “us”, “our”) through whytefilms.com.au and our booking flow.",
      "By submitting a booking request or checking the agreement box at checkout, you confirm that you have read and accept these Terms.",
    ],
  },
  {
    title: "2. Bookings & confirmation",
    body: [
      "A booking request is not confirmed until we have reviewed availability and sent written confirmation (email or message).",
      "Package details, duration and inclusions shown at checkout are those that apply to your booking, unless we agree otherwise in writing.",
      "You are responsible for providing accurate contact and session information so we can deliver the service.",
    ],
  },
  {
    title: "3. Prices & payment",
    body: [
      "Prices are displayed in Australian dollars (AUD) and include GST where applicable, unless stated otherwise.",
      "Payment terms will be confirmed with your booking. Sessions may require a deposit or full prepayment to secure the date.",
      "Add-ons selected during booking are charged in addition to the base package price.",
    ],
  },
  {
    title: "4. Cancellation & rescheduling",
    body: [
      "You may request to reschedule subject to our availability. We will do our best to offer an alternative slot.",
      "Cancellations or no-shows with less than 48 hours’ notice may be charged in full or result in loss of deposit, at our discretion.",
      "If we must cancel for reasons within our control, we will offer a reschedule or a refund of amounts paid for the affected session.",
    ],
  },
  {
    title: "5. Deliverables & usage",
    body: [
      "Delivery timelines depend on the package and any “fast turnaround” add-on selected. Approximate timing will be confirmed with your booking.",
      "Unless otherwise agreed in writing, Whyte Films retains copyright in all photos and videos we create. You receive a licence to use the approved deliverables for your personal or commercial brand promotion.",
      "We may use selected work in our portfolio, website and social channels unless you ask us in writing not to before the session.",
    ],
  },
  {
    title: "6. Client responsibilities",
    body: [
      "You must arrive on time, follow reasonable creative direction on set, and ensure you have the right to be photographed or filmed at the location.",
      "If talent, venues or third-party assets are involved, you are responsible for any required releases or permissions.",
    ],
  },
  {
    title: "7. Liability",
    body: [
      "To the fullest extent permitted by Australian Consumer Law, our liability for any claim arising from a booking is limited to the amount you paid for that booking.",
      "We are not liable for indirect or consequential loss, including lost profits or brand opportunities, except where liability cannot be excluded by law.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      "Questions about these Terms: management@whytefilms.com.au",
      "Whyte Films — Australia. Last updated August 2026.",
    ],
  },
] as const;

export function Terms() {
  return (
    <section className="bg-[#010101] px-[var(--pad)] pb-[var(--section-y)] pt-28 md:pt-32">
      <div className="mx-auto flex w-full max-w-[1408px] flex-col gap-12 md:gap-16">
        <SectionHeader left="LEGAL" right="TERMS" />

        <div className="max-w-[720px]">
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/70">
            General terms of sale for Whyte Films packages, sessions and
            related services.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 md:gap-12">
          {sections.map((section) => (
            <article key={section.title} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold tracking-[-0.02em] text-white md:text-xl">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-white/70"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
