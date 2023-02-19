<script setup lang="ts">
import Draggable from 'vuedraggable'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { GroupType } from '~/types'
import type { GroupTypeUnion } from '~/types'
import { useTeamMembers } from '~/composables/state'
import { createNewGroup, deleteGroup, getAllGroups, setGroups, updateGroups } from '~/services/groups'

const props = defineProps({
  noteId: {
    type: Number,
    required: true,
  },
})

const { data: asyncGroups } = await useAsyncData('groups', async () => {
  const { data } = await getAllGroups(props.noteId)
  return data
})

const groups = useGroups()
const teamMembers = useTeamMembers()

const debouncedUpdateGroups = useDebounceFn(() => {
  updateGroups(props.noteId, groups.value)
}, 2000)

if (asyncGroups.value) {
  setGroups(asyncGroups.value.map((item, index) => ({
    id: item.id,
    note: { value: item.editor_string || '', json: {} },
    order: index,
    type: item.type as GroupTypeUnion || 'Players',
    players: item.players || [],
  })))
}

const query = ref('')
const filteredMembers = computed(() =>
  query.value === ''
    ? teamMembers.value
    : teamMembers.value.filter(member =>
      member.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)
</script>

<template>
  <div class="box groups">
    <div class="flex justify-between mb-4 items-center">
      <div class="notification">
        Add groups to show messages only to certain players
      </div>
      <div class="groups__actions buttons">
        <Button type="is-primary" @click="createNewGroup(noteId, groups.length + 1)">
          Add Group
        </Button>
      </div>
    </div>
    <Draggable v-model="groups" handle=".handle" item-key="id">
      <template #item="{ element }">
        <div class=" flex w-full bg-gray-800 py-2 px-4 mb-2 rounded-1">
          <span class="i-carbon-draggable mr-2 text-2xl handle" />

          <div class="w-full">
            <Field label="Type" stacked>
              <Select v-model:value="element.type" @update:value="debouncedUpdateGroups">
                <option v-for="type in GroupType" :key="type">
                  {{ type }}
                </option>
              </Select>
            </Field>

            <Field
              v-if="element.type === 'Players'"
              stacked
              :label="`Players: ${element.players.join(',')}`"
            >
              <Combobox v-model="element.players" multiple @update:model-value="debouncedUpdateGroups">
                <div class="relative mt-1">
                  <div
                    class="relative w-full cursor-default  rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                  >
                    <ComboboxInput
                      class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      @change="query = $event.target.value"
                    />

                    <TransitionRoot
                      leave="transition ease-in duration-100"
                      leave-from="opacity-100"
                      leave-to="opacity-0"
                      @after-leave="query = ''"
                    >
                      <ComboboxOptions class="absolute z-5 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <div
                          v-if="filteredMembers.length === 0 && query !== ''"
                          class="relative cursor-default select-none py-2 px-4 text-gray-700"
                        >
                          Nothing found.
                        </div>
                        <ComboboxOption
                          v-for="member in filteredMembers"
                          :key="member.id"
                          v-slot="{ selected, active }"
                          as="template"
                          :value="member.name"
                        >
                          <li
                            class="relative cursor-default select-none py-2 pl-10 pr-4"
                            :class="{
                              'bg-teal-600 text-white': active,
                              'text-gray-900': !active,
                            }"
                          >
                            <span
                              class="block truncate"
                              :class="{ 'font-medium': selected, 'font-normal': !selected }"
                            >
                              {{ member.name }}
                            </span>
                            <span
                              v-if="selected"
                              class="absolute inset-y-0 left-0 flex items-center pl-3"
                              :class="{ 'text-white': active, 'text-teal-600': !active }"
                            >
                              <span class="i-carbon-checkmark h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ComboboxOption>
                      </ComboboxOptions>
                    </TransitionRoot>
                  </div>
                </div>
              </Combobox>
            </Field>

            <Field stacked>
              <Editor
                v-model="element.note.value"
                @update:json="element.note.json = $event"
                @update:model-value="debouncedUpdateGroups"
              />
            </Field>
          </div>

          <a
            class="i-carbon-trash-can w-8 mt-2 ml-2 flex-grow-0"
            @click="deleteGroup(element.id)"
          />
        </div>
      </template>
    </Draggable>
  </div>
</template>
