import { type TextareaProps, Flex, Textarea } from "@mantine/core";
import { styles, errorContainer, labelContainer } from "./Textfield.css";
import { Icon, type IconName } from "../Icons/Icon";
import { Typography } from "../Typography";
import {
  type ChangeEvent,
  type ChangeEventHandler,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

export type TextfieldProps = Pick<
  TextareaProps,
  "disabled" | "error" | "defaultValue" | "value" | "readOnly"
> & {
  /**
   * The label of the textfield.
   */
  label: string;
  /**
   * The placeholder of the textfield.
   */
  placeholder?: string;
  /**
   * The icon to display before the input.
   */
  leadingIcon?: IconName;
  /**
   * The icon to display after the input.
   */
  trailingIcon?: IconName;
  /**
   * Whether the label is optional. @default true
   */
  showLabel?: boolean;
  /**
   * Whether the input is optional.
   */
  isOptional?: boolean;
  /**
   * The help text to display below the input.
   */
  helpText?: React.ReactNode;
  /**
   * Whether the input should wrap.
   */
  wrap?: boolean;
  /**
   * Whether the input should be stacked. @default true
   */
  stacked?: boolean;
  /**
   * Whether the input should grow. @default false
   */
  grow?: boolean;
  /**
   * The function to call when the input value changes.
   */
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
};

export const Textfield = forwardRef<HTMLTextAreaElement, TextfieldProps>(
  (
    {
      label,
      error,
      leadingIcon,
      trailingIcon,
      showLabel = true,
      placeholder,
      isOptional,
      value,
      readOnly,
      defaultValue,
      helpText,
      wrap = false,
      stacked = true,
      onChange,
      grow = false,
      ...props
    },
    ref,
  ) => {
    const isControlled = useRef(value !== undefined);
    const [valued, setValued] = useState(!!(value ?? defaultValue));
    const [inputValue, setInputValue] = useState(value ?? defaultValue);

    useEffect(() => {
      if (isControlled.current) {
        setInputValue(value);
      }
    }, [value, isControlled]);

    const updateValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!readOnly) {
        if (!isControlled.current) {
          setInputValue(event.target.value);
        }
        onChange?.(event);
      }
    };

    const handleOnInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValued(!!event.target.value);
    };

    return (
      <Textarea
        ref={ref}
        value={inputValue}
        onChange={updateValue}
        data-wrap={wrap}
        component={wrap ? "textarea" : "input"}
        autosize={wrap ? false : true}
        styles={{
          input: { fieldSizing: grow ? "content" : "fit" },
        }}
        wrapperProps={{
          "data-stacked": stacked,
        }}
        minRows={1}
        classNames={styles}
        onInput={handleOnInput}
        description={helpText}
        aria-label={label}
        readOnly={readOnly}
        inputWrapperOrder={["label", "input", "description", "error"]}
        label={
          showLabel &&
          (isOptional ? (
            <Flex className={labelContainer}>
              <Typography variant="body-2/normal">{label}</Typography>
              <Typography
                variant="caption"
                color="form/label/color/default-color"
              >
                (optional)
              </Typography>
            </Flex>
          ) : (
            <Typography variant="body-2/normal">{label}</Typography>
          ))
        }
        data-valued={valued}
        placeholder={placeholder}
        error={
          error ? (
            <Flex className={errorContainer}>
              <Icon name="error_Filled" size={16} />
              <Typography variant="caption">{error}</Typography>
            </Flex>
          ) : undefined
        }
        leftSectionPointerEvents="none"
        rightSectionPointerEvents="none"
        leftSection={leadingIcon ? <Icon name={leadingIcon} /> : undefined}
        rightSection={trailingIcon ? <Icon name={trailingIcon} /> : undefined}
        {...props}
      ></Textarea>
    );
  },
);
