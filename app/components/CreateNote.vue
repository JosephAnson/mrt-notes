<script setup lang="ts">
const router = useRouter()

async function createNote() {
  await router.push(`/note/create`)
}
</script>

<template>
  <div class="flex justify-between items-center">
    <BaseHeading h3 class="mb-0">
      Create New Note
    </BaseHeading>
    <form class="flex gap-4" @submit.prevent="createNote">
      <BaseButton type="submit">
        Create note
      </BaseButton>
    </form>
  </div>
</template>
