import { useWoWClient } from '~/utils/blizzard'

interface Tier {
  id: number
  name: string
}
interface Expansions {
  tiers: Tier[]
}

export default defineEventHandler(async (): Promise<Tier[]> => {
  const wowClient = await useWoWClient()

  const {
    data: { tiers },
  } = await wowClient.journal<Expansions>({ resource: 'expansion' })

  return tiers
})
