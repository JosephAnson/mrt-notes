import type { SpellIdInformation } from '~/types'
import { SPELL_INFO_BASE_URL } from '~/utils/constants'

export default cachedEventHandler(
  async (event): Promise<SpellIdInformation> => {
    if (!event.context.params) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Should provide spell id',
      })
    }
    const spellId = event.context.params.id

    try {
      const { icon, tooltip, name } = await $fetch<SpellIdInformation>(`${SPELL_INFO_BASE_URL}${spellId}`)

      return { icon, tooltip, name }
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: 'Icon Not Found',
      })
    }
  },
  {
    maxAge: 60 * 60 * 24 * 7,
  }
)
