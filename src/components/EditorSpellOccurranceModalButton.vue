<script lang="ts" setup>
const emits = defineEmits(['input'])

const modalActive = ref(false)

const spellOccurrence = reactive({
  timeAfterSpellStarted: '00:10',
  occurrence: 1,
  spellId: 306111,
})

function createSpellOccurrenceSnippet() {
  const insertString = `{time:${spellOccurrence.timeAfterSpellStarted},SCS:${spellOccurrence.spellId}:${spellOccurrence.occurrence}}`

  openSnackbar(`Snippet entered is: ${insertString}`)

  emits('input', insertString)

  modalActive.value = false
}
</script>

<template>
  <a class="mr-2" href="#" @click="modalActive = true">
    <slot />
  </a>

  <Modal v-model:active="modalActive">
    <SpellIdInput v-model="spellOccurrence.spellId" />

    <Field label="Enter the Time after spell cast? {00:10}" stacked>
      <Input v-model="spellOccurrence.timeAfterSpellStarted" />
    </Field>

    <Field label="Enter the cast number?" stacked>
      <Input v-model="spellOccurrence.occurrence" />
    </Field>

    <footer>
      <Button class="mr-2" @click="modalActive = false">
        Cancel
      </Button>
      <Button @click="createSpellOccurrenceSnippet">
        Done
      </Button>
    </footer>
  </Modal>
</template>
