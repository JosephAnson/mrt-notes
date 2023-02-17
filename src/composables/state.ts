import type { Member, Note } from '~/types'

export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
export const useNotes = () => useState<Note[]>('notes', () => [])
