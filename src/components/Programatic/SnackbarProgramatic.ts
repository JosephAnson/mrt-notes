import { createApp } from 'vue'
import Snackbar from '../Snackbar.vue'
import { merge } from '~/utils/helpers'

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

    const propsData = merge(defaultParam, params)

    const component = createApp(Snackbar, {
      ...propsData,
    })

    component.mount(document.createElement('div'))
  },
}

export default SnackbarProgrammatic
