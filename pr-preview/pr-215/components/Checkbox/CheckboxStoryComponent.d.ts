interface CheckboxStory {
    value: string;
    label: string;
    disabled?: boolean;
    indeterminate?: boolean;
    checked?: boolean;
    showLabel?: boolean;
}
interface CheckboxStoryComponentProps {
    checkboxes: CheckboxStory[];
    label: string;
    optional?: boolean;
    defaultValue?: string[];
    value?: string[];
    labelPlacement?: "top" | "left";
}
export declare function CheckboxStoryComponent({ checkboxes, label, optional, defaultValue, value, labelPlacement, }: CheckboxStoryComponentProps): import("react/jsx-runtime").JSX.Element;
export {};
