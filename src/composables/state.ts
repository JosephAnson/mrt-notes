import type { Member } from '~/types'

export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
