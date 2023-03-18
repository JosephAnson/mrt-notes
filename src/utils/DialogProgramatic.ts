import { createApp } from 'vue'
import { Dialog } from '#components'

interface DialogProps {
  title?: string | null
  message?: string | null
  confirmText?: string
  cancelText?: string
  hasInput?: boolean
  inputAttrs?: object
  onConfirm: Function
  onCancel?: Function
  ariaRole?: string
  animation?: string
}

export function openDialog(params: DialogProps & Record<string, any>) {
  const component = createApp(Dialog, params)

  if (process.client) component.mount(document.createElement('div'))
}
