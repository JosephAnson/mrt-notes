<script setup lang="ts">
import type { Node } from '~/types'
import { flattenedNoteCategories } from '~/utils/constants'

const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const userStore = useUserStore()

const q = route.query?.q ? getRouterParamsAsString(route.query.q) : null
const categoryQuery = route.query?.categories ? getRouterParamsAsString(route.query.categories).split(',') : null

await useAsyncData('userFavourites', async () => await userStore.fetchUserFavourites(user.value?.id))
await useAsyncData('notes', async () => await notesStore.fetchSearchNotes(q || '', categoryQuery))

const selectedCategoryList = flattenedNoteCategories?.filter((category) => categoryQuery?.includes(category.id))

const search = ref(q || '')
const categories = ref<Node[]>(selectedCategoryList)
const categoryIds = computed<string[]>(() => categories.value.map((category) => category.id))

async function searchNotes() {
  if (search.value || categories.value.length) {
    router.push({
      name: 'search',
      query: {
        q: search.value,
        categories: categoryIds.value.join(','),
      },
    })

    await notesStore.fetchSearchNotes(search.value, categoryIds.value)
  }
}
</script>

<template>
  <Section>
    <Container>
      <form class="mb-10" @submit.prevent="searchNotes">
        <Heading h1>Find Notes</Heading>
        <Field label-for="search" label="Search" stacked>
          <Input id="search" v-model="search" type="search" />
        </Field>
        <NoteCategories v-model="categories" class="mb-4"></NoteCategories>
        <Button type="submit"> Search </Button>
      </form>

      <NoteItem v-for="note in notesStore.notes.search" :key="note.id" :note="note" />
    </Container>
  </Section>
</template>
