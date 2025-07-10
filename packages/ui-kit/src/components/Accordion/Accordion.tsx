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

// Export the main Accordion component with dot notation
export const Accordion = Object.assign(AccordionWrapper, {
  Item: MantineAccordion.Item,
  Control: MantineAccordion.Control,
  Panel: MantineAccordion.Panel,
});
