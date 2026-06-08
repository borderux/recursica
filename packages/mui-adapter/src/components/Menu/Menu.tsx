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

  return (
    <MuiMenu
      ref={ref}
      className={`${styles.dropdown} ${className || ""}`}
      classes={{
        paper: styles.dropdown,
        list: styles.dropdown,
      }}
      {...(sanitizedProps as MuiMenuProps)}
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
        className={`${styles.item} ${className || ""}`}
        {...(sanitizedProps as MuiMenuItemProps)}
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
        className={`${styles.divider} ${className || ""}`}
        {...(sanitizedProps as MuiDividerProps)}
      />
    );
  },
);

MenuDivider.displayName = "MenuDivider";
