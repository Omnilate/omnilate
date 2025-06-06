export interface Paginated<T> {
  total: number
  page: number
  pageSize: number
  items: T[]
}
