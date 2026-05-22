import { forwardRef } from "react";
import {
  Menu as MuiMenu,
  type MenuProps as MuiMenuProps,
  type MenuTargetProps as MuiMenuTargetProps,
  type MenuDropdownProps as MuiMenuDropdownProps,
  type MenuItemProps as MuiMenuItemProps,
  type MenuDividerProps as MuiMenuDividerProps,
  type MenuLabelProps as MuiMenuLabelProps,
  type MenuSubProps as MuiMenuSubProps,
  type MenuSubTargetProps as MuiMenuSubTargetProps,
  type MenuSubDropdownProps as MuiMenuSubDropdownProps,
  createPolymorphicComponent,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Menu.module.css";

// ============================================================
// MENU ROOT
// ============================================================

/**
 * Recursica Menu component wrapping Mui's composable Menu.
 *
 * Usage follows the composable dot-notation pattern:
 * ```tsx
 * <Menu>
 *   <Menu.Target><Button>Open</Button></Menu.Target>
 *   <Menu.Dropdown>
 *     <Menu.Label>Section</Menu.Label>
 *     <Menu.Item>Action</Menu.Item>
 *     <Menu.Divider />
 *     <Menu.Item>Another action</Menu.Item>
 *   </Menu.Dropdown>
 * </Menu>
 * ```
 */
export type MenuProps = RecursicaOverStyled<MuiMenuProps>;

const MenuBase = function Menu({ overStyled = false, ...rest }: MenuProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind CSS module classes to Mui's internal classNames API
  const mergedClassNames: Partial<Record<string, string>> = {
    dropdown: styles.dropdown,
    item: styles.item,
    itemLabel: styles.itemLabel,
    itemSection: styles.itemSection,
    divider: styles.divider,
    label: styles.label,
    chevron: styles.chevron,
  };

  const classNamesProp = (sanitizedProps as Record<string, unknown>).classNames;
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
    <MuiMenu
      classes={mergedClassNames}
      {...(sanitizedProps as unknown as MuiMenuProps)}
    />
  );
};
MenuBase.displayName = "Menu";

// ============================================================
// MENU TARGET
// ============================================================

/**
 * Wrapper for the element that triggers the menu.
 * Requires a single child element that supports ref forwarding.
 */
export type MenuTargetProps = MuiMenuTargetProps;

const MenuTarget = function MenuTarget(props: MenuTargetProps) {
  return <MuiMenu.Target {...props} />;
};
MenuTarget.displayName = "MenuTarget";

// ============================================================
// MENU DROPDOWN
// ============================================================

/** The dropdown panel containing menu items, dividers, and labels. */
export type MenuDropdownProps = RecursicaOverStyled<MuiMenuDropdownProps>;

const MenuDropdown = forwardRef<HTMLDivElement, MenuDropdownProps>(
  function MenuDropdown({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MuiMenu.Dropdown
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MuiMenuDropdownProps)}
      />
    );
  },
);
MenuDropdown.displayName = "MenuDropdown";

// ============================================================
// MENU ITEM
// ============================================================

/**
 * An individual actionable item within the menu dropdown.
 *
 * **Note:** Mui's `color` prop is stripped in strict mode to enforce
 * design token adherence. Use `overStyled={true}` if you need to bypass.
 */
export type MenuItemProps = RecursicaOverStyled<
  Omit<MuiMenuItemProps, "color">
>;

const _MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  function MenuItem({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Strip Mui's `color` prop to enforce token-driven styling
    if (!overStyled) {
      delete restRecord["color"];
    }

    const classNameProp = restRecord.className as string | undefined;

    return (
      <MuiMenu.Item
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MuiMenuItemProps)}
      />
    );
  },
);
_MenuItem.displayName = "MenuItem";

/**
 * An individual actionable item within the menu dropdown.
 *
 * Supports polymorphism via the `component` prop for link-style items.
 * @example
 * ```tsx
 * <Menu.Item component="a" href="/settings">Settings</Menu.Item>
 * ```
 */
const MenuItem = createPolymorphicComponent<"button", MenuItemProps>(_MenuItem);

// ============================================================
// MENU DIVIDER
// ============================================================

/** A visual separator between groups of menu items. */
export type MenuDividerProps = RecursicaOverStyled<MuiMenuDividerProps>;

const MenuDivider = forwardRef<HTMLHRElement, MenuDividerProps>(
  function MenuDivider({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MuiMenu.Divider
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MuiMenuDividerProps)}
      />
    );
  },
);
MenuDivider.displayName = "MenuDivider";

// ============================================================
// MENU LABEL
// ============================================================

/** A non-interactive section label used to categorize groups of menu items. */
export type MenuLabelProps = RecursicaOverStyled<MuiMenuLabelProps>;

const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(function MenuLabel(
  { overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MuiMenu.Label
      ref={ref}
      className={classNameProp}
      {...(sanitizedProps as unknown as MuiMenuLabelProps)}
    />
  );
});
MenuLabel.displayName = "MenuLabel";

// ============================================================
// MENU SUB (SUBMENU CONTAINER)
// ============================================================

/** Container for a submenu, wrapping Menu.Sub.Target and Menu.Sub.Dropdown. */
export type MenuSubProps = MuiMenuSubProps;

const MenuSubBase = function MenuSub(props: MenuSubProps) {
  return <MuiMenu.Sub {...props} />;
};
MenuSubBase.displayName = "MenuSub";

// ============================================================
// MENU SUB TARGET
// ============================================================

/** Wrapper for the element that triggers the submenu. */
export type MenuSubTargetProps = MuiMenuSubTargetProps;

const MenuSubTarget = function MenuSubTarget(props: MenuSubTargetProps) {
  return <MuiMenu.Sub.Target {...props} />;
};
MenuSubTarget.displayName = "MenuSubTarget";

// ============================================================
// MENU SUB ITEM (triggers submenu)
// ============================================================

/**
 * A menu item that acts as a submenu trigger.
 * Renders within Menu.Sub.Target and displays a chevron indicator.
 */
export type MenuSubItemProps = RecursicaOverStyled<
  Omit<MuiMenuItemProps, "color">
>;

const _MenuSubItem = forwardRef<HTMLButtonElement, MenuSubItemProps>(
  function MenuSubItem({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    if (!overStyled) {
      delete restRecord["color"];
    }

    const classNameProp = restRecord.className as string | undefined;

    return (
      <MuiMenu.Sub.Item
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MuiMenuItemProps)}
      />
    );
  },
);
_MenuSubItem.displayName = "MenuSubItem";

/**
 * A menu item that acts as a submenu trigger.
 *
 * Supports polymorphism via the `component` prop.
 */
const MenuSubItem = createPolymorphicComponent<"button", MenuSubItemProps>(
  _MenuSubItem,
);

// ============================================================
// MENU SUB DROPDOWN
// ============================================================

/** The dropdown panel for a submenu. */
export type MenuSubDropdownProps = RecursicaOverStyled<MuiMenuSubDropdownProps>;

const MenuSubDropdown = forwardRef<HTMLDivElement, MenuSubDropdownProps>(
  function MenuSubDropdown({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MuiMenu.Sub.Dropdown
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MuiMenuSubDropdownProps)}
      />
    );
  },
);
MenuSubDropdown.displayName = "MenuSubDropdown";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type MenuSubComponent = typeof MenuSubBase & {
  Target: typeof MenuSubTarget;
  Item: typeof MenuSubItem;
  Dropdown: typeof MenuSubDropdown;
};

const MenuSub = MenuSubBase as MenuSubComponent;
MenuSub.Target = MenuSubTarget;
MenuSub.Item = MenuSubItem;
MenuSub.Dropdown = MenuSubDropdown;

type MenuComponent = typeof MenuBase & {
  Target: typeof MenuTarget;
  Dropdown: typeof MenuDropdown;
  Item: typeof MenuItem;
  Divider: typeof MenuDivider;
  Label: typeof MenuLabel;
  Sub: MenuSubComponent;
};

export const Menu = MenuBase as MenuComponent;
Menu.Target = MenuTarget;
Menu.Dropdown = MenuDropdown;
Menu.Item = MenuItem;
Menu.Divider = MenuDivider;
Menu.Label = MenuLabel;
Menu.Sub = MenuSub;
