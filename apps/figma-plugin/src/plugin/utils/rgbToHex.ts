/**
 * Function to parse an RGBA object to a HEX string
 * @rgba {RGBA} - RGBA object
 * @returns {string} HEX string
 * @recovered https://github.com/jake-figma/variables-import-export/blob/main/code.js
 */
export function rgbToHex({ r, g, b, a }: RGBA): string {
  if (a !== 1) {
    return `rgba(${[r, g, b].map((n) => Math.round(n * 255)).join(', ')}, ${a.toFixed(4)})`;
  }
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)].join('');
  return `#${hex}`;
}
