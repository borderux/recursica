import { TooltipProps as ManTooltipProps } from '@mantine/core';
export interface TooltipProps extends Pick<ManTooltipProps, "position" | "children" | "opened" | "defaultOpened"> {
    label: string;
}
export declare const Tooltip: ({ label, position, children, opened, }: TooltipProps) => import("react/jsx-runtime").JSX.Element;
