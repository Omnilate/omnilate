import type * as Y from 'yjs'

export type AwarenessInfo = {
  uid: number
  color: string
} & ({
  active: false
} | {
  active: true
  workingOn: {
    filePath: string[]
    key: string
    language: string
    page: number
    cursorOffset: number
  }
})

// export interface File {
//   type: 'i18next'
//   path: string[]
//   content:
// }
export interface Discussion {
  content: string
  createdAt: string
  updatedAt: string
  authorId: number
}

export interface ProjectStructure { // under the root map
  name: string
  description: string
  createdAt: string
  updatedAt: string

  root: ProjectDirectory
}

export interface ProjectChatMessage {
  content: string
  createdAt: string
  authorId: number
}

export type ProjectDirectoryY = Y.Map<ProjectDirectoryY | Y.Doc>

export interface ProjectDirectory {
  type: 'directory'
  children: Record<string, ProjectDirectory | ProjectFileInfo>
}

export interface ProjectFileInfo {
  type: 'file'
}

/** structure of subdoc, under the 'root' map */
export interface ProjectFile {
  createdAt: string
  updatedAt: string

  sourceLanguage: string
  languages: string[]
  records: Record<string, ProjectRecord>
  fileVersions: Record<string, ProjectFileVersion>
}

export type ProjectRecord = Record<string, LanguageRecord>

export interface LanguageRecord {
  discussions: Discussion[]
  updatedAt: string
  lastEditorId: number
  value: string
  state: 'review-needed' | 'approved' | 'rejected'
}

export interface ProjectFileVersion {
  description: string
  createdAt: string
  /** base64 */
  serializedStateVector: string
}
