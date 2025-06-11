export function capitalize(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
