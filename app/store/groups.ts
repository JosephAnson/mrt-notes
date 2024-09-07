import { generateJSON } from '@tiptap/html'
import { toast } from 'vue-sonner'
import { createNewGroup, deleteGroupById } from '~/services/groups'
import type { Group, GroupTypeUnion } from '~/types'
import { editorExtensions } from '~/utils/editor'

interface GroupsState {
  groups: Group[]
}

export const useGroupsStore = defineStore('Groups', {
  state: (): GroupsState => ({
    groups: [],
  }),
  actions: {
    clearGroups() {
      this.groups = []
    },
    setGroups(newGroups: Group[]) {
      this.groups = newGroups
    },
    async deleteGroup(id: number) {
      await deleteGroupById(id)
      this.groups = this.groups.filter(t => t.id !== id) || []
    },
    async addGroup(
      note_id: number,
      order: number,
      type: GroupTypeUnion = 'Healers',
      editor_string = '',
      players?: string[],
    ) {
      const user = useSupabaseUser()
      if (user.value) {
        const newGroup = await createNewGroup({
          note_id,
          order: this.groups.length + 1,
          type,
          editor_string,
          players,
          user_id: user.value.id,
        })

        if (newGroup) {
          this.groups?.push({
            id: newGroup.id,
            note: { value: newGroup.editor_string || '', json: {} },
            type: (newGroup.type as GroupTypeUnion) || 'Players',
            players: newGroup.players || [],
          })
        }
      }
      else {
        toast.error('Need to be logged in to add group')
      }
    },
    async fetchAllGroups(noteId: number) {
      const groups = await getAllGroups(noteId)

      if (groups) {
        this.setGroups(
          groups.map((item, index) => ({
            id: item.id,
            note: { value: item.editor_string || '', json: generateJSON(item.editor_string || '', editorExtensions) },
            order: index,
            type: (item.type as GroupTypeUnion) || 'Players',
            players: item.players || [],
          })),
        )
      }
    },
  },
})
