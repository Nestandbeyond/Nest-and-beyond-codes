import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nest & Beyond" },
      { name: "description", content: "Reach the Nest & Beyond concierge for client assistance, consultations and trade enquiries." },
      { property: "og:title", content: "Contact — Nest & Beyond" },
      { property: "og:description", content: "Reach the Nest & Beyond concierge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const field =
  "w-full bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:border-primary";

function Contact() {
  return (
    <>
      <PageIntro eyebrow="Concierge" title="Contact Us">
        Client assistance, private consultations, white-glove delivery and trade enquiries.
      </PageIntro>
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-tablet">
          <form
            className="space-y-space-sm bg-surface-container-low rounded-2xl p-space-lg"
            onSubmit={(e) => {
              e.preventDefault();
              e.currentTarget.reset();
              toast.success("Thank you — our concierge will be in touch.");
            }}
          >
            <input required name="name" placeholder="Your name" className={field} maxLength={100} />
            <input required type="email" name="email" placeholder="Your email" className={field} maxLength={255} />
            <textarea required name="message" rows={5} placeholder="How may we help?" className={field} maxLength={2000} />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-surface-tint transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
