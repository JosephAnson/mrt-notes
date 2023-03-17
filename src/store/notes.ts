import type { Note, NoteTypes, NotesAndProfile } from '~/types'
import { createNotes, deleteNote, fetchAllNotesByUserId, searchAllNotes } from '~/services/notes'

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
    setNotes(type: NoteTypes, notes: NotesAndProfile[]) {
      this.notes[type] = notes.map(createNotes)
    },
    async fetchAllUserNotes(userID: string) {
      const notes = await fetchAllNotesByUserId(userID)

      this.setNotes('user', notes)
      return notes
    },
    async fetchRecentlyModifiedNotes() {
      const notes = await getAllNotes({ order: 'updated_at', limit: 5 })
      this.setNotes('recentlyModified', notes)
      return notes
    },
    async fetchRecentlyCreatedNotes() {
      const notes = await getAllNotes({ limit: 5 })
      this.setNotes('recentlyCreated', notes)
      return notes
    },
    async fetchSearchNotes(name: string, categories: string[] | null) {
      const notes = await searchAllNotes(name, categories)
      this.setNotes('search', notes)
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
