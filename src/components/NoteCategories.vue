<script lang="ts" setup>
import { useFuse } from '@vueuse/integrations/useFuse'
import type { Node } from '~/types'

const props = defineProps<{
  modelValue: Pick<Node, 'id' | 'label'>[]
}>()

const emits = defineEmits(['update:modelValue'])

const container = ref(null)
const search = ref('')
const open = ref(false)

const modelValue = useVModel(props, 'modelValue', emits)

const { results } = useFuse<Node>(search, noteCategories, {
  fuseOptions: {
    keys: [['label'], ['children', 'label']],
    threshold: 0.4,
    findAllMatches: true,
    includeMatches: true,
  },
  matchAllWhenSearchEmpty: true,
})

function toggle(match: Node) {
  const exists = modelValue.value.find((value) => value.id === match.id)
  if (!exists) {
    modelValue.value.push({ id: match.id, label: match.label })
    emits('update:modelValue', modelValue.value)
  } else {
    remove(match)
  }
}

function remove(match: Node) {
  modelValue.value = modelValue.value.filter((t) => t.id !== match.id)
}

function highlight(match: Node) {
  return !!modelValue.value.find((item) => item.id === match.id)
}

onClickOutside(container, () => {
  open.value = false
})
</script>

<template>
  <div ref="container" class="bg-primary-700 p-1 rounded">
    <div>
      <div class="flex flex-wrap">
        <Button
          v-for="value in modelValue"
          :key="value.id"
          class="flex items-center mr-1 mb-1 whitespace-nowrap"
          @click="remove(value)"
        >
          {{ value.label }}

          <div class="ml-2 i-carbon-trash-can"></div>
        </Button>
      </div>
      <div></div>
      <div class="relative">
        <Input
          v-model="search"
          placeholder="Search for categories"
          type="search"
          class="pr-8"
          @focus="open = true"
        ></Input>
        <div
          class="absolute top-0 right-0 text-primary-100 p-4"
          :class="open ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
          @click="open = !open"
        ></div>
      </div>
    </div>

    <div class="relative">
      <div
        v-if="open"
        class="absolute bg-white text-black rounded overflow-hidden mt-1 w-full z-20 shadow"
      >
        <div
          v-for="result in results"
          :key="result.item.id"
          @click.stop="toggle(result.item)"
        >
          <div
            class="px-2 py-1 flex items-center"
            :class="{ 'bg-gray-200': highlight(result.item) }"
          >
            <div
              class="text-primary-100 mr-1"
              :class="
                highlight(result.item)
                  ? 'i-carbon-checkbox-checked'
                  : 'i-carbon-checkbox'
              "
            ></div>
            {{ result.item.label }}
          </div>
          <div
            v-for="child in result.item.children"
            :key="child.id"
            @click.stop="toggle(child)"
          >
            <div
              class="flex items-center px-2 py-1 pl-4"
              :class="{ 'bg-gray-200': highlight(child) }"
            >
              <div
                class="text-primary-100 mr-1"
                :class="
                  highlight(child)
                    ? 'i-carbon-checkbox-checked'
                    : 'i-carbon-checkbox'
                "
              ></div>
              {{ child.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
