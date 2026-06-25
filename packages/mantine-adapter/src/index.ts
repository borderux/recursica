import "@recursica/adapter-common/style.css";
import * as rawComponents from "./components";
import { wrapComponent } from "@recursica/adapter-common";

export * from "@recursica/adapter-common";

// Expose unwrapped structural layout primitives to preserve their polymorphic types
export const Flex = rawComponents.Flex;
export const Group = rawComponents.Group;
export const Stack = rawComponents.Stack;
export const Container = rawComponents.Container;
export const Link = rawComponents.Link;
export const Text = rawComponents.Text;

// Statically wrap and export components to inject overStyled visual highlight in dev mode
export const Accordion = wrapComponent(
  rawComponents.Accordion,
) as typeof rawComponents.Accordion;
export const AccordionItem = wrapComponent(
  rawComponents.AccordionItem,
) as typeof rawComponents.AccordionItem;
export const AccordionControl = wrapComponent(
  rawComponents.AccordionControl,
) as typeof rawComponents.AccordionControl;
export const AccordionPanel = wrapComponent(
  rawComponents.AccordionPanel,
) as typeof rawComponents.AccordionPanel;
export const AutoComplete = wrapComponent(
  rawComponents.AutoComplete,
) as typeof rawComponents.AutoComplete;
export const Avatar = wrapComponent(
  rawComponents.Avatar,
) as typeof rawComponents.Avatar;
export const Badge = wrapComponent(
  rawComponents.Badge,
) as typeof rawComponents.Badge;
export const Breadcrumb = wrapComponent(
  rawComponents.Breadcrumb,
) as typeof rawComponents.Breadcrumb;
export const Button = wrapComponent(
  rawComponents.Button,
) as typeof rawComponents.Button;
export const Card = wrapComponent(
  rawComponents.Card,
) as typeof rawComponents.Card;
export const Checkbox = wrapComponent(
  rawComponents.Checkbox,
) as typeof rawComponents.Checkbox;
export const CheckboxGroup = wrapComponent(
  rawComponents.CheckboxGroup,
) as typeof rawComponents.CheckboxGroup;
export const Chip = wrapComponent(
  rawComponents.Chip,
) as typeof rawComponents.Chip;
export const DatePicker = wrapComponent(
  rawComponents.DatePicker,
) as typeof rawComponents.DatePicker;
export const Dropdown = wrapComponent(
  rawComponents.Dropdown,
) as typeof rawComponents.Dropdown;
export const FileInput = wrapComponent(
  rawComponents.FileInput,
) as typeof rawComponents.FileInput;
export const FileUpload = wrapComponent(
  rawComponents.FileUpload,
) as typeof rawComponents.FileUpload;
export const FormControlLayout = wrapComponent(
  rawComponents.FormControlLayout,
) as typeof rawComponents.FormControlLayout;
export const HoverCard = wrapComponent(
  rawComponents.HoverCard,
) as typeof rawComponents.HoverCard;
export const Loader = wrapComponent(
  rawComponents.Loader,
) as typeof rawComponents.Loader;
export const Label = wrapComponent(
  rawComponents.Label,
) as typeof rawComponents.Label;
export const Menu = wrapComponent(
  rawComponents.Menu,
) as typeof rawComponents.Menu;
export const Modal = wrapComponent(
  rawComponents.Modal,
) as typeof rawComponents.Modal;
export const NumberInput = wrapComponent(
  rawComponents.NumberInput,
) as typeof rawComponents.NumberInput;
export const Pagination = wrapComponent(
  rawComponents.Pagination,
) as typeof rawComponents.Pagination;
export const Panel = wrapComponent(
  rawComponents.Panel,
) as typeof rawComponents.Panel;
export const PanelFooter = wrapComponent(
  rawComponents.PanelFooter,
) as typeof rawComponents.PanelFooter;
export const Popover = wrapComponent(
  rawComponents.Popover,
) as typeof rawComponents.Popover;
export const Radio = wrapComponent(
  rawComponents.Radio,
) as typeof rawComponents.Radio;
export const RadioGroup = wrapComponent(
  rawComponents.RadioGroup,
) as typeof rawComponents.RadioGroup;
export const ReadOnlyField = wrapComponent(
  rawComponents.ReadOnlyField,
) as typeof rawComponents.ReadOnlyField;
export const SegmentedControl = wrapComponent(
  rawComponents.SegmentedControl,
) as typeof rawComponents.SegmentedControl;
export const Slider = wrapComponent(
  rawComponents.Slider,
) as typeof rawComponents.Slider;
export const Stepper = wrapComponent(
  rawComponents.Stepper,
) as typeof rawComponents.Stepper;
export const Switch = wrapComponent(
  rawComponents.Switch,
) as typeof rawComponents.Switch;
export const SwitchGroup = wrapComponent(
  rawComponents.SwitchGroup,
) as typeof rawComponents.SwitchGroup;
export const Table = wrapComponent(
  rawComponents.Table,
) as typeof rawComponents.Table;
export const Tabs = wrapComponent(
  rawComponents.Tabs,
) as typeof rawComponents.Tabs;
export const TextArea = wrapComponent(
  rawComponents.TextArea,
) as typeof rawComponents.TextArea;
export const TextField = wrapComponent(
  rawComponents.TextField,
) as typeof rawComponents.TextField;
export const TimePicker = wrapComponent(
  rawComponents.TimePicker,
) as typeof rawComponents.TimePicker;
export const Timeline = wrapComponent(
  rawComponents.Timeline,
) as typeof rawComponents.Timeline;
export const TimelineItem = wrapComponent(
  rawComponents.TimelineItem,
) as typeof rawComponents.TimelineItem;
export const Title = wrapComponent(
  rawComponents.Title,
) as typeof rawComponents.Title;
export const Toast = wrapComponent(
  rawComponents.Toast,
) as typeof rawComponents.Toast;
export const Tooltip = wrapComponent(
  rawComponents.Tooltip,
) as typeof rawComponents.Tooltip;
export const TransferList = wrapComponent(
  rawComponents.TransferList,
) as typeof rawComponents.TransferList;

export type {
  RecursicaCheckboxGroupProps,
  RecursicaDatePickerProps,
  RecursicaDropdownProps,
  RecursicaNumberInputProps,
  RecursicaRadioGroupProps,
  RecursicaReadOnlyFieldProps,
  RecursicaReadOnlyTextFieldProps,
  RecursicaSliderProps,
  RecursicaSwitchGroupProps,
  RecursicaTextAreaProps,
  RecursicaTextFieldProps,
} from "./components";
