import { useWoWClient } from '~/utils/blizzard'

interface EncounterInstance {
  id: number
  name: string
}

interface EncounterInstances {
  dungeons: EncounterInstance[]
  raids: EncounterInstance[]
}

export default defineEventHandler(async (event): Promise<EncounterInstances> => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const storageKey = `expansion-instances:${id}`
  const encounterInstances = await useStorage().getItem<EncounterInstances>(storageKey)
  if (encounterInstances) return encounterInstances

  const wowClient = await useWoWClient()

  const { data } = await wowClient.journal<{
    dungeons: EncounterInstance[]
    raids: EncounterInstance[]
  }>({
    resource: 'expansion',
    id,
  })

  await useStorage().setItem(storageKey, data)

  return data
})
