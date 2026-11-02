import { createFileRoute } from "@tanstack/react-router";
import { Hero, Categories, Ethos, Sustainability, Testimonials, Instagram, Newsletter } from "@/components/site/StitchSections";
import { Bestsellers } from "@/components/site/Bestsellers";
import { collectionsQuery, productsQuery } from "@/lib/shopify-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nest & Beyond — Inspired Living Beyond Expectations" },
      { name: "description", content: "Curated home décor, sustainable essentials, and timeless pieces designed to transform every space into a mindful sanctuary." },
      { property: "og:title", content: "Nest & Beyond — Inspired Living Beyond Expectations" },
      { property: "og:description", content: "Curated home décor, sustainable essentials, and timeless pieces for a mindful sanctuary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery(undefined, 8)),
      context.queryClient.ensureQueryData(collectionsQuery()),
    ]),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Categories />
      <Ethos />
      <Bestsellers />
      <Sustainability />
      <Testimonials />
      <Instagram />
      <Newsletter />
    </>
  );
}
