<script lang="ts" setup>
import type { SpellIdInformation } from '~/types'
import { SPELL_INFO_BASE_URL } from '~/utils/constants'
import { createEdtiorSpellIdImageData } from '~/utils/editor'

const emits = defineEmits(['input'])

const modalActive = ref(false)
const spellID = ref('')

async function createSpellSnippet(spellId: string) {
  openSnackbar(`Spell entered is: ${spellId}`)

  const { icon } = await $fetch<SpellIdInformation>(
    SPELL_INFO_BASE_URL + spellId
  )

  emits('input', createEdtiorSpellIdImageData(icon, spellId))

  modalActive.value = false
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
      <Button @click="createSpellSnippet(spellID)"> Done </Button>
    </footer>
  </Modal>
</template>
