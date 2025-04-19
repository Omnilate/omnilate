export function getContrastTextColor (backgroundHex: string): string {
  const r = parseInt(backgroundHex.slice(1, 3), 16)
  const g = parseInt(backgroundHex.slice(3, 5), 16)
  const b = parseInt(backgroundHex.slice(5, 7), 16)

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  console.log(`Luminance: ${luminance}, Background Color: ${backgroundHex}`)
  return (luminance > 0.75) ? '#000000' : '#FFFFFF'
}
