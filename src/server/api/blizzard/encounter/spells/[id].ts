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

export default defineEventHandler(async (event): Promise<{ id: number; name: string; spells: EncounterSpell[] }> => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const wowClient = await useWoWClient()

  const { data } = await wowClient.journal<Encounter>({
    resource: 'encounter',
    id,
  })

  const spells: EncounterSpell[] = []

  function generateAllSpells(sections: EncounterSection[]) {
    for (const section of sections) {
      if (section.spell) spells.push(section.spell)
    }
  }

  if (data.sections) generateAllSpells(data.sections)

  return { id, name: data.name, spells }
})
