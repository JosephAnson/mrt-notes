import type { Favourite, Group, Member, Note, Profile } from '~/types'

export const useProfile = () =>
  useState<Profile>('profile', () => ({
    id: '',
    username: null,
    avatar_url: null,
  }))
export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
export const useNotes = () => useState<Note[]>('notes', () => [])
export const useGroups = () => useState<Group[]>('groups', () => [])
export const useFavourites = () => useState<Favourite[]>('favourites', () => [])
