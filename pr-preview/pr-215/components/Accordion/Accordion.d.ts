import { Accordion as MantineAccordion, AccordionProps } from '@mantine/core';
declare const AccordionWrapper: <T extends boolean = false>(props: AccordionProps<T>) => import("react/jsx-runtime").JSX.Element;
type AccordionComponent = typeof AccordionWrapper & {
    Item: typeof MantineAccordion.Item;
    Control: typeof MantineAccordion.Control;
    Panel: typeof MantineAccordion.Panel;
};
export declare const Accordion: AccordionComponent;
export {};
