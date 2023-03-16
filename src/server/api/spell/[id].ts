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
  if (storedIcon)
    return {
      icon: storedIcon.icon,
      tooltip: storedIcon.tooltip,
      name: storedIcon.name,
    }

  try {
    const { icon, tooltip, name } = await $fetch<SpellIdInformation>(`${SPELL_INFO_BASE_URL}${spellId}`)

    await useStorage().setItem(storageKey, { icon, tooltip, name })

    return { icon, tooltip, name }
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Icon Not Found',
    })
  }
})
