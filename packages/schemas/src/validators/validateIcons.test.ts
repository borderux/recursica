import { describe, it, expect } from "vitest";
import { validateIcons } from "./validateIcons.js";

describe("validateIcons", () => {
  it("should validate a correct icons object", () => {
    const validData = {
      icon1: "path/to/icon1.svg",
      icon2: "path/to/icon2.svg",
      icon3: "path/to/icon3.svg",
    };

    const result = validateIcons(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should validate an empty icons object", () => {
    const validData = {};

    const result = validateIcons(validData);
    expect(result.isValid).toBe(true);
  });

  it("should reject non-string values", () => {
    const invalidData = {
      icon1: "path/to/icon1.svg",
      icon2: 123, // Should be string
      icon3: true, // Should be string
      icon4: null, // Should be string
    };

    const result = validateIcons(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("icon2: must be string");
    expect(result.errors).toContain("icon3: must be string");
    expect(result.errors).toContain("icon4: must be string");
  });

  it("should validate icons with various path formats", () => {
    const validData = {
      icon1: "path/to/icon1.svg",
      icon2: "/absolute/path/to/icon2.svg",
      icon3: "./relative/path/to/icon3.svg",
      icon4: "https://example.com/icon4.svg",
      icon5: "icon5.svg",
    };

    const result = validateIcons(validData);
    expect(result.isValid).toBe(true);
  });

  it("should validate icons with special characters in names", () => {
    const validData = {
      "icon-1": "path/to/icon1.svg",
      icon_2: "path/to/icon2.svg",
      "icon.3": "path/to/icon3.svg",
      "icon 4": "path/to/icon4.svg", // Spaces are allowed in property names
    };

    const result = validateIcons(validData);
    expect(result.isValid).toBe(true);
  });
});
