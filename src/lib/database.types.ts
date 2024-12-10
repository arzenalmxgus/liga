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
      profiles: {
        Row: {
          id: string
          created_at: string
          first_name: string | null
          middle_name: string | null
          last_name: string | null
          suffix: string | null
          birthdate: string | null
          profile_picture_path: string | null
          user_role: 'attendee' | 'host'
        }
        Insert: {
          id: string
          created_at?: string
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          suffix?: string | null
          birthdate?: string | null
          profile_picture_path?: string | null
          user_role?: 'attendee' | 'host'
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string | null
          middle_name?: string | null
          last_name?: string | null
          suffix?: string | null
          birthdate?: string | null
          profile_picture_path?: string | null
          user_role?: 'attendee' | 'host'
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
  }
}