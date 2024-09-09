<script setup lang="ts">
import { useFuse } from '@vueuse/integrations/useFuse'
import type { ExpansionList } from '~/server/api/blizzard/encounter/all'

const { data: expansions } = await useFetch<ExpansionList>('/api/blizzard/encounter/all')

const input = ref('')
const { results } = useFuse(input, expansions.value, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: [
      'name',
      'instances.raids.name',
      'instances.dungeons.name',
      'instances.raids.encounters.name',
      'instances.dungeons.encounters.name',
    ],
  },
})

const resultsItem = computed(() => results.value.map(i => i.item))
</script>

<template>
  <BaseSection>
    <BaseContainer>
      <div class="flex justify-between mb-8">
        <BaseHeading h1 class="!mb-0">
          Search Expansion
        </BaseHeading>
        <BaseField label="Search" class="w-128" label-for="encounter-search">
          <BaseInput v-model="input" placeholder="Search for an encounter" />
        </BaseField>
      </div>

      <div class="md:grid grid-cols-2 gap-12">
        <div>
          <BaseHeading h2>
            Raids
          </BaseHeading>

          <div v-for="(expansion, index) in resultsItem" :key="expansion.id" class="mb-12">
            <Ad v-if="index === 1" ad-slot="5501746994" ad-format="fluid" ad-layout-key="-fv+64+31-d5+c4" />

            <BaseCard class="mb-8">
              <BaseCardHeader h3>
                {{ expansion.name }} Raids
              </BaseCardHeader>
              <BaseCardContent>
                <div v-for="raid in expansion.instances.raids" :key="raid.id" class="mb-4">
                  <BaseHeading h4>
                    {{ raid.name }}
                  </BaseHeading>

                  <div class="flex flex-wrap gap-2 mb-2">
                    <BaseButton v-for="instance in raid.encounters" :key="instance.id" as-child size="sm">
                      <NuxtLink :to="`/search?q=${instance.name}`">
                        {{ instance.name }}
                      </NuxtLink>
                    </BaseButton>
                  </div>
                </div>
              </BaseCardContent>
            </BaseCard>
          </div>
        </div>
        <div>
          <BaseHeading h2>
            Dungeons
          </BaseHeading>

          <div v-for="(expansion, index) in resultsItem" :key="expansion.id" class="mb-12">
            <Ad v-if="index === 1" ad-slot="7513403484" ad-format="fluid" ad-layout-key="-fv+64+31-d5+c4" />

            <BaseCard class="mb-8">
              <BaseCardHeader h3>
                {{ expansion.name }} Dungeons
              </BaseCardHeader>
              <BaseCardContent>
                <div v-for="raid in expansion.instances.dungeons" :key="raid.id" class="mb-4">
                  <BaseHeading h4>
                    {{ raid.name }}
                  </BaseHeading>

                  <div class="flex flex-wrap gap-2 mb-2">
                    <BaseButton v-for="instance in raid.encounters" :key="instance.id" as-child size="sm">
                      <NuxtLink :to="`/search?q=${instance.name}`">
                        {{ instance.name }}
                      </NuxtLink>
                    </BaseButton>
                  </div>
                </div>
              </BaseCardContent>
            </BaseCard>
          </div>
        </div>
      </div>
    </BaseContainer>
  </BaseSection>
</template>
