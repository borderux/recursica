import React, { useEffect } from "react";
import type { Decorator } from "@storybook/react-vite";

type TypefaceEntry = {
  $extensions?: { "com.google.fonts"?: { url?: string } };
};

export interface RecursicaFontsDecoratorOptions {
  /** The design tokens object (usually imported from recursica_tokens.json) */
  tokens: unknown;
}

export const withRecursicaFonts = ({
  tokens,
}: RecursicaFontsDecoratorOptions): Decorator => {
  const RecursicaFontsDecorator = (Story: React.ElementType) => {
    useEffect(() => {
      const typefaces = (
        tokens as {
          tokens?: { font?: { typefaces?: Record<string, TypefaceEntry> } };
        }
      )?.tokens?.font?.typefaces;

      if (
        !typefaces ||
        typeof typefaces !== "object" ||
        Object.keys(typefaces).length === 0
      ) {
        // eslint-disable-next-line no-console
        console.warn("RecursicaFontLoader: No typefaces listed in tokens.");
        return;
      }

      const urls: string[] = [];

      for (const [name, face] of Object.entries(typefaces)) {
        if (name.startsWith("$")) continue;
        if (!face || typeof face !== "object") continue;
        const url = face.$extensions?.["com.google.fonts"]?.url;
        if (typeof url !== "string" || url === "") {
          throw new Error(
            `Typeface "${name}" is missing a Google Font definition (tokens.font.typefaces.${name}.$extensions["com.google.fonts"].url).`,
          );
        }
        urls.push(url);
      }

      if (urls.length === 0) {
        // eslint-disable-next-line no-console
        console.warn(
          "RecursicaFontLoader: No Google Font URLs found in typefaces.",
        );
        return;
      }

      urls.forEach((url) => {
        if (document.querySelector(`link[href="${url}"]`)) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokens]);

    return <Story />;
  };

  RecursicaFontsDecorator.displayName = "withRecursicaFonts";
  return RecursicaFontsDecorator;
};
