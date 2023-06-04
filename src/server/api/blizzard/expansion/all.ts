import { useWoWClient } from '~/utils/blizzard'

interface Tier {
  id: number
  name: string
}
interface Expansions {
  tiers: Tier[]
}

export default cachedEventHandler(
  async (): Promise<Tier[]> => {
    const wowClient = await useWoWClient()

    const {
      data: { tiers },
    } = await wowClient.journal<Expansions>({ resource: 'expansion' })

    return tiers.sort((a, b) => {
      return b.id - a.id
    })
  },
  {
    name: 'expansion-all',
    group: 'expansion',
    maxAge: 60 * 60 * 24 * 60,
  }
)
