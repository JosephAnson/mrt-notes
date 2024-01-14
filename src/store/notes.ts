import type { Note } from '~/types'
import {
  getAllNotes,
  searchAllNotes,
} from '~/services/notes'

export const useNotesStore = defineStore('notes', () => {
  const search = ref<Note[]>([])

  async function fetchSearchNotes(name?: string) {
    const notes = name ? await searchAllNotes(name) : await getAllNotes({ limit: 30 })
    search.value = notes
    return notes
  }
  async function deleteNote(id: number) {
    search.value = search.value.filter(item => item.id !== id)
  }

  return {
    search,
    fetchSearchNotes,
    deleteNote,
  }
})
