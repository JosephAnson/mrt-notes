<script lang="ts" setup>
import SpellInformation from '~/components/SpellInformation.vue'
import type { SpellIdInformation } from '~/types'
import { SPELL_INFO_BASE_URL } from '~/utils/constants'

const props = defineProps({
  modelValue: [String, Number],
})

const emit = defineEmits(['update:modelValue', 'spellIDInformation'])

const spellIDInformationUrl = computed(
  () => `${SPELL_INFO_BASE_URL}${props.modelValue}`
)

const { data: spellIDInformation } = useFetch<SpellIdInformation>(
  spellIDInformationUrl
)

const modelValue = useVModel(props, 'modelValue', emit)

watch(spellIDInformation, () => emit('spellIDInformation', spellIDInformation))
</script>

<template>
  <SpellInformation
    v-if="spellIDInformation"
    :icon="spellIDInformation.icon"
    :tooltip="spellIDInformation.tooltip"
  />
  <Field label="Enter a spell id?" stacked>
    <Input v-model="modelValue" placeholder="Add in a spell id" />
  </Field>
</template>
