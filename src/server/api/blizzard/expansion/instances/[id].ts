import { useWoWClient } from '~/utils/blizzard'

interface EncounterInstance {
  id: number
  name: string
}

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const wowClient = await useWoWClient()

  const { data } = await wowClient.journal<{
    dungeons: EncounterInstance[]
    raids: EncounterInstance[]
  }>({
    resource: 'expansion',
    id,
  })

  return data
})
