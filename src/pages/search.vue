<script setup lang="ts">
import type { Node } from '~/types'
import { flattenedNoteCategories } from '~/utils/constants'

const route = useRoute()
const router = useRouter()
const notes = useNotes()

const q = route.query?.q ? getRouterParamsAsString(route.query.q) : null
const categoryQuery = route.query?.categories
  ? getRouterParamsAsString(route.query.categories).split(',')
  : []

const selectedCategoryList = flattenedNoteCategories?.filter((category) =>
  categoryQuery.includes(category.id)
)

const { data: asyncNotes } = await useAsyncData('notes', async () =>
  q || categoryQuery
    ? await searchAllNotes(q || '', categoryQuery)
    : await getAllNotes()
)
if (asyncNotes.value) setNotes(asyncNotes.value)

const search = ref(q || '')
const categories = ref<Node[]>(selectedCategoryList)
const categoryIds = computed<string[]>(() =>
  categories.value.map((category) => category.id)
)

async function searchNotes() {
  if (search.value || categories.value.length) {
    router.push({
      name: 'search',
      query: {
        q: search.value,
        categories: categoryIds.value.join(','),
      },
    })

    setNotes(await searchAllNotes(search.value, categoryIds.value))
  } else {
    router.push({
      name: 'search',
    })

    setNotes(await getAllNotes())
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

      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
    </Container>
  </Section>
</template>
