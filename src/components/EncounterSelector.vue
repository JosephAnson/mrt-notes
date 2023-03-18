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

const { data: expansions } = await useLazyFetch('/api/blizzard/expansion/all')

const isMPlusDungeons = computed(() => expansionSelect.value === 505)

const { data: expansionInstances, pending: expansionInstancesPending } = await useLazyFetch(
  () => `/api/blizzard/expansion/instances/${expansionSelect.value}`,
  {
    pick: ['dungeons', 'raids'],
  }
)

const { data: instance, pending: instancePending } = await useLazyFetch(
  () => `/api/blizzard/instance/${instanceSelect.value}`
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
