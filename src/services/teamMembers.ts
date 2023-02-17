import type { Player, WowClassesUnion } from '~/types'
import type { Database } from '~/supabase.types'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export async function getAllTeamMembers() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('team_members').select('id, name, class').eq('user_id', user.value?.id).order('created_at')
}

export async function addTeamMember(playerName: string, playerClass: WowClassesUnion) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('team_members')
    .upsert({
      name: playerName,
      class: playerClass,
      user_id: user.value?.id,
    })
    .select('id, name, class')
    .single()
}

export async function removeTeamMember(player: Player) {
  const client = useSupabaseClient<Database>()
  return await client.from('team_members').delete().match({ id: player.id })
}
