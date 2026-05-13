import React from "react";
import {
  TimelineItem as MantineTimelineItem,
  type TimelineItemProps as MantineTimelineItemProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Timeline.module.css";

export interface RecursicaTimelineItemProps {
  /**
   * Timestamp text displayed below the description.
   */
  timestamp?: React.ReactNode;
  /**
   * The structural styling variant of the bullet container.
   * Maps to the UI Kit structural tokens.
   * @default "default"
   */
  bulletVariant?: "default" | "avatar" | "icon" | "icon-alternative";
}

export type TimelineItemProps = RecursicaOverStyled<
  Omit<MantineTimelineItemProps, "radius" | "color" | "lineVariant"> &
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
      <MantineTimelineItem
        ref={ref}
        classNames={mergedClassNames}
        data-variant={bulletVariant}
        {...(sanitizedProps as unknown as Omit<
          MantineTimelineItemProps,
          "radius" | "color" | "lineVariant"
        >)}
      >
        {content}
      </MantineTimelineItem>
    );
  },
);

TimelineItem.displayName = "TimelineItem";
