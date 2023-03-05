<script lang="ts" setup>
import SpellInformation from '~/components/SpellInformation.vue'
import type { SpellIdInformation } from '~/types'

const props = defineProps({
  modelValue: [String, Number],
})

const emit = defineEmits(['update:modelValue', 'spellIDInformation'])

const spellIDInformationUrl = computed(() => `/api/spell/${props.modelValue}`)

const { data: spellIDInformation } = useFetch<SpellIdInformation>(
  spellIDInformationUrl,
  { key: `SpellIdInput${props.modelValue}` }
)

const modelValue = useVModel(props, 'modelValue', emit)

watch(spellIDInformation, () => emit('spellIDInformation', spellIDInformation))
</script>

<template>
  <SpellInformation
    v-if="spellIDInformation && props.modelValue"
    :icon="spellIDInformation.icon"
    :tooltip="spellIDInformation.tooltip"
  />
  <Field label="Enter a spell id?" stacked>
    <Input v-model="modelValue" placeholder="Add in a spell id" />
  </Field>
</template>
