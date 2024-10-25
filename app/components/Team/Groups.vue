<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, TransitionRoot } from '@headlessui/vue'
import { VueDraggable } from 'vue-draggable-plus'
import { toast } from 'vue-sonner'
import PlayerTags from '~/components/PlayerTags.vue'
import { type Group, GroupType, type GroupTypeUnion, type Member } from '~/types'

const props = defineProps({
  noteId: {
    type: Number,
    required: true,
  },
})

const user = useSupabaseUser()

const { data: groups, refresh } = await useFetch('/api/groups/all', { key: 'groups-all', query: { noteId: props.noteId }, deep: false })
const { data: members } = await useFetch('/api/team/all', { key: 'team-all', watch: [user], deep: false })

const b = ref([])
syncRef(groups, b, { direction: 'ltr' })

const debouncedUpdateGroups = useDebounceFn(
  async () => {
    if (groups.value) {
      await $fetch('/api/groups/update', { method: 'POST', body: { noteId: props.noteId, groups: groups.value } })
    }
  },
  DEBOUNCE_TYPING_TIMER,
  { maxWait: 5000 },
)

const query = ref('')
const filteredMembers = computed(() =>
  query.value === ''
    ? members.value
    : members.value?.filter(member =>
      member.name.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)

function getSelectedMembers(players?: string[]) {
  if (players) {
    return members.value?.filter(member => players.includes(member.name))
  }
}

function onGroupMemberDelete(group: Group, member: Member) {
  group.players = group.players.filter(player => player !== member.name)
}

async function deleteGroup(id: number) {
  await $fetch('/api/groups/remove', { method: 'DELETE', body: { id } })
  await refresh()
}

async function addGroup(
  note_id: number,
  order: number,
  type: GroupTypeUnion = 'Healers',
  editor_string = '',
  players?: string[],
) {
  if (user.value) {
    await $fetch('/api/groups/add', {
      method: 'POST',
      body: {
        note_id,
        order,
        type,
        editor_string,
        players,
        user_id: user.value.id,
      },
    })

    await refresh()
  }
  else {
    toast.error('Need to be logged in to add group')
  }
}
</script>

<template>
  <div v-if="groups">
    <div class="flex justify-between items-center mb-4 last:mb-0">
      <div class="font-bold">
        Add groups to show messages only to certain players
      </div>
      <div class="groups__actions buttons">
        <BaseButton @click="addGroup(noteId, groups.length + 1)">
          Add Group
        </BaseButton>
      </div>
    </div>
    <VueDraggable
      v-model="b"
      class="gap-2 flex flex-col"
      handle=".handle"
      @change="debouncedUpdateGroups"
    >
      <div
        v-for="item in b"
        :key="item.id"
      >
        <BaseCard>
          <BaseCardBlock class="flex w-full px-2 mb-2">
            <Icon name="carbon:draggable" class="mr-2 text-2xl handle" />

            <div class="w-full">
              <BaseField label="Type" stacked>
                <BaseSelect v-model="item.type" @update:model-value="debouncedUpdateGroups">
                  <BaseSelectTrigger>
                    <BaseSelectValue placeholder="Select a type" />
                  </BaseSelectTrigger>
                  <BaseSelectContent>
                    <BaseSelectItem v-for="type in GroupType" :key="type" :value="type">
                      {{ type }}
                    </BaseSelectItem>
                  </BaseSelectContent>
                </BaseSelect>
              </BaseField>

              <BaseField v-if="item.type === 'Players'">
                <BaseField
                  label="Group Players:"
                  class="!mb-2 flex-wrap lg:flex lg:flex-nowrap lg:items-start"
                >
                  <PlayerTags
                    :members="getSelectedMembers(item.players)"
                    delete
                    @delete="onGroupMemberDelete(item, $event)"
                  />
                </BaseField>

                <Combobox v-model="item.players" multiple @update:model-value="debouncedUpdateGroups">
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
                            v-if="filteredMembers?.length === 0 && query !== ''"
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
                                <Icon name="carbon:checkmark" class="h-5 w-5" aria-hidden="true" />
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
                v-model="item.note.value"
                :members="item.type === 'Players' ? getSelectedMembers(item.players) : members"
                @update:json="item.note.json = $event"
                @update:model-value="debouncedUpdateGroups"
              />
            </div>

            <a class="w-8 mt-2 ml-2 flex-grow-0 cursor-pointer" @click="deleteGroup(item.id)">
              <Icon name="carbon:trash-can" />
            </a>
          </BaseCardBlock>
        </BaseCard>
      </div>
    </VueDraggable>
  </div>
</template>
