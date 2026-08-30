import React from "react";
import { describe, it, expect } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Loader } from "./Loader";

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

/**
 * `animate={false}` must deterministically freeze every variant — including
 * the bars'/dots' individually-animated child spans that Mantine renders
 * without our own class names, so they can only be reached by a descendant
 * selector, not the `data-variant`-scoped rules the size/thickness CSS uses.
 */
describe("Loader animate prop", () => {
  it.each(["oval", "bars", "dots"] as const)(
    "freezes every animated element for variant=%s when animate is false, and animates by default",
    (variant) => {
      const animated = mount(
        <MantineProvider defaultColorScheme="light">
          <Loader variant={variant} />
        </MantineProvider>,
      );
      const frozen = mount(
        <MantineProvider defaultColorScheme="light">
          <Loader variant={variant} animate={false} />
        </MantineProvider>,
      );

      try {
        const animatedRoot =
          animated.container.querySelector("[data-variant]")!;
        const frozenRoot = frozen.container.querySelector("[data-variant]")!;

        const animatedTargets = [
          animatedRoot,
          ...Array.from(animatedRoot.querySelectorAll("*")),
        ];
        const frozenTargets = [
          frozenRoot,
          ...Array.from(frozenRoot.querySelectorAll("*")),
        ];

        // At least one element (or the root's own ::after, for oval) actually
        // animates by default — otherwise this test would trivially pass.
        const hasAnimation = (el: Element, pseudo?: string) =>
          getComputedStyle(el, pseudo).animationName !== "none";
        const animatedHasMotion =
          animatedTargets.some((el) => hasAnimation(el)) ||
          hasAnimation(animatedRoot, "::after");
        expect(animatedHasMotion).toBe(true);

        // Frozen: nothing animates, root included, pseudo-element included.
        for (const el of frozenTargets) {
          expect(getComputedStyle(el).animationName).toBe("none");
        }
        expect(getComputedStyle(frozenRoot, "::after").animationName).toBe(
          "none",
        );
      } finally {
        unmount(animated);
        unmount(frozen);
      }
    },
  );
});
