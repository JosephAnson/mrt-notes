<script lang="ts" setup async>
import { createNewNote } from '~/services/notes'
import Input from '~/components/Input.vue'

const user = useSupabaseUser()

const noteName = ref('')
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
        <Input v-model="noteName" />
        <Button class="mr-2" @click="createNewNote(noteName, '', {})">
          Create note
        </Button>
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
