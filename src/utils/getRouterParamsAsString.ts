import type { LocationQueryValue } from 'vue-router'

export function getRouterParamsAsString(
  params: string | string[] | LocationQueryValue | LocationQueryValue[]
): string {
  return String(Array.isArray(params) ? params[0] : params)
}
