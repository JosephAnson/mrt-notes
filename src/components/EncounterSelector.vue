<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    expansion: number
    instance: number
    encounter: number
  }>(),
  {
    expansion: 503,
    instance: 1200,
    encounter: 2480,
  }
)
const emits = defineEmits(['update:expansion', 'update:instance', 'update:encounter'])

const { expansion: expansionSelect, instance: instanceSelect, encounter: encounterSelect } = useVModels(props, emits)

const { data: expansions } = await useFetch('/api/blizzard/expansion/all', {
  onResponse({ response }) {
    expansionSelect.value = response._data.at(-1).id
    return response._data
  },
})

const isMPlusDungeons = computed(() => expansionSelect.value === 505)

const instancesUrl = computed(() => `/api/blizzard/expansion/instances/${expansionSelect.value}`)
const { data: expansionInstances } = await useFetch(instancesUrl, {
  pick: ['dungeons', 'raids'],
  onResponse({ response }) {
    if (isMPlusDungeons.value) {
      instanceSelect.value = response._data.dungeons[0].id
    } else {
      instanceSelect.value = response._data.raids.at(-1).id
    }
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
</script>

<template>
  <Field label="Expansions" stacked>
    <Select v-model:value="expansionSelect">
      <option v-for="expansion in expansions" :key="expansion.id" :value="expansion.id">
        {{ expansion.name }}
      </option>
    </Select>
  </Field>

  <Field
    v-if="expansionInstances && expansionInstances?.raids && expansionInstances.dungeons"
    label="Instances"
    stacked
  >
    <Select v-model:value="instanceSelect">
      <template v-if="!isMPlusDungeons">
        <optgroup label="raids">Raids</optgroup>
        <option v-for="expansion in expansionInstances.raids" :key="expansion.id" :value="expansion.id">
          {{ expansion.name }}
        </option>
      </template>
      <optgroup label="dungeons">Dungeons</optgroup>
      <option v-for="expansion in expansionInstances.dungeons" :key="expansion.id" :value="expansion.id">
        {{ expansion.name }}
      </option>
    </Select>
  </Field>

  <Field label="Encounters" stacked>
    <Select v-model:value="encounterSelect">
      <option v-for="encounter in instance.encounters" :key="encounter.id" :value="encounter.id">
        {{ encounter.name }}
      </option>
    </Select>
  </Field>
</template>
