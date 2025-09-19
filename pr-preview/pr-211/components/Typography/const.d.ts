import { CSSProperties } from '@vanilla-extract/css';
export declare const TypographyVariants: readonly ["h1", "h2", "h3", "h4", "h5", "h6", "subtitle-1/normal", "subtitle-1/strong", "subtitle-2/normal", "subtitle-2/strong", "body-1/normal", "body-1/strong", "body-2/normal", "body-2/strong", "caption", "overline", "button"];
export type TypographyVariant = (typeof TypographyVariants)[number];
export declare const typographies: Record<TypographyVariant, CSSProperties>;
