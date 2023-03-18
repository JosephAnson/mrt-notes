<script lang="ts" setup>
const expansion = ref(503)
const instance = ref(1200)

const encounter = ref(2480)
const { data: spellData, pending } = await useFetch(() => `/api/blizzard/encounter/spells/${encounter.value}`)
</script>

<template>
  <Section>
    <Container>
      <EncounterSelector v-model:expansion="expansion" v-model:instance="instance" v-model:encounter="encounter" />

      <Field label="Spells" stacked>
        <div v-if="!pending && spellData">
          <div v-for="spell in spellData.spells" :key="spell.id" class="flex space-between group relative">
            {{ spell.name }} (hover for info)

            <img
              v-if="spell.spellIdInformation"
              :src="`https://wow.zamimg.com/images/wow/icons/medium/${spell.spellIdInformation.icon}.jpg`"
              :alt="spell.spellIdInformation.name"
            />
            <SpellInformation
              class="hidden !absolute top-100% left-0 group-hover:block pointerevents-none"
              :icon="spell.spellIdInformation.icon"
              :tooltip="spell.spellIdInformation.tooltip"
            ></SpellInformation>
          </div>
        </div>
        <div v-else class="flex items-center">
          Loading Spells
          <div class="i-carbon-fire origin-center w-8 h-8 animate-spin animate-3s ml-2"></div>
        </div>
      </Field>
    </Container>
  </Section>
</template>
