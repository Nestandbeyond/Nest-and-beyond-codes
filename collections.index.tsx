import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { collectionsQuery } from "@/lib/shopify-queries";
import { PageIntro } from "@/components/site/PageIntro";

export const Route = createFileRoute("/collections/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(collectionsQuery()),
  head: () => ({
    meta: [
      { title: "Collections — Nest & Beyond" },
      { name: "description", content: "Explore Nest & Beyond collections, each assembled to cultivate calm and tactile resonance." },
      { property: "og:title", content: "Collections — Nest & Beyond" },
      { property: "og:description", content: "Explore Nest & Beyond collections by sanctuary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Collections,
});

function Collections() {
  const { data: all } = useSuspenseQuery(collectionsQuery());
  const data = all.filter((c) => c.handle !== "frontpage");
  return (
    <>
      <PageIntro eyebrow="Curated Spaces" title="Explore by Sanctuary">
        Every collection is thoughtfully assembled to cultivate calm, intentional balance, and rich tactile resonance.
      </PageIntro>
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
          {data.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant text-center py-space-xl">No collections yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {data.map((c) => (
                <Link
                  key={c.id}
                  to="/collections/$handle"
                  params={{ handle: c.handle }}
                  className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
                    {c.image && (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url('${c.image.url}')` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-space-md flex items-center justify-between bg-surface-container-lowest">
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors">{c.title}</h3>
                      {c.description && <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{c.description}</p>}
                    </div>
                    <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
