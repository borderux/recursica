import React from "react";
import MuiTimeline, {
  type TimelineProps as MuiTimelineProps,
} from "@mui/lab/Timeline";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Timeline.module.css";
import { TimelineItem, type TimelineItemProps } from "./TimelineItem";

import { type RecursicaTimelineProps } from "@recursica/adapter-common";

/**
 * Properties for the strictly-tokenized Timeline component.
 * Native Mui abstract properties like `color`, `radius`, `bulletSize`, and `lineWidth`
 * have been stripped out to strictly enforce the structural mappings of the Recursica UI Kit.
 */
export type TimelineProps = RecursicaOverStyled<
  Omit<MuiTimelineProps, "color" | "radius" | "bulletSize" | "lineWidth"> &
    RecursicaTimelineProps
>;

interface TimelineComponent
  extends React.ForwardRefExoticComponent<
    TimelineProps & React.RefAttributes<HTMLUListElement>
  > {
  Item: typeof TimelineItem;
}

/**
 * The `Timeline` component displays a list of events in chronological order.
 *
 * **Recursica Abstract:**
 * This component acts as a structural wrapper around Mui's `<Timeline>`, composing
 * `TimelineSeparator`/`TimelineDot`/`TimelineConnector`/`TimelineContent` per item
 * (via `Timeline.Item`) so the bullet marker and connecting line render the same way
 * they do in the Mantine adapter.
 *
 * @example
 * ```tsx
 * <Timeline active={1}>
 *   <Timeline.Item title="Event 1" timestamp="Yesterday">Description</Timeline.Item>
 * </Timeline>
 * ```
 */
const TimelineInner = React.forwardRef<HTMLUListElement, TimelineProps>(
  function Timeline(
    { overStyled = false, active = -1, children, ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    const items = React.Children.toArray(children);
    const decoratedItems = items.map((item, index) =>
      React.isValidElement(item)
        ? React.cloneElement(item as React.ReactElement<TimelineItemProps>, {
            __active: active >= index,
            __isLast: index === items.length - 1,
          })
        : item,
    );

    return (
      <MuiTimeline
        ref={ref}
        {...(sanitizedProps as unknown as Omit<
          MuiTimelineProps,
          "color" | "radius" | "bulletSize" | "lineWidth"
        >)}
        classes={{ root: styles.root }}
      >
        {decoratedItems}
      </MuiTimeline>
    );
  },
);

TimelineInner.displayName = "Timeline";

export const Timeline = TimelineInner as TimelineComponent;
Timeline.Item = TimelineItem;
