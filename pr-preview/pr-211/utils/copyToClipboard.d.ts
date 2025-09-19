import { default as React } from '../../../../node_modules/react';
/**
 * Helper function for copy text to clipboard
 * @param {string} textToCopy The text string for copying to the clipboard
 * @param {element|node} componentRef The ref of the component that we want to trigger the copy
 */
declare const copyToClipboard: (textToCopy: string, componentRef: React.RefObject<HTMLElement | null>) => Promise<void>;
export { copyToClipboard };
