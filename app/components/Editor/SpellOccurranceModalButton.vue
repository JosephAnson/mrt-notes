<script lang="ts" setup>
import { toast } from 'vue-sonner'

const emits = defineEmits(['input'])

const spellOccurrence = reactive({
  timeAfterSpellStarted: '00:10',
  occurrence: 1,
  spellId: 306111,
})

function createSpellOccurrenceSnippet() {
  const insertString = `{time:${spellOccurrence.timeAfterSpellStarted},SCS:${spellOccurrence.spellId}:${spellOccurrence.occurrence}}`

  toast.success(`Snippet entered is: ${insertString}`)

  emits('input', insertString)
}
</script>

<template>
  <BaseDialogDrawer @save="createSpellOccurrenceSnippet()">
    <template #trigger>
      <EditorToolbarButton>
        <slot />
      </EditorToolbarButton>
    </template>

    <SpellIdInput v-model="spellOccurrence.spellId" />

    <BaseField label="Enter the Time after spell cast? {00:10}" stacked>
      <BaseInput v-model="spellOccurrence.timeAfterSpellStarted" />
    </BaseField>

    <BaseField label="Enter the cast number?" stacked>
      <BaseInput v-model="spellOccurrence.occurrence" />
    </BaseField>
  </BaseDialogDrawer>
</template>
