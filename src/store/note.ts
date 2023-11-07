import type { EncounterSpell } from '~/server/api/blizzard/encounter/spells/[id]'

export interface NoteStoreState {
  spells: EncounterSpell[]
}

export const useNoteStore = defineStore('note', {
  state: (): NoteStoreState => ({
    spells: [],
  }),
  actions: {
    setSpells(spells: EncounterSpell[]) {
      this.spells = spells
    },
  },
})
