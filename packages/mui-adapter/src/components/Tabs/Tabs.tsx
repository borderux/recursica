import { forwardRef } from "react";
import {
  Tabs as MuiTabs,
  type TabsProps as MuiTabsProps,
  Tab as MuiTab,
  type TabProps as MuiTabProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Tabs.module.css";

export interface RecursicaTabsProps
  extends Omit<MuiTabsProps, "variant" | "classNames" | "color" | "radius"> {
  variant?: "default" | "outline" | "pills";
}

export type TabsProps = RecursicaOverStyled<RecursicaTabsProps>;

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(props, ref) {
    const {
      variant = "default",
      orientation = "horizontal",
      overStyled = false,
      className,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiTabs
        ref={ref}
        orientation={orientation}
        className={`${styles.root} ${className || ""}`}
        data-variant={variant}
        data-orientation={orientation}
        classes={{
          flexContainer: styles.list,
          indicator: styles.indicator,
        }}
        {...(sanitizedProps as MuiTabsProps)}
      />
    );
  },
);

Tabs.displayName = "Tabs";

export type TabProps = RecursicaOverStyled<MuiTabProps>;

export const Tab = forwardRef<HTMLDivElement, TabProps>(
  function Tab(props, ref) {
    const { overStyled = false, className, ...rest } = props;
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiTab
        ref={ref}
        className={`${styles.tab} ${className || ""}`}
        {...(sanitizedProps as MuiTabProps)}
      />
    );
  },
);

Tab.displayName = "Tab";

import { TabPanel as MuiTabPanel } from "@mui/lab";
import type { TabPanelProps as MuiTabPanelProps } from "@mui/lab";

export type TabPanelProps = RecursicaOverStyled<MuiTabPanelProps>;

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel(props, ref) {
    const { overStyled = false, className, ...rest } = props;
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiTabPanel
        ref={ref}
        className={`${styles.panel} ${className || ""}`}
        {...(sanitizedProps as MuiTabPanelProps)}
      />
    );
  },
);

TabPanel.displayName = "TabPanel";
