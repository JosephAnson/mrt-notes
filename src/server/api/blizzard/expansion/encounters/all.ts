import type { EncounterInstance } from '~/server/api/blizzard/expansion/instances/[id]'
import type { InstanceReturn } from '~/server/api/blizzard/instance/[id]'

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

    for (const expansion of expansions) {
      const expansionInstance = await $fetch(`/api/blizzard/expansion/instances/${expansion.id}/`)

      expansionList.push({
        id: expansion.id,
        name: expansion.name,
        instances: {
          raids: await Promise.all(
            expansionInstance.raids.map((i: EncounterInstance) => $fetch(`/api/blizzard/instance/${i.id}/`))
          ),
          dungeons: await Promise.all(
            expansionInstance.dungeons.map((i: EncounterInstance) => $fetch(`/api/blizzard/instance/${i.id}/`))
          ),
        },
      })
    }

    return expansionList
  },
  {
    maxAge: 60 * 60 * 24 * 14,
  }
)
