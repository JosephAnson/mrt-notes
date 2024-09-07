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

    <BaseField label="Enter the Time after spell cast? {00:10}" stacked>
      <BaseInput v-model="spellOccurrence.timeAfterSpellStarted" />
    </BaseField>

    <BaseField label="Enter the cast number?" stacked>
      <BaseInput v-model="spellOccurrence.occurrence" />
    </BaseField>

    <footer>
      <BaseButton class="mr-2" @click="modalActive = false">
        Cancel
      </BaseButton>
      <BaseButton @click="createSpellOccurrenceSnippet">
        Done
      </BaseButton>
    </footer>
  </Modal>
</template>
