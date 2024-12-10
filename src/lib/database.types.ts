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
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          location: string
          location_coordinates: [number, number] | null
          category: string
          participants_limit: number
          current_participants: number
          entrance_fee: number | null
          is_free: boolean
          banner_photo: string
          host_id: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          date: string
          location: string
          location_coordinates?: [number, number] | null
          category: string
          participants_limit: number
          current_participants?: number
          entrance_fee?: number | null
          is_free?: boolean
          banner_photo: string
          host_id: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          date?: string
          location?: string
          location_coordinates?: [number, number] | null
          category?: string
          participants_limit?: number
          current_participants?: number
          entrance_fee?: number | null
          is_free?: boolean
          banner_photo?: string
          host_id?: string
          description?: string | null
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