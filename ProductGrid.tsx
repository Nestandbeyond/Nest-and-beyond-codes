import { useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { QuickView } from "./QuickView";

export function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  const [quick, setQuick] = useState<ShopifyProduct | null>(null);
  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-low py-space-xl px-space-md text-center">
        <span className="material-symbols-outlined text-secondary text-[32px]">inventory_2</span>
        <p className="mt-space-sm font-title-lg text-title-lg text-on-surface">No products found</p>
        <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant">New pieces are being curated — please check back soon.</p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-mobile md:gap-gutter">
        {products.map((p) => (
          <ProductCard key={p.node.id} product={p} onQuickView={setQuick} />
        ))}
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
