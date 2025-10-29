import { MultiFileChip } from "./MultiFileChip";

interface MultiFileValueComponentProps {
  value: File[] | null;
  onRemove?: (index: number) => void;
}

export const MultiFileValueComponent = ({
  value,
  onRemove,
}: MultiFileValueComponentProps) => {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {value.map((file, index) => (
        <MultiFileChip
          key={`${file.name}-${index}`}
          label={file.name}
          onClose={onRemove ? () => onRemove(index) : undefined}
        />
      ))}
    </div>
  );
};
