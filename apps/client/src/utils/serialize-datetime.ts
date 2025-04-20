// MM/DD hh(24):mm
export function serializeDateTime (d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
