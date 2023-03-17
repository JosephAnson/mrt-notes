import type { Favourite, Group, Member } from '~/types'

export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
export const useGroups = () => useState<Group[]>('groups', () => [])
export const useFavourites = () => useState<Favourite[]>('favourites', () => [])
