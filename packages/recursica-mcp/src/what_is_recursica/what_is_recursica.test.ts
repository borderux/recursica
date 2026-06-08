import { describe, it, expect } from "vitest";
import { what_is_recursica } from "./what_is_recursica.js";

describe("what_is_recursica", () => {
  it("should return general documentation about recursica", async () => {
    const result = await what_is_recursica.handler(
      {},
      { root: "", allAdapters: [] },
    );
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("What is Recursica?");
    expect(result.content[0].text).toContain("React Framework");
    expect(result.content[0].text).toContain("recursica_project_setup");
  });
});
