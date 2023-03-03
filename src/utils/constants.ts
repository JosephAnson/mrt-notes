import type { Node } from '~/types'
import { flattenCategoryNodes } from '~/utils/flattenCategoryNodes'

export const SPELL_INFO_BASE_URL = 'https://nether.wowhead.com/tooltip/spell/'

export const IMAGE_MARKER = 'IMAGE_MARKER'
export const IMAGE_SPELLID = 'IMAGE_SPELLID'

export const noteCategories: Node[] = [
  {
    id: 'pve/sepulcher-of-the-first-ones',
    label: 'Sepulcher Of The First Ones',
  },
  {
    id: 'pve/vault-of-the-incarnates',
    label: 'Vault of the Incarnates',
    children: [
      {
        id: 'pve/vault-of-the-incarnates/eranog',
        label: 'Eranog',
      },
      {
        id: 'pve/vault-of-the-incarnates/sennarth-the-cold-breath',
        label: 'Sennarth The Cold Breath',
      },
      {
        id: 'pve/vault-of-the-incarnates/the-primalist-council',
        label: 'The Primalist Council',
      },
      {
        id: 'pve/vault-of-the-incarnates/kurog-grimtotem',
        label: 'Kurog grimtotem',
      },
      {
        id: 'pve/vault-of-the-incarnates/broodkeeper-diurna',
        label: 'Broodkeeper Diurna',
      },
      {
        id: 'pve/vault-of-the-incarnates/raszageth-the-storm-eater',
        label: 'Raszageth The Storm Eater',
      },
      {
        id: 'pve/vault-of-the-incarnates/terros',
        label: 'Terros',
      },
      {
        id: 'pve/vault-of-the-incarnates/dathea-ascended',
        label: 'Dathea Ascended',
      },
    ],
  },
]

export const flattenedNoteCategories = flattenCategoryNodes(noteCategories)
