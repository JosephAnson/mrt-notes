import type { SpellIdInformation } from '~/types'
import { useWoWClient } from '~/utils/blizzard'

interface EncounterSpell {
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

interface EncouterSpells {
  id: number
  name: string
  spells: EncounterSpell[]
}

export default defineEventHandler(async (event): Promise<EncouterSpells> => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const storageKey = `encounter-spells:${id}`
  const storedSpells = await useStorage().getItem<EncouterSpells>(storageKey)
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

  const spells: EncounterSpell[] = []

  async function generateAllSpells(sections: EncounterSection[]) {
    for (const section of sections) {
      if (section.spell) {
        const spellIdInformation = await $fetch<SpellIdInformation>(`/api/spell/${section.spell.id}`)

        spells.push({ ...section.spell, spellIdInformation })
      }
      if (section.sections) await generateAllSpells(section.sections)
    }
  }

  if (data.sections) await generateAllSpells(data.sections)

  await useStorage().setItem(storageKey, { id, name: data.name, spells })

  return { id, name: data.name, spells }
})
