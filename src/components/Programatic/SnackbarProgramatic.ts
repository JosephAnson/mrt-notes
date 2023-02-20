import { createApp } from 'vue'
import Snackbar from '../Snackbar.vue'

const SnackbarProgrammatic = {
  open(params: Record<string, any> | string): any {
    if (typeof params === 'string') {
      params = {
        message: params,
      }
    }

    const component = createApp(Snackbar, params)

    component.mount(document.createElement('div'))
  },
}

export default SnackbarProgrammatic
