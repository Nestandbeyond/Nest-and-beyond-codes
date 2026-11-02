import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { productQuery } from "@/lib/shopify-queries";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useHydrated } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.handle));
    if (!p) throw notFound();
    return { title: p.node.title, description: p.node.description.slice(0, 155), image: p.node.images.edges[0]?.node.url };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Nest & Beyond` : "Product — Nest & Beyond";
    const desc = loaderData?.description || "A timeless piece from the Nest & Beyond atelier.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData?.image
          ? [
              { property: "og:image", content: loaderData.image },
              { name: "twitter:image", content: loaderData.image },
            ]
          : []),
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(handle));
  const hydrated = useHydrated();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const saved = useWishlistStore((s) => s.handles.includes(handle));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const p = data!.node;
  const variants = p.variants.edges.map((e) => e.node);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((variants[0]?.selectedOptions ?? []).map((o) => [o.name, o.value])),
  );
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const variant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? variants[0],
    [variants, selected],
  );
  const images = p.images.edges.map((e) => e.node);
  const hasOptions = p.options.length > 1 || (p.options[0]?.values.length ?? 0) > 1;

  const add = async () => {
    if (!variant) return;
    const ok = await addItem({
      product: data!,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions,
    });
    if (ok) toast.success("Added to Sanctuary Bag", { description: p.title });
    else toast.error("Couldn't add to bag", { description: "Please try again in a moment." });
  };

  return (
    <section className="w-full bg-surface pt-28 pb-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <Link to="/shop" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary mb-space-md">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to the Atelier
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <div className="space-y-space-sm">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container">
              {images[imgIdx] && <img src={images[imgIdx].url} alt={images[imgIdx].altText ?? p.title} className="w-full h-full object-cover" />}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-space-xs">
                {images.map((im, i) => (
                  <button
                    key={im.url}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={`aspect-square rounded-lg overflow-hidden bg-surface-container ring-2 transition-all ${i === imgIdx ? "ring-primary" : "ring-transparent hover:ring-outline-variant"}`}
                  >
                    <img src={im.url} alt={im.altText ?? `${p.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-space-md lg:pt-space-lg">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{p.productType || "Atelier Artifact"}</span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary tracking-tight">{p.title}</h1>
            <div className="flex items-baseline gap-space-sm">
              <p className="font-headline-sm text-headline-sm text-primary">{variant ? formatMoney(variant.price) : formatMoney(p.priceRange.minVariantPrice)}</p>
              {variant?.compareAtPrice && Number(variant.compareAtPrice.amount) > Number(variant.price.amount) && (
                <p className="font-body-md text-body-md text-on-surface-variant line-through">{formatMoney(variant.compareAtPrice)}</p>
              )}
            </div>
            {hasOptions &&
              p.options.map((opt) => (
                <div key={opt.name}>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-space-xs">{opt.name}</p>
                  <div className="flex flex-wrap gap-space-xs">
                    {opt.values.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSelected((s) => ({ ...s, [opt.name]: v }))}
                        className={
                          selected[opt.name] === v
                            ? "px-space-md py-1.5 rounded-full text-label-md font-label-md bg-primary-container text-on-primary transition-all"
                            : "px-space-md py-1.5 rounded-full text-label-md font-label-md bg-surface-container text-on-surface hover:bg-surface-container-high transition-all"
                        }
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            <div className="flex items-center gap-space-sm">
              <div className="flex items-center rounded-lg bg-surface-container">
                <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-8 text-center font-title-md text-title-md">{qty}</span>
                <button type="button" aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <button
                type="button"
                onClick={add}
                disabled={isLoading || !variant?.availableForSale}
                className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-surface-tint hover:shadow-lg transition-all duration-300 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                {variant?.availableForSale ? "Add to Sanctuary Bag" : "Sold Out"}
              </button>
              <button
                type="button"
                aria-label="Save to Wishlist"
                onClick={() => toggleWish(handle)}
                className={`w-11 h-11 rounded-full bg-surface-container flex items-center justify-center hover:text-error transition-all ${hydrated && saved ? "text-error" : "text-on-surface"}`}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: hydrated && saved ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
              </button>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant/80">Complimentary White-Glove Shipping • 30-Day In-Home Trial</p>
            {p.descriptionHtml ? (
              <div
                className="pt-space-md border-t border-outline-variant/30 font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-space-sm [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
              />
            ) : (
              <p className="pt-space-md border-t border-outline-variant/30 font-body-md text-body-md text-on-surface-variant">{p.description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
