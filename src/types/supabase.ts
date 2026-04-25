export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      maintenance_reports: {
        Row: {
          description: string | null
          id: string
          issue_type: string
          photo_url: string | null
          resolved_at: string | null
          room_number: string
          status: string
          timestamp: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          issue_type: string
          photo_url?: string | null
          resolved_at?: string | null
          room_number: string
          status: string
          timestamp?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          issue_type?: string
          photo_url?: string | null
          resolved_at?: string | null
          room_number?: string
          status?: string
          timestamp?: string | null
        }
      }
      missing_items_reports: {
        Row: {
          comment: string | null
          id: string
          items: string[]
          photo_url: string | null
          provided: boolean
          provided_at: string | null
          room_number: string
          steward: string
          timestamp: string | null
        }
        Insert: {
          comment?: string | null
          id?: string
          items: string[]
          photo_url?: string | null
          provided?: boolean
          provided_at?: string | null
          room_number: string
          steward: string
          timestamp?: string | null
        }
        Update: {
          comment?: string | null
          id?: string
          items?: string[]
          photo_url?: string | null
          provided?: boolean
          provided_at?: string | null
          room_number?: string
          steward?: string
          timestamp?: string | null
        }
      }
      rooms: {
        Row: {
          created_at: string | null
          floor: number
          id: string
          last_cleaned: string | null
          number: string
          photo_url: string | null
          status: string
          steward: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          floor: number
          id?: string
          last_cleaned?: string | null
          number: string
          photo_url?: string | null
          status: string
          steward?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          floor?: number
          id?: string
          last_cleaned?: string | null
          number?: string
          photo_url?: string | null
          status?: string
          steward?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}