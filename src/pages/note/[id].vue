<script lang="ts" setup>
import { useSupabaseUser } from '#imports'
import type { EditorData } from '~/types'

const route = useRoute()
const groups = useGroups()

const { data: note } = await useAsyncData('notes', async () => {
  const { data } = await getNote(getRouterParamsAsString(route.params.id))
  return data
})

const editor = reactive<EditorData>({
  value: note.value?.editor_string || '',
  json: {},
})

const user = useSupabaseUser()
const noteIsUsers = computed(
  () => user.value && note.value && user.value.id === note.value.user_id
)
</script>

<template>
  <Page>
    <Container>
      <div class="flex justify-between mb-4">
        <Heading h1> Mrt Notes </Heading>

        <nuxt-link
          v-if="noteIsUsers"
          :to="`/note/edit/${route.params.id}`"
          class="flex"
        >
          <Button class="bg-red-700 flex-shrink-0"> Edit Note </Button>
        </nuxt-link>
      </div>

      <section>
        <Editor
          v-model="editor.value"
          class="hidden"
          @update:json="editor.json = $event"
        />
        <NotePreview
          :note-json="editor.json"
          :note-string="editor.value"
          :groups="groups"
        />
      </section>
    </Container>
  </Page>
</template>
