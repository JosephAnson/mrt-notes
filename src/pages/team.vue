<script lang='ts' setup>
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div class="page-homepage section">
    <h1 class="title">
      here's your team
    </h1>
    {{ players }}
    <TeamMembers v-model:players="players" />
  </div>
</template>
