<script setup>
const { data: expansions } = await useFetch('/api/blizzard/expansion/all')
const { data: expansionInstances } = await useFetch(
  '/api/blizzard/expansion/instances/503',
  {
    pick: ['dungeons', 'raids'],
  }
)
const { data: instance } = await useFetch('/api/blizzard/instance/1200')
const { data: spellData } = await useFetch(
  '/api/blizzard/encounter/spells/2500'
)
</script>

<template>
  <Section>
    <Container class="text-xs">
      <Heading>{{ spellData.name }} Spells - 2500</Heading>
      <div v-for="spell in spellData.spells" :key="spell.id" class="flex">
        {{ spell.name }}
        <SpellImage v-model="spell.id"></SpellImage>
      </div>
      <hr />
      <Heading>Encounters - instance(1200)</Heading>
      <pre>{{
        instance.encounters.map((expansion) => ({
          id: expansion.id,
          name: expansion.name,
        }))
      }}</pre>
      <hr />
      <Heading>Expansion Instances (503)</Heading>
      <Heading h4>Raids</Heading>
      <pre>{{
        expansionInstances.raids.map((expansion) => ({
          id: expansion.id,
          name: expansion.name,
        }))
      }}</pre>
      <hr />
      <Heading h4>Dungeons</Heading>
      <pre>{{
        expansionInstances.dungeons.map((expansion) => ({
          id: expansion.id,
          name: expansion.name,
        }))
      }}</pre>
      <hr />
      <Heading>Expansions</Heading>
      <pre>{{
        expansions.map((expansion) => ({
          id: expansion.id,
          name: expansion.name,
        }))
      }}</pre>
    </Container>
  </Section>
</template>
