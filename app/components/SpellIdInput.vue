<script lang="ts" setup>
import type { SpellIdInformation } from '~/types'
import SpellInformation from '~/components/SpellInformation.vue'

const props = defineProps({
  modelValue: [String, Number],
})

const emit = defineEmits(['update:modelValue', 'spellIDInformation'])

const spellIDInformationUrl = computed(() => `/api/spell/${props.modelValue}`)

const { data: spellIDInformation } = useFetch<SpellIdInformation>(spellIDInformationUrl, {
  key: `SpellIdInput${props.modelValue}`,
})

const modelValue = useVModel(props, 'modelValue', emit)

watch(spellIDInformation, () => emit('spellIDInformation', spellIDInformation))
</script>

<template>
  <SpellInformation
    v-if="spellIDInformation && props.modelValue"
    :icon="spellIDInformation.icon"
    :tooltip="spellIDInformation.tooltip"
    fixed
  />
  <BaseField label="Enter a spell id?">
    <BaseInput v-model="modelValue" placeholder="Add in a spell id" />
  </BaseField>
</template>
