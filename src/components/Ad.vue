<script setup lang='ts'>
defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  adSlot: string
  adLayout: string
  maxHeight: boolean
}>()

const adClient = process.env.GOOGLE_ADSENSE_ID

const attrs = {}

if (props.adLayout)
  attrs['data-ad-layout'] = props.adLayout
</script>

<template>
  <Container>
    <ins
      class="adsbygoogle flex justify-center items-center block w-full"
      :class="{ 'h-[115px] max-h-[115px]': props.maxHeight }"
      :data-ad-client="adClient"
      :data-ad-slot="props.adSlot"
      data-ad-format="auto"
      data-full-width-responsive="true"
      v-bind="attrs"
    />
  </Container>
</template>

<style scoped lang='scss'>
.adsbygoogle > :deep(div) {
  width: 100% !important;
  height: 115px !important;
  display: flex !important;
  justify-content: center;
  align-items: center;

  > iframe{
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
