import { toast } from 'vue-sonner'
import { addTeamMember, getAllTeamMembers, removeTeamMember, updateTeamMembers } from '~/services/teamMembers'
import type { Member, WowClassesUnion } from '~/types'

export const useTeamMembersStore = defineStore('teamMembers', () => {
  const members = ref([] as Member[])

  async function addMember(playerName: string, playerClass: WowClassesUnion) {
    const teamMember = await addTeamMember(playerName, playerClass, members.length + 1)

    if (teamMember) {
      members.value.push({
        id: teamMember.id,
        class: teamMember.class as WowClassesUnion,
        name: teamMember.name,
      })

      toast.success(`Added Member: ${teamMember.name}`)
    }
  }

  async function removeMember(player: Member) {
    await removeTeamMember(player)
    members.value = members.value.filter(t => t.id !== player.id) || []

    toast.success(`Removed: ${player.name}`)

    return members
  }

  async function updateMembers() {
    await updateTeamMembers(members.value)

    toast.success('Updated Members')
  }

  async function fetchAllTeamMembers() {
    const newMembers = await getAllTeamMembers()
    if (newMembers) {
      members.value = newMembers.map(item => ({
        id: item.id,
        class: item.class as WowClassesUnion,
        name: item.name,
      }))
    }
  }

  return {
    members,
    addMember,
    removeMember,
    updateMembers,
    fetchAllTeamMembers,
  }
})
