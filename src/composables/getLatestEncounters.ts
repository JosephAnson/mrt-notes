export async function getLatestEncounters() {
  const expansions = await $fetch('/api/blizzard/expansion/all')
  const expansionInstances = await $fetch(`/api/blizzard/expansion/instances/${expansions[expansions.length - 1].id}`)
  const instance = await $fetch(
    `/api/blizzard/instance/${expansionInstances.raids[expansionInstances.raids.length - 1].id}`
  )
  return instance.encounters.map((i) => i.name)
}
