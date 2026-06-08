import React from "react";
import {
  Timeline as MantineTimeline,
  type TimelineProps as MantineTimelineProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Timeline.module.css";
import { TimelineItem } from "./TimelineItem";

import { type RecursicaTimelineProps } from "@recursica/adapter-common";

/**
 * Properties for the strictly-tokenized Timeline component.
 * Native Mantine abstract properties like `color`, `radius`, `bulletSize`, and `lineWidth`
 * have been stripped out to strictly enforce the structural mappings of the Recursica UI Kit.
 */
export type TimelineProps = RecursicaOverStyled<
  Omit<MantineTimelineProps, "color" | "radius" | "bulletSize" | "lineWidth"> &
    RecursicaTimelineProps
>;

interface TimelineComponent
  extends React.ForwardRefExoticComponent<
    TimelineProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: typeof TimelineItem;
}

/**
 * The `Timeline` component displays a list of events in chronological order.
 *
 * **Recursica Abstract:**
 * This component acts as a structural wrapper around Mantine's `<Timeline>`.
 * It forces alignment and geometry strictly via the UI Kit's `.itemBullet` and connector definitions.
 *
 * @example
 * ```tsx
 * <Timeline active={1}>
 *   <Timeline.Item title="Event 1" timestamp="Yesterday">Description</Timeline.Item>
 * </Timeline>
 * ```
 */
const TimelineInner = React.forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
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

    return (
      <MantineTimeline
        ref={ref}
        classNames={mergedClassNames}
        {...(sanitizedProps as unknown as Omit<
          MantineTimelineProps,
          "color" | "radius" | "bulletSize" | "lineWidth"
        >)}
      />
    );
  },
);

TimelineInner.displayName = "Timeline";

export const Timeline = TimelineInner as TimelineComponent;
Timeline.Item = TimelineItem;
