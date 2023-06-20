import type { SpellIdInformation } from '../../../types'
import { SPELL_INFO_BASE_URL } from '../../../utils/constants'

interface Response extends SpellIdInformation {
  error: string
}

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
      const { icon, tooltip, name, error } = await $fetch<Response>(`${SPELL_INFO_BASE_URL}${spellId}`)

      if (error) {
        return {
          icon: 'trade_engineering',
          tooltip:
            '<a class="whtt-name" href="https://www.wowhead.com/spell=106727/unknown"><b class="whtt-name">Unknown</b></a><br />Instant',
          name: 'Unknown',
        }
      }

      const includeWowHeadURLinTooltip = tooltip.replace(
        'href="',
        'rel="noreferrer nofollow" target="_blank" href="https://www.wowhead.com'
      )

      return { icon, tooltip: includeWowHeadURLinTooltip, name }
    } catch {
      return {
        icon: 'trade_engineering',
        tooltip:
          '<a class="whtt-name" href="https://www.wowhead.com/spell=106727/unknown"><b class="whtt-name">Unknown</b></a><br />Instant',
        name: 'Unknown',
      }
    }
  },
  {
    name: 'spell',
    group: 'spell',
    maxAge: 60 * 60 * 24 * 7,
  }
)
