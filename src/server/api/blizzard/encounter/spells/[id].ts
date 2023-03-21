import type { SpellIdInformation } from '~/types'
import { useWoWClient } from '~/utils/blizzard'

export interface EncounterSpell {
  id: number
  name: string
  spellIdInformation: SpellIdInformation
}
interface EncounterSection {
  id: number
  title: string
  sections?: EncounterSection[]
  spell: EncounterSpell
}

interface Encounter {
  id: number
  name: string
  sections: EncounterSection[]
}

export interface EncounterSpells {
  id: number
  name: string
  spells: EncounterSpell[]
}

export default cachedEventHandler(
  async (event): Promise<EncounterSpells> => {
    if (!event.context.params) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Should provide id',
      })
    }

    const id = event.context.params.id

    const wowClient = await useWoWClient()

    const { data } = await wowClient.journal<Encounter>({
      resource: 'encounter',
      id: Number(id),
    })

    const spellsMap: Record<number, EncounterSpell> = {}

    async function generateAllSpells(sections: EncounterSection[]) {
      for (const section of sections) {
        if (section.spell) {
          const spellIdInformation = await $fetch<SpellIdInformation>(`/api/spell/${section.spell.id}`)

          if (!(section.spell.id in spellIdInformation))
            spellsMap[section.spell.id] = { ...section.spell, spellIdInformation }
        }
        if (section.sections) await generateAllSpells(section.sections)
      }
    }

    if (data.sections) await generateAllSpells(data.sections)

    const spells = Object.values(spellsMap)

    return { id: Number(id), name: data.name, spells }
  },
  {
    maxAge: 60 * 60 * 24 * 7,
  }
)
