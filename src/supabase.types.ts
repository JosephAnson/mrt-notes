export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      favourites: {
        Row: {
          created_at: string | null
          id: number
          note_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          note_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          note_id?: number
          user_id?: string
        }
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
      }
    }
    Views: {
      [_ in never]: never
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
