import { createFileRoute } from "@tanstack/react-router";
import { Sustainability, Newsletter } from "@/components/site/StitchSections";
import { PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Nest & Beyond" },
      { name: "description", content: "Crafted with reverence for the earth: our materials, sourcing and restorative commitments." },
      { property: "og:title", content: "Sustainability — Nest & Beyond" },
      { property: "og:description", content: "Crafted with reverence for the earth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Restorative Pledge" title="Sustainability" />
      <Sustainability />
      <Newsletter />
    </>
  ),
});
