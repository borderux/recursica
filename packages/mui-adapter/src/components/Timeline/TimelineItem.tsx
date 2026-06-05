import React from "react";
import MuiTimelineItem, {
  type TimelineItemProps as MuiTimelineItemProps,
} from "@mui/lab/TimelineItem";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Timeline.module.css";

import { type RecursicaTimelineItemProps } from "@recursica/adapter-common";

export type TimelineItemProps = RecursicaOverStyled<
  Omit<MuiTimelineItemProps, "radius" | "color" | "lineVariant"> &
    RecursicaTimelineItemProps
>;

/**
 * The individual item component for the Timeline.
 *
 * **Recursica Abstract:**
 * The `Timeline.Item` has been extended to support a `timestamp` string natively,
 * rendering it below the body content. It also accepts a `bulletVariant` to morph
 * the structural dimensions of the node circle automatically.
 */
export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  function TimelineItem(
    {
      overStyled = false,
      timestamp,
      bulletVariant = "default",
      children,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    const mergedClassNames: Partial<Record<string, string>> = {
      item: styles.item,
      itemBody: styles.itemBody,
      itemContent: styles.itemContent,
      itemBullet: styles.itemBullet,
      itemTitle: styles.itemTitle,
    };

    const classNamesProp = (sanitizedProps as Record<string, unknown>)
      .classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Record<string, string>;
      Object.keys(o).forEach((key) => {
        if (mergedClassNames[key]) {
          mergedClassNames[key] = `${mergedClassNames[key]} ${o[key]}`;
        } else {
          mergedClassNames[key] = o[key];
        }
      });
    }

    // Embed timestamp inside children if provided, wrapped in a specific class
    const content = timestamp ? (
      <>
        {children && <div className={styles.description}>{children}</div>}
        <div className={styles.timestamp}>{timestamp}</div>
      </>
    ) : (
      children
    );

    return (
      <MuiTimelineItem
        ref={ref}
        classes={mergedClassNames}
        data-variant={bulletVariant}
        {...(sanitizedProps as unknown as Omit<
          MuiTimelineItemProps,
          "radius" | "color" | "lineVariant"
        >)}
      >
        {content}
      </MuiTimelineItem>
    );
  },
);

TimelineItem.displayName = "TimelineItem";
