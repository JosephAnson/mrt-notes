import type { Favourite, Group, Member, Note, Profile } from '~/types'

export const useProfile = () =>
  useState<Profile>('profile', () => ({
    id: '',
    username: null,
    avatar_url: null,
  }))

export const useNotes = () => useState<Note[]>('notes', () => [])
export const useSearchNotes = () => useState<Note[]>('searchNotes', () => [])
export const useUserNotes = () => useState<Note[]>('userNotes', () => [])
export const useRecentlyCreatedNotes = () =>
  useState<Note[]>('recentlyCreateNotes', () => [])
export const useRecentlyUpdatedNotes = () =>
  useState<Note[]>('recentlyUpdatedNotes', () => [])

export const useTeamMembers = () => useState<Member[]>('teamMembers', () => [])
export const useGroups = () => useState<Group[]>('groups', () => [])
export const useFavourites = () => useState<Favourite[]>('favourites', () => [])
