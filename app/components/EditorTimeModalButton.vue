<script lang="ts" setup>
const emits = defineEmits(['input'])

const modalActive = ref(false)
const time = ref('')

function createTimeSnippet(value: string) {
  openSnackbar(`Time entered is: ${value}`)

  emits('input', `{time:${value}}`)

  time.value = ''
  modalActive.value = false
}
</script>

<template>
  <a class="mr-2" href="#" @click="modalActive = true">
    <slot />
  </a>

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
