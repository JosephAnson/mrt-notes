import { addFavourite, getUserFavourites, removeFavourite } from '~/services/favourites'
import type { Favourite } from '~/types'

export interface UserState {
  favourites: Favourite[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    favourites: [],
  }),
  actions: {
    hasFavourite(noteId: number) {
      return this.favourites.find((item) => item.note_id === noteId)
    },
    async fetchUserFavourites(userID: string | undefined) {
      if (userID) {
        this.favourites = await getUserFavourites(userID)
      }

      return this.favourites
    },
    async removeUserFavourite(noteId: number, userId: string) {
      const notesStore = useNotesStore()
      await removeFavourite(noteId, userId)
      this.favourites = this.favourites.filter((item) => item.note_id !== noteId)
      notesStore.changeFavouriteAmount(noteId, -1)
      openSnackbar({ message: 'Removed from account favourites', background: 'bg-red-700' })
    },
    async addUserFavourite(noteId: number, userId: string) {
      const notesStore = useNotesStore()
      const favourite = await addFavourite(noteId, userId)
      this.favourites = [...this.favourites, favourite]
      notesStore.changeFavouriteAmount(noteId, 1)
      openSnackbar('Added to account favourites')
    },
    async toggleUserFavourite(noteId: number) {
      const user = useSupabaseUser()
      const userId = user.value?.id

      if (userId) {
        if (this.hasFavourite(noteId)) {
          this.removeUserFavourite(noteId, userId)
        } else {
          this.addUserFavourite(noteId, userId)
        }
      }
    },
  },
})
