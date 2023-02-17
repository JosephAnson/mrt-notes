import { createApp } from 'vue'
import Modal from '../Modal.vue'
import { merge } from '~/utils/helpers'

const ModalProgrammatic = {
  open(params: Record<string, any> | string): void {
    if (typeof params === 'string') {
      params = {
        content: params,
      }
    }

    const defaultParam = {
      programmatic: true,
    }

    const propsData = merge(defaultParam, params)

    const component = createApp(Modal, {
      ...propsData,
    })

    component.mount(document.createElement('div'))
  },
}

export default ModalProgrammatic
