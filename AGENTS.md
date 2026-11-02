<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Static page sections live in `src/components/site/StitchSections.tsx`, converted verbatim from the user's Google Stitch export; edit markup there sparingly to keep the original design exact.
- Design tokens (colors, type scale, spacing, radii) mirror the Stitch Tailwind config in `src/styles.css`; use those utilities (e.g. `bg-primary-container`, `px-margin`) instead of new colors.
- All commerce data comes from the Shopify Storefront API (`src/lib/shopify.ts`); never add mock products.
- Cart state is the Zustand store in `src/stores/cartStore.ts`, synced to a real Shopify cart; checkout always uses the cart's `checkoutUrl` opened in a new tab.
- Browser-persisted values (cart, wishlist) render only after hydration (`useHydrated`) to avoid SSR mismatches.
