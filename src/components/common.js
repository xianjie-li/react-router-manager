export const placeHolderFn = () => null;

export function firstUpperCase(str = "") {
  if (!str) return "";
  return str.replace(/^./, $1 => $1.toUpperCase());
}
