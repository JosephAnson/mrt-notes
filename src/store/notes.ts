import type { Note, NoteTypes, NotesAndProfile } from '~/types'
import { createNotes, deleteNote, fetchAllNotesByUserId, getAllNotes, searchAllNotes } from '~/services/notes'

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
      const notes = await $fetch('/api/notes/recentlyModifiedNotes')
      this.setNotes('recentlyModified', notes)
      return notes
    },
    async fetchRecentlyCreatedNotes() {
      const notes = await $fetch('/api/notes/recentlyCreatedNotes')
      this.setNotes('recentlyCreated', notes)
      return notes
    },
    async fetchSearchNotes(name?: string) {
      const notes = name ? await searchAllNotes(name) : await getAllNotes({ limit: 30 })
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
