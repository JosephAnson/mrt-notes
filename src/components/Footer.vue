<template>
  <footer class="py-10">
    <div class="container">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
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
          <Button class="ml-4 !px-2 bg-transparent" aria-label="Twitter Share Button" @click="tweet">
            <div class="i-carbon-logo-twitter"></div
          ></Button>
        </div>
      </div>
    </div>
  </footer>
</template>
