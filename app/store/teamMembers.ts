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

      openSnackbar(`Added Member: ${teamMember.name}`)
    }
  }

  async function removeMember(player: Member) {
    await removeTeamMember(player)
    members.value = members.value.filter(t => t.id !== player.id) || []

    openSnackbar({ message: `Removed: ${player.name}`, background: 'bg-red-700' })

    return members
  }

  async function updateMembers() {
    await updateTeamMembers(members.value)

    openSnackbar('Updated Members')
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
