<script setup lang="ts">
import { paramCase } from 'change-case'
import Draggable from 'vuedraggable'
import { getAllTeamMembers } from '#imports'
import type { Ref } from '#imports'
import type { WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'

const { data: asyncTeamMembers } = await useAsyncData(
  'teamMembers',
  async () => await getAllTeamMembers()
)

const teamMembers = useTeamMembers()

const playerName = ref('')
const playerClass: Ref<WowClassesUnion> = ref('Death Knight')

if (asyncTeamMembers.value) setTeamMembers(asyncTeamMembers.value)

const debouncedUpdateMembers = useDebounceFn(() => {
  updateMembers(teamMembers.value)
}, 2000)
</script>

<template>
  <Field label-for="player" label="Player">
    <Input v-model="playerName" class="mr-2" />

    <Select
      v-model:value="playerClass"
      class="mr-2"
      :class="`has-wow-background-${paramCase(playerClass)}`"
    >
      <option v-for="type in WowClasses" :key="type">
        {{ type }}
      </option>
    </Select>

    <Button type="is-primary" @click="addTeamMember(playerName, playerClass)">
      Add
    </Button>
  </Field>

  <Draggable
    v-model="teamMembers"
    handle=".handle"
    item-key="id"
    @change="debouncedUpdateMembers"
  >
    <template #item="{ element, index }">
      <div
        class="bg-gray-800 flex justify-between py-2 px-4 items-center mb-2 rounded-1"
      >
        <span class="i-carbon-draggable mr-2 text-2xl handle" />

        <Field
          class="w-full !mb-0 mr-2"
          :label-for="`player-${index}`"
          label="Player"
        >
          <Input
            v-model="element.name"
            class="w-full mr-2"
            @change="debouncedUpdateMembers"
          />

          <Select
            v-model:value="element.class"
            :class="`has-wow-background-${paramCase(element.class)}`"
            @update:value="debouncedUpdateMembers"
          >
            <option v-for="type in WowClasses" :key="type">
              {{ type }}
            </option>
          </Select>
        </Field>

        <Button class="delete" @click="removeTeamMember(element)">
          Delete
        </Button>
      </div>
    </template>
  </Draggable>
</template>
