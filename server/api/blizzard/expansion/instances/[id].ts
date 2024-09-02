import { useWoWClient } from '../../../../../app/utils/blizzard'

export interface EncounterInstance {
  id: number
  name: string
}

export interface EncounterInstances {
  dungeons: EncounterInstance[]
  raids: EncounterInstance[]
  currentRaid: EncounterInstance
  currentDungeon: EncounterInstance
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

    return {
      dungeons: data.dungeons,
      raids: data.raids,
      currentRaid: data.raids[data.raids.length - 1],
      currentDungeon: data.dungeons[data.dungeons.length - 1],
    }
  },
  {
    name: 'expansion-instances',
    group: 'expansion',
    maxAge: 60 * 60 * 24 * 14,
  },
)
