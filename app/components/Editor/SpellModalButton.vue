<script lang="ts" setup>
import type { SpellIdInformation } from '~/types'
import { toast } from 'vue-sonner'
import { createEditorSpellIdImageData } from '~/utils/editor'

const emits = defineEmits(['input'])

const spellID = ref('')

async function createSpellSnippet(spellId: string) {
  if (!spellId) {
    toast.warning('Enter a Spell ID!')
  }
  else {
    toast.success(`Spell entered is: ${spellId}`)

    const { icon } = await $fetch<SpellIdInformation>(`/api/spell/${spellId}`)

    emits('input', createEditorSpellIdImageData(icon, spellId))
  }
}
</script>

<template>
  <BaseDialogDrawer @save="createSpellSnippet(spellID)">
    <template #trigger>
      <EditorToolbarButton>
        <slot />
      </EditorToolbarButton>
    </template>

    <SpellIdInput v-model="spellID" />
  </BaseDialogDrawer>
</template>
