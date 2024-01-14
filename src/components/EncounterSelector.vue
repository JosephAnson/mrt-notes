<script lang="ts" setup>
const props = defineProps<{
  expansion: number
  instance: number
  encounter: number
}>()

const emits = defineEmits(['update:expansion', 'update:instance', 'update:encounter'])

const { expansion: expansionSelect, instance: instanceSelect, encounter: encounterSelect } = useVModels(props, emits)

const { data: expansions } = await useFetch('/api/blizzard/expansion/all')
const { data: expansionInstances, pending: expansionInstancesPending } = await useFetch(() => `/api/blizzard/expansion/instances/${expansionSelect.value}`)
const { data: instance, pending: instancePending } = await useFetch(() => `/api/blizzard/instance/${instanceSelect.value}`)

const isMPlusDungeons = computed(() => expansionSelect.value === 505)

watch(expansionInstances, (newExpansionInstances) => {
  if (newExpansionInstances)
    instanceSelect.value = newExpansionInstances.raids[newExpansionInstances.raids.length - 1].id
})

watch(instance, (newInstance) => {
  if (newInstance) encounterSelect.value = newInstance.encounters[0].id
})
</script>

<template>
  <div class="mb-4">
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
            <optgroup label="Raids">
              Raids
            </optgroup>
            <option
              v-for="expansionInstance in expansionInstances.raids"
              :key="expansionInstance.id"
              :value="expansionInstance.id"
            >
              {{ expansionInstance.name }}
            </option>
          </template>
          <optgroup label="Dungeons">
            Dungeons
          </optgroup>
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
  </div>
</template>
