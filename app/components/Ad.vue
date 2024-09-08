<script setup lang='ts'>
import { isClient } from '@vueuse/core'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  adSlot: string
  adLayout?: string
  adFormat?: string
  adLayoutKey?: string
}>(), {
  adFormat: 'horizontal',
})

const adClient = process.env.GOOGLE_ADSENSE_ID

const attrs = {}

if (props.adLayout)
  attrs['data-ad-layout'] = props.adLayout

if (props.adLayoutKey)
  attrs['data-ad-layout-key'] = props.adLayoutKey

onMounted(() => {
  if (isClient) {
    setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
      catch (e) {
        console.error(e)
      }
    }, 50)
  }
})
</script>

<template>
  <div class="my-4">
    <BaseContainer>
      <ins
        class="adsbygoogle flex justify-center items-center block w-full"
        :data-ad-client="adClient"
        :data-ad-slot="props.adSlot"
        :data-ad-format="props.adFormat"
        data-full-width-responsive="false"
        v-bind="attrs"
      />
    </BaseContainer>
  </div>
</template>

<style>
.adsbygoogle :deep(iframe) {
  width: 100% !important;
}
</style>
