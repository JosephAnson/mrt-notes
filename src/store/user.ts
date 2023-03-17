import { addFavourite, getUserFavourites, removeFavourite } from '~/services/favourites'
import type { Favourite } from '~/types'

export interface UserState {
  favourites: Favourite[]
}

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      favourites: [],
    } as UserState),
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
      await removeFavourite(noteId, userId)
      this.favourites = this.favourites.filter((item) => item.note_id !== noteId)
      openSnackbar({ message: 'Removed from favourites', background: 'bg-red-700' })
    },
    async addUserFavourite(noteId: number, userId: string) {
      const favourite = await addFavourite(noteId, userId)
      this.favourites = [...this.favourites, favourite]
      openSnackbar('Added to favourites')
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
