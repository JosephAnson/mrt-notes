<script setup lang="ts">
import { kebabCase } from 'change-case'
import type { Ref } from 'vue'
import Draggable from 'vuedraggable'
import type { WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'

const teamMembersStore = useTeamMembersStore()
await useAsyncData('teamMembers', async () => await teamMembersStore.fetchAllTeamMembers())

const playerName = ref('')
const playerClass: Ref<WowClassesUnion> = ref('Death Knight')

const debouncedUpdateMembers = useDebounceFn(
  () => {
    teamMembersStore.updateMembers()
  },
  DEBOUNCE_TYPING_TIMER,
  { maxWait: 5000 },
)
</script>

<template>
  <BaseField label-for="player" label="Player" stacked>
    <div class="flex w-full gap-4">
      <BaseInput v-model="playerName" />

      <BaseSelect v-model="playerClass" :class="`has-wow-background-${kebabCase(playerClass)}`">
        <BaseSelectTrigger>
          <BaseSelectValue placeholder="Select the class" />
        </BaseSelectTrigger>
        <BaseSelectContent>
          <BaseSelectGroup>
            <BaseSelectItem v-for="type in WowClasses" :key="type" :value="type">
              {{ type }}
            </BaseSelectItem>
          </BaseSelectGroup>
        </BaseSelectContent>
      </BaseSelect>

      <BaseButton @click="teamMembersStore.addMember(playerName, playerClass)">
        Add
      </BaseButton>
    </div>
  </BaseField>

  <template v-if="teamMembersStore.members?.length">
    <Draggable v-model="teamMembersStore.members" handle=".handle" item-key="id" @change="debouncedUpdateMembers">
      <template #item="{ element, index }">
        <BaseCard class="mb-2">
          <BaseCardBlock class="flex justify-between items-center">
            <span class="i-carbon-draggable mr-2 text-2xl handle" />

            <BaseField class="w-full" :label-for="`player-${index}`" label="Player">
              <div class="flex gap-2 w-full">
                <BaseInput v-model="element.name" @update:model-value="debouncedUpdateMembers" />

                <BaseSelect
                  :model-value="element.class" class="mr-2"
                  :class="`has-wow-background-${kebabCase(element.class)}`"
                  @update:model-value="debouncedUpdateMembers"
                >
                  <BaseSelectTrigger>
                    <BaseSelectValue placeholder="Select the class" />
                  </BaseSelectTrigger>
                  <BaseSelectContent>
                    <BaseSelectGroup>
                      <BaseSelectItem v-for="type in WowClasses" :key="type" :value="type">
                        {{ type }}
                      </BaseSelectItem>
                    </BaseSelectGroup>
                  </BaseSelectContent>
                </BaseSelect>

                <BaseButton class="delete" @click="teamMembersStore.removeMember(element)">
                  Delete
                </BaseButton>
              </div>
            </BaseField>
          </BaseCardBlock>
        </BaseCard>
      </template>
    </Draggable>
  </template>
</template>
