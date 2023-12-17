<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const profileStore = useProfileStore()

await useAsyncData('nav-profile', async () => await profileStore.fetchProfile())

function login() {
  router.push(`/login?returnUrl=${window.location.href}`)
}

function logout() {
  client.auth.signOut()
  router.push('/')
}

const navigation = computed(() => [
  { name: 'About', to: '/about', show: true },
  { name: 'Search', to: '/search', show: true },
  { name: 'Encounters', to: '/allencounters', show: true },
  { name: 'Playground', to: '/playground', show: true },
  { name: 'My Notes', to: `/profile/${profileStore.username}`, show: user.value && profileStore.username },
  { name: profileStore.username ? `Account (${profileStore.username})` : 'Account', to: '/account', show: user.value },
  { name: 'Team', to: '/team', show: user.value },
])

const mobileMenuOpen = ref(false)

router.afterEach(() => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <div class="bg-primary-100">
    <Container>
      <nav class="flex items-center justify-between py-3" aria-label="Global">
        <div class="flex lg:flex-1">
          <NuxtLink
            to="/"
            title="ERT: ERT Note creator for WoW"
            class="-m-1.5 p-1.5 heading font-secondary font-semibold flex justify-start text-l mr-2"
          >
            MRT Notes
          </NuxtLink>
        </div>
        <div class="flex lg:hidden">
          <button
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-indigo-300 bg-transparent"
            @click="mobileMenuOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <span class="i-carbon-menu h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <template v-for="item in navigation" :key="item.name">
            <NuxtLink v-if="item.show" :href="item.to" class="text-sm font-semibold leading-6 text-white">
              {{ item.name }}
            </NuxtLink>
          </template>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            class="flex items-center text-sm font-semibold leading-6 text-white mr-4"
            href="https://github.com/JosephAnson/mrt-notes/issues"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Report issue
          </a>
          <a v-if="!user" class="text-sm font-semibold leading-6 text-white cursor-pointer" @click="login"> Login </a>
          <a v-else class="text-sm font-semibold leading-6 text-white cursor-pointer" @click="logout"> Logout </a>
        </div>
      </nav>

      <Dialog :open="mobileMenuOpen" @close="mobileMenuOpen = false">
        <div class="fixed inset-0 z-10" />
        <DialogPanel
          class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">MRT Notes</span>
            </a>
            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
              <span class="sr-only">Close menu</span>
              <div class="i-carbon-close h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <template v-for="item in navigation" :key="item.name">
                  <NuxtLink
                    v-if="item.show"
                    :to="item.to"
                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {{ item.name }}
                  </NuxtLink>
                </template>
              </div>
              <div class="py-6 space-y-2">
                <Button
                  class="!px-2 flex items-center text-center justify-center w-full"
                  href="https://github.com/JosephAnson/mrt-notes/issues"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <span class="i-carbon-logo-github inline-block mr-2 text-xl" />
                  Submit issues or request features
                </Button>
                <Button v-if="!user" class="w-full cursor-pointer" @click="login">
                  Login
                </Button>
                <Button v-else class="w-full cursor-pointer" @click="logout">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </Container>
  </div>
</template>
