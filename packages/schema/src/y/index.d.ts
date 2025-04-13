export interface AwarenessInfo {
  uid: number
  color: string
  workingOn: {
    page: number
    recordId: number
    cursorOffset: number
  }
}