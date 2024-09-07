<script lang="ts" setup>
import { toast } from 'vue-sonner'

const emits = defineEmits(['input'])

const modalActive = ref(false)
const time = ref('')

function createTimeSnippet(value: string) {
  toast.success(`Time entered is: ${value}`)

  emits('input', `{time:${value}}`)

  time.value = ''
  modalActive.value = false
}
</script>

<template>
  <EditorToolbarButton href="#" @click="modalActive = true">
    <slot />
  </EditorToolbarButton>

  <Modal v-model:active="modalActive">
    <BaseField label="Enter a time?" stacked>
      <BaseInput v-model="time" placeholder="e.g. 10:00" />
    </BaseField>

    <footer>
      <BaseButton class="mr-2" @click="modalActive = false">
        Cancel
      </BaseButton>
      <BaseButton @click="createTimeSnippet(time)">
        Done
      </BaseButton>
    </footer>
  </Modal>
</template>
