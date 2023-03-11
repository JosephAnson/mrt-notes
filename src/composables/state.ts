import type { Favourite, Group, Member, Profile } from '~/types'

export const useProfile = () =>
  useState<Profile>('profile', () => ({
    id: '',
    username: null,
    avatar_url: null,
  }))

export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
export const useGroups = () => useState<Group[]>('groups', () => [])
export const useFavourites = () => useState<Favourite[]>('favourites', () => [])
