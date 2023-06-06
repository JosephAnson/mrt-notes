import { useWoWClient } from '../../../../utils/blizzard'

interface Instance {
  id: number
  name: string
}

export interface InstanceReturn {
  id: number
  name: string
  encounters: Instance[]
}

export default cachedEventHandler(
  async (event) => {
    if (!event.context.params) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Should provide id',
      })
    }

    const id = event.context.params.id

    const wowClient = await useWoWClient()

    const { data } = await wowClient.journal<InstanceReturn>({
      resource: 'instance',
      id: Number(id),
    })

    return data
  },
  {
    maxAge: 60 * 60 * 24 * 14,
    name: 'instance',
    group: 'instance',
  }
)
