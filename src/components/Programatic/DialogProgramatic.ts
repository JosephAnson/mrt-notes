import { createApp } from 'vue'
import Dialog from '../Dialog.vue'
import { merge } from '~/utils/helpers'

function open(propsData: Record<string, any>) {
  const component = createApp(Dialog, propsData)

  component.mount(document.createElement('div'))
}

interface DialogProps {
  message: string
  inputAttrs: {
    placeholder: string
  }
  onConfirm: (value: string) => void
}

const DialogProgrammatic = {
  alert(params: Record<string, any> | string) {
    if (typeof params === 'string') {
      params = {
        message: params,
      }
    }
    const defaultParam = {
      canCancel: false,
    }
    const propsData = merge(defaultParam, params)
    return open(propsData)
  },
  confirm(params: Record<string, any>) {
    const defaultParam = {}
    const propsData = merge(defaultParam, params)
    return open(propsData)
  },
  prompt(params: DialogProps) {
    const defaultParam = {
      hasInput: true,
      confirmText: 'Done',
    }
    const propsData = merge(defaultParam, params)
    return open(propsData)
  },
}

export default DialogProgrammatic
