import { IconName } from '../Icons/Icon';
export interface BreadcrumbItem {
    /** The text to display */
    text?: string;
    /** The icon to display */
    icon?: IconName;
    /** The href for the link */
    href?: string;
}
export interface BreadcrumbProps {
    /** Array of breadcrumb items */
    items: BreadcrumbItem[];
}
export declare const Breadcrumb: import('../../../../../node_modules/react').ForwardRefExoticComponent<BreadcrumbProps & import('../../../../../node_modules/react').RefAttributes<HTMLDivElement>>;
