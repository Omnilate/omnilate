export function jumpTo (url: string): void {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.click()
}
