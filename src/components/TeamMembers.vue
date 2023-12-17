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
  <Field label-for="player" label="Player">
    <Input v-model="playerName" class="mr-2" />

    <Select v-model:value="playerClass" class="mr-2" :class="`has-wow-background-${kebabCase(playerClass)}`">
      <option v-for="type in WowClasses" :key="type">
        {{ type }}
      </option>
    </Select>

    <Button @click="teamMembersStore.addMember(playerName, playerClass)">
      Add
    </Button>
  </Field>

  <template v-if="teamMembersStore.members?.length">
    <Draggable v-model="teamMembersStore.members" handle=".handle" item-key="id" @change="debouncedUpdateMembers">
      <template #item="{ element, index }">
        <Card class="flex justify-between px-4 items-center mb-2 rounded-1">
          <span class="i-carbon-draggable mr-2 text-2xl handle" />

          <Field class="w-full !mb-0 mr-2 !inline-block !sm:flex" :label-for="`player-${index}`" label="Player">
            <Input v-model="element.name" class="w-full mr-2 my-2 sm:my-0" @update:model-value="debouncedUpdateMembers" />

            <Select
              v-model:value="element.class"
              :class="`has-wow-background-${kebabCase(element.class)}`"
              @update:value="debouncedUpdateMembers"
            >
              <option v-for="type in WowClasses" :key="type">
                {{ type }}
              </option>
            </Select>
          </Field>

          <Button class="delete" @click="teamMembersStore.removeMember(element)">
            Delete
          </Button>
        </Card>
      </template>
    </Draggable>
  </template>
</template>
