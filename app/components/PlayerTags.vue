<script setup lang='ts'>
import type { Member } from '~/types'

const props = defineProps<{
  members: Member[]
  delete?: boolean
}>()

const emits = defineEmits(['click', 'delete'])

function onClick(teamMember: Member) {
  emits('click', teamMember)
}

function onDelete(teamMember: Member) {
  emits('delete', teamMember)
}
</script>

<template>
  <div v-if="props.members?.length" class="flex flex-wrap gap-1">
    <BaseTag
      v-for="teamMember in props.members"
      :key="teamMember.id"
      :variant="teamMember.class"
      class="cursor-pointer"
      @click.prevent="onClick(teamMember)"
    >
      {{ teamMember.name }}

      <Icon v-if="props.delete" name="carbon:trash-can" class="ml-2" @click="onDelete(teamMember)" />
    </BaseTag>
  </div>
</template>
