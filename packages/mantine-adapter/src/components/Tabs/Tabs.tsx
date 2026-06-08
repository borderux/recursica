import { forwardRef } from "react";
import {
  Tabs as MantineTabs,
  type TabsProps as MantineTabsProps,
  type TabsListProps as MantineTabsListProps,
  type TabsTabProps as MantineTabsTabProps,
  type TabsPanelProps as MantineTabsPanelProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Tabs.module.css";

import { type RecursicaTabsProps } from "@recursica/adapter-common";

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
    <MantineTabs
      ref={ref}
      variant={variant}
      orientation={orientation}
      className={`${styles.root} ${className || ""}`}
      data-variant={variant}
      data-orientation={orientation}
      classNames={{
        list: styles.list,
        tab: styles.tab,
        panel: styles.panel,
      }}
      {...(sanitizedProps as MantineTabsProps)}
    />
  );
});

_Tabs.displayName = "Tabs";

export type TabsListProps = RecursicaOverStyled<MantineTabsListProps>;

const _TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(props, ref) {
    const { overStyled = false, ...rest } = props;
    return (
      <MantineTabs.List
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MantineTabsListProps)}
      />
    );
  },
);
_TabsList.displayName = "Tabs.List";

export type TabsTabProps = RecursicaOverStyled<MantineTabsTabProps>;

const _TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  function TabsTab(props, ref) {
    const { overStyled = false, ...rest } = props;
    return (
      <MantineTabs.Tab
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MantineTabsTabProps)}
      />
    );
  },
);
_TabsTab.displayName = "Tabs.Tab";

export type TabsPanelProps = RecursicaOverStyled<MantineTabsPanelProps>;

const _TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel(props, ref) {
    const { overStyled = false, ...rest } = props;
    return (
      <MantineTabs.Panel
        ref={ref}
        {...(filterStylingProps(rest, overStyled) as MantineTabsPanelProps)}
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
