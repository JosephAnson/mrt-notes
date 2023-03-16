<script lang="ts" setup>
import type { SpellIdInformation } from '~/types'

const props = defineProps({
  modelValue: [String, Number],
})

const spellIDInformationUrl = computed(() => `/api/spell/${props.modelValue}`)

const { data: spellIDInformation } = useFetch<SpellIdInformation>(spellIDInformationUrl, {
  key: `spellImage: ${props.modelValue}`,
})
</script>

<template>
  <img
    v-if="spellIDInformation"
    :src="`https://wow.zamimg.com/images/wow/icons/medium/${spellIDInformation.icon}.jpg`"
    :alt="spellIDInformation.name"
  />
</template>
