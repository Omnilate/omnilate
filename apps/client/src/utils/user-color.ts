const colorPool = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FF33A1',
  '#FF8C33',
  '#33FFF5',
  '#FF33B8',
  '#8C33FF',
  '#33FF8C',
  '#FFC733'
]

export const getUserColor = (uid: number): string => {
  const index = uid % colorPool.length
  return colorPool[index]
}
