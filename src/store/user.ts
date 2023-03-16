import { addFavourite, getUserHasFavourites, removeFavourite } from '~/services/favourites'
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
    async fetchUserFavourites(userID: string | undefined) {
      if (userID) {
        this.favourites = await getUserHasFavourites(userID)
      }

      return this.favourites
    },
    async removeUserFavourite(noteId: number, userId: string) {
      await removeFavourite(noteId, userId)
      this.favourites = this.favourites.filter((item) => item.note_id !== noteId)
    },
    async addUserFavourite(noteId: number, userId: string) {
      const favourite = await addFavourite(noteId, userId)
      this.favourites = [...this.favourites, favourite]
    },
  },
})
