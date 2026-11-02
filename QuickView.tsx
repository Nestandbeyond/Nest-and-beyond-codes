import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { addProductToBag } from "./ProductCard";

export function QuickView({ product, onClose }: { product: ShopifyProduct | null; onClose: () => void }) {
  const [shown, setShown] = useState<ShopifyProduct | null>(product);
  const isLoading = useCartStore((s) => s.isLoading);
  useEffect(() => {
    if (product) setShown(product);
  }, [product]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!product;
  const p = shown?.node;
  const img = p?.images.edges[0]?.node;
  const variant = p?.variants.edges[0]?.node;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl p-space-lg overflow-hidden transform transition-transform duration-300 max-h-[90vh] overflow-y-auto ${open ? "scale-100" : "scale-95"}`}
      >
        <button
          className="absolute top-space-md right-space-md w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors z-10"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        {p && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md items-center">
            <div className="aspect-square rounded-xl bg-surface-container overflow-hidden">
              {img && <div className="w-full h-full bg-cover bg-center" role="img" aria-label={img.altText ?? p.title} style={{ backgroundImage: `url('${img.url}')` }} />}
            </div>
            <div className="space-y-space-sm">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{p.productType || "Atelier Artifact"}</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{p.title}</h3>
              <p className="font-title-lg text-title-lg text-primary">{formatMoney(p.priceRange.minVariantPrice)}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-5">{p.description}</p>
              <div className="pt-space-xs space-y-space-xs">
                <button
                  className="w-full py-space-xs rounded bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-surface-tint shadow-md transition-all flex items-center justify-center gap-space-xs disabled:opacity-60"
                  onClick={async () => {
                    await addProductToBag(shown!);
                    onClose();
                  }}
                  disabled={isLoading || !variant?.availableForSale}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>{variant?.availableForSale ? "Add to Sanctuary Bag" : "Sold Out"}</span>
                </button>
                <Link
                  to="/product/$handle"
                  params={{ handle: p.handle }}
                  onClick={onClose}
                  className="block text-center font-label-md text-label-md text-primary hover:text-surface-tint underline-offset-4 hover:underline"
                >
                  View full details
                </Link>
                <p className="font-label-md text-label-md text-center text-on-surface-variant/80">
                  Complimentary White-Glove Shipping • 30-Day In-Home Trial
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
