import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { collectionQuery } from "@/lib/shopify-queries";
import { PageIntro } from "@/components/site/PageIntro";
import { ProductGrid } from "@/components/site/ProductGrid";

export const Route = createFileRoute("/collections/$handle")({
  loader: async ({ context, params }) => {
    const c = await context.queryClient.ensureQueryData(collectionQuery(params.handle));
    if (!c) throw notFound();
    return { title: c.title, description: c.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — Nest & Beyond` : "Collection — Nest & Beyond" },
      { name: "description", content: loaderData?.description || "A curated Nest & Beyond collection." },
      { property: "og:title", content: loaderData ? `${loaderData.title} — Nest & Beyond` : "Collection — Nest & Beyond" },
      { property: "og:description", content: loaderData?.description || "A curated Nest & Beyond collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(collectionQuery(handle));
  if (!data) return null;
  return (
    <>
      <PageIntro eyebrow="Collection" title={data.title}>
        {data.description}
      </PageIntro>
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
          <ProductGrid products={data.products} />
        </div>
      </section>
    </>
  );
}
