<script lang="ts" setup async>
import LoginButtons from '~/components/LoginButtons.vue'

const user = useSupabaseUser()
</script>

<template>
  <Page>
    <Container>
      <Heading>Homepage</Heading>

      <div v-if="!user">
        <p>
          Login to get started
        </p>
        <LoginButtons />
      </div>
      <div v-else>
        <nuxt-link to="notes">
          <Button>View your notes</Button>
        </nuxt-link>
        <nuxt-link to="team">
          <Button>View your team</Button>
        </nuxt-link>
      </div>
    </Container>
  </Page>
</template>
