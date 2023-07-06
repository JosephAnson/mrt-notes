import { useWoWClient } from '../../../../../utils/blizzard'

export interface EncounterInstance {
  id: number
  name: string
}

export interface EncounterInstances {
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
    name: 'expansion-instances',
    group: 'expansion',
    maxAge: 60 * 60 * 24 * 14,
  },
)
