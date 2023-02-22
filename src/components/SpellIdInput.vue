<script lang="ts" setup>
import SpellInformation from '~/components/SpellInformation.vue'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const spellIDInformationUrl = computed(
  () =>
    `https://nether.wowhead.com/tooltip/spell/${props.modelValue}?dataEnv=1&locale=0`
)

const { data: spellIDInformation } = useFetch(spellIDInformationUrl)

const modelValue = useVModel(props, 'modelValue', emit)
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
