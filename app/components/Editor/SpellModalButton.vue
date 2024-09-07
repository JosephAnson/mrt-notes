<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { SpellIdInformation } from '~/types'
import { createEditorSpellIdImageData } from '~/utils/editor'

const emits = defineEmits(['input'])

const modalActive = ref(false)
const spellID = ref('')

async function createSpellSnippet(spellId: string) {
  if (!spellId) {
    toast.warning('Enter a Spell ID!')
  }
  else {
    toast.success(`Spell entered is: ${spellId}`)

    const { icon } = await $fetch<SpellIdInformation>(`/api/spell/${spellId}`)

    emits('input', createEditorSpellIdImageData(icon, spellId))

    modalActive.value = false
  }
}
</script>

<template>
  <EditorToolbarButton href="#" @click.stop="modalActive = true">
    <slot />
  </EditorToolbarButton>

  <Modal v-model:active="modalActive">
    <SpellIdInput v-model="spellID" />

    <footer>
      <BaseButton class="mr-2" @click="modalActive = false">
        Cancel
      </BaseButton>
      <BaseButton :disabled="!spellID" @click="createSpellSnippet(spellID)">
        Done
      </BaseButton>
    </footer>
  </Modal>
</template>
