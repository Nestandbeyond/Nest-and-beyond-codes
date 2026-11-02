import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { productsQuery } from "@/lib/shopify-queries";
import { PageIntro } from "@/components/site/PageIntro";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/shop")({
  validateSearch: z.object({ q: z.string().optional() }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(productsQuery(deps.q, 48)),
  head: () => ({
    meta: [
      { title: "Shop the Atelier — Nest & Beyond" },
      { name: "description", content: "Browse every piece in the Nest & Beyond atelier: furniture, linens, ceramics and wellness essentials." },
      { property: "og:title", content: "Shop the Atelier — Nest & Beyond" },
      { property: "og:description", content: "Browse every piece in the Nest & Beyond atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { q } = Route.useSearch();
  const { data } = useSuspenseQuery(productsQuery(q, 48));
  return (
    <>
      <PageIntro eyebrow="The Atelier" title={q ? `Results for “${q}”` : "Shop All"}>
        Timeless pieces, thoughtfully made for enduring quietude.
      </PageIntro>
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
          <ProductGrid products={data} />
        </div>
      </section>
    </>
  );
}
