<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'
import {
  createMRTGroupString,
  createMRTString,
  createPreviewString,
} from '~/utils/createMRTString'

const props = defineProps({
  noteString: { type: String, default: '' },
  noteJson: Object as PropType<JSONContent>,
})

const groups = useGroups()
const { copy, isSupported } = useClipboard()

function copyToClipboard(string: string) {
  copy(string)
  openSnackbar({
    message: 'Copied to clipboard!',
    background: 'bg-gray-900',
  })
}

const preview = computed(() => {
  let preview = `${createPreviewString(props.noteString)}\n`

  for (const group of groups.value)
    preview += createPreviewString(group.note.value)

  return preview
})

const mrtString = computed(() => {
  let MRTNote = createMRTString(props.noteJson)

  for (const group of groups.value) MRTNote += createMRTGroupString(group)

  return MRTNote
})
</script>

<template>
  <div class="flex justify-between mb-4">
    <Heading h3> MRT String </Heading>
    <Button v-if="isSupported" @click="copyToClipboard(mrtString)">
      Copy MRT String
    </Button>
  </div>
  <div
    class="preview bg-white p-4 color-black text-sm mb-4 h-64 overflow-y-scroll break-all text-xs"
  >
    <pre v-html="mrtString" />
  </div>
  <Heading h3> Preview </Heading>
  <div class="relative preview p-4 text-xs">
    <div
      class="absolute top-0 left-0 w-full h-full !bg-cover !bg-center z-1 grayscale !bg-no-repeat opacity-70"
      :style="{ background: 'url(/wow-background.jpeg)' }"
    ></div>
    <pre class="whitespace-normal break-all z-2 relative" v-html="preview" />
  </div>
</template>

<style scoped lang="scss">
.preview {
  :deep(img) {
    display: inline-block;
  }
}
</style>
