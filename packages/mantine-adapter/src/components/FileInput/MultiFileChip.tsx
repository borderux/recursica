import { forwardRef } from "react";
import { styles } from "./MultiFileChip.css";
import { Icon } from "../Icon/Icon";

interface MultiFileChipProps {
  /** The text label to display in the chip */
  label: string;
  /** Callback function when the close button is clicked */
  onClose?: () => void;
  /** Additional CSS class name */
  className?: string;
}

export const MultiFileChip = forwardRef<HTMLDivElement, MultiFileChipProps>(
  ({ label, onClose, className, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (
        onClose &&
        (e.key === "Delete" || e.key === "Backspace" || e.key === "Enter")
      ) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.root} ${className || ""}`}
        onClick={onClose}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Remove ${label}. Press Delete, Backspace, or Enter to remove.`}
        {...props}
      >
        <span className={styles.label}>{label}</span>
        {onClose && (
          <div
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <Icon name="x_mark_solid" size={16} color="currentColor" />
          </div>
        )}
      </div>
    );
  },
);

MultiFileChip.displayName = "MultiFileChip";
