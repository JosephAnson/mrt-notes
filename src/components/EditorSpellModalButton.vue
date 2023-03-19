<script lang="ts" setup>
import type { SpellIdInformation } from '~/types'
import { createEditorSpellIdImageData } from '~/utils/editor'

const emits = defineEmits(['input'])

const modalActive = ref(false)
const spellID = ref('')

async function createSpellSnippet(spellId: string) {
  if (!spellId) {
    openSnackbar({ message: `Enter a Spell ID!`, background: 'bg-red-700' })
  } else {
    openSnackbar(`Spell entered is: ${spellId}`)

    const { icon } = await $fetch<SpellIdInformation>(`/api/spell/${spellId}`)

    emits('input', createEditorSpellIdImageData(icon, spellId))

    modalActive.value = false
  }
}
</script>

<template>
  <a class="mr-2" href="#" @click.stop="modalActive = true">
    <slot></slot>
  </a>

  <Modal v-model:active="modalActive">
    <SpellIdInput v-model="spellID" />

    <footer>
      <Button class="mr-2" @click="modalActive = false"> Cancel </Button>
      <Button :disabled="!spellID" @click="createSpellSnippet(spellID)"> Done </Button>
    </footer>
  </Modal>
</template>
