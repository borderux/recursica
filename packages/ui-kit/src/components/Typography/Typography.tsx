import type { RecursicaColors } from "../../recursica/RecursicaColorsType";
import { recursica } from "../../recursica/Recursica";

import type { TypographyVariant } from "./const";
import { Title } from "@mantine/core";
import { styles } from "./Typography.css";

export interface TypographyProps {
  /**
   * The variant of the typography @default 'body-1/normal'
   */
  variant?: TypographyVariant;
  /**
   * The children of the typography
   */
  children: React.ReactNode;
  /**
   * The color of the typography
   */
  color?: RecursicaColors;
  /**
   * The element to render the typography as
   */
  as?: React.ElementType;
  /**
   * The text decoration of the typography
   */
  textDecoration?: "strikethrough";
  /**
   * The text align of the typography
   */
  textAlign?: "left" | "center" | "right";
  /**
   * The flex of the typography
   */
  flex?: number;
  /**
   * The opacity of the typography
   */
  opacity?: number;
}

export const Typography = ({
  variant = "body-1/normal",
  children,
  color,
  as: asComponent,
  textDecoration,
  textAlign,
  flex,
  opacity,
}: TypographyProps) => {
  const getComponentAsVariantBased = () => {
    switch (variant) {
      case "h1":
      case "h2":
      case "h3":
        return variant;

      default:
        return "p";
    }
  };

  const componentAs = asComponent ?? getComponentAsVariantBased();

  return (
    <Title
      classNames={styles}
      component={componentAs}
      data-text-decoration={textDecoration}
      variant={variant}
      style={{
        "--typography-color": color ? recursica[color] : "currentColor",
        opacity: opacity ?? 1,
        textAlign,
        flex,
      }}
    >
      {children}
    </Title>
  );
};
