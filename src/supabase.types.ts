export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      favourites: {
        Row: {
          created_at: string
          id: number
          note_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          note_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          note_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'favourites_note_id_fkey'
            columns: ['note_id']
            referencedRelation: 'notes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favourites_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          editor_string: string | null
          id: number
          note_id: number
          order: number
          players: string[] | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          editor_string?: string | null
          id?: number
          note_id: number
          order?: number
          players?: string[] | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          editor_string?: string | null
          id?: number
          note_id?: number
          order?: number
          players?: string[] | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'groups_note_id_fkey'
            columns: ['note_id']
            referencedRelation: 'notes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'groups_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      notes: {
        Row: {
          categories: string[] | null
          created_at: string
          description: string | null
          editor_string: string | null
          encounter: number | null
          expansion: number | null
          fts: unknown | null
          id: number
          instance: number | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          description?: string | null
          editor_string?: string | null
          encounter?: number | null
          expansion?: number | null
          fts?: unknown | null
          id?: number
          instance?: number | null
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          description?: string | null
          editor_string?: string | null
          encounter?: number | null
          expansion?: number | null
          fts?: unknown | null
          id?: number
          instance?: number | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notes_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      team_members: {
        Row: {
          class: string
          created_at: string | null
          id: number
          name: string
          order: number | null
          user_id: string | null
        }
        Insert: {
          class?: string
          created_at?: string | null
          id?: number
          name?: string
          order?: number | null
          user_id?: string | null
        }
        Update: {
          class?: string
          created_at?: string | null
          id?: number
          name?: string
          order?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'team_members_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      favourites_count: {
        Row: {
          count: number | null
          note_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'favourites_note_id_fkey'
            columns: ['note_id']
            referencedRelation: 'notes'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      array_to_string_immutable: {
        Args: {
          arg: string[]
          separator: string
          null_string?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
