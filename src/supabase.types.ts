export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          created_at: string | null
          editor_string: string | null
          id: number
          name: string
          note_id: number
          order: number
          players: string[] | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          editor_string?: string | null
          id?: number
          name?: string
          note_id: number
          order?: number
          players?: string[] | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          editor_string?: string | null
          id?: number
          name?: string
          note_id?: number
          order?: number
          players?: string[] | null
          type?: string | null
        }
      }
      notes: {
        Row: {
          created_at: string | null
          editor_string: string | null
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          editor_string?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          editor_string?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
      }
      team_members: {
        Row: {
          class: string
          created_at: string | null
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          class?: string
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
        Update: {
          class?: string
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
