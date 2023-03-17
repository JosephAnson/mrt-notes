import { useWoWClient } from '~/utils/blizzard'

interface EncounterSpell {
  id: number
  name: string
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

  function generateAllSpells(sections: EncounterSection[]) {
    for (const section of sections) {
      if (section.spell) spells.push(section.spell)
      if (section.sections) generateAllSpells(section.sections)
    }
  }

  if (data.sections) generateAllSpells(data.sections)

  await useStorage().setItem(storageKey, { id, name: data.name, spells })

  return { id, name: data.name, spells }
})
