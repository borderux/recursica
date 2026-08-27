import React from "react";
import { describe, it, expect } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { ThemeProvider, createTheme, Button as MuiButton } from "@mui/material";
import { Button as RecursicaButton } from "./Button";

function mount(node: React.ReactElement): {
  container: HTMLElement;
  root: Root;
} {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  flushSync(() => root.render(node));
  return { container, root };
}

function unmount({ container, root }: { container: HTMLElement; root: Root }) {
  root.unmount();
  container.remove();
}

const theme = createTheme({ colorSchemes: { light: true, dark: true } });

function withProvider(node: React.ReactElement) {
  return <ThemeProvider theme={theme}>{node}</ThemeProvider>;
}

/**
 * Guards against Recursica's Button CSS bleeding onto (or being bled onto by) a plain,
 * unwrapped MUI Button rendered in the same document. The two must be visibly different
 * (Recursica's own classes/data-attributes), but the plain kit button must render identically
 * whether or not a Recursica Button exists alongside it.
 */
describe("Button style isolation from the underlying MUI kit", () => {
  it("adds Recursica-only classes/attributes without leaking them onto a plain MUI Button", () => {
    const recursica = mount(
      withProvider(<RecursicaButton>Recursica</RecursicaButton>),
    );
    const kit = mount(withProvider(<MuiButton>Plain</MuiButton>));

    try {
      const recursicaButton = recursica.container.querySelector("button")!;
      const kitButton = kit.container.querySelector("button")!;

      const recursicaClasses = Array.from(recursicaButton.classList);
      const kitClasses = new Set(kitButton.classList);
      const recursicaOnlyClasses = recursicaClasses.filter(
        (cls) => !kitClasses.has(cls),
      );

      // Recursica's Button.module.css classes must exist...
      expect(recursicaOnlyClasses.length).toBeGreaterThan(0);
      // ...and none of them are present on the plain kit button.
      for (const cls of recursicaOnlyClasses) {
        expect(kitButton.classList.contains(cls)).toBe(false);
      }

      // Recursica-only markers confirm the two are meaningfully different components.
      expect(recursicaButton.getAttribute("data-variant")).toBe("solid");
      expect(kitButton.getAttribute("data-variant")).toBeNull();
    } finally {
      unmount(recursica);
      unmount(kit);
    }
  });

  it("renders a plain MUI Button identically whether or not Recursica's Button is mounted alongside it", () => {
    const recursica = mount(
      withProvider(<RecursicaButton>Recursica</RecursicaButton>),
    );
    const kitAlongsideRecursica = mount(
      withProvider(<MuiButton>Plain</MuiButton>),
    );
    const kitIsolated = mount(withProvider(<MuiButton>Plain</MuiButton>));

    try {
      const kitButton =
        kitAlongsideRecursica.container.querySelector("button")!;
      const isolatedButton = kitIsolated.container.querySelector("button")!;

      expect(Array.from(kitButton.classList).sort()).toEqual(
        Array.from(isolatedButton.classList).sort(),
      );

      const kitStyle = getComputedStyle(kitButton);
      const isolatedStyle = getComputedStyle(isolatedButton);
      expect(kitStyle.borderRadius).toBe(isolatedStyle.borderRadius);
      expect(kitStyle.backgroundColor).toBe(isolatedStyle.backgroundColor);
      expect(kitStyle.fontFamily).toBe(isolatedStyle.fontFamily);
    } finally {
      unmount(recursica);
      unmount(kitAlongsideRecursica);
      unmount(kitIsolated);
    }
  });
});
