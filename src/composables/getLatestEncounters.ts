export async function getLatestEncounters() {
  const expansions = await $fetch('/api/blizzard/expansion/all')

  const raidInstances = await $fetch(`/api/blizzard/expansion/instances/${expansions[1].id}`)
  const raids = await $fetch(`/api/blizzard/instance/${raidInstances.raids[raidInstances.raids.length - 1].id}`)

  const dungeonInstances = await $fetch(`/api/blizzard/expansion/instances/${expansions[0].id}`)

  return { raids: raids.encounters.map(i => i.name), dungeons: dungeonInstances.dungeons.map(i => i.name) }
}
