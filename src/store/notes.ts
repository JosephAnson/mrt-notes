import type { Note } from '~/types'
import {
  deleteNote as deleteNoteApi,
  fetchAllNotesByUserId,
  getAllNotes,
  searchAllNotes,
} from '~/services/notes'

export const useNotesStore = defineStore('notes', () => {
  const search = ref<Note[]>([])
  const user = ref<Note[]>([])

  async function fetchAllUserNotes(userID?: string) {
    if (!userID) return user.value
    const notes = await fetchAllNotesByUserId(userID)
    user.value = notes
    return notes
  }

  async function fetchSearchNotes(name?: string) {
    const notes = name ? await searchAllNotes(name) : await getAllNotes({ limit: 30 })
    search.value = notes
    return notes
  }
  async function deleteNote(id: number) {
    await deleteNoteApi(id)

    user.value = user.value.filter(item => item.id !== id)
    search.value = search.value.filter(item => item.id !== id)
  }

  return {
    search,
    user,
    fetchAllUserNotes,
    fetchSearchNotes,
    deleteNote,
  }
})
