import { forwardRef } from "react";
import { styles } from "./MultiFileChip.css";

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
            <svg
              className={styles.closeIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}
      </div>
    );
  },
);

MultiFileChip.displayName = "MultiFileChip";
