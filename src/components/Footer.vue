<template>
  <footer class="py-10">
    <div class="container">
      <div class="md:flex grid gap-2">
        <Button
          tag="a"
          class="bg-transparent !px-2 flex items-center"
          href="https://github.com/JosephAnson/mrt-notes/issues"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <span class="i-carbon-logo-github inline-block mr-2 text-xl" />
          Submit issues or request features
        </Button>
        <Button to="/privacyPolicy" class="!px-2 bg-transparent text-left" aria-label="Twitter Share Button">
          Privacy Policy
        </Button>
        <Button
          class="!px-2 bg-transparent flex items-center justify-center"
          aria-label="Twitter Share Button"
          @click="tweet"
        >
          <span class="i-carbon-logo-twitter inline-block text-xl"></span>
        </Button>
      </div>
    </div>
  </footer>
</template>
