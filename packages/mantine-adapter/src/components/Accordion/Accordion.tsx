import {
  Accordion as MantineAccordion,
  type AccordionProps as MantineAccordionProps,
} from "@mantine/core";
import * as styles from "./Accordion.css";

// interface FigmaVariantProps {
//   Open?: boolean;
//   Divider?: boolean;
//   Title?: string;
// }

export type AccordionProps = MantineAccordionProps;

const AccordionWrapper = (props: AccordionProps) => {
  return (
    <MantineAccordion
      {...props}
      classNames={{
        ...styles,
        ...props.classNames,
      }}
    />
  );
};

// Define the type for our Accordion component with sub-components
type AccordionComponent = typeof AccordionWrapper & {
  Item: typeof MantineAccordion.Item;
  Control: typeof MantineAccordion.Control;
  Panel: typeof MantineAccordion.Panel;
};

// Export the main Accordion component with dot notation
export const Accordion: AccordionComponent = Object.assign(AccordionWrapper, {
  Item: MantineAccordion.Item,
  Control: MantineAccordion.Control,
  Panel: MantineAccordion.Panel,
});
