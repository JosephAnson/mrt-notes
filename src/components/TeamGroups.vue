<script setup lang="ts">
import Draggable from 'vuedraggable'
import { Guid } from '~/shared/guid'
import { GroupType } from '~/types'
import type { Group, Player } from '~/types'

const props = defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    required: true,
  },
  players: {
    type: Array as PropType<Player[]>,
    required: true,
  },
})

const emit = defineEmits(['update:players'])

const groups = useVModel(props, 'groups', emit)

const playerNames = computed(() => props.players.map(player => player.name))

function getFilteredPlayers(text: string) {
  return props.players
    .filter((player) => {
      return player.name
        .toString()
        .toLowerCase()
        .includes(text.toLowerCase())
    })
    .map(player => player.name)
}

function addGroup() {
  groups.value.push({
    id: Guid.create(),
    type: 'Players',
    players: [],
    editor: {
      value: '',
      json: {},
    },
  })
}

function removeGroup(group: Group) {
  const index = groups.value.indexOf(group)
  groups.value.splice(index, 1)
}
</script>

<template>
  <div class="box groups">
    <div class="notification">
      Add groups to show messages only to certain players
    </div>
    <div class="groups__actions buttons">
      <Button type="is-primary" @click="addGroup">
        Add Group
      </Button>
    </div>
    <Draggable v-model="groups" handle=".handle" item-key="id">
      <template #item="{ element }">
        <div
          class="groups__items box is-dark"
        >
          <article class="media">
            <div class="media-left">
              <Icon
                icon="align-justify"
                pack="fa"
                class="handle"
              />
            </div>
            <div class="media-content">
              <Field label="Type" horizontal>
                <Select v-model:value="element.type">
                  <option v-for="type in GroupType" :key="type">
                    {{ type }}
                  </option>
                </Select>
              </Field>
              <Field
                v-if="element.type === 'Players'"
                label="Players"
                horizontal
              >
                <Taginput
                  v-model:tags="element.players"
                  :data="playerNames"
                  autocomplete
                  allow-new
                  open-on-focus
                  :confirm-key-codes="[13, 32, 188]"
                  @typing="getFilteredPlayers"
                />
              </Field>
              <Field label="Tactic" horizontal>
                <Editor
                  v-model="element.editor.value"
                  :players="players"
                  @update:json="element.editor.json = $event"
                />
              </Field>
            </div>
            <div class="media-right">
              <button
                class="delete"
                @click="removeGroup(element)"
              />
            </div>
          </article>
        </div>
      </template>
    </Draggable>
  </div>
</template>
