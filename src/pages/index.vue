<script lang="ts" setup async>
const user = useSupabaseUser()
</script>

<template>
  <Page>
    <Container>
      <Heading h1>
        Homepage
      </Heading>

      <div v-if="!user">
        <p>
          Login to get started
        </p>
        <LoginButtons />
      </div>
      <div v-else>
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
      </div>
    </Container>
  </Page>
</template>
