import { forwardRef } from "react";
import {
  Tabs as MuiTabs,
  type TabsProps as MuiTabsProps,
  type ListProps as MuiTabsListProps,
  type TabsProps as MuiTabsTabProps,
  type any as MuiTabsPanelProps,
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

const _Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
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
      variant={variant}
      orientation={orientation}
      className={`${styles.root} ${className || ""}`}
      data-variant={variant}
      data-orientation={orientation}
      classes={{
        list: styles.list,
        tab: styles.tab,
        panel: styles.panel,
      }}
      {...(sanitizedProps as MuiTabsProps)}
    />
  );
});

_Tabs.displayName = "Tabs";

export type TabsListProps = RecursicaOverStyled<MuiTabsListProps>;

const _TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(props, ref) {
    const { overStyled = false, ...rest } = props;
    return (
      <div
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MuiTabsListProps)}
      />
    );
  },
);
_TabsList.displayName = "Tabs.List";

export type TabsTabProps = RecursicaOverStyled<MuiTabsTabProps>;

const _TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  function TabsTab(props, ref) {
    const { overStyled = false, ...rest } = props;
    return (
      <div
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MuiTabsTabProps)}
      />
    );
  },
);
_TabsTab.displayName = "Tabs.Tab";

export type TabsPanelProps = RecursicaOverStyled<MuiTabsPanelProps>;

const _TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel(props, ref) {
    const { overStyled = false, ...rest } = props;
    return (
      <div
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MuiTabsPanelProps)}
      />
    );
  },
);
_TabsPanel.displayName = "Tabs.Panel";

export const Tabs: typeof _Tabs & {
  List: typeof _TabsList;
  Tab: typeof _TabsTab;
  Panel: typeof _TabsPanel;
} = Object.assign(_Tabs, {
  List: _TabsList,
  Tab: _TabsTab,
  Panel: _TabsPanel,
});
