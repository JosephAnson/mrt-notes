<script setup lang="ts">
import Draggable from 'vuedraggable'
import type { Player, WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'
import { ref, useAsyncData } from '#imports'
import { addTeamMember, removeTeamMember } from '~/services/teamMembers'

const { data: players } = await useAsyncData('team_members', async () => {
  const { data } = await client.from('team_members').select('id, name, class').eq('user_id', user.value?.id).order('created_at')
  return data
})

const playerName = ref('')
const playerClass: WowClassesUnion = 'Death Knight'

async function addPlayer(playerName: string, playerClass: WowClassesUnion) {
  const data = addTeamMember(playerName, playerClass)
  players.value?.push(data as any)
}

async function removePlayer(player: Player) {
  const data = removeTeamMember(player)
  players.value = players.value?.filter(t => t.id !== player.id) || []
}
</script>

<template>
  <div class=" players">
    <div class="notification">
      List all players to show auto complete features
    </div>
    <div class="groups__actions buttons">
      <Field label="Player">
        <Field grouped>
          <Field expanded>
            <Input v-model:value="playerName" expanded />
          </Field>
          <Field>
            <Select v-model:value="playerClass">
              <option v-for="type in WowClasses" :key="type">
                {{ type }}
              </option>
            </Select>
          </Field>
          <Button
            type="is-primary"
            @click="addPlayer(playerName, playerClass)"
          >
            Add
          </Button>
        </Field>
      </Field>
    </div>
    <Draggable v-model="players" handle=".handle" item-key="id">
      <template #item="{ element }">
        <div
          class="player__items block is-small"
        >
          <article class="media">
            <div class="media-left">
              <Icon
                icon="align-justify"
                pack="fas"
                class="handle"
              />
            </div>
            <div class="media-content">
              <Field label="Player" horizontal>
                <Field expanded>
                  <Input v-model:value="element.name" expanded />
                </Field>
                <Field>
                  <Select v-model:value="element.class">
                    <option v-for="type in WowClasses" :key="type">
                      {{ type }}
                    </option>
                  </Select>
                </Field>
              </Field>
            </div>
            <div class="media-right">
              <button
                class="delete"
                @click="removePlayer(element)"
              />
            </div>
          </article>
        </div>
      </template>
    </Draggable>
  </div>
</template>
