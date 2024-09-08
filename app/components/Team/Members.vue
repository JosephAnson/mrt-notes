<script setup lang="ts">
import { toast } from 'vue-sonner'
import Draggable from 'vuedraggable'
import type { Ref } from 'vue'
import { addTeamMember, removeTeamMember, updateTeamMembers } from '~/services/teamMembers'
import type { Member, WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'

const user = useSupabaseUser()
const { data: members, refresh } = await useAsyncData('teamMembers', async () => await getAllTeamMembers(), {
  watch: [user],
})

const playerName = ref('')
const playerClass: Ref<WowClassesUnion> = ref('Death Knight')

const debouncedUpdateMembers = useDebounceFn(
  async () => {
    await updateTeamMembers(members.value)
    toast.success('Updated Members')
  },
  DEBOUNCE_TYPING_TIMER,
  { maxWait: 5000 },
)

async function removeMember(player: Member) {
  await removeTeamMember(player)
  await refresh()
  toast.success(`Removed: ${player.name}`)
}

async function addMember(playerName: string, playerClass: WowClassesUnion) {
  if (members.value) {
    const teamMember = await addTeamMember(playerName, playerClass, members.value.length + 1)

    if (teamMember) {
      await refresh()
      toast.success(`Added Member: ${teamMember.name}`)
    }
  }
}
</script>

<template>
  <BaseField label-for="player" label="Player" stacked>
    <div class="flex w-full gap-4">
      <BaseInput v-model="playerName" />

      <BaseSelect v-model="playerClass">
        <BaseSelectTrigger :variant="playerClass">
          <BaseSelectValue placeholder="Select the class" />
        </BaseSelectTrigger>
        <BaseSelectContent>
          <BaseSelectGroup>
            <BaseSelectItem v-for="type in WowClasses" :key="type" :value="type">
              {{ type }}
            </BaseSelectItem>
          </BaseSelectGroup>
        </BaseSelectContent>
      </BaseSelect>

      <BaseButton @click="addMember(playerName, playerClass)">
        Add
      </BaseButton>
    </div>
  </BaseField>

  <template v-if="members?.length">
    <Draggable v-model="members" handle=".handle" item-key="id" @change="debouncedUpdateMembers">
      <template #item="{ element, index }">
        <BaseCard>
          <BaseCardBlock class="flex justify-between items-center">
            <Icon name="carbon:draggable" class="mr-2 text-2xl handle" />

            <BaseField class="w-full" :label-for="`player-${index}`" label="Player">
              <div class="flex gap-2 w-full">
                <BaseInput v-model="element.name" @update:model-value="debouncedUpdateMembers" />

                <BaseSelect
                  v-model="element.class"
                  @update:model-value="debouncedUpdateMembers"
                >
                  <BaseSelectTrigger :variant="element.class">
                    <span v-if="element.class">{{ element.class }}</span>
                    <BaseSelectValue v-else placeholder="Select the class" />
                  </BaseSelectTrigger>
                  <BaseSelectContent>
                    <BaseSelectGroup>
                      <BaseSelectItem v-for="type in WowClasses" :key="type" :value="type">
                        {{ type }}
                      </BaseSelectItem>
                    </BaseSelectGroup>
                  </BaseSelectContent>
                </BaseSelect>

                <BaseButton variant="destructive" @click="removeMember(element)">
                  Delete
                </BaseButton>
              </div>
            </BaseField>
          </BaseCardBlock>
        </BaseCard>
      </template>
    </Draggable>
  </template>
</template>
