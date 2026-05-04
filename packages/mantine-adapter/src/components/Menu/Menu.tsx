import { forwardRef } from "react";
import {
  Menu as MantineMenu,
  type MenuProps as MantineMenuProps,
  type MenuTargetProps as MantineMenuTargetProps,
  type MenuDropdownProps as MantineMenuDropdownProps,
  type MenuItemProps as MantineMenuItemProps,
  type MenuDividerProps as MantineMenuDividerProps,
  type MenuLabelProps as MantineMenuLabelProps,
  type MenuSubProps as MantineMenuSubProps,
  type MenuSubTargetProps as MantineMenuSubTargetProps,
  type MenuSubDropdownProps as MantineMenuSubDropdownProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Menu.module.css";

// ============================================================
// MENU ROOT
// ============================================================

/**
 * Recursica Menu component wrapping Mantine's composable Menu.
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
export type MenuProps = RecursicaOverStyled<MantineMenuProps>;

const MenuBase = function Menu({ overStyled = false, ...rest }: MenuProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind CSS module classes to Mantine's internal classNames API
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
    <MantineMenu
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as MantineMenuProps)}
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
export type MenuTargetProps = MantineMenuTargetProps;

const MenuTarget = function MenuTarget(props: MenuTargetProps) {
  return <MantineMenu.Target {...props} />;
};
MenuTarget.displayName = "MenuTarget";

// ============================================================
// MENU DROPDOWN
// ============================================================

/** The dropdown panel containing menu items, dividers, and labels. */
export type MenuDropdownProps = RecursicaOverStyled<MantineMenuDropdownProps>;

const MenuDropdown = forwardRef<HTMLDivElement, MenuDropdownProps>(
  function MenuDropdown({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MantineMenu.Dropdown
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MantineMenuDropdownProps)}
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
 * **Note:** Mantine's `color` prop is stripped in strict mode to enforce
 * design token adherence. Use `overStyled={true}` if you need to bypass.
 */
export type MenuItemProps = RecursicaOverStyled<
  Omit<MantineMenuItemProps, "color">
>;

const _MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  function MenuItem({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Strip Mantine's `color` prop to enforce token-driven styling
    if (!overStyled) {
      delete restRecord["color"];
    }

    const classNameProp = restRecord.className as string | undefined;

    return (
      <MantineMenu.Item
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MantineMenuItemProps)}
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
export type MenuDividerProps = RecursicaOverStyled<MantineMenuDividerProps>;

const MenuDivider = forwardRef<HTMLHRElement, MenuDividerProps>(
  function MenuDivider({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MantineMenu.Divider
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MantineMenuDividerProps)}
      />
    );
  },
);
MenuDivider.displayName = "MenuDivider";

// ============================================================
// MENU LABEL
// ============================================================

/** A non-interactive section label used to categorize groups of menu items. */
export type MenuLabelProps = RecursicaOverStyled<MantineMenuLabelProps>;

const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(function MenuLabel(
  { overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantineMenu.Label
      ref={ref}
      className={classNameProp}
      {...(sanitizedProps as unknown as MantineMenuLabelProps)}
    />
  );
});
MenuLabel.displayName = "MenuLabel";

// ============================================================
// MENU SUB (SUBMENU CONTAINER)
// ============================================================

/** Container for a submenu, wrapping Menu.Sub.Target and Menu.Sub.Dropdown. */
export type MenuSubProps = MantineMenuSubProps;

const MenuSubBase = function MenuSub(props: MenuSubProps) {
  return <MantineMenu.Sub {...props} />;
};
MenuSubBase.displayName = "MenuSub";

// ============================================================
// MENU SUB TARGET
// ============================================================

/** Wrapper for the element that triggers the submenu. */
export type MenuSubTargetProps = MantineMenuSubTargetProps;

const MenuSubTarget = function MenuSubTarget(props: MenuSubTargetProps) {
  return <MantineMenu.Sub.Target {...props} />;
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
  Omit<MantineMenuItemProps, "color">
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
      <MantineMenu.Sub.Item
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MantineMenuItemProps)}
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
export type MenuSubDropdownProps =
  RecursicaOverStyled<MantineMenuSubDropdownProps>;

const MenuSubDropdown = forwardRef<HTMLDivElement, MenuSubDropdownProps>(
  function MenuSubDropdown({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MantineMenu.Sub.Dropdown
        ref={ref}
        className={classNameProp}
        {...(sanitizedProps as unknown as MantineMenuSubDropdownProps)}
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
