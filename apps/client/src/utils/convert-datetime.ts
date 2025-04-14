export type ConvertDatetime<T, K extends keyof T> = Omit<T, K> & Record<K, Date>

export function convertDatetime<T, K extends keyof T> (
  obj: T,
  keys: K[]
): ConvertDatetime<T, K> {
  const res = { ...obj }
  for (const k of keys) {
    (res as any)[k] = new Date(res[k] as string)
  }
  return res as ConvertDatetime<typeof obj, typeof keys[number]>
}
