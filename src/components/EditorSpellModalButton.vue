<script lang="ts" setup>
const emits = defineEmits(['input'])

const modalActive = ref(false)
const spellID = ref('')

function createSpellSnippet(value: String) {
  openSnackbar(`Spell entered is: ${value}`)
  const insertString = `{spell:${value}}`

  emits('input', insertString)

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
