<script setup lang="ts">
const router = useRouter()
const noteName = ref('')

async function createNote(name: string) {
  if (!name && name.length <= 0) return openSnackbar('Please enter a name')

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
  <form class="flex">
    <Field sr-only label="Enter name for note" class="w-full" label-for="create-note">
      <Input v-model="noteName" class="mr-2" placeholder="Enter name for note" />
    </Field>
    <Button tag="a" class="mr-2 flex-shrink-0" @click="createNote(noteName)">
      Create note
    </Button>
  </form>
</template>
