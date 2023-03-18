<script lang="ts" setup>
import Loading from '~/components/Loading.vue'

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

const { data: expansionInstances, pending: expansionInstancesPending } = await useFetch(
  () => `/api/blizzard/expansion/instances/${expansionSelect.value}`,
  {
    pick: ['dungeons', 'raids'],
    onResponse({ response }) {
      if (isMPlusDungeons.value) {
        instanceSelect.value = response._data.dungeons[0].id
      } else {
        instanceSelect.value = response._data.raids.at(-1).id
      }
      return response._data
    },
  }
)

const { data: instance, pending: instancePending } = await useFetch(
  () => `/api/blizzard/instance/${instanceSelect.value}`,
  {
    onResponse({ response }) {
      encounterSelect.value = response._data.encounters[0].id
      return response._data
    },
  }
)
</script>

<template>
  <Field label="Expansions" stacked>
    <Select v-model:value="expansionSelect">
      <option v-for="expansionItem in expansions" :key="expansionItem.id" :value="expansionItem.id">
        {{ expansionItem.name }}
      </option>
    </Select>
  </Field>

  <div v-if="!expansionInstancesPending">
    <Field
      v-if="expansionSelect && expansionInstances && expansionInstances?.raids && expansionInstances.dungeons"
      label="Instances"
      stacked
    >
      <Select v-model:value="instanceSelect">
        <template v-if="!isMPlusDungeons">
          <optgroup label="raids">Raids</optgroup>
          <option
            v-for="expansionInstance in expansionInstances.raids"
            :key="expansionInstance.id"
            :value="expansionInstance.id"
          >
            {{ expansionInstance.name }}
          </option>
        </template>
        <optgroup label="dungeons">Dungeons</optgroup>
        <option
          v-for="expansionInstance in expansionInstances.dungeons"
          :key="expansionInstance.id"
          :value="expansionInstance.id"
        >
          {{ expansionInstance.name }}
        </option>
      </Select>
    </Field>

    <div v-if="!instancePending">
      <Field v-if="instanceSelect && instance?.encounters" label="Encounters" stacked>
        <Select v-model:value="encounterSelect">
          <option
            v-for="instanceEncounter in instance.encounters"
            :key="instanceEncounter.id"
            :value="instanceEncounter.id"
          >
            {{ instanceEncounter.name }}
          </option>
        </Select>
      </Field>
    </div>
    <div v-else>
      <Loading>Loading Encounters</Loading>
    </div>
  </div>
  <div v-else>
    <Loading>Loading Instances</Loading>
  </div>
</template>