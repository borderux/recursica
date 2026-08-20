import { forwardRef } from "react";
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
  { overStyled = false, className, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const mergedClassNames = mergeClassNames(
    {
      paper: styles.dropdown,
      list: styles.dropdown,
    },
    (sanitizedProps as Record<string, unknown>).classes as
      | Partial<Record<string, string>>
      | undefined,
  );

  return (
    <MuiMenu
      ref={ref}
      {...(sanitizedProps as MuiMenuProps)}
      className={`${styles.dropdown} ${className || ""}`}
      classes={mergedClassNames}
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
