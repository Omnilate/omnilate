export type WithRelationField<T, K extends string, V> = {
  [P in keyof T]: P extends K ? V : T[P]
} & Record<Exclude<string, keyof T>, never> & {
  [P in Exclude<keyof T, K>]: T[P]
}
