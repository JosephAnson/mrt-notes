import type { Member, WowClassesUnion } from '~/types'
import type { Database } from '~/supabase.types'

const teamMembersColumns = 'id, name, class'

export async function getAllTeamMembers() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { data } = await client
    .from('team_members')
    .select(teamMembersColumns)
    .eq('user_id', user.value?.id)
    .order('order')

  return data as Member[]
}
export async function updateTeamMembers(members: Member[]) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { data } = await client
    .from('team_members')
    .upsert(
      members.map((member, index) => ({
        id: member.id,
        name: member.name,
        user_id: user.value?.id,
        order: index,
        class: member.class,
      }))
    )
    .select(teamMembersColumns)
  return data
}

export async function addTeamMember(playerName: string, playerClass: WowClassesUnion, order: number) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const { data } = await client
    .from('team_members')
    .insert({
      name: playerName,
      class: playerClass,
      order,
      user_id: user.value?.id,
    })
    .select(teamMembersColumns)
    .single()

  return data
}

export async function removeTeamMember(player: Member) {
  const client = useSupabaseClient<Database>()
  return client.from('team_members').delete().match({ id: player.id })
}
