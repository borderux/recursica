/**
 * A single transferable item.
 */
export interface RecursicaTransferListItem {
  /** Unique identifier used for selection and transfer */
  value: string;
  /** Display text */
  label: string;
  /** Optional group name — items sharing a group render under a CheckboxGroup */
  group?: string;
}

/** Controlled/uncontrolled data shape: [sourceItems, targetItems] */
export type RecursicaTransferListData = [
  RecursicaTransferListItem[],
  RecursicaTransferListItem[],
];

/**
 * Props for the Recursica TransferList component.
 */
export interface RecursicaTransferListProps {
  /** Controlled data: [sourceItems, targetItems] */
  data?: RecursicaTransferListData;
  /** Uncontrolled initial data: [sourceItems, targetItems] */
  defaultData?: RecursicaTransferListData;
  /** Called with the new [sourceItems, targetItems] whenever items are transferred */
  onChange?: (data: RecursicaTransferListData) => void;
  /** Label for the source (left) list */
  sourceLabel?: string;
  /** Label for the target (right) list */
  targetLabel?: string;
  /** Enable per-pane search filtering. Defaults to true */
  searchable?: boolean;
  /** Placeholder text for the search fields */
  searchPlaceholder?: string;
}
