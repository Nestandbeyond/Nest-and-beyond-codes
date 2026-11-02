import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageIntro } from "@/components/site/PageIntro";
import { ProductGrid } from "@/components/site/ProductGrid";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useHydrated } from "@/hooks/use-hydrated";
import { fetchProductByHandle } from "@/lib/shopify";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Nest & Beyond" },
      { name: "description", content: "Pieces you've saved from the Nest & Beyond atelier." },
      { property: "og:title", content: "Your Wishlist — Nest & Beyond" },
      { property: "og:description", content: "Pieces you've saved from the Nest & Beyond atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const hydrated = useHydrated();
  const handles = useWishlistStore((s) => s.handles);
  const { data, isLoading } = useQuery({
    queryKey: ["shopify", "wishlist", handles],
    enabled: hydrated,
    queryFn: async () => (await Promise.all(handles.map(fetchProductByHandle))).filter((p) => p !== null),
  });
  return (
    <>
      <PageIntro eyebrow="Saved Pieces" title="Your Wishlist" />
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
          {!hydrated || isLoading ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-space-xl">Loading…</p>
          ) : (
            <ProductGrid products={data ?? []} />
          )}
        </div>
      </section>
    </>
  );
}
