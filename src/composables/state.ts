import type { Group, Member, Note } from '~/types'

export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
export const useNotes = () => useState<Note[]>('notes', () => [])
export const useGroups = () => useState<Group[]>('groups', () => [])
