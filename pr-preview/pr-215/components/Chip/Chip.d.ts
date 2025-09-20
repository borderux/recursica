import { ChipProps as ManChipProps, ChipGroupProps as ManChipGroupProps } from '@mantine/core';
import { IconName } from '../Icons/Icon';
export interface ChipProps extends Pick<ManChipProps, "checked" | "defaultChecked" | "onChange" | "value" | "readOnly"> {
    error?: boolean;
    label: string;
    icon?: {
        /**
         * The icon to display when the chip is checked. Typically a solid icon.
         */
        selected: IconName;
        /**
         * The icon to display when the chip is not checked. Typically an outline icon.
         */
        unselected: IconName;
    };
}
export type ChipGroupProps<T extends boolean = false> = ManChipGroupProps<T>;
declare const ChipComponent: import('../../../../../node_modules/react').ForwardRefExoticComponent<ChipProps & import('../../../../../node_modules/react').RefAttributes<HTMLInputElement>>;
declare const GroupComponent: {
    <T extends boolean = false>(props: ChipGroupProps<T>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
type ChipWithGroup = typeof ChipComponent & {
    Group: typeof GroupComponent;
};
export declare const Chip: ChipWithGroup;
export {};
