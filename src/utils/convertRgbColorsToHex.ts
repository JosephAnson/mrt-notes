export function convertRgbColorsToHex(string: string) {
  return string.replace(/rgb\(\d+,\s*\d+,\s*\d+\)/g, (rgbString) => {
    return `#${rgbString
      .match(/\b(\d+)\b/g)
      ?.map((digit) => Number.parseInt(digit).toString(16).padStart(2, '0').toUpperCase())
      .join('')}`
  })
}
