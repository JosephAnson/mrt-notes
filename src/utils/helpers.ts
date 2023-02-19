/**
 * Merge function to replace Object.assign with deep merging possibility
 */
const isObject = (item: any) => typeof item === 'object' && !Array.isArray(item)
const mergeFn = (target: Record<string, any>, source: Record<string, any>, deep = false) => {
  if (deep || !Object.assign) {
    const isDeep = (prop: string) =>
      isObject(source[prop])
      && target !== null
      && isObject(target[prop])

    const replaced: Record<string, any> = Object.getOwnPropertyNames(source)
      .map(prop => ({
        [prop]: isDeep(prop)
          ? mergeFn(target[prop], source[prop], deep)
          : source[prop],
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

/**
 * Get value of an object property/path even if it's nested
 */
export function getValueByPath(obj: Record<string, any>, path?: string): any {
  if (!path)
    return

  return path.split('.').reduce((o, i) => o[i], obj)
}

export function toCss(value: number | string | undefined): null | string {
  if (value === undefined || value === '') {
    return null
  }
  else {
    return typeof value === 'string'
      ? value
      : `${value}px`
  }
}

export function toParamCase(string: String) {
  return string.replaceAll(' ', '-').toLowerCase()
}