import {
  Accordion as MantineAccordion,
  type AccordionProps as MantineAccordionProps,
} from "@mantine/core";
import * as styles from "./Accordion.css";
import { Icon } from "../Icon/Icon";
import { recursica } from "@recursica/official-release/recursica";
import { LayerTypeProps, getLayerClassname } from "../Layer";

interface FigmaProps {
  Divider?: boolean;
}

export type AccordionProps = FigmaProps &
  MantineAccordionProps &
  LayerTypeProps;

const AccordionWrapper = ({
  Divider = true,
  Layer,
  ...props
}: AccordionProps) => {
  return (
    <MantineAccordion
      {...props}
      className={`${getLayerClassname(Layer) + " " + (props.className || "")}`}
      classNames={{
        ...styles,
        item: Divider ? styles.item : styles.itemNoDivider,
        ...props.classNames,
      }}
      chevron={
        props.chevron || (
          <Icon
            name="chevron_down_solid"
            color={recursica.uiKit["accordion/color/icon"]}
            size={recursica.uiKit["accordion/size/icon"]}
          />
        )
      }
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
