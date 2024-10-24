<script setup lang="ts">
import type { Ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { toast } from 'vue-sonner'
import type { Member, WowClassesUnion } from '~/types'
import { WowClasses } from '~/types'

const user = useSupabaseUser()
const { data: members, refresh } = await useFetch('/api/team/all', { key: 'team-all', watch: [user], deep: false })

const playerName = ref('')
const playerClass: Ref<WowClassesUnion> = ref('Death Knight')

const debouncedUpdateMembers = useDebounceFn(
  async () => {
    await $fetch('/api/team/update', { method: 'POST', body: members.value })
    await refresh()
    toast.success('Updated Members')
  },
  DEBOUNCE_TYPING_TIMER,
  { maxWait: 5000 },
)

async function removeMember(member: Member) {
  await $fetch('/api/team/remove', { method: 'DELETE', body: member })
  await refresh()
  toast.success(`Removed: ${member.name}`)
}

async function addMember(name: string, playerClass: WowClassesUnion) {
  if (members.value) {
    const teamMember = await $fetch(
      '/api/team/add',
      {
        method: 'POST',
        body: {
          playerName: name,
          playerClass,
          order: members.value.length + 1,
        },
      },
    )

    if (teamMember) {
      playerName.value = ''
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

      <BaseButton :disabled="!playerName" @click="addMember(playerName, playerClass)">
        Add
      </BaseButton>
    </div>
  </BaseField>

  <div v-if="members?.length">
    <VueDraggable v-model="members" handle=".handle" class="gap-2 flex flex-col" @change="debouncedUpdateMembers">
      <div
        v-for="(item, index) in members"
        :key="item.id"
      >
        <BaseCard>
          <BaseCardBlock class="flex justify-between items-center">
            <Icon name="carbon:draggable" class="mr-2 text-2xl handle" />

            <BaseField class="w-full" :label-for="`player-${index}`" label="Player">
              <div class="flex gap-2 w-full">
                <BaseInput v-model="item.name" @update:model-value="debouncedUpdateMembers" />

                <BaseSelect
                  v-model="item.class"
                  @update:model-value="debouncedUpdateMembers"
                >
                  <BaseSelectTrigger :variant="item.class">
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

                <BaseButton variant="destructive" @click="removeMember(item)">
                  Delete
                </BaseButton>
              </div>
            </BaseField>
          </BaseCardBlock>
        </BaseCard>
      </div>
    </VueDraggable>
  </div>
</template>
