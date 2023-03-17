<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, TransitionRoot } from '@headlessui/vue'
import Draggable from 'vuedraggable'
import { GroupType } from '~/types'

const props = defineProps({
  noteId: {
    type: Number,
    required: true,
  },
})

const groupsStore = useGroupsStore()
const teamMembersStore = useTeamMembersStore()

await useAsyncData('groups', async () => await groupsStore.fetchAllGroups(props.noteId))

const debouncedUpdateGroups = useDebounceFn(() => {
  updateGroups(props.noteId, groupsStore.groups)
}, 2000)

const query = ref('')
const filteredMembers = computed(() =>
  query.value === ''
    ? teamMembersStore.members
    : teamMembersStore.members.filter((member) =>
        member.name.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)
</script>

<template>
  <div class="box groups">
    <div class="flex justify-between mb-4 items-center">
      <div class="notification">Add groups to show messages only to certain players</div>
      <div class="groups__actions buttons">
        <Button type="is-primary" @click="groupsStore.addGroup(noteId, groupsStore.groups.length + 1)">
          Add Group
        </Button>
      </div>
    </div>
    <Draggable v-model="groupsStore.groups" handle=".handle" item-key="id" @change="debouncedUpdateGroups">
      <template #item="{ element }">
        <div class="flex w-full bg-gray-800 py-2 px-4 mb-2 rounded-1">
          <span class="i-carbon-draggable mr-2 text-2xl handle" />

          <div class="w-full">
            <Field label="Type" stacked>
              <Select v-model:value="element.type" @update:value="debouncedUpdateGroups">
                <option v-for="type in GroupType" :key="type">
                  {{ type }}
                </option>
              </Select>
            </Field>

            <Field v-if="element.type === 'Players'" stacked :label="`Players: ${element.players.join(',')}`">
              <Combobox v-model="element.players" multiple @update:model-value="debouncedUpdateGroups">
                <div class="relative mt-1">
                  <div
                    class="relative w-full cursor-default rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300 sm:text-sm"
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
                      <ComboboxOptions
                        class="absolute z-5 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
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
                              'bg-primary-100 text-white': active,
                              'text-gray-900': !active,
                            }"
                          >
                            <span
                              class="block truncate"
                              :class="{
                                'font-medium': selected,
                                'font-normal': !selected,
                              }"
                            >
                              {{ member.name }}
                            </span>
                            <span
                              v-if="selected"
                              class="absolute inset-y-0 left-0 flex items-center pl-3"
                              :class="{
                                'text-white': active,
                                'text-primary-100': !active,
                              }"
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

          <a class="i-carbon-trash-can w-8 mt-2 ml-2 flex-grow-0" @click="groupsStore.deleteGroup(element.id)" />
        </div>
      </template>
    </Draggable>
  </div>
</template>
