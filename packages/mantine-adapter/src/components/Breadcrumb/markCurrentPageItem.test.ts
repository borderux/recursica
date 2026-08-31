import { createElement, type ReactElement } from "react";
import { describe, it, expect } from "vitest";
import { markCurrentPageItem } from "@recursica/adapter-common";

type Props = Record<string, unknown>;

describe("markCurrentPageItem", () => {
  it("marks the last item aria-current=page and leaves earlier items untouched", () => {
    const items = markCurrentPageItem([
      createElement("a", { href: "/one" }, "One"),
      createElement("a", { href: "/two" }, "Two"),
      createElement("span", {}, "Three"),
    ]) as ReactElement<Props>[];

    expect(items[0].props.href).toBe("/one");
    expect(items[0].props["aria-current"]).toBeUndefined();
    expect(items[1].props.href).toBe("/two");
    expect(items[1].props["aria-current"]).toBeUndefined();
    expect(items[2].props["aria-current"]).toBe("page");
  });

  it("strips href/onClick and drops tab order on an interactive last item", () => {
    const onClick = () => {};
    const [last] = markCurrentPageItem([
      createElement("a", { href: "/current", onClick }, "Current"),
    ]) as ReactElement<Props>[];

    expect(last.props.href).toBeUndefined();
    expect(last.props.onClick).toBeUndefined();
    expect(last.props.tabIndex).toBe(-1);
    expect(last.props["aria-current"]).toBe("page");
  });

  it("leaves a non-interactive last item's other props untouched", () => {
    const [last] = markCurrentPageItem([
      createElement("span", { className: "current" }, "Current"),
    ]) as ReactElement<Props>[];

    expect(last.props.className).toBe("current");
    expect(last.props.tabIndex).toBeUndefined();
    expect(last.props["aria-current"]).toBe("page");
  });

  it("passes through non-element children (e.g. plain text) unchanged", () => {
    const items = markCurrentPageItem(["First", "Last"]);

    expect(items).toEqual(["First", "Last"]);
  });
});
