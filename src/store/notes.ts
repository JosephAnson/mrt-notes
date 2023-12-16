import type { Note, NoteTypes } from '~/types'
import {
  deleteNote,
  fetchAllNotesByUserId,
  fetchRecentlyCreatedNotes,
  fetchRecentlyModifiedNotes,
  getAllNotes,
  searchAllNotes,
} from '~/services/notes'

export interface NoteState {
  notes: {
    search: Note[]
    user: Note[]
    recentlyCreated: Note[]
    recentlyModified: Note[]
  }
}

export const useNotesStore = defineStore('notes', {
  state: (): NoteState => ({
    notes: {
      search: [],
      user: [],
      recentlyCreated: [],
      recentlyModified: [],
    },
  }),
  actions: {
    async fetchAllUserNotes(userID?: string) {
      if (!userID) return this.notes.user
      const notes = await fetchAllNotesByUserId(userID)
      this.notes.user = notes
      return notes
    },
    async fetchRecentlyModifiedNotes() {
      const notes = await fetchRecentlyModifiedNotes()
      this.notes.recentlyModified = notes
      return notes
    },
    async fetchRecentlyCreatedNotes() {
      const notes = await fetchRecentlyCreatedNotes()
      this.notes.recentlyCreated = notes
      return notes
    },
    async fetchSearchNotes(name?: string) {
      const notes = name ? await searchAllNotes(name) : await getAllNotes({ limit: 30 })
      this.notes.search = notes
      return notes
    },
    async deleteNote(id: number) {
      await deleteNote(id)

      for (const key in this.notes) {
        const noteKey = key as NoteTypes
        this.notes[noteKey] = this.notes[noteKey]?.filter((t: Note) => t.id !== id) || []
      }
    },
  },
})
