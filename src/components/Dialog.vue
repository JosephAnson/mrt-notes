<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import type { PropType } from 'vue'

import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Dialog',
  props: {
    title: { type: String, default: null },
    message: { type: String, default: null },
    confirmText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Cancel' },
    hasInput: { type: Boolean, default: false },
    inputAttrs: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({ required: true }),
    },
    onConfirm: {
      type: Function as PropType<(value: string) => boolean>,
      default: () => {
        return null
      },
    },
    onCancel: {
      type: Function as PropType<any>,
      default: () => {
        return null
      },
    },
    ariaRole: {
      type: String,
      validator: (value: string) => {
        return ['dialog', 'alertdialog'].includes(value)
      },
      default: 'dialog',
    },
    animation: {
      type: String,
      default: 'zoom-out',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const dialog = ref(null)

    const prompt = ref<string>('')
    const isActive = ref<boolean>(false)

    const { activate, deactivate } = useFocusTrap(dialog, { immediate: true })

    const cancelOptions = computed(() => {
      return ['escape', 'x', 'outside', 'button']
    })

    const showCancel = computed(() => {
      return cancelOptions.value.includes('button')
    })

    /**
     * If it's a prompt Dialog, validate the input.
     * Call the onConfirm prop (function) and close the Dialog.
     */
    function confirm() {
      props.onConfirm(prompt.value)
      close()
    }

    /**
     * Close the Dialog.
     */
    function close() {
      deactivate()
      isActive.value = false
    }

    /**
     * Close the Modal if canCancel and call the onCancel prop (function).
     */
    function cancel(method?: string) {
      if (method && !cancelOptions.value.includes(method)) return

      emit('cancel')
      props.onCancel()
      close()
    }

    onMounted(() => {
      isActive.value = true

      activate()
    })

    return {
      prompt,
      dialog,
      isActive,
      showCancel,
      confirm,
      close,
      cancel,
    }
  },
})
</script>

<template>
  <teleport to="body">
    <transition name="zoom-out">
      <div
        v-if="isActive"
        v-bind="$attrs"
        ref="dialog"
        class="dialog"
        :role="ariaRole"
      >
        <div
          class="fixed bg-black opacity-50 h-full w-full top-0 left-0"
          @click="cancel('outside')"
        />
        <div
          class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex"
        >
          <div class="relative w-full h-full max-w-2xl md:h-auto">
            <div class="relative p-4 bg-gray-700 rounded-lg shadow">
              <Heading v-if="title" p styled="h2">
                {{ title }}
              </Heading>

              <section>
                <p class="mb-2">
                  <template v-if="$slots.default">
                    <slot />
                  </template>
                  <template v-else>
                    {{ message }}
                  </template>
                </p>

                <Field v-if="hasInput">
                  <Input
                    v-bind="inputAttrs"
                    ref="input"
                    v-model="prompt"
                    class="input"
                    @keyup.enter="confirm"
                  />
                </Field>
              </section>

              <footer class="flex justify-between">
                <Button
                  v-if="showCancel"
                  class="mr-2"
                  @click="cancel('button')"
                  @keyup.enter="cancel('button')"
                >
                  {{ cancelText }}
                </Button>
                <Button class="button" @click="confirm" @keyup.enter="confirm">
                  {{ confirmText }}
                </Button>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
