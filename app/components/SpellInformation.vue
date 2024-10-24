<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    icon: string
    tooltip: string
    showIcon?: boolean
  }>(),
  { showIcon: true },
)
</script>

<template>
  <div
    class="wowhead-tooltip wowhead-tooltip-width-restriction mb-2 relative min-w-80 !left-[100%]"
    :class="{ 'pl-12': props.showIcon }"
    :style="{ visibility: 'visible' }"
  >
    <div v-if="props.showIcon" class="whtt-tooltip-icon" style="visibility: visible">
      <div class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="spell">
        <ins
          :style="`background-image: url('https://wow.zamimg.com/images/wow/icons/medium/${props.icon}.jpg');`"
        />
        <del />
      </div>
    </div>

    <table class="!w-full">
      <tbody>
        <tr>
          <td v-html="props.tooltip" />
          <th style="background-position: right top" />
        </tr>
        <tr>
          <th style="background-position: left bottom" />
          <th style="background-position: right bottom" />
        </tr>
      </tbody>
    </table>
  </div>
</template>
