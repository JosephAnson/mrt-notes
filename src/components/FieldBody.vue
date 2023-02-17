<script lang="ts">
import type { PropType } from 'vue'
import Field from './Field.vue'

export default defineComponent({
  name: 'FieldBody',
  props: {
    message: { type: String, default: null },
    description: { type: String, default: null },
    type: { type: [String, Object] as PropType<string | Record<string, unknown>>, default: null },
  },
  setup(props, { slots }) {
    const fieldSlots = computed<any[]>(() => {
      if (slots && slots.default) {
        return (slots.default() as any).map((element: any) => {
          if (props.message || props.description) {
            return h(
              Field,
              {
                message: props.message,
                description: props.description,
                type: props.type,
              },
              () => [element],
            )
          }
          return h(Field, { type: props.type }, () => element)
        })
      }

      return []
    })

    return () => h('div', { 'class': 'field-body', 'data-testid': 'field-body' }, fieldSlots.value)
  },
})
</script>
