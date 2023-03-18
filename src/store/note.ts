import type { EncounterSpell } from '~/server/api/blizzard/encounter/spells/[id]'

export interface NoteState {
  spells: EncounterSpell[]
}

export const useNoteStore = defineStore('note', {
  state: (): NoteState => ({
    spells: [],
  }),
  actions: {
    setSpells(spells: EncounterSpell[]) {
      this.spells = spells
    },
  },
})
