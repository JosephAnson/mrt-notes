import { addTeamMember, getAllTeamMembers, removeTeamMember, updateTeamMembers } from '~/services/teamMembers'
import type { Member, WowClassesUnion } from '~/types'

interface TeamMembersState {
  members: Member[]
}

export const useTeamMembersStore = defineStore('teamMembers', {
  state: (): TeamMembersState => ({
    members: [],
  }),
  actions: {
    setTeamMembers(members: Member[]) {
      this.members = members.map((item) => ({
        id: item.id,
        class: item.class as WowClassesUnion,
        name: item.name,
      }))
    },
    async addMember(playerName: string, playerClass: WowClassesUnion) {
      const teamMember = await addTeamMember(playerName, playerClass, this.members.length + 1)

      if (teamMember) {
        this.members.push({
          id: teamMember.id,
          class: teamMember.class as WowClassesUnion,
          name: teamMember.name,
        })

        openSnackbar(`Added Member: ${teamMember.name}`)
      }
    },
    async removeMember(player: Member) {
      await removeTeamMember(player)
      this.members = this.members.filter((t) => t.id !== player.id) || []

      openSnackbar({ message: `Removed: ${player.name}`, background: 'bg-red-700' })

      return this.members
    },
    async updateMembers() {
      await updateTeamMembers(this.members)

      openSnackbar('Updated Members')
    },
    async fetchAllTeamMembers() {
      const members = await getAllTeamMembers()
      this.setTeamMembers(members)
    },
  },
})
