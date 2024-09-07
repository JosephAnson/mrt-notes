<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, TransitionRoot } from '@headlessui/vue'
import Draggable from 'vuedraggable'
import PlayerTags from '~/components/PlayerTags.vue'
import { type Group, GroupType, type Member } from '~/types'

const props = defineProps({
  noteId: {
    type: Number,
    required: true,
  },
})

const groupsStore = useGroupsStore()
const teamMembersStore = useTeamMembersStore()
const { members } = storeToRefs(teamMembersStore)

await useAsyncData('groups', async () => await groupsStore.fetchAllGroups(props.noteId))

const debouncedUpdateGroups = useDebounceFn(
  () => {
    updateGroups(props.noteId, groupsStore.groups)
  },
  DEBOUNCE_TYPING_TIMER,
  { maxWait: 5000 },
)

const query = ref('')
const filteredMembers = computed(() =>
  query.value === ''
    ? members.value
    : members.value.filter(member =>
      member.name.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)

function getSelectedMembers(players: string[]) {
  return members.value.filter(member => players.includes(member.name))
}

function onGroupMemberDelete(group: Group, member: Member) {
  group.players = group.players.filter(player => player !== member.name)
}
</script>

<template>
  <div class="box groups">
    <div
      class="flex justify-between items-center" :class="{
        'mb-4': groupsStore.groups.length > 0,
      }"
    >
      <div class="font-bold">
        Add groups to show messages only to certain players
      </div>
      <div class="groups__actions buttons">
        <BaseButton @click="groupsStore.addGroup(noteId, groupsStore.groups.length + 1)">
          Add Group
        </BaseButton>
      </div>
    </div>
    <Draggable v-model="groupsStore.groups" handle=".handle" item-key="id" @change="debouncedUpdateGroups">
      <template #item="{ element }">
        <BaseCard class="flex w-full px-2 mb-2 rounded-1 !bg-gray-700">
          <span class="i-carbon-draggable mr-2 text-2xl handle" />

          <div class="w-full">
            <BaseField label="Type" stacked>
              <BaseSelect v-model:model-value="element.type" @update:value="debouncedUpdateGroups">
                <BaseSelectTrigger>
                  <BaseSelectValue placeholder="Select a class type" />
                </BaseSelectTrigger>
                <BaseSelectContent>
                  <BaseSelectItem v-for="type in GroupType" :key="type" :value="type">
                    {{ type }}
                  </BaseSelectItem>
                </BaseSelectContent>
              </BaseSelect>
            </BaseField>

            <BaseField v-if="element.type === 'Players'" stacked>
              <BaseField
                label="Group Players:"
                class="!mb-2 flex-wrap lg:flex lg:flex-nowrap lg:items-start"
              >
                <PlayerTags :members="getSelectedMembers(element.players)" delete @delete="onGroupMemberDelete(element, $event)" />
              </BaseField>

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
            </BaseField>

            <Editor
              v-model="element.note.value"
              :members="element.type === 'Players' ? getSelectedMembers(element.players) : members"
              @update:json="element.note.json = $event"
              @update:model-value="debouncedUpdateGroups"
            />
          </div>

          <a class="i-carbon-trash-can w-8 mt-2 ml-2 flex-grow-0 cursor-pointer" @click="groupsStore.deleteGroup(element.id)" />
        </BaseCard>
      </template>
    </Draggable>
  </div>
</template>
