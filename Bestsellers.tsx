import { useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { collectionQuery, collectionsQuery, productsQuery } from "@/lib/shopify-queries";
import { ProductGrid } from "./ProductGrid";

const chipOn = "filter-btn px-space-md py-1.5 rounded-full text-label-md font-label-md bg-primary-container text-on-primary transition-all";
const chipOff =
  "filter-btn px-space-md py-1.5 rounded-full text-label-md font-label-md bg-surface-container text-on-surface hover:bg-surface-container-high transition-all";

export function Bestsellers() {
  const { data: all } = useSuspenseQuery(productsQuery(undefined, 8));
  const { data: collections } = useSuspenseQuery(collectionsQuery());
  const [active, setActive] = useState<string>("all");
  const coll = useQuery({ ...collectionQuery(active), enabled: active !== "all" });
  const products = active === "all" ? all : (coll.data?.products ?? []).slice(0, 8);

  return (
    <section className="w-full py-space-xl bg-surface" id="products">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-space-xs">The Atelier Select</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary tracking-tight">Acclaimed Bestsellers</h2>
          </div>
          {collections.some((c) => c.handle !== "frontpage") && (
            <div className="flex flex-wrap items-center gap-space-xs">
              <button className={active === "all" ? chipOn : chipOff} onClick={() => setActive("all")} type="button">
                All Favorites
              </button>
              {collections.filter((c) => c.handle !== "frontpage").slice(0, 4).map((c) => (
                <button key={c.id} className={active === c.handle ? chipOn : chipOff} onClick={() => setActive(c.handle)} type="button">
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>
        {active !== "all" && coll.isLoading ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant py-space-xl text-center">Loading…</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
