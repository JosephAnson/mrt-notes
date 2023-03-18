import type { SpellIdInformation } from '~/types'
import { SPELL_INFO_BASE_URL } from '~/utils/constants'

export default defineEventHandler(async (event): Promise<SpellIdInformation> => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide spell id',
    })
  }
  const spellId = event.context.params.id
  const storageKey = `spell:${spellId}`

  const storedIcon = await useStorage().getItem(storageKey)
  if (storedIcon) return storedIcon

  try {
    const { icon, tooltip, name } = await $fetch<SpellIdInformation>(`${SPELL_INFO_BASE_URL}${spellId}`)

    const returnObj = { icon, tooltip, name }
    await useStorage().setItem(storageKey, returnObj)
    return returnObj
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Icon Not Found',
    })
  }
})
