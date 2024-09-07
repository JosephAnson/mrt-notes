<script setup lang='ts'>
import type { Member } from '~/types'

const props = defineProps< {
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
  <div v-if="props.members?.length" class="flex flex-wrap">
    <a
      v-for="teamMember in props.members"
      :key="teamMember.id"
      class="flex space-between cursor-pointer mr-1 mb-1 items-center bg-gray-900 hover:bg-black rounded px-2"
      :class="`has-wow-text-${teamMember.class?.replace(' ', '-').toLowerCase()}`"
      @click.prevent="onClick(teamMember)"
    >
      {{ teamMember.name }}

      <Icon v-if="props.delete" name="carbon:trash-can" class="ml-2" @click="onDelete(teamMember)" />
    </a>
  </div>
</template>
