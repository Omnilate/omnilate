// MM/DD hh(24):mm
export function serializeDateTime (rawD: Date | string): string {
  const d = (typeof rawD === 'string') ? new Date(rawD) : rawD
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
