import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";

export async function addProductToBag(product: ShopifyProduct, variantIndex = 0, quantity = 1) {
  const variant = product.node.variants.edges[variantIndex]?.node;
  if (!variant) return;
  const ok = await useCartStore.getState().addItem({
    product,
    variantId: variant.id,
    variantTitle: variant.title,
    price: variant.price,
    quantity,
    selectedOptions: variant.selectedOptions ?? [],
  });
  if (ok) toast.success("Added to Sanctuary Bag", { description: product.node.title });
  else toast.error("Couldn't add to bag", { description: "Please try again in a moment." });
}

export function ProductCard({ product, onQuickView }: { product: ShopifyProduct; onQuickView: (p: ShopifyProduct) => void }) {
  const p = product.node;
  const hydrated = useHydrated();
  const isLoading = useCartStore((s) => s.isLoading);
  const saved = useWishlistStore((s) => s.handles.includes(p.handle));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const [img1, img2] = p.images.edges.map((e) => e.node);
  const firstVariant = p.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? false;
  const subtitle = p.productType || p.variants.edges.length > 1 ? p.productType || `${p.variants.edges.length} options` : "";
  const badges = (p.tags ?? []).slice(0, 2);
  const isSaved = hydrated && saved;

  return (
    <div className="product-item group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container">
        <Link to="/product/$handle" params={{ handle: p.handle }} className="absolute inset-0" aria-label={p.title}>
          {img1 && (
            <div
              role="img"
              aria-label={img1.altText ?? p.title}
              className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${img2 ? "group-hover:opacity-0" : ""}`}
              style={{ backgroundImage: `url('${img1.url}')` }}
            />
          )}
          {img2 && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${img2.url}')` }}
            />
          )}
        </Link>
        {badges.length > 0 && (
          <div className="absolute top-space-sm left-space-sm flex flex-col gap-1 pointer-events-none">
            {badges.map((b, i) => (
              <span
                key={b}
                className={
                  i === 0
                    ? "px-space-xs py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase tracking-wider shadow-sm"
                    : "px-space-xs py-1 rounded bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm"
                }
              >
                {b}
              </span>
            ))}
          </div>
        )}
        <button
          aria-label="Save to Wishlist"
          aria-pressed={isSaved}
          onClick={() => toggleWish(p.handle)}
          className={`wishlist-btn absolute top-space-sm right-space-sm w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center hover:bg-surface-container-lowest hover:text-error transition-all ${isSaved ? "text-error" : "text-on-surface"}`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>
        <div className="absolute bottom-space-sm inset-x-space-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-full py-space-xs rounded bg-surface-container-lowest/90 backdrop-blur-md text-on-surface hover:bg-surface-container-lowest text-label-md font-label-md shadow-sm transition-all text-center"
            onClick={() => onQuickView(product)}
            type="button"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
        <div>
          <Link to="/product/$handle" params={{ handle: p.handle }}>
            <h3 className="font-headline-sm text-[20px] text-on-surface line-clamp-1 hover:text-primary transition-colors">{p.title}</h3>
          </Link>
          {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        <div className="pt-space-xs flex items-center justify-between gap-space-xs">
          <span className="font-title-lg text-title-lg text-primary">{formatMoney(p.priceRange.minVariantPrice)}</span>
          <button
            className="add-cart-btn px-space-md py-space-xs rounded bg-primary-container text-on-primary hover:bg-surface-tint font-label-md text-label-md shadow-sm transition-all flex items-center gap-1 disabled:opacity-60"
            onClick={() => addProductToBag(product)}
            disabled={isLoading || !available}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span>{available ? "Add to Bag" : "Sold Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
