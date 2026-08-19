import React from "react";
import MuiTimelineItem, {
  type TimelineItemProps as MuiTimelineItemProps,
} from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Timeline.module.css";

import { type RecursicaTimelineItemProps } from "@recursica/adapter-common";

export type TimelineItemProps = RecursicaOverStyled<
  Omit<MuiTimelineItemProps, "radius" | "color" | "lineVariant" | "title"> &
    RecursicaTimelineItemProps & {
      /** Heading rendered above the item's description/timestamp */
      title?: React.ReactNode;
      /** @internal injected by `Timeline` to mark items up to `active` */
      __active?: boolean;
      /** @internal injected by `Timeline`; suppresses the trailing connector on the last item */
      __isLast?: boolean;
    }
>;

/**
 * The individual item component for the Timeline.
 *
 * **Recursica Abstract:**
 * The `Timeline.Item` has been extended to support a `timestamp` string natively,
 * rendering it below the body content. It also accepts a `bulletVariant` to morph
 * the structural dimensions of the node circle automatically.
 *
 * Internally it composes Mui's `TimelineSeparator`/`TimelineDot`/`TimelineConnector`/
 * `TimelineContent` primitives (Mui has no single "item" abstraction like Mantine's
 * `Timeline.Item` that renders a bullet + connector on its own).
 */
export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  function TimelineItem(
    {
      overStyled = false,
      timestamp,
      bulletVariant = "default",
      bullet,
      title,
      children,
      __active = false,
      __isLast = false,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const { className: userClassName, ...restSanitizedProps } =
      sanitizedProps as Record<string, unknown> & { className?: string };

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
        data-variant={bulletVariant}
        data-active={__active || undefined}
        {...(restSanitizedProps as unknown as Omit<
          MuiTimelineItemProps,
          "radius" | "color" | "lineVariant" | "title"
        >)}
        className={
          userClassName ? `${styles.item} ${userClassName}` : styles.item
        }
      >
        <TimelineSeparator>
          <TimelineDot className={styles.itemBullet}>{bullet}</TimelineDot>
          {!__isLast && <TimelineConnector className={styles.itemConnector} />}
        </TimelineSeparator>
        <TimelineContent className={styles.itemBody}>
          {title && <div className={styles.itemTitle}>{title}</div>}
          <div className={styles.itemContent}>{content}</div>
        </TimelineContent>
      </MuiTimelineItem>
    );
  },
);

TimelineItem.displayName = "TimelineItem";
