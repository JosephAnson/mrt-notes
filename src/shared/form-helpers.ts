import { inject } from 'vue'

import type { FieldState } from '../components/Field/types'

const fieldStateDefaultValues: FieldState = {
  newDescription: '',
  newMessage: '',
  newType: '',
}

/**
 * Get the type prop from parent if it's a Field.
 */
export function fieldType(): string | string[] | Record<string, string> | undefined {
  return inject<FieldState>('fieldState', fieldStateDefaultValues)?.newType
}

/**
 * Get the message prop from parent if it's a Field.
 */
export function fieldMessage(): string | string[] | Record<string, string> | undefined {
  return inject<FieldState>('fieldState', fieldStateDefaultValues)?.newMessage
}
