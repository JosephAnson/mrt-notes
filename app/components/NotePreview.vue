<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'
import { toast } from 'vue-sonner'
import { createMRTGroupString, createMRTString, createPreviewString } from '~/utils/createMRTString'

const props = defineProps({
  noteString: { type: String, default: '' },
  noteJson: Object as PropType<JSONContent>,
})

const groupsStore = useGroupsStore()
const { copy, isSupported } = useClipboard()

function copyToClipboard(string: string) {
  copy(string)
  toast.success('Copied to clipboard!')
}

const preview = computed(() => {
  let preview = `${createPreviewString(props.noteString)}\n`

  for (const group of groupsStore.groups) preview += createPreviewString(group.note.value)

  return preview
})

const mrtString = computed(() => {
  let MRTNote = createMRTString(props.noteJson)

  for (const group of groupsStore.groups) MRTNote += createMRTGroupString(group)

  return MRTNote
})
</script>

<template>
  <BaseCard class="mb-4">
    <BaseCardHeader>
      <div class="flex justify-between items-center">
        <div>
          MRT String
        </div>
        <BaseButton v-if="isSupported" class="my-[-1rem]" @click="copyToClipboard(mrtString)">
          Copy MRT String
        </BaseButton>
      </div>
    </BaseCardHeader>
    <div class="preview bg-white p-4 text-black h-64 overflow-y-scroll break-all text-xs">
      <pre v-html="mrtString" />
    </div>
  </BaseCard>

  <BaseCard>
    <BaseCardHeader>
      Preview
    </BaseCardHeader>
    <div class="relative preview p-4 text-xs">
      <div
        class="absolute top-0 left-0 w-full h-full !bg-cover !bg-center z-1 grayscale !bg-no-repeat opacity-70"
        :style="{ background: 'url(/wow-background.jpeg)' }"
      />
      <pre class="whitespace-normal break-all z-2 relative" v-html="preview" />
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
.preview {
  :deep(img) {
    display: inline-block;
  }
}
</style>
