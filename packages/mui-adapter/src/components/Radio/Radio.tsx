import { forwardRef } from "react";
import {
  Radio as MuiRadio,
  type RadioProps as MuiRadioProps,
} from "@mui/material";
import { type ReadOnlyControlProps } from "@recursica/adapter-common";
import { RadioGroup } from "./RadioGroup";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import {
  type RequireAccessibleLabel,
  type RecursicaRadioProps,
} from "@recursica/adapter-common";
import {
  FormControlLayout,
  type FormControlLayoutProps,
} from "../FormControlLayout/FormControlLayout";
import { AssistiveElement } from "../AssistiveElement/AssistiveElement";

import styles from "./Radio.module.css";

const RadioIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    style={style}
  >
    <circle cx="8" cy="8" r="5" />
  </svg>
);

export type RadioWrapperProps = Omit<MuiRadioProps, "size" | "color"> &
  RecursicaRadioProps &
  ReadOnlyControlProps &
  Pick<
    FormControlLayoutProps,
    "formLayout" | "labelSize" | "controlMaxWidth" | "controlMinWidth"
  >;

export type RecursicaRadioPropsAlias =
  RequireAccessibleLabel<RadioWrapperProps>;

export type RadioProps = RecursicaOverStyled<RecursicaRadioPropsAlias>;

type RadioComponent = React.ForwardRefExoticComponent<
  RadioProps & React.RefAttributes<HTMLInputElement>
> & {
  Group: typeof RadioGroup;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
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
    // Props this component intentionally doesn't support — deleted at runtime so they can't leak
    // through even if a caller forces them via plain JavaScript, bypassing the Omit<> above.
    const UNSUPPORTED_PROPS = [
      "size", // Recursica controls sizing via design tokens, not MUI's native small/medium size
      "color", // Colors are token-driven; MUI's native palette isn't exposed
    ] as const satisfies readonly (keyof MuiRadioProps)[];

    const sanitizedProps = omitUnsupportedProps(
      filterStylingProps(rest, overStyled),
      UNSUPPORTED_PROPS,
    );
    const restRecord = sanitizedProps as Record<string, unknown>;

    // NOTE: MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
    // was reading the wrong key and silently doing nothing. Fixed. Also "body"/"inner"/"radio"/
    // "icon"/"labelWrapper"/"label" below were never real MUI `classes` slots (MUI's Radio only
    // recognizes root/checked/disabled/colorPrimary/colorSecondary/sizeSmall, plus "input" from
    // the underlying SwitchBase) — those slot names are Mantine's own Radio classNames API,
    // copy-pasted over verbatim. Since none of them existed as real slots, MUI silently dropped
    // them, so the circle (all its background/border CSS lived under `.radio`) never rendered —
    // only the label showed. Fixed by keeping only the real slots here and drawing the circle as
    // our own combined icon/checkedIcon node instead (see radioNode below), same pattern already
    // used by Checkbox.
    const mergedClassNames = mergeClassNames(
      {
        root: styles.root,
        checked: styles.checked,
        disabled: styles.disabled,
      },
      restRecord.classes as Partial<Record<string, string>> | undefined,
    );

    const classNameProp = restRecord.className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    if (readOnly && !!readOnlyComponent) {
      const isChecked = !!(restRecord.checked ?? restRecord.defaultChecked);
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

    // MUI's icon/checkedIcon fully replace the visual (they're the only child SwitchBase
    // renders alongside the invisible native input) — so the ring + dot both have to live in
    // one combined node per state, same pattern as Checkbox's icon/checkedIcon divs.
    // sanitizedProps spreads FIRST: these render-critical props (icon/checkedIcon/className/
    // classes/disabled/disableRipple/sx) must win over anything of the same name coming through
    // from the caller, or they'd silently clobber the exact rendering this component depends on.
    const radioNode = (
      <MuiRadio
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...(sanitizedProps as unknown as MuiRadioProps)}
        icon={<div className={styles.radio} />}
        checkedIcon={
          <div className={`${styles.radio} ${styles.radioChecked}`}>
            <RadioIcon className={styles.icon} />
          </div>
        }
        className={!label ? `${finalClass} ${styles.inner}` : styles.inner}
        classes={mergedClassNames}
        disabled={readOnly || disabled}
        disableRipple
        sx={label ? { padding: 0 } : undefined}
      />
    );

    const finalNode = label ? (
      <div className={finalClass} style={style as React.CSSProperties}>
        <div className={styles.body}>
          {radioNode}
          <div className={styles.labelWrapper}>
            <label
              className={styles.label}
              htmlFor={restRecord.id as string}
              data-disabled={readOnly || disabled ? true : undefined}
            >
              {label as React.ReactNode}
            </label>
            {/* description/error are mutually exclusive — error takes precedence */}
            {error ? (
              <AssistiveElement
                assistiveVariant="error"
                assistiveWithIcon={false}
              >
                {error}
              </AssistiveElement>
            ) : (
              description && (
                <AssistiveElement
                  assistiveVariant="help"
                  assistiveWithIcon={false}
                >
                  {description}
                </AssistiveElement>
              )
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className={finalClass} style={style as React.CSSProperties}>
        {radioNode}
      </div>
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
) as RadioComponent;

Radio.displayName = "Radio";
Radio.Group = RadioGroup;
