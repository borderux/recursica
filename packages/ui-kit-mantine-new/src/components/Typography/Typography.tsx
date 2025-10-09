import { Typography as BaseTypography } from "@mantine/core";
import { TypographyProps as BaseTypographyProps } from "@mantine/core";
import * as styles from "./Typography.css";

export type TypographyProps = BaseTypographyProps;

export const Typography = (props: TypographyProps) => {
  return (
    <BaseTypography
      {...props}
      className={`${styles.root} ${props.className || ""}`}
    />
  );
};
