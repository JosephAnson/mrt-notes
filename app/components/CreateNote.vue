<script setup lang="ts">
import { toast } from 'vue-sonner'

const router = useRouter()
const noteName = ref('')

async function createNote(name: string) {
  if (!name && name.length <= 0) return toast.warning('Please enter a name')

  const { data } = await $fetch('/api/notes/create', {
    query: {
      name,
    },
  })

  if (data) await router.push(`/note/edit/${data.id}`)
}
</script>

<template>
  <Heading h3>
    Create New Note
  </Heading>
  <form class="flex gap-4" @submit.prevent="createNote(noteName)">
    <BaseField sr-only label="Enter name for note" class="w-full" label-for="create-note">
      <BaseInput v-model="noteName" placeholder="Enter name for note" />
    </BaseField>
    <BaseButton type="submit">
      Create note
    </BaseButton>
  </form>
</template>
