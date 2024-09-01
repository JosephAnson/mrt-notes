export default cachedEventHandler(
  async () => {
    const expansions = await $fetch('/api/blizzard/expansion/all')

    const currentExpansion = expansions.sort((a, b) => a.key.id - b.key.id)[0]

    const raidInstances = await $fetch(`/api/blizzard/expansion/instances/${currentExpansion.id}`)
    const raids = await $fetch(`/api/blizzard/instance/${raidInstances.raids[raidInstances.raids.length - 1].id}`)
    const dungeonInstances = await $fetch(`/api/blizzard/expansion/instances/${currentExpansion.id}`)

    const currentRaid = raidInstances.raids[raidInstances.raids.length - 1]

    const currentInstance = await $fetch(`/api/blizzard/instance/${currentRaid.id}`)

    return {
      expansions,
      raids: raids.encounters,
      dungeons: dungeonInstances.dungeons,
      currentExpansion,
      currentRaid,
      currentInstance: currentInstance.encounters[0],
    }
  },
  {
    name: 'blizzard-latest-encounters',
    group: 'blizzard',
    maxAge: 60 * 60 * 24,
  },
)
