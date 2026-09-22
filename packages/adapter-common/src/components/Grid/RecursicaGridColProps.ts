import React from "react";

/**
 * Props for the Recursica Grid.Col layout component.
 *
 * TODO(grid-col-contract): `span`, `order`, `visibleFrom`, and `hiddenFrom` are all drafted below,
 * commented out, and NOT part of this contract yet (2026-09-22, Matt — paused to get the Grid
 * work merged rather than resolve every open question first). Come back to this:
 *
 * - `span`/`order`: both mantine-v8 and mui-v7 independently built matching versions of these
 *   with no shared contract driving either — a signal they're genuinely common, worth
 *   formalizing. `span` also resolves a naming mismatch: Mantine calls the column-width prop
 *   `span`, mui-v7 calls it `size` — Matt chose Mantine's naming as the eventual Recursica name.
 * - `visibleFrom`/`hiddenFrom`: same signal (both adapters independently built matching
 *   versions), but their breakpoint values (`xs`/`sm`/`md`/`lg`/`xl` below) are Mantine's own
 *   naming convention, not a Recursica one — Recursica doesn't have its own breakpoint naming yet.
 *   Don't just copy Mantine's keys back in; wait for the real convention. Note `span`/`order`'s
 *   own per-breakpoint map variants below have the same `xs`/`sm`/`md`/`lg`/`xl` gap — resolve
 *   together with `visibleFrom`/`hiddenFrom` when that convention lands.
 * - `offset`: never added — still undiffed between the two adapters.
 */
// export type RecursicaGridColSpan =
//   | number
//   | "auto"
//   | "content"
//   | Partial<
//       Record<"xs" | "sm" | "md" | "lg" | "xl", number | "auto" | "content">
//     >;

export interface RecursicaGridColProps {
  /** Content inside the column */
  children?: React.ReactNode;
  // /** Number of columns this item spans, or a per-breakpoint map */
  // span?: RecursicaGridColSpan;
  // /** Reorders the column at different viewport sizes */
  // order?: number | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", number>>;
  // /** Hides the column below the given breakpoint */
  // visibleFrom?: "xs" | "sm" | "md" | "lg" | "xl";
  // /** Hides the column above the given breakpoint */
  // hiddenFrom?: "xs" | "sm" | "md" | "lg" | "xl";
}
