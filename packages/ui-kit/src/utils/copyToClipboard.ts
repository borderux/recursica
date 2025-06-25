import React from "react";

/**
 * Helper function for copy text to clipboard
 * @param {string} textToCopy The text string for copying to the clipboard
 * @param {element|node} componentRef The ref of the component that we want to trigger the copy
 */
const copyToClipboard = (
  textToCopy: string,
  componentRef: React.RefObject<HTMLElement | null>,
): Promise<void> => {
  const currentFocus = document.activeElement as HTMLInputElement;
  return new Promise((resolve, reject) => {
    if (componentRef && componentRef.current) {
      const textArea = document.createElement("textarea");
      textArea.readOnly = true;
      textArea.defaultValue = textToCopy;
      componentRef.current.appendChild(textArea);
      textArea.select();
      const wasCopied = document.execCommand("copy");
      componentRef.current.removeChild(textArea);
      if (currentFocus) {
        currentFocus.focus();
      }
      if (wasCopied) {
        resolve();
      } else {
        reject(new Error("Failed to copy"));
      }
    } else {
      reject(new Error("Copy area reference is not defined"));
    }
  });
};

export { copyToClipboard };
