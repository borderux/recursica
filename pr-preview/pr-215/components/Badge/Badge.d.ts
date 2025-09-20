/**
 * The style of the badge.
 */
type BadgeStyle = "primary" | "ghost" | "alert" | "success";
export interface BadgeProps {
    /**
     * The label to display in the badge.
     */
    label: string | number;
    /**
     * The size of the badge.
     * @default 'default'
     */
    size?: "default" | "large";
    /**
     * The style of the badge.
     * @default 'primary'
     */
    style?: BadgeStyle;
}
export declare function Badge({ label, size, style, }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
