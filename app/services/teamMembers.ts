import type { Database } from '~/supabase.types'
import type { Member, WowClassesUnion } from '~/types'

const teamMembersColumns = 'id, name, class'

export async function getAllTeamMembers() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  if (!user.value?.id) return []

  const { data } = await client
    .from('team_members')
    .select(teamMembersColumns)
    .eq('user_id', user.value?.id)
    .order('order')
    .returns<Member[]>()

  return data
}

export async function updateTeamMembers(members?: Member[] | null) {
  if (members) {
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
        })),
      )
      .returns<Member[]>()
      .select(teamMembersColumns)
    return data
  }
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
    .returns<Member[]>()
    .single()

  return data
}

export async function removeTeamMember(player: Member) {
  const client = useSupabaseClient<Database>()
  return client.from('team_members').delete().match({ id: player.id })
}
