import { createApp } from 'vue'
import { Snackbar } from '#components'

interface SnackbarProps {
  background?: string
  message: string | string[]
  duration?: number
}

export function openSnackbar(params: (SnackbarProps & Record<string, any>) | string): any {
  if (typeof params === 'string') {
    params = {
      message: params,
    }
  }

  const component = createApp(Snackbar, params)

  component.mount(document.createElement('div'))
}
