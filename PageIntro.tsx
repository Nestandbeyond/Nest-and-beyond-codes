import type { ReactNode } from "react";

/** Page heading block used on inner pages, styled like the Stitch section headers. */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="w-full bg-surface-container-low pt-28 pb-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-space-xs">{eyebrow}</span>
        <h1 className="font-display-mobile text-display-mobile md:font-display md:text-display text-primary tracking-tight">{title}</h1>
        {children && <div className="mt-space-md max-w-2xl font-body-lg text-body-lg text-on-surface-variant">{children}</div>}
      </div>
    </section>
  );
}
