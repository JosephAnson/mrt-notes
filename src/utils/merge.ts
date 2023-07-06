/**
 * Merge function to replace Object.assign with deep merging possibility
 */
function isObject(item: any) {
  return typeof item === 'object' && !Array.isArray(item)
}
function mergeFn(target: Record<string, any>, source: Record<string, any>, deep = false) {
  if (deep || !Object.assign) {
    const isDeep = (prop: string) => isObject(source[prop]) && target !== null && isObject(target[prop])

    const replaced: Record<string, any> = Object.getOwnPropertyNames(source)
      .map(prop => ({
        [prop]: isDeep(prop) ? mergeFn(target[prop], source[prop], deep) : source[prop],
      }))
      .reduce((a, b) => ({ ...a, ...b }), {})

    return {
      ...target,
      ...replaced,
    }
  }
  else {
    return Object.assign(target, source)
  }
}
export const merge = mergeFn
