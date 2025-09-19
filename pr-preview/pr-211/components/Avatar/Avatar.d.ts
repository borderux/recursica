import { HTMLAttributes } from '../../../../../node_modules/react';
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    /** The initials to display (mandatory) */
    initials: string;
    /** The variant of the avatar */
    variant?: "primary" | "ghost" | "image";
    /** The size of the avatar */
    size?: "small" | "default" | "large";
    /** The image source for image variant */
    src?: string;
    /** The alt text for image variant */
    alt?: string;
    /** Whether to show border style */
    border?: boolean;
}
/** Avatar component for displaying user avatars with different variants */
export declare const ForwardedAvatar: import('../../../../../node_modules/react').ForwardRefExoticComponent<AvatarProps & import('../../../../../node_modules/react').RefAttributes<HTMLDivElement>>;
export declare const Avatar: (<C = "div">(props: import('@mantine/core').PolymorphicComponentProps<C, AvatarProps>) => React.ReactElement) & Omit<import('../../../../../node_modules/react').FunctionComponent<(AvatarProps & {
    component?: any;
} & Omit<Omit<any, "ref">, "component" | keyof AvatarProps> & {
    ref?: any;
    renderRoot?: (props: any) => any;
}) | (AvatarProps & {
    component: React.ElementType;
    renderRoot?: (props: Record<string, any>) => any;
})>, never> & Record<string, never>;
