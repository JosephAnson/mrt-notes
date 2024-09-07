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
    <BaseField label="Expansions" stacked>
      <BaseSelect v-model="expansionSelect">
        <BaseSelectTrigger>
          <BaseSelectValue placeholder="Select an expansion" />
        </BaseSelectTrigger>
        <BaseSelectContent>
          <BaseSelectGroup>
            <BaseSelectItem v-for="expansionItem in expansions" :key="expansionItem.id" :value="expansionItem.id">
              {{ expansionItem.name }}
            </BaseSelectItem>
          </BaseSelectGroup>
        </BaseSelectContent>
      </BaseSelect>
    </BaseField>

    <div v-if="!expansionInstancesPending">
      <BaseField
        v-if="expansionSelect && expansionInstances && expansionInstances?.raids && expansionInstances.dungeons"
        label="Instances"
        stacked
      >
        <BaseSelect v-model="instanceSelect">
          <BaseSelectTrigger>
            <BaseSelectValue placeholder="Select an instance" />
          </BaseSelectTrigger>
          <BaseSelectContent>
            <template v-if="!isMPlusDungeons">
              <BaseSelectGroup>
                <SelectLabel label="Raids">
                  Raids
                </SelectLabel>
                <BaseSelectItem
                  v-for="expansionInstance in expansionInstances.raids"
                  :key="expansionInstance.id"
                  :value="expansionInstance.id"
                >
                  {{ expansionInstance.name }}
                </BaseSelectItem>
              </BaseSelectGroup>
            </template>
            <BaseSelectGroup>
              <SelectLabel label="Dungeons">
                Dungeons
              </SelectLabel>
              <BaseSelectItem
                v-for="expansionInstance in expansionInstances.dungeons"
                :key="expansionInstance.id"
                :value="expansionInstance.id"
              >
                {{ expansionInstance.name }}
              </BaseSelectItem>
            </BaseSelectGroup>
          </BaseSelectContent>
        </BaseSelect>
      </BaseField>

      <div v-if="!instancePending">
        <BaseField v-if="instanceSelect && instance?.encounters" label="Encounters" stacked>
          <BaseSelect v-model="encounterSelect">
            <BaseSelectTrigger>
              <BaseSelectValue placeholder="Select an encounter" />
            </BaseSelectTrigger>
            <BaseSelectContent>
              <BaseSelectItem
                v-for="instanceEncounter in instance.encounters"
                :key="instanceEncounter.id"
                :value="instanceEncounter.id"
              >
                {{ instanceEncounter.name }}
              </BaseSelectItem>
            </BaseSelectContent>
          </BaseSelect>
        </BaseField>
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
