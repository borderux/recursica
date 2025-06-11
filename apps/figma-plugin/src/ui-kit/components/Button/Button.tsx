import { createPolymorphicComponent, Button as ManButton } from '@mantine/core';
import { forwardRef, type HTMLAttributes } from 'react';
import { styles } from './Button.css';
import { type IconName, Icon } from '../Icons/Icon';
export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** The label of the button */
  label: string;
  /** Show the button text */
  text?: boolean;
  /** The variant of the button */
  variant?: 'contained' | 'outline' | 'text';
  /** The size of the button */
  size?: 'default' | 'small';
  /** The loading state of the button */
  loading?: boolean;
  /** The disabled state of the button */
  disabled?: boolean;
  /** The right section of the button */
  rightSection?: IconName;
  /** The left section of the button */
  leftSection?: IconName;
}
/** Primary UI component for user interaction */
const ForwardedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = 'contained',
      size = 'default',
      disabled = false,
      loading = false,
      rightSection,
      leftSection,
      text = true,
      ...props
    },
    ref
  ) => {
    return (
      <ManButton
        ref={ref}
        variant={variant}
        size={size}
        aria-label={label}
        loading={loading}
        loaderProps={{ children: <Icon name='cached_Outlined' /> }}
        disabled={disabled}
        data-notext={!text}
        rightSection={rightSection ? <Icon name={rightSection} /> : undefined}
        leftSection={leftSection ? <Icon name={leftSection} /> : undefined}
        classNames={styles}
        {...props}
      >
        {text ? label : null}
      </ManButton>
    );
  }
);
ForwardedButton.displayName = 'Button';

export const Button = createPolymorphicComponent<'button', ButtonProps>(ForwardedButton);
