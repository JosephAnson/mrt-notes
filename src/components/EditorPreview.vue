<script setup lang="ts">
import clipboard from 'copy-to-clipboard'
import type { JSONContent } from '@tiptap/vue-3'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'
import { createERTGroupString, createERTString } from '~/utils/createErtString'
import type { Group } from '~/types'

const props = defineProps({
  editorString: String,
  editorJson: Object as PropType<JSONContent>,
  groups: { type: Array as PropType<Group[]>, required: true },
})

function copyToClipboard(string: string) {
  clipboard(string)
  SnackbarProgrammatic.open({
    message: 'Copied to clipboard!',
    type: 'is-primary',
  })
}

const preview = computed(() => {
  let preview = `${props.editorString}\n`

  for (const group of props.groups)
    preview += group.editor.value

  return preview
})

const ertString = computed(() => {
  let ERTNote = createERTString(props.editorJson)

  for (const group of props.groups)
    ERTNote += createERTGroupString(group)

  return ERTNote
})
</script>

<template>
  <div class="level">
    <div class="level-left">
      <h3 class="title is-4">
        String Preview
      </h3>
    </div>
    <div class="level-right">
      <div class="buttons">
        <Button type="is-primary" @click="copyToClipboard(ertString)">
          Copy ERT String
        </Button>
      </div>
    </div>
  </div>
  <div class="preview is-sticky">
    <pre class="box is-white" v-html="ertString" />
  </div>
  <div class="level">
    <div class="level-left">
      <h3 class="title is-4">
        Preview
      </h3>
    </div>
  </div>
  <div class="preview is-sticky">
    <pre class="box is-white" v-html="preview" />
  </div>
</template>
