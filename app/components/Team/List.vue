<script setup lang='ts'>
import { kebabCase } from 'change-case'

const user = useSupabaseUser()

const { data: newMembers } = await useFetch('/api/team/all', { key: 'team-all', watch: [user] })
</script>

<template>
  <div>
    <ul class="gap-1 grid grid-cols-2">
      <li
        v-for="member in newMembers"
        :key="member.id"
        class="flex"
        :class="`has-wow-text-${kebabCase(member.class)}`"
      >
        <BaseTag class="rounded-r-none w-full">
          {{ member.name }}
        </BaseTag>
        <BaseTag :variant="member.class" class="rounded-l-none w-full whitespace-nowrap">
          {{ member.class }}
        </BaseTag>
      </li>
    </ul>
  </div>
</template>
