import { useWoWClient } from '~/utils/blizzard'

interface EncounterInstance {
  id: number
  name: string
}

interface EncounterInstances {
  dungeons: EncounterInstance[]
  raids: EncounterInstance[]
}

export default cachedEventHandler(
  async (event): Promise<EncounterInstances> => {
    if (!event.context.params) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Should provide id',
      })
    }

    const id = event.context.params.id

    const wowClient = await useWoWClient()

    const { data } = await wowClient.journal<{
      dungeons: EncounterInstance[]
      raids: EncounterInstance[]
    }>({
      resource: 'expansion',
      id: Number(id),
    })

    return data
  },
  {
    maxAge: 60 * 60 * 24 * 7,
  }
)
