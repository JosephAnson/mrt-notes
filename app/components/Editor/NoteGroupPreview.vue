<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'
import { toast } from 'vue-sonner'
import { createMRTGroupString, createMRTString, createPreviewString } from '~/utils/createMRTString'

const props = defineProps({
  noteId: { type: Number },
  noteString: { type: String, default: '' },
  noteJson: Object as PropType<JSONContent>,
})

// TODO: renable groups once they're fixed
// const { data: groups } = await useFetch('/api/groups/all', { key: 'groups-all', query: { noteId: props.noteId }, deep: false, watch: [() => props.noteId] })
const groups = ref([])
const { copy, isSupported } = useClipboard()

function copyToClipboard(string: string) {
  copy(string)
  toast.success('Copied to clipboard!')
}

const preview = computed(() => {
  let preview = `${createPreviewString(props.noteString)}\n`

  if (groups.value) {
    for (const group of groups.value) {
      preview += createPreviewString(group.note.value)
    }
  }

  return preview
})

const mrtString = computed(() => {
  let MRTNote = createMRTString(props.noteJson)

  if (groups.value) {
    for (const group of groups.value) {
      MRTNote += createMRTGroupString(group)
    }
  }

  return MRTNote
})
</script>

<template>
  <div>
    <BaseCard class="overflow-hidden">
      <BaseCardHeader>
        Preview
      </BaseCardHeader>
      <div class="relative preview p-4 text-xs min-h-60">
        <div
          class="absolute top-0 left-0 w-full h-full !bg-cover !bg-center z-1 grayscale !bg-no-repeat opacity-70"
          :style="{ background: 'url(/wow-background.jpeg)' }"
        />
        <pre class="whitespace-normal break-all z-2 relative" v-html="preview" />
      </div>
    </BaseCard>

    <BaseCard class="mb-4 overflow-hidden">
      <BaseCardHeader>
        <div class="flex justify-between items-center gap-4">
          <div>
            MRT String
          </div>
          <BaseButton v-if="isSupported" class="my-[-1rem]" @click="copyToClipboard(mrtString)">
            Copy MRT String
          </BaseButton>
        </div>
      </BaseCardHeader>
      <div class="preview bg-white p-4 text-black h-40 overflow-y-scroll break-all text-xs">
        <pre v-html="mrtString" />
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.preview {
  :deep(img) {
    display: inline-block;
  }
}
</style>
