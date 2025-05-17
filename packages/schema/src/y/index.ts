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
    cursor?: {
      index: number
      length: number
    }
  }
})

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
  syncFlag?: Y.Text
  chatMessages: Y.Array<ProjectChatMessage>

  root: ProjectDirectory
}

export interface ProjectChatMessage {
  content: string
  createdAt: string
  authorId: number
}

// #region Directory

export interface YDirectoryStructure {
  type: 'directory'
  children: Y.Map<ProjectDirectoryY | ProjectFileY>
}

export type ProjectDirectoryY = Y.Map<YDirectoryStructure[keyof YDirectoryStructure]>

export interface ProjectDirectory {
  type: 'directory'
  children: Record<string, ProjectDirectory | ProjectFile>
}

// #endregion Directory
// #region File

export interface YFileStructure {
  type: 'file'
  createdAt: string
  updatedAt: string

  sourceLanguage: string
  languages: Y.Map<LanguageMetaY>
  records: Y.Map<ProjectRecordY>
}

export type ProjectFileY = Y.Map<YFileStructure[keyof YFileStructure]>

export interface ProjectFile {
  type: 'file'
  createdAt: string
  updatedAt: string

  sourceLanguage: string
  languages: Record<string, LanguageMetaStructure>
  records: Record<string, ProjectRecord>
}

// #endregion File

// #region Language

export interface LanguageMetaStructure {
  source: boolean
  recordsWIPCount: number
  recordsNeedReviewCount: number
  recordsApprovedCount: number
  recordsRejectedCount: number
}

export type LanguageMetaY = Y.Map<LanguageMetaStructure[keyof LanguageMetaStructure]>

// #endregion Language

// #region Record

export interface YRecordStructure {
  languages: Y.Map<LanguageRecordY>
  updatedAt: string
}

export type ProjectRecordY = Y.Map<YRecordStructure[keyof YRecordStructure]>

export interface ProjectRecord {
  languages: Record<string, LanguageRecord>
  updatedAt: string
}

export type LanguageRecordState = 'source' | 'wip' | 'review-needed' | 'reviewed' | 'approved' | 'rejected'

export interface YLanguageRecordStructure {
  discussions: Y.Array<Discussion>
  updatedAt: string
  lastEditorId: number
  contributorIds: number[]
  value: Y.Text
  state: LanguageRecordState
}

export type LanguageRecordY = Y.Map<YLanguageRecordStructure[keyof YLanguageRecordStructure]>

export interface LanguageRecord {
  discussions: Discussion[]
  updatedAt: string
  lastEditorId: number
  value: string
  state: LanguageRecordState
}

// #endregion Record
