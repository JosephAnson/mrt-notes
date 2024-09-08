<script lang="ts" setup>
import { toast } from 'vue-sonner'

const emits = defineEmits(['input'])

const time = ref('')

function createTimeSnippet(value: string) {
  toast.success(`Time entered is: ${value}`)

  emits('input', `{time:${value}}`)

  time.value = ''
}
</script>

<template>
  <BaseDialogDrawer @save="createTimeSnippet(time)">
    <template #trigger>
      <EditorToolbarButton>
        <slot />
      </EditorToolbarButton>
    </template>

    <BaseField label="Enter a time?" stacked>
      <BaseInput v-model="time" placeholder="e.g. 10:00" />
    </BaseField>
  </BaseDialogDrawer>
</template>
