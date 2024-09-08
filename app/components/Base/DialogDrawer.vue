<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { DrawerClose, DrawerTrigger } from 'vaul-vue'

defineProps<{
  title?: string
  description?: string
  isOpen?: boolean
}>()

const emits = defineEmits(['save', 'close'])

// Reuse `form` section
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)
</script>

<template>
  <BaseDialog v-if="isDesktop" v-model:open="isOpen">
    <BaseDialogTrigger as-child>
      <slot name="trigger" />
    </BaseDialogTrigger>
    <BaseDialogContent class="sm:max-w-[425px]">
      <BaseDialogHeader>
        <BaseDialogTitle>{{ title }}</BaseDialogTitle>
        <BaseDialogDescription>
          {{ description }}
        </BaseDialogDescription>
      </BaseDialogHeader>
      <slot />
      <BaseDialogClose as-child>
        <BaseButton class="w-full" @click="emits('save')">
          Save
        </BaseButton>
      </BaseDialogClose>
    </BaseDialogContent>
  </BaseDialog>

  <BaseDrawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <BaseDrawerContent>
      <BaseDrawerHeader class="text-left">
        <BaseDrawerTitle>{{ title }}</BaseDrawerTitle>
        <BaseDrawerDescription>
          {{ description }}
        </BaseDrawerDescription>
      </BaseDrawerHeader>
      <slot />
      <BaseDrawerFooter class="pt-2">
        <DrawerClose as-child>
          <BaseButton @click="emits('save')">
            Save
          </BaseButton>
        </DrawerClose>
        <DrawerClose as-child>
          <BaseButton variant="outline" @click="emits('close')">
            Cancel
          </BaseButton>
        </DrawerClose>
      </BaseDrawerFooter>
    </BaseDrawerContent>
  </BaseDrawer>
</template>
