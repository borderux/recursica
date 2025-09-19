import { IconName } from '../components/Icons/Icon';
export interface ComboboxItem {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: IconName;
    onClick?: () => void;
}
export * from './mantine.d';
