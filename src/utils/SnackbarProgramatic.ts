import { createApp } from 'vue'
import { Snackbar } from '#components'

export function openSnackbar(params: Record<string, any> | string): any {
  if (typeof params === 'string') {
    params = {
      message: params,
    }
  }

  const component = createApp(Snackbar, params)

  component.mount(document.createElement('div'))
}
