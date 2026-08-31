import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { IS_DEV } from "../../utils/overStyledControl";

/**
 * Marks the last Breadcrumb child as the current page: adds `aria-current="page"`, and — if the
 * element looks interactive (has `href` or `onClick`) — strips those props and sets `tabIndex={-1}`
 * so it drops out of the tab order.
 *
 * This is best-effort, not a guarantee. `cloneElement` can only override props the element
 * actually reads. A custom Link component (e.g. React Router's) that drives navigation from its
 * own internal handler rather than a passed-through `onClick` will keep navigating regardless.
 * The last crumb should really just be plain text — see BREADCRUMB_IMPLEMENTATION_NOTES.md.
 */
export function markCurrentPageItem(children: ReactNode): ReactNode {
  const items = Children.toArray(children);
  const lastIndex = items.length - 1;

  return items.map((child, index) => {
    if (index !== lastIndex || !isValidElement(child)) {
      return child;
    }

    const elementProps = child.props as Record<string, unknown>;
    const isInteractive =
      elementProps.href !== undefined || elementProps.onClick !== undefined;

    if (IS_DEV && isInteractive) {
      console.warn(
        "[Breadcrumb] The last item represents the current page and should be plain, " +
          "non-interactive text (e.g. a <span>), not a link. Breadcrumb stripped its href/onClick " +
          'and added aria-current="page", but this can\'t stop a custom Link component (e.g. a ' +
          "router Link) that navigates from its own internal handler rather than these props.",
      );
    }

    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      "aria-current": "page",
      ...(isInteractive
        ? { href: undefined, onClick: undefined, tabIndex: -1 }
        : {}),
    });
  });
}
