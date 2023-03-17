<script setup>
const expansionSelect = ref(503)
const instanceSelect = ref(1200)
const encounterSelect = ref(2480)

const { data: expansions } = await useFetch('/api/blizzard/expansion/all', {
  onResponse({ response }) {
    expansionSelect.value = response._data.at(-1).id
    return response._data
  },
})

const instancesUrl = computed(() => `/api/blizzard/expansion/instances/${expansionSelect.value}`)
const { data: expansionInstances } = await useFetch(instancesUrl, {
  pick: ['dungeons', 'raids'],
  onResponse({ response }) {
    instanceSelect.value = response._data.raids.at(-1).id
    return response._data
  },
})

const instanceUrl = computed(() => `/api/blizzard/instance/${instanceSelect.value}`)
const { data: instance } = await useFetch(instanceUrl, {
  onResponse({ response }) {
    encounterSelect.value = response._data.encounters[0].id
    return response._data
  },
})

const encounterUrl = computed(() => `/api/blizzard/encounter/spells/${encounterSelect.value}`)
const { data: spellData } = await useFetch(encounterUrl)
</script>

<template>
  <Section>
    <Container class="text-xs">
      <Heading>Expansions</Heading>
      <Select v-model:value="expansionSelect">
        <option v-for="expansion in expansions" :key="expansion.id" :value="expansion.id">{{ expansion.name }}</option>
      </Select>
      <hr />

      <div v-if="expansionInstances && expansionInstances?.raids && expansionInstances.dungeons">
        <Heading>Expansion Instances ({{ expansionSelect }})</Heading>

        <Select v-model:value="instanceSelect">
          <optgroup label="raids">Raids</optgroup>
          <option v-for="expansion in expansionInstances.raids" :key="expansion.id" :value="expansion.id">
            {{ expansion.name }}
          </option>
          <optgroup label="dungeons">Dungeons</optgroup>
          <option v-for="expansion in expansionInstances.dungeons" :key="expansion.id" :value="expansion.id">
            {{ expansion.name }}
          </option>
        </Select>
        <hr />
      </div>

      <Heading>Encounters - instance({{ instanceSelect }})</Heading>
      <Select v-model:value="encounterSelect">
        <option v-for="encounter in instance.encounters" :key="encounter.id" :value="encounter.id">
          {{ encounter.name }}
        </option>
      </Select>

      <hr />

      <Heading>{{ spellData.name }} Spells - {{ encounterSelect }}</Heading>
      <div v-for="spell in spellData.spells" :key="spell.id" class="flex">
        {{ spell.name }}
        <SpellImage v-model="spell.id"></SpellImage>
      </div>
    </Container>
  </Section>
</template>
