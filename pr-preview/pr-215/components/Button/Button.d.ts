import { HTMLAttributes } from '../../../../../node_modules/react';
import { IconName } from '../Icons/Icon';
export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /** The label of the button */
    label: string;
    /** The style of the button */
    variant?: "solid" | "outline" | "text";
    /** The size of the button */
    size?: "default" | "small";
    /** The icon for icon variant */
    icon?: IconName;
    /** The leading icon for iconText variant */
    leading?: IconName;
    /** The trailing icon for iconText variant */
    trailing?: IconName;
    /** The loading state of the button */
    loading?: boolean;
    /** The disabled state of the button */
    disabled?: boolean;
}
/** Primary UI component for user interaction */
export declare const ForwardedButton: import('../../../../../node_modules/react').ForwardRefExoticComponent<ButtonProps & import('../../../../../node_modules/react').RefAttributes<HTMLButtonElement>>;
export declare const Button: (<C = "button">(props: import('@mantine/core').PolymorphicComponentProps<C, ButtonProps>) => React.ReactElement) & Omit<import('../../../../../node_modules/react').FunctionComponent<(ButtonProps & {
    component?: any;
} & Omit<Omit<any, "ref">, "component" | keyof ButtonProps> & {
    ref?: any;
    renderRoot?: (props: any) => any;
}) | (ButtonProps & {
    component: React.ElementType;
    renderRoot?: (props: Record<string, any>) => any;
})>, never> & Record<string, never>;
