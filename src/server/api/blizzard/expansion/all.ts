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

    const storageKey = `all-expansions`

    const {
      data: { tiers },
    } = await wowClient.journal<Expansions>({ resource: 'expansion' })

    return tiers
  },
  {
    maxAge: 60 * 60 * 24 * 7,
  }
)
