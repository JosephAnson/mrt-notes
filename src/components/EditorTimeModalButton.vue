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
    <Field label="Enter a time?" stacked>
      <Input v-model="time" placeholder="e.g. 10:00" />
    </Field>

    <footer>
      <Button class="mr-2" @click="modalActive = false">
        Cancel
      </Button>
      <Button @click="createTimeSnippet(time)">
        Done
      </Button>
    </footer>
  </Modal>
</template>
