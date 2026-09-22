export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          metric: string
          threshold: number
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          metric: string
          threshold: number
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          metric?: string
          threshold?: number
          title?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string
          distance_km: number | null
          duration_seconds: number
          id: string
          is_demo: boolean
          kind: string
          note: string | null
          pace_seconds: number | null
          photo_url: string | null
          profile_id: string
          strava_activity_id: number | null
          updated_at: string
          visibility: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          created_at?: string
          distance_km?: number | null
          duration_seconds: number
          id?: string
          is_demo?: boolean
          kind: string
          note?: string | null
          pace_seconds?: number | null
          photo_url?: string | null
          profile_id: string
          strava_activity_id?: number | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string
          distance_km?: number | null
          duration_seconds?: number
          id?: string
          is_demo?: boolean
          kind?: string
          note?: string | null
          pace_seconds?: number | null
          photo_url?: string | null
          profile_id?: string
          strava_activity_id?: number | null
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_comments: {
        Row: {
          activity_id: string
          body: string
          created_at: string
          id: string
          is_hidden: boolean
          profile_id: string
          updated_at: string
        }
        Insert: {
          activity_id: string
          body: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          profile_id: string
          updated_at?: string
        }
        Update: {
          activity_id?: string
          body?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_comments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_likes: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_likes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_profile_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          gallery_image_urls: string[]
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_profile_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          gallery_image_urls?: string[]
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_profile_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          gallery_image_urls?: string[]
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_profile_id_fkey"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_profile_id_fkey"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          id: string
          joined_at: string
          profile_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          joined_at?: string
          profile_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          end_date: string
          goal: number
          goal_type: string
          id: string
          image_url: string | null
          is_demo: boolean
          slug: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          end_date: string
          goal: number
          goal_type?: string
          id?: string
          image_url?: string | null
          is_demo?: boolean
          slug?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          end_date?: string
          goal?: number
          goal_type?: string
          id?: string
          image_url?: string | null
          is_demo?: boolean
          slug?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      circle_members: {
        Row: {
          circle_id: string
          id: string
          joined_at: string
          profile_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string
          profile_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_feelings: {
        Row: {
          created_at: string
          feeling_date: string
          feeling_detail: string | null
          id: string
          mood: string
          note: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feeling_date?: string
          feeling_detail?: string | null
          id?: string
          mood: string
          note?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feeling_date?: string
          feeling_detail?: string | null
          id?: string
          mood?: string
          note?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_feelings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_feelings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          event_id: string
          id: string
          profile_id: string
          registered_at: string
        }
        Insert: {
          event_id: string
          id?: string
          profile_id: string
          registered_at?: string
        }
        Update: {
          event_id?: string
          id?: string
          profile_id?: string
          registered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          registration_open: boolean
          slug: string
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          registration_open?: boolean
          slug: string
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          registration_open?: boolean
          slug?: string
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      intimacy_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intimacy_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intimacy_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          profile_id: string
          read_at: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          profile_id: string
          read_at?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          profile_id?: string
          read_at?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          delivery_method: string
          email: string
          id: string
          items: Json
          payment_method: string
          phone: string | null
          shipping_address: Json | null
          shipping_cents: number
          status: string
          stripe_session_id: string | null
          subtotal_cents: number
          total_cents: number
        }
        Insert: {
          created_at?: string
          customer_name: string
          delivery_method: string
          email: string
          id?: string
          items: Json
          payment_method: string
          phone?: string | null
          shipping_address?: Json | null
          shipping_cents?: number
          status?: string
          stripe_session_id?: string | null
          subtotal_cents: number
          total_cents: number
        }
        Update: {
          created_at?: string
          customer_name?: string
          delivery_method?: string
          email?: string
          id?: string
          items?: Json
          payment_method?: string
          phone?: string | null
          shipping_address?: Json | null
          shipping_cents?: number
          status?: string
          stripe_session_id?: string | null
          subtotal_cents?: number
          total_cents?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          city_lat: number | null
          city_lng: number | null
          country: string | null
          cover_photo_url: string | null
          created_at: string
          cycle_length_days: number | null
          date_of_birth: string | null
          dynamic_theme: boolean
          gallery_photos: string[]
          gifts: string | null
          id: string
          interests: string[]
          is_demo: boolean
          is_menopause: boolean
          is_postpartum: boolean
          is_pregnant: boolean
          is_public: boolean
          is_trying_to_conceive: boolean
          last_period_date: string | null
          name: string
          notify_challenges: boolean
          notify_comments: boolean
          notify_likes: boolean
          onboarding_completed: boolean
          postpartum_since: string | null
          pregnancy_due_date: string | null
          share_chapter: boolean
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          city_lat?: number | null
          city_lng?: number | null
          country?: string | null
          cover_photo_url?: string | null
          created_at?: string
          cycle_length_days?: number | null
          date_of_birth?: string | null
          dynamic_theme?: boolean
          gallery_photos?: string[]
          gifts?: string | null
          id?: string
          interests?: string[]
          is_demo?: boolean
          is_menopause?: boolean
          is_postpartum?: boolean
          is_pregnant?: boolean
          is_public?: boolean
          is_trying_to_conceive?: boolean
          last_period_date?: string | null
          name?: string
          notify_challenges?: boolean
          notify_comments?: boolean
          notify_likes?: boolean
          onboarding_completed?: boolean
          postpartum_since?: string | null
          pregnancy_due_date?: string | null
          share_chapter?: boolean
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          city_lat?: number | null
          city_lng?: number | null
          country?: string | null
          cover_photo_url?: string | null
          created_at?: string
          cycle_length_days?: number | null
          date_of_birth?: string | null
          dynamic_theme?: boolean
          gallery_photos?: string[]
          gifts?: string | null
          id?: string
          interests?: string[]
          is_demo?: boolean
          is_menopause?: boolean
          is_postpartum?: boolean
          is_pregnant?: boolean
          is_public?: boolean
          is_trying_to_conceive?: boolean
          last_period_date?: string | null
          name?: string
          notify_challenges?: boolean
          notify_comments?: boolean
          notify_likes?: boolean
          onboarding_completed?: boolean
          postpartum_since?: string | null
          pregnancy_due_date?: string | null
          share_chapter?: boolean
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      strava_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: number
          id: string
          profile_id: string
          refresh_token: string
          strava_athlete_id: number
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: number
          id?: string
          profile_id: string
          refresh_token: string
          strava_athlete_id: number
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: number
          id?: string
          profile_id?: string
          refresh_token?: string
          strava_athlete_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strava_connections_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strava_connections_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          profile_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_directory: {
        Row: {
          avatar_url: string | null
          bio: string | null
          chapter: string | null
          city: string | null
          city_lat: number | null
          city_lng: number | null
          created_at: string | null
          id: string | null
          interests: string[] | null
          is_demo: boolean | null
          name: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          chapter?: never
          city?: string | null
          city_lat?: number | null
          city_lng?: number | null
          created_at?: string | null
          id?: string | null
          interests?: string[] | null
          is_demo?: boolean | null
          name?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          chapter?: never
          city?: string | null
          city_lat?: number | null
          city_lng?: number | null
          created_at?: string | null
          id?: string | null
          interests?: string[] | null
          is_demo?: boolean | null
          name?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_daily_series: {
        Args: { _days?: number }
        Returns: {
          activities: number
          day: string
          feelings: number
          signups: number
        }[]
      }
      admin_members: {
        Args: never
        Returns: {
          activities: number
          avatar_url: string
          city: string
          email: string
          email_confirmed: boolean
          feelings: number
          is_admin: boolean
          is_public: boolean
          km: number
          last_activity: string
          last_sign_in_at: string
          name: string
          onboarding_completed: boolean
          profile_id: string
          registered_at: string
          user_id: string
          username: string
        }[]
      }
      admin_stats: { Args: never; Returns: Json }
      challenge_leaderboard: {
        Args: { _challenge_id: string; _metric?: string }
        Returns: {
          activities: number
          avatar_url: string
          name: string
          profile_id: string
          username: string
          value: number
        }[]
      }
      challenge_progress: {
        Args: { _challenge_id: string }
        Returns: {
          my_contribution: number
          participants: number
          progress: number
        }[]
      }
      current_profile_id: { Args: never; Returns: string }
      delete_my_account_data: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_username_available: { Args: { _username: string }; Returns: boolean }
      profile_stats: {
        Args: { _profile_id: string }
        Returns: {
          month_km: number
          month_runs: number
          month_workouts: number
          streak_days: number
          total_km: number
          total_minutes: number
          total_runs: number
          total_workouts: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
