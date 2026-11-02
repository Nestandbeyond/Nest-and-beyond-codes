import { createFileRoute } from "@tanstack/react-router";
import { Ethos, Testimonials, Instagram } from "@/components/site/StitchSections";
import { PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nest & Beyond" },
      { name: "description", content: "Where nature meets elevated living: the story behind Nest & Beyond." },
      { property: "og:title", content: "About — Nest & Beyond" },
      { property: "og:description", content: "Where nature meets elevated living: the story behind Nest & Beyond." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Our Story" title="About Nest & Beyond" />
      <Ethos />
      <Testimonials />
      <Instagram />
    </>
  ),
});
