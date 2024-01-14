export default cachedEventHandler(
  async () => {
    const expansions = await $fetch('/api/blizzard/expansion/all')

    const raidInstances = await $fetch(`/api/blizzard/expansion/instances/${expansions[1].id}`)
    const raids = await $fetch(`/api/blizzard/instance/${raidInstances.raids[raidInstances.raids.length - 1].id}`)

    const dungeonInstances = await $fetch(`/api/blizzard/expansion/instances/${expansions[0].id}`)

    const currentRaid = raidInstances.raids[raidInstances.raids.length - 1]

    const currentInstance = await $fetch(`/api/blizzard/instance/${currentRaid.id}`)

    return {
      expansions,
      raids: raids.encounters,
      dungeons: dungeonInstances.dungeons,
      currentExpansion: expansions.filter(expansion => expansion.id !== 505)[0],
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
