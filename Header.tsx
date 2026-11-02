import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/shopify";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCjtE1DH7qw95h6Cz3oJ9bTOiwR5pNFZ1m8d8hBf2cyrCo_V1mzeiEYfm89Rmh8ZlHWw1idG5nIXZ1V5T95Aqe1IIn0BcJ9uf7xBSgfyMKvl8BHa4KuLtRrCWxJtF58v-j0bztYxPIoEFq2TQCQZHL-xbetCWWg-x0MyERE8Jff12K7AzNU-a3R4oQ3RcaID4NT4o4H4JXTjp-mdL3v13qBzLQr8QwbhLTlXBV8hGORFWKuHCFDwoieBA";
const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwl_pBNNXg1pWBkmCdovj737crPgViGUAY8W_KOWppQQOffdGTsCEFgHwHNT4r1JlJMy0bNGiA83vA_KPuAXYNv3TcFisAJ3oVbNcC-SA8rbQBfuXHW9K4mtm8KXa5QI47Oi0iT8JURePeDmz2nCwYoubMn6tLyQvNapRySP6tzb6VHwTM332DgTEwNl2YQ1PDjk52qEOuG3mz1gBoHtcC4r2v8eboVwNOqA-wZyVI";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/contact", label: "Contact" },
] as const;

const inactive = "font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors py-1";
const active = "font-label-lg text-label-lg transition-colors py-1 text-primary font-semibold border-b-2 border-primary";

export function Header() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const wishCount = useWishlistStore((s) => s.handles.length);
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const count = hydrated ? items.reduce((s, i) => s + i.quantity, 0) : 0;
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "USD";

  useEffect(() => {
    if (bagOpen) syncCart();
  }, [bagOpen, syncCart]);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setBagOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="w-full bg-primary-container text-on-primary py-space-xs text-center font-label-caps text-label-caps tracking-widest flex items-center justify-center gap-space-sm px-space-md">
        <span className="opacity-90">Complimentary white-glove delivery on orders over $250</span>
        <span className="opacity-40 hidden sm:inline">|</span>
        <span className="opacity-90 hidden sm:inline">Carbon-Neutral Sanctuary Living</span>
      </div>
      <div className="w-full bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-secondary/20">
        <div className="h-20 max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-shrink-0">
            <button
              aria-label="Open menu"
              className="lg:hidden p-space-xs text-on-surface-variant hover:text-on-surface"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-[24px]">{menuOpen ? "close" : "menu"}</span>
            </button>
            <Link className="flex items-center" to="/">
              <img alt="Nest & Beyond" className="h-16 w-auto object-contain" src={LOGO} />
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-space-lg">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={inactive}
                activeProps={{ className: active, "aria-current": "page" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-space-sm sm:gap-space-md flex-shrink-0">
            <button
              aria-label="Search Catalog"
              className="p-space-xs text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
            <Link
              aria-label="Wishlist"
              className="relative p-space-xs text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              to="/wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {hydrated && wishCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-on-secondary font-label-caps text-[9px] flex items-center justify-center rounded-full leading-none">
                  {wishCount}
                </span>
              )}
            </Link>
            <div
              className="relative group"
              onMouseLeave={() => setBagOpen(false)}
            >
              <button
                aria-label="Shopping Cart"
                className="relative p-space-xs text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                type="button"
                onClick={() => setBagOpen((v) => !v)}
                onMouseEnter={() => setBagOpen(true)}
              >
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                {count > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary-container text-on-primary font-label-caps text-[9px] flex items-center justify-center rounded-full leading-none">
                    {count}
                  </span>
                )}
              </button>
              <div
                className={`absolute right-0 top-full pt-space-xs transition-all duration-200 z-50 ${
                  bagOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="w-[calc(100vw-2.5rem)] max-w-80 sm:w-80 bg-surface-container-lowest p-space-md rounded-xl shadow-[0_12px_32px_-4px_rgba(15,77,44,0.08),0_4px_12px_-2px_rgba(44,44,44,0.04)] border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                    <span className="font-title-md text-title-md text-on-surface">Your Sanctuary Bag</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="py-space-md space-y-space-sm max-h-72 overflow-y-auto">
                    {(!hydrated || items.length === 0) && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-center py-space-sm">
                        Your bag is empty.
                      </p>
                    )}
                    {hydrated &&
                      items.map((item) => {
                        const img = item.product.node.images.edges[0]?.node;
                        return (
                          <div key={item.variantId} className="flex items-center gap-space-sm">
                            <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden">
                              {img && <img src={img.url} alt={img.altText ?? item.product.node.title} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-title-md text-body-sm text-on-surface truncate">{item.product.node.title}</p>
                              <p className="font-body-sm text-label-md text-on-surface-variant truncate">
                                {item.variantTitle !== "Default Title" ? `${item.variantTitle} • ` : ""}
                                {formatMoney({ amount: String(parseFloat(item.price.amount) * item.quantity), currencyCode: item.price.currencyCode })}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                disabled={isLoading}
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[14px]">remove</span>
                              </button>
                              <span className="w-5 text-center font-label-md text-label-md">{item.quantity}</span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                disabled={isLoading}
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[14px]">add</span>
                              </button>
                              <button
                                type="button"
                                aria-label="Remove item"
                                disabled={isLoading}
                                onClick={() => removeItem(item.variantId)}
                                className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-error disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="pt-space-sm border-t border-outline-variant/20 flex items-center justify-between mb-space-sm">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Subtotal</span>
                    <span className="font-title-md text-title-md text-primary">
                      {formatMoney({ amount: String(hydrated ? subtotal : 0), currencyCode: currency })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={checkout}
                    disabled={!hydrated || items.length === 0 || isLoading || isSyncing}
                    className="block w-full py-space-xs text-center bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-tint transition-colors disabled:opacity-60"
                  >
                    {isLoading || isSyncing ? "Updating…" : "View Bag & Checkout"}
                  </button>
                </div>
              </div>
            </div>
            <span className="hidden sm:flex items-center pl-space-xs">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-secondary/30 hover:ring-secondary transition-all"
                src={AVATAR}
              />
            </span>
          </div>
        </div>
        {searchOpen && (
          <form
            className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pb-space-sm flex gap-space-xs"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchOpen(false);
              navigate({ to: "/shop", search: { q: q.trim() || undefined } });
            }}
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the atelier…"
              className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm px-space-md py-space-xs rounded-lg focus:outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary-container text-on-primary font-label-lg text-label-lg px-space-md py-space-xs rounded-lg hover:bg-surface-tint transition-colors">
              Search
            </button>
          </form>
        )}
        {menuOpen && (
          <nav className="lg:hidden border-t border-outline-variant/20 px-margin-mobile md:px-margin-tablet py-space-sm flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface py-space-xs"
                activeProps={{ className: "font-label-lg text-label-lg text-primary font-semibold py-space-xs" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
