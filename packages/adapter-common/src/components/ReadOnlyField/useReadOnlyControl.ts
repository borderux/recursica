import { useState, useEffect, useCallback } from "react";

export function useReadOnlyControl(
  initialReadOnly?: boolean,
  onLabelEditClick?: (e: React.MouseEvent<HTMLElement>) => void,
) {
  const [isReadOnly, setIsReadOnly] = useState(!!initialReadOnly);

  useEffect(() => {
    setIsReadOnly(!!initialReadOnly);
  }, [initialReadOnly]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setIsReadOnly(false);
      onLabelEditClick?.(e);
    },
    [onLabelEditClick],
  );

  return { isReadOnly, handleEditClick };
}
