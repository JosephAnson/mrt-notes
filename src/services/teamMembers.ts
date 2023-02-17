import type { Player, WowClassesUnion } from '~/types'
import type { Database } from '~/supabase.types'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export async function addTeamMember(playerName: string, playerClass: WowClassesUnion) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const { data } = await client.from('team_members')
    .upsert({
      name: playerName,
      class: playerClass,
      user_id: user.value?.id,
    })
    .select('id, name, class')
    .single()

  return data
}

export async function removeTeamMember(player: Player) {
  const client = useSupabaseClient<Database>()

  await client.from('team_members').delete().match({ id: player.id })
}
