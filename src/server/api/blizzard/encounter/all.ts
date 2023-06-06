import type { EncounterInstance } from '../expansion/instances/[id]'
import type { InstanceReturn } from '../instance/[id]'

export interface ExpansionList {
  id: number
  name: string
  instances: {
    raids: InstanceReturn[]
    dungeons: InstanceReturn[]
  }
}

export default cachedEventHandler(
  async (): Promise<ExpansionList[]> => {
    const expansionList: ExpansionList[] = []

    const expansions = await $fetch('/api/blizzard/expansion/all')

    const expansionWithoutMythicPlus = expansions.filter((i) => i.name !== 'Mythic+ Dungeons')

    for (const expansion of expansionWithoutMythicPlus) {
      const expansionInstance = await $fetch(`/api/blizzard/expansion/instances/${expansion.id}/`)

      expansionList.push({
        id: expansion.id,
        name: expansion.name,
        instances: {
          raids: await Promise.all(
            expansionInstance.raids.reverse().map((i: EncounterInstance) => $fetch(`/api/blizzard/instance/${i.id}/`))
          ),
          dungeons: await Promise.all(
            expansionInstance.dungeons
              .reverse()
              .map((i: EncounterInstance) => $fetch(`/api/blizzard/instance/${i.id}/`))
          ),
        },
      })
    }

    return expansionList
  },
  {
    name: 'expansion-encounters',
    group: 'expansion',
    maxAge: 60 * 60 * 24 * 14,
  }
)
