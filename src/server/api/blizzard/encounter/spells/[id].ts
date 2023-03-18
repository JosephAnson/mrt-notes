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

export default defineEventHandler(async (event): Promise<EncounterSpells> => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const storageKey = `encounter-spells:${id}`
  const storedSpells = await useStorage().getItem<EncounterSpells>(storageKey)
  if (storedSpells)
    return {
      id: storedSpells.id,
      name: storedSpells.name,
      spells: storedSpells.spells,
    }

  const wowClient = await useWoWClient()

  const { data } = await wowClient.journal<Encounter>({
    resource: 'encounter',
    id,
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

  await useStorage().setItem(storageKey, { id, name: data.name, spells })
  return { id, name: data.name, spells }
})
