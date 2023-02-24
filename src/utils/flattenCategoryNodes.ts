import type { Node } from '~/types'

export function flattenCategoryNodes(nodes: Node[]) {
  const result = []
  for (const node of nodes) {
    if (node.children) {
      result.push({ id: node.id, label: node.label })

      for (const child of node.children) {
        result.push(child)
      }
    } else {
      result.push(node)
    }
  }
  return result
}
