<script lang="ts" setup>
const props = defineProps({
  icon: String,
  tooltip: String,
})
</script>

<template>
  <div class="wowhead-tooltip wowhead-tooltip-width-restriction mb-2 pl-12 relative" :style="{ visibility: 'visible' }">
    <div class="whtt-tooltip-icon !left-0" style="visibility: visible">
      <div class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="spell">
        <ins
          :style="`background-image: url('https://wow.zamimg.com/images/wow/icons/medium/${props.icon}.jpg');`"
        ></ins>
        <del></del>
      </div>
    </div>

    <table class="!w-full">
      <tbody>
        <tr>
          <td v-html="props.tooltip"></td>
          <th style="background-position: right top"></th>
        </tr>
        <tr>
          <th style="background-position: left bottom"></th>
          <th style="background-position: right bottom"></th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
