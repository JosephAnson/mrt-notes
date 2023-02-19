<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { Ref } from '#imports'
import type { WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'
import { addTeamMember, getAllTeamMembers, removeTeamMember, setTeamMembers, updateMembers } from '~/services/teamMembers'
import { useTeamMembers } from '~/composables/state'

const { data: asyncTeamMembers } = await useAsyncData('team_members', async () => {
  const { data } = await getAllTeamMembers()
  return data
})

const teamMembers = useTeamMembers()

if (asyncTeamMembers.value) {
  setTeamMembers(asyncTeamMembers.value.map(item => ({
    id: item.id,
    class: item.class as WowClassesUnion,
    name: item.name,
  })))
}

const playerName = ref('')
const playerClass: Ref<WowClassesUnion> = ref('Death Knight')

const debouncedUpdateMembers = useDebounceFn(() => {
  updateMembers(teamMembers.value)
}, 2000)

function toParamCase(string: String) {
  return string.replaceAll(' ', '-').toLowerCase()
}
</script>

<template>
  <Field label-for="player" label="Player">
    <Input v-model="playerName" class="mr-2" />

    <Select v-model:value="playerClass" class="mr-2" :class="`has-wow-background-${toParamCase(playerClass)}`">
      <option v-for="type in WowClasses" :key="type">
        {{ type }}
      </option>
    </Select>

    <Button
      type="is-primary"
      @click="addTeamMember(playerName, playerClass)"
    >
      Add
    </Button>
  </Field>

  <Draggable v-model="teamMembers" handle=".handle" item-key="id" @change="debouncedUpdateMembers">
    <template #item="{ element, index }">
      <div class="bg-gray-800 flex justify-between py-2 px-4 items-center mb-2 rounded-1">
        <span class="i-carbon-draggable mr-2 text-2xl handle" />

        <Field class="w-full !mb-0 mr-2" :label-for="`player-${index}`" label="Player">
          <Input v-model="element.name" class="w-full mr-2" @change="debouncedUpdateMembers" />

          <Select v-model:value="element.class" :class="`has-wow-background-${toParamCase(element.class)}`" @update:value="debouncedUpdateMembers">
            <option v-for="type in WowClasses" :key="type">
              {{ type }}
            </option>
          </Select>
        </Field>

        <Button
          class="delete"
          @click="removeTeamMember(element)"
        >
          Delete
        </Button>
      </div>
    </template>
  </Draggable>
</template>
