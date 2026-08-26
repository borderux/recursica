import { forwardRef, type CSSProperties } from "react";
import {
  Menu as MuiMenu,
  type MenuProps as MuiMenuProps,
  MenuItem as MuiMenuItem,
  type MenuItemProps as MuiMenuItemProps,
  Divider as MuiDivider,
  type DividerProps as MuiDividerProps,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Menu.module.css";

import { type RecursicaMenuProps } from "@recursica/adapter-common";

export type MenuProps = RecursicaOverStyled<MuiMenuProps & RecursicaMenuProps>;

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { overStyled = false, className, maxHeight, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames = mergeClassNames(
    {
      paper: styles.dropdown,
      list: styles.dropdown,
    },
    restRecord.classes as Partial<Record<string, string>> | undefined,
  );

  // `maxHeight` is a caller-supplied override of the token-driven dropdown max-height, applied
  // to the Paper slot's inline style — an explicit per-instance escape hatch, not a design token.
  const callerSlotProps = restRecord.slotProps as
    | { paper?: Record<string, unknown> }
    | undefined;
  const mergedSlotProps = maxHeight
    ? {
        ...callerSlotProps,
        paper: {
          ...callerSlotProps?.paper,
          style: {
            ...(callerSlotProps?.paper?.style as CSSProperties | undefined),
            maxHeight,
          },
        },
      }
    : callerSlotProps;

  return (
    <MuiMenu
      ref={ref}
      {...(sanitizedProps as MuiMenuProps)}
      className={className}
      classes={mergedClassNames}
      {...(mergedSlotProps
        ? { slotProps: mergedSlotProps as MuiMenuProps["slotProps"] }
        : {})}
    />
  );
});

Menu.displayName = "Menu";

export type MenuItemProps = RecursicaOverStyled<MuiMenuItemProps>;

export const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  function MenuItem({ overStyled = false, className, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiMenuItem
        ref={ref}
        {...(sanitizedProps as MuiMenuItemProps)}
        className={`${styles.item} ${className || ""}`}
      />
    );
  },
);

MenuItem.displayName = "MenuItem";

export type MenuDividerProps = RecursicaOverStyled<MuiDividerProps>;

export const MenuDivider = forwardRef<HTMLHRElement, MenuDividerProps>(
  function MenuDivider({ overStyled = false, className, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiDivider
        ref={ref}
        {...(sanitizedProps as MuiDividerProps)}
        className={`${styles.divider} ${className || ""}`}
      />
    );
  },
);

MenuDivider.displayName = "MenuDivider";
