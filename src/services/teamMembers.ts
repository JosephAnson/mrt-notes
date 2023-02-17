import type { Member, WowClassesUnion } from '~/types'
import type { Database } from '~/supabase.types'
import { useTeamMembers } from '~/composables/state'
import SnackbarProgrammatic from '~/components/Programatic/SnackbarProgramatic'

export function setTeamMembers(members: Member[]) {
  const teamMembers = useTeamMembers()

  teamMembers.value = members
}

export async function getAllTeamMembers() {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  return client.from('team_members').select('id, name, class').eq('user_id', user.value?.id).order('created_at')
}

export async function updateMembers(members: Member[]) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  await client.from('team_members')
    .upsert(members.map(member => ({
      id: member.id,
      name: member.name,
      user_id: user.value?.id,
      class: member.class,
    })))
    .select('id, name, class')

  SnackbarProgrammatic.open('Saved')
}

export async function addTeamMember(playerName: string, playerClass: WowClassesUnion) {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { data } = await client.from('team_members')
    .insert({
      name: playerName,
      class: playerClass,
      user_id: user.value?.id,
    })
    .select('id, name, class')
    .single()

  const teamMembers = useTeamMembers()
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
