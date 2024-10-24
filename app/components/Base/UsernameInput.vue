<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{
  username: string
  usernameExists: boolean
}>()
const emits = defineEmits<{
  'update:username': [value: string]
  'update:usernameExists': [value: boolean]
}>()
const { username, usernameExists } = useVModels(props, emits)

const isChecking = ref<boolean | null>(null)

async function checkUsernameAvailability() {
  if (!username.value) {
    toast.error('Username cannot be empty!')
    isChecking.value = null
    return
  }

  isChecking.value = true
  usernameExists.value = await $fetch(`/api/profile/checkUsername`, { query: { username: username.value } })
  isChecking.value = false
}

watchDebounced(() => username.value, () => checkUsernameAvailability(), { debounce: 500, maxWait: 1000 })
</script>

<template>
  <div class="relative w-full max-w-sm items-center">
    <BaseInput v-bind="$attrs" v-model="username" />
    <span v-if="!usernameExists && isChecking === false" class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
      <Check class="size-6 text-green-500" />
    </span>
  </div>
  <BaseNotification v-if="usernameExists" class="mt-4 block" variant="destructive">
    Username is already taken, please choose another.
  </BaseNotification>
  <BaseNotification v-if="isChecking">
    Checking username availability...
  </BaseNotification>
</template>
