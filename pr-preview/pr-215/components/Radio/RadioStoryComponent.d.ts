interface RadioStory {
    value: string;
    label: string;
    showLabel?: boolean;
    disabled?: boolean;
}
interface RadioStoryComponentProps {
    radios: RadioStory[];
    label: string;
    optional?: boolean;
    defaultValue?: string;
}
export declare function RadioStoryComponent({ radios, label, optional, defaultValue, }: RadioStoryComponentProps): import("react/jsx-runtime").JSX.Element;
export {};
