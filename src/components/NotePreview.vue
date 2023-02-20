<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'
import { createERTGroupString, createERTString } from '~/utils/createErtString'
import type { Group } from '~/types'

const props = defineProps({
  noteString: { type: String, default: '' },
  noteJson: Object as PropType<JSONContent>,
  groups: { type: Array as PropType<Group[]>, required: true },
})

const { copy, isSupported } = useClipboard()

function copyToClipboard(string: string) {
  copy(string)
  SnackbarProgrammatic.open({
    message: 'Copied to clipboard!',
    background: 'bg-gray-900',
  })
}

const preview = computed(() => {
  let preview = `${props.noteString}\n`

  for (const group of props.groups) preview += group.note.value

  return preview
})

const ertString = computed(() => {
  let ERTNote = createERTString(props.noteJson)

  for (const group of props.groups) ERTNote += createERTGroupString(group)

  return ERTNote
})
</script>

<template>
  <div class="flex justify-between mb-4">
    <Heading h3> String Preview </Heading>

    <Button v-if="isSupported" @click="copyToClipboard(ertString)">
      Copy ERT String
    </Button>
  </div>
  <div
    class="preview bg-white p-4 color-black text-sm mb-4 h-64 overflow-y-scroll break-all"
  >
    <pre v-html="ertString" />
  </div>
  <Heading h3> Preview </Heading>
  <div class="preview bg-white p-4 color-black text-sm h-64 overflow-y-scroll">
    <pre class="whitespace-normal break-all" v-html="preview" />
  </div>
</template>

<style scoped lang="scss">
.preview {
  :deep(img) {
    display: inline-block;
  }
}
</style>
