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

  const storageKey = `all-expansions`
  const allExpansions = await useStorage().getItem<Tier[]>(storageKey)
  if (allExpansions) return allExpansions

  const {
    data: { tiers },
  } = await wowClient.journal<Expansions>({ resource: 'expansion' })

  await useStorage().setItem(storageKey, tiers)

  return tiers
})
