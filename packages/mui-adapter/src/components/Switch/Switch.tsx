import { forwardRef, useContext } from "react";
import {
  Switch as MuiSwitch,
  type SwitchProps as MuiSwitchProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";

import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RequireAccessibleLabel,
  type RecursicaSwitchProps,
} from "@recursica/adapter-common";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";
import styles from "./Switch.module.css";

import { SwitchGroup, SwitchGroupContext } from "./SwitchGroup";

// Same glyphs as mantine-adapter's Switch (re-exported from @mantine/core's CheckIcon/CloseIcon,
// not importable here since mui-adapter doesn't depend on @mantine/core) — kept pixel-identical
// so adapter-tester's cross-adapter diff stays clean. Same precedent as Checkbox's inline icons.
function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export type SwitchWrapperProps = Omit<
  MuiSwitchProps,
  "size" | "color" | "radius" | "variant"
> &
  RecursicaSwitchProps &
  ReadOnlyControlProps &
  Pick<
    FormControlLayoutProps,
    "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
  >;

export type RecursicaSwitchPropsAlias =
  RequireAccessibleLabel<SwitchWrapperProps>;

export type SwitchProps = RecursicaOverStyled<RecursicaSwitchPropsAlias>;

type SwitchComponent = React.ForwardRefExoticComponent<
  SwitchProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof SwitchGroup;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const {
      overStyled = false,
      readOnly,
      readOnlyComponent,
      disabled,
      formLayout,
      labelSize,
      controlMaxWidth,
      controlMinWidth,
      label,
      description,
      error,
      style,
      ...rest
    } = props;
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    // Actively delete dimension bindings that bypass the abstraction
    delete restRecord["size"];
    delete restRecord["color"];
    delete restRecord["radius"];
    delete restRecord["variant"];

    // NOTE: classes.root must stay keyed "root" (MUI's own slot name), but it targets a
    // dedicated .switchRoot CSS class, not .root — .root is this component's own outer
    // wrapper class (applied separately, see finalClass below) and sizing the actual MUI
    // switch span the same way would squeeze that wrapper down to the track's own width.
    // See SWITCH_IMPLEMENTATION_NOTES.md #5.
    // NOTE: no "thumb" key here — the default MuiSwitch-thumb slot classes.thumb targets is
    // never rendered. We supply our own icon/checkedIcon node below (see thumbNode), which
    // replaces that slot outright (confirmed against MUI's SwitchBase/Switch source: icon and
    // checkedIcon substitute the whole default thumb, they don't add to it), so the .thumb
    // class is applied directly to our own node instead.
    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.switchRoot,
      body: styles.body,
      track: styles.track,
      switchBase: styles.switchBase,
      trackLabel: styles.trackLabel,
      labelWrapper: styles.labelWrapper,
      label: styles.label,
    };

    // NOTE: MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
    // was reading the wrong key and silently doing nothing. Fixed. Also note "body"/
    // "trackLabel"/"labelWrapper"/"label" below aren't real MUI `classes` slots at all (MUI
    // only recognizes root/switchBase/track/thumb/input/checked/disabled/colorX/sizeX/edgeX) —
    // those four are this component's own hardcoded elements, styled directly in the JSX below,
    // not through MUI's classes mechanism. Only root/track/switchBase actually take effect via
    // this override path; the rest are pre-existing dead weight, unrelated to the classNames bug.
    const classesProp = restRecord.classes;
    if (
      classesProp &&
      typeof classesProp === "object" &&
      !Array.isArray(classesProp)
    ) {
      const o = classesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.root
        ? `${styles.switchRoot} ${o.root}`
        : styles.switchRoot;
      mergedClassNames.body = o.body ? `${styles.body} ${o.body}` : styles.body;
      mergedClassNames.track = o.track
        ? `${styles.track} ${o.track}`
        : styles.track;
      mergedClassNames.trackLabel = o.trackLabel
        ? `${styles.trackLabel} ${o.trackLabel}`
        : styles.trackLabel;
      mergedClassNames.labelWrapper = o.labelWrapper
        ? `${styles.labelWrapper} ${o.labelWrapper}`
        : styles.labelWrapper;
      mergedClassNames.label = o.label
        ? `${styles.label} ${o.label}`
        : styles.label;
    }

    const classNameProp = restRecord.className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    // Threads a grouped Switch's checked state through SwitchGroupContext (mirrors Checkbox's
    // identical CheckboxGroupContext pattern) — FormGroup itself has no controlled-value
    // concept, so this is the only place group membership is actually computed. Standalone
    // (ungrouped) Switch usage is untouched: isChecked/isGroupReadOnly are no-ops outside a
    // <Switch.Group>. See SWITCH_IMPLEMENTATION_NOTES.md.
    const groupContext = useContext(SwitchGroupContext);
    const isGrouped = groupContext !== null;
    const isGroupReadOnly = isGrouped ? !!groupContext.readOnly : false;
    const isChecked = isGrouped
      ? (groupContext.value || []).includes(restRecord.value as string)
      : !!(restRecord.checked ?? restRecord.defaultChecked);

    const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isGrouped) return;
      const currentValue = groupContext.value || [];
      const thisValue = restRecord.value as string;
      const newValue = event.target.checked
        ? [...currentValue, thisValue]
        : currentValue.filter((v) => v !== thisValue);
      groupContext.onChange?.(event, newValue);
    };

    if (readOnly && !!readOnlyComponent) {
      const ReadOnlyComp = readOnlyComponent;
      const roNode = (
        <ReadOnlyComp
          {...props}
          checked={isChecked}
          label={restRecord.label as React.ReactNode}
        />
      );

      if (formLayout) {
        return (
          <FormControlLayout
            formLayout={formLayout}
            labelSize={labelSize}
            controlMaxWidth={controlMaxWidth}
            controlMinWidth={controlMinWidth}
          >
            {roNode}
          </FormControlLayout>
        );
      }

      return <>{roNode}</>;
    }

    // Same node passed as both icon and checkedIcon (mirrors MUI's own Switch.js, which does
    // the same: `icon={icon} checkedIcon={icon}`) so it never unmounts/remounts on toggle —
    // that's what lets the checkIcon/closeIcon crossfade via CSS opacity instead of a hard swap,
    // matching mantine-adapter's thumbIcon (single node, both glyphs always mounted).
    const thumbNode = (
      <span className={styles.thumb}>
        <span className={styles.thumbIconWrapper}>
          <CheckIcon className={styles.checkIcon} />
          <CloseIcon className={styles.closeIcon} />
        </span>
      </span>
    );

    // We omit Mui's sizing/coloring so we rely strictly on variables from Switch.module.css.
    // color is hardcoded to "default" (never left to MUI's "primary" fallback) so MUI's own
    // palette-driven blue checked/hover/focus styling never activates in the first place —
    // see SWITCH_IMPLEMENTATION_NOTES.md #5.
    const isSwitchDisabled = readOnly || disabled || isGroupReadOnly;

    const switchNode = (
      <MuiSwitch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={!label ? `${finalClass} ${styles.inner}` : styles.inner}
        classes={mergedClassNames}
        color="default"
        disabled={isSwitchDisabled}
        data-disabled={isSwitchDisabled || undefined}
        icon={thumbNode}
        checkedIcon={thumbNode}
        {...(sanitizedProps as unknown as MuiSwitchProps)}
        {...(isGrouped
          ? { checked: isChecked, onChange: handleGroupChange }
          : {})}
      />
    );

    const finalNode = label ? (
      <div className={finalClass} style={style as React.CSSProperties}>
        <div className={styles.body}>
          {switchNode}
          <div className={styles.labelWrapper}>
            <label
              className={styles.label}
              htmlFor={restRecord.id as string}
              data-disabled={readOnly || disabled ? true : undefined}
            >
              {label as React.ReactNode}
            </label>
            {description && (
              <div
                className={styles.description}
                data-disabled={readOnly || disabled ? true : undefined}
              >
                {description}
              </div>
            )}
            {error && (
              <div
                className={styles.error}
                data-disabled={readOnly || disabled ? true : undefined}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      switchNode
    );

    if (formLayout) {
      return (
        <FormControlLayout
          formLayout={formLayout}
          labelSize={labelSize}
          controlMaxWidth={controlMaxWidth}
          controlMinWidth={controlMinWidth}
        >
          {finalNode}
        </FormControlLayout>
      );
    }

    return finalNode;
  },
) as SwitchComponent;

Switch.displayName = "Switch";
Switch.Group = SwitchGroup;
