import { createApp } from 'vue'
import Snackbar from '../Snackbar.vue'

const SnackbarProgrammatic = {
  open(params: Record<string, any> | string): any {
    if (typeof params === 'string') {
      params = {
        message: params,
      }
    }

    const defaultParam = {
      type: 'is-success',
      position: 'is-bottom-right',
    }

    const propsData = { ...defaultParam, ...params }

    const component = createApp(Snackbar, {
      ...propsData,
    })

    component.mount(document.createElement('div'))
  },
}

export default SnackbarProgrammatic
