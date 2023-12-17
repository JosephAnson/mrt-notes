<script lang="ts" setup>
const updateNumber = 2
const show = ref(false)

const update = useLocalStorage('updates', 0)

function close() {
  show.value = false
  update.value = updateNumber
}

onMounted(() => {
  show.value = update.value !== updateNumber
})
</script>

<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="pointer-events-auto overflow-hidden rounded-lg bg-green-700 shadow-lg shadow-white/10 ring-1 ring-black ring-opacity-5"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-1">
            <p class="font-semibold mb-2">
              Recent Updates
            </p>
            <slot />
          </div>
          <div class="flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="close"
            >
              <span class="sr-only">Close</span>
              <span class="h-5 w-5 i-carbon-close" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
