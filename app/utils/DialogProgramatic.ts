import { Dialog } from '#components'
import { createApp } from 'vue'

interface DialogProps {
  title?: string | null
  message?: string | null
  confirmText?: string
  cancelText?: string
  hasInput?: boolean
  inputAttrs?: object
  onConfirm: (value?: string) => void
  onCancel?: () => void
  ariaRole?: string
  animation?: string
}

export function openDialog(params: DialogProps & Record<string, any>) {
  const component = createApp(Dialog, params)

  if (process.client) component.mount(document.createElement('div'))
}
