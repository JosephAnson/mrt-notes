export function getRouterParamsAsString(params: string | string[]): string {
  return String(Array.isArray(params) ? params[0] : params)
}
