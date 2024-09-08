<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const email = ref('')
</script>

<template>
  <BaseSection class="min-h-[80dvh] flex items-center">
    <BaseContainer>
      <BaseCard v-if="!user" class="w-full max-w-sm mx-auto">
        <BaseCardHeader>
          <BaseCardTitle>Login</BaseCardTitle>
          <BaseCardDescription>Choose your preferred login method</BaseCardDescription>
        </BaseCardHeader>
        <form @submit="() => signInWithOtp(email)">
          <BaseCardContent class="grid gap-4">
            <BaseField label-for="email" label="Email" stacked>
              <BaseInput id="email" v-model="email" type="email" />
            </BaseField>
          </BaseCardContent>
          <BaseCardFooter>
            <BaseButton class="w-full" type="submit">
              Sign in
            </BaseButton>
          </BaseCardFooter>
        </form>
        <BaseCardFooter class="flex flex-col space-y-4">
          <div class="relative w-full">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <BaseButton
              variant="discord"
              @click="login('discord')"
            >
              <Icon name="bi:discord" class="h-4 w-4 mr-2" />
              Login with Discord
            </BaseButton>
            <BaseButton
              variant="google"
              @click="login('google')"
            >
              <Icon name="devicon-plain:google" class="h-4 w-4 mr-2" />
              Login with Google
            </BaseButton>
          </div>
        </BaseCardFooter>
      </BaseCard>
      <BaseCard v-else class="w-full max-w-sm mx-auto">
        <BaseCardHeader>
          <BaseCardTitle>Logout</BaseCardTitle>
          <BaseCardDescription>Click below to logout</BaseCardDescription>
        </BaseCardHeader>
        <BaseCardFooter>
          <BaseButton @click="client.auth.signOut()">
            Logout
          </BaseButton>
        </BaseCardFooter>
      </BaseCard>
    </BaseContainer>
  </BaseSection>
</template>
