export function toFontWeight(value: string) {
  // thin -> 100
  const thinFontWeight = ['thin'];

  // extra light -> 200
  const extraLightFontWeight = ['extralight'];

  // light -> 300
  const lightFontWeight = ['light'];

  // regular -> 400
  const regularFontWeight = ['regular'];

  // medium -> 500
  const mediumFontWeight = ['medium'];

  // semibold -> 600
  const semiboldFontWeight = ['semibold'];

  // bold -> 700
  const boldFontWeight = ['bold'];

  // extra bold -> 800
  const extraBoldFontWeight = ['extra bold', 'extrabold'];

  // black -> 900
  const blackFontWeight = ['black', 'heavy'];

  // name to number reference: https://docs.tokens.studio/token-types/token-type-font-weight#numeric-weights
  const lowerValue = value.toLowerCase();

  if (thinFontWeight.some((weight) => lowerValue.includes(weight))) return 100;
  if (extraLightFontWeight.some((weight) => lowerValue.includes(weight))) return 200;
  if (lightFontWeight.some((weight) => lowerValue.includes(weight))) return 300;
  if (regularFontWeight.some((weight) => lowerValue.includes(weight))) return 400;
  if (mediumFontWeight.some((weight) => lowerValue.includes(weight))) return 500;
  if (semiboldFontWeight.some((weight) => lowerValue.includes(weight))) return 600;
  if (boldFontWeight.some((weight) => lowerValue.includes(weight))) return 700;
  if (extraBoldFontWeight.some((weight) => lowerValue.includes(weight))) return 800;
  if (blackFontWeight.some((weight) => lowerValue.includes(weight))) return 900;

  return 400; // default to regular
}
