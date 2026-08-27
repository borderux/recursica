import { describe, it, expect } from "vitest";
import {
  BLOCKED_STYLING_KEYS,
  SPACING_MAP,
  filterStylingProps,
  mapLayoutProps,
} from "./filterStylingProps";

describe("filterStylingProps", () => {
  it("strips every blocked styling key by default", () => {
    const props = Object.fromEntries(
      BLOCKED_STYLING_KEYS.map((key) => [key, "should-be-removed"]),
    );

    const sanitized = filterStylingProps(props);

    for (const key of BLOCKED_STYLING_KEYS) {
      expect(sanitized).not.toHaveProperty(key);
    }
  });

  it("keeps props that aren't blocked styling keys", () => {
    const sanitized = filterStylingProps({
      disabled: true,
      "aria-label": "Submit",
    });

    expect(sanitized).toEqual({ disabled: true, "aria-label": "Submit" });
  });

  it("keeps layout props (e.g. margin) untouched when not a rec- token", () => {
    const sanitized = filterStylingProps({ m: "16px" });

    expect(sanitized).toEqual({ m: "16px" });
  });

  it("maps rec- spacing tokens on layout props to their CSS variable", () => {
    const sanitized = filterStylingProps({ m: "rec-lg", gap: "rec-sm" });

    expect(sanitized).toEqual({
      m: SPACING_MAP["rec-lg"],
      gap: SPACING_MAP["rec-sm"],
    });
  });

  it("does not map rec- tokens on props that aren't layout props", () => {
    const sanitized = filterStylingProps({ "data-testid": "rec-lg" });

    expect(sanitized).toEqual({ "data-testid": "rec-lg" });
  });

  it("leaves an unrecognized rec- value alone", () => {
    const sanitized = filterStylingProps({ m: "rec-not-a-real-token" });

    expect(sanitized).toEqual({ m: "rec-not-a-real-token" });
  });

  it("bypasses all filtering when overStyled is true", () => {
    const props = { className: "custom", bg: "red", m: "rec-lg" };

    expect(filterStylingProps(props, true)).toEqual(props);
  });

  it("does not mutate the input props object", () => {
    const props = { className: "custom", m: "rec-lg" };

    filterStylingProps(props);

    expect(props).toEqual({ className: "custom", m: "rec-lg" });
  });
});

describe("mapLayoutProps", () => {
  it("maps rec- spacing tokens on layout props", () => {
    expect(mapLayoutProps({ mt: "rec-xl" })).toEqual({
      mt: SPACING_MAP["rec-xl"],
    });
  });

  it("leaves non-layout props untouched even if they look like a token", () => {
    expect(mapLayoutProps({ variant: "rec-xl" })).toEqual({
      variant: "rec-xl",
    });
  });
});
