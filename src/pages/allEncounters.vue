<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse'
import type { ExpansionList } from '~/server/api/blizzard/expansion/encounters/all'

const { data: expansions } = await useFetch<ExpansionList>('/api/blizzard/expansion/encounters/all')

const input = ref('')
const { results } = useFuse(input, expansions.value, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: [
      'instances.raids.name',
      'instances.dungeons.name',
      'instances.raids.encounters.name',
      'instances.dungeons.encounters.name',
    ],
  },
})

const resultsItem = computed(() => results.value.map((i) => i.item))
</script>

<template>
  <Section>
    <Container>
      <div class="flex justify-between mb-8">
        <Heading h1 class="!mb-0"> Search Expansion</Heading>
        <Field label="Search" class="w-128">
          <Input v-model="input" placeholder="Search for an encounter" />
        </Field>
      </div>

      <div class="grid grid-cols-2 gap-12">
        <div>
          <Heading h2> Raids </Heading>

          <div v-for="expansion in resultsItem" :key="expansion.id" class="mb-12">
            <div class="mb-8">
              <Heading h3> {{ expansion.name }} Raids </Heading>
              <div v-for="raid in expansion.instances.raids" :key="raid.id" class="mb-4">
                <Heading h4> {{ raid.name }}</Heading>

                <div class="flex flex-wrap gap-2 mb-2">
                  <Button v-for="instance in raid.encounters" :key="instance.id" :to="`/search?q=${instance.name}`">
                    {{ instance.name }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Heading h2> Dungeons</Heading>

          <div v-for="expansion in resultsItem" :key="expansion.id" class="mb-12">
            <div class="mb-8">
              <Heading h3> {{ expansion.name }} Dungeons </Heading>
              <div v-for="raid in expansion.instances.dungeons" :key="raid.id" class="mb-4">
                <Heading h4> {{ raid.name }}</Heading>

                <div class="flex flex-wrap gap-2 mb-2">
                  <Button v-for="instance in raid.encounters" :key="instance.id" :to="`/search?q=${instance.name}`">
                    {{ instance.name }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>
