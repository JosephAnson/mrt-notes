<script lang="ts" setup async>
const user = useSupabaseUser()
</script>

<template>
  <Page>
    <Container>
      <div class="flex justify-between">
        <Heading h1>
          Homepage
        </Heading>

        <div v-if="!user" class="flex">
          <Heading h2 class="mr-4">
            Login to get started
          </Heading>
          <LoginButtons />
        </div>
      </div>
      <div class="prose text-xl">
        <p>
          Website to handle all your World of Warcraft ERT Notes
        </p>
      </div>
      <div v-if="user">
        <CreateNote />

        <Heading h3>
          Edit information
        </Heading>

        <nuxt-link class="mr-2" to="notes">
          <Button>View your notes</Button>
        </nuxt-link>
        <nuxt-link class="mr-2" to="team">
          <Button>View your team</Button>
        </nuxt-link>

        <div class="prose mt-8">
          <p>
            Working in progress, items still to be completed
          </p>
          <ul>
            <li>
              Import of ert note
            </li>
          </ul>
        </div>
      </div>
    </Container>
  </Page>
</template>
