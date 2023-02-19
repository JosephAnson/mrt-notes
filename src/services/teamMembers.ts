import type { Member, WowClassesUnion } from '~/types'
import type { Database } from '~/supabase.types'
import { useTeamMembers } from '~/composables/state'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'

const teamMembersColumns = 'id, name, class'

type TeamMembersRow = Database['public']['Tables']['team_members']['Row']
export function setTeamMembers(members: Pick<TeamMembersRow, 'id' | 'name' | 'class'>[]) {
  const teamMembers = useTeamMembers()

  teamMembers.value = members.map(item => ({
    id: item.id,
    class: item.class as WowClassesUnion,
    name: item.name,
  }))
}

export async function getAllTeamMembers() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  return await useAsyncData('teamMembers', async () => {
    const { data } = await client.from('team_members').select(teamMembersColumns).eq('user_id', user.value?.id).order('order')
    return data
  })
}

export async function updateMembers(members: Member[]) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  await client.from('team_members')
    .upsert(members.map((member, index) => ({
      id: member.id,
      name: member.name,
      user_id: user.value?.id,
      order: index,
      class: member.class,
    })))
    .select(teamMembersColumns)

  SnackbarProgrammatic.open('Saved')
}

export async function addTeamMember(playerName: string, playerClass: WowClassesUnion) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const teamMembers = useTeamMembers()

  const { data } = await client.from('team_members')
    .insert({
      name: playerName,
      class: playerClass,
      order: teamMembers.value.length + 1,
      user_id: user.value?.id,
    })
    .select(teamMembersColumns)
    .single()

  if (data) {
    teamMembers.value?.push({
      id: data.id,
      class: data.class as WowClassesUnion,
      name: data.name,
    })
  }
}

export async function removeTeamMember(player: Member) {
  const client = useSupabaseClient<Database>()

  const teamMembers = useTeamMembers()
  teamMembers.value = teamMembers.value?.filter(t => t.id !== player.id) || []

  return client.from('team_members').delete().match({ id: player.id })
}
