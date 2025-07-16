import {
  Accordion as MantineAccordion,
  type AccordionProps,
} from "@mantine/core";
import { styles } from "./Accordion.css";

// Create a wrapper component that applies our custom styles
const AccordionWrapper = <T extends boolean = false>(
  props: AccordionProps<T>,
) => {
  return (
    <MantineAccordion<T>
      {...props}
      classNames={{
        ...props.classNames,
        ...styles,
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
