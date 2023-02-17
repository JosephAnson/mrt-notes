<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { Player, WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'
import { ref, useAsyncData } from '#imports'
import { addTeamMember, getAllTeamMembers, removeTeamMember } from '~/services/teamMembers'

const { data: players } = await useAsyncData('team_members', async () => {
  const { data } = await getAllTeamMembers()
  return data
})

const playerName = ref('')
const playerClass: WowClassesUnion = 'Death Knight'

async function addPlayer(playerName: string, playerClass: WowClassesUnion) {
  const { data } = await addTeamMember(playerName, playerClass)

  if (data) {
    players.value?.push({
      id: data.id,
      class: data.class,
      name: data.name,
    })
  }
}

async function removePlayer(player: Player) {
  await removeTeamMember(player)
  players.value = players.value?.filter(t => t.id !== player.id) || []
}
</script>

<template>
  <Field label-for="player" label="Player">
    <Input v-model="playerName" class="mr-2" expanded />

    <Select v-model:value="playerClass" class="mr-2">
      <option v-for="type in WowClasses" :key="type">
        {{ type }}
      </option>
    </Select>

    <Button
      type="is-primary"
      @click="addPlayer(playerName, playerClass)"
    >
      Add
    </Button>
  </Field>

  <Draggable v-model="players" handle=".handle" item-key="id">
    <template #item="{ element, index }">
      <div class="bg-gray-800 flex justify-between py-2 px-4 items-center mb-2 rounded-1">
        <Icon
          icon="align-justify"
          pack="fas"
          class="handle mr-2"
        />
        <Field class="w-full !mb-0 mr-2" :label-for="`player-${index}`" label="Player" horizontal>
          <Input v-model="element.name" class="w-full mr-2" expanded />

          <Select v-model:value="element.class">
            <option v-for="type in WowClasses" :key="type">
              {{ type }}
            </option>
          </Select>
        </Field>

        <Button
          class="delete"
          @click="removePlayer(element)"
        >
          Delete
        </Button>
      </div>
    </template>
  </Draggable>
</template>
