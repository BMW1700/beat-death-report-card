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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          icon: string | null
          id: string
          metadata: Json | null
          rarity: string | null
          unlocked_at: string | null
          user_id: string
          xp_reward: number | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          rarity?: string | null
          unlocked_at?: string | null
          user_id: string
          xp_reward?: number | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json | null
          rarity?: string | null
          unlocked_at?: string | null
          user_id?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      community_interactions: {
        Row: {
          analysis_id: string | null
          content: string | null
          created_at: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_interactions_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "death_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      death_analyses: {
        Row: {
          analysis_type: string | null
          category: string | null
          community_corrected: boolean | null
          confidence: number | null
          corrected_item: string | null
          created_at: string | null
          final_words: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          item_detected: string | null
          kill_rating: number | null
          kill_rating_text: string | null
          lethal_dose: string | null
          mechanism: string | null
          original_detection: string | null
          scenario: string | null
          survival_tips: string | null
          time_to_death: string | null
          toxicity_level: number | null
          user_id: string
        }
        Insert: {
          analysis_type?: string | null
          category?: string | null
          community_corrected?: boolean | null
          confidence?: number | null
          corrected_item?: string | null
          created_at?: string | null
          final_words?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          item_detected?: string | null
          kill_rating?: number | null
          kill_rating_text?: string | null
          lethal_dose?: string | null
          mechanism?: string | null
          original_detection?: string | null
          scenario?: string | null
          survival_tips?: string | null
          time_to_death?: string | null
          toxicity_level?: number | null
          user_id: string
        }
        Update: {
          analysis_type?: string | null
          category?: string | null
          community_corrected?: boolean | null
          confidence?: number | null
          corrected_item?: string | null
          created_at?: string | null
          final_words?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          item_detected?: string | null
          kill_rating?: number | null
          kill_rating_text?: string | null
          lethal_dose?: string | null
          mechanism?: string | null
          original_detection?: string | null
          scenario?: string | null
          survival_tips?: string | null
          time_to_death?: string | null
          toxicity_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      death_duels: {
        Row: {
          challenger_id: string
          challenger_scenario: string
          challenger_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          opponent_id: string | null
          opponent_scenario: string | null
          opponent_score: number | null
          status: string | null
          winner_id: string | null
        }
        Insert: {
          challenger_id: string
          challenger_scenario: string
          challenger_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          opponent_id?: string | null
          opponent_scenario?: string | null
          opponent_score?: number | null
          status?: string | null
          winner_id?: string | null
        }
        Update: {
          challenger_id?: string
          challenger_scenario?: string
          challenger_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          opponent_id?: string | null
          opponent_scenario?: string | null
          opponent_score?: number | null
          status?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          created_at: string | null
          id: string
          leaderboard_type: string
          rank: number | null
          score: number
          updated_at: string | null
          user_id: string
          week_of: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          leaderboard_type: string
          rank?: number | null
          score: number
          updated_at?: string | null
          user_id: string
          week_of?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          leaderboard_type?: string
          rank?: number | null
          score?: number
          updated_at?: string | null
          user_id?: string
          week_of?: string | null
        }
        Relationships: []
      }
      life_actions: {
        Row: {
          action_id: string
          category: string
          description: string
          id: string
          logged_at: string | null
          method: string | null
          minutes_impact: number
          user_id: string
        }
        Insert: {
          action_id: string
          category: string
          description: string
          id?: string
          logged_at?: string | null
          method?: string | null
          minutes_impact: number
          user_id: string
        }
        Update: {
          action_id?: string
          category?: string
          description?: string
          id?: string
          logged_at?: string | null
          method?: string | null
          minutes_impact?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          alcohol_frequency: string | null
          allergies: string | null
          avatar_url: string | null
          bio: string | null
          calculated_baseline_years: number | null
          chronic_conditions: Json | null
          created_at: string | null
          danger_level: number | null
          data_consent_level: string | null
          desired_products: Json | null
          diet_quality_score: number | null
          diet_restrictions: string | null
          display_name: string | null
          email: string | null
          exercise_frequency: string | null
          exercise_history_years: number | null
          exercise_intensity: string | null
          family_health_history: Json | null
          free_scans_used: number | null
          gender: string | null
          happiness_score: number | null
          health_score: number | null
          id: string
          immortal_mode: boolean | null
          life_satisfaction_score: number | null
          location: string | null
          medication_count: number | null
          mental_health_score: number | null
          onboarding_completed_at: string | null
          premium_user: boolean | null
          sleep_disorders: string | null
          sleep_hours_avg: number | null
          sleep_quality_score: number | null
          smoking_status: string | null
          social_connections_score: number | null
          stress_level: number | null
          subscription_active: boolean | null
          subscription_tier: string | null
          substance_use: string | null
          supplements: Json | null
          survival_streak: number | null
          survivalist_mode: boolean | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
          username: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          age?: number | null
          alcohol_frequency?: string | null
          allergies?: string | null
          avatar_url?: string | null
          bio?: string | null
          calculated_baseline_years?: number | null
          chronic_conditions?: Json | null
          created_at?: string | null
          danger_level?: number | null
          data_consent_level?: string | null
          desired_products?: Json | null
          diet_quality_score?: number | null
          diet_restrictions?: string | null
          display_name?: string | null
          email?: string | null
          exercise_frequency?: string | null
          exercise_history_years?: number | null
          exercise_intensity?: string | null
          family_health_history?: Json | null
          free_scans_used?: number | null
          gender?: string | null
          happiness_score?: number | null
          health_score?: number | null
          id?: string
          immortal_mode?: boolean | null
          life_satisfaction_score?: number | null
          location?: string | null
          medication_count?: number | null
          mental_health_score?: number | null
          onboarding_completed_at?: string | null
          premium_user?: boolean | null
          sleep_disorders?: string | null
          sleep_hours_avg?: number | null
          sleep_quality_score?: number | null
          smoking_status?: string | null
          social_connections_score?: number | null
          stress_level?: number | null
          subscription_active?: boolean | null
          subscription_tier?: string | null
          substance_use?: string | null
          supplements?: Json | null
          survival_streak?: number | null
          survivalist_mode?: boolean | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          age?: number | null
          alcohol_frequency?: string | null
          allergies?: string | null
          avatar_url?: string | null
          bio?: string | null
          calculated_baseline_years?: number | null
          chronic_conditions?: Json | null
          created_at?: string | null
          danger_level?: number | null
          data_consent_level?: string | null
          desired_products?: Json | null
          diet_quality_score?: number | null
          diet_restrictions?: string | null
          display_name?: string | null
          email?: string | null
          exercise_frequency?: string | null
          exercise_history_years?: number | null
          exercise_intensity?: string | null
          family_health_history?: Json | null
          free_scans_used?: number | null
          gender?: string | null
          happiness_score?: number | null
          health_score?: number | null
          id?: string
          immortal_mode?: boolean | null
          life_satisfaction_score?: number | null
          location?: string | null
          medication_count?: number | null
          mental_health_score?: number | null
          onboarding_completed_at?: string | null
          premium_user?: boolean | null
          sleep_disorders?: string | null
          sleep_hours_avg?: number | null
          sleep_quality_score?: number | null
          smoking_status?: string | null
          social_connections_score?: number | null
          stress_level?: number | null
          subscription_active?: boolean | null
          subscription_tier?: string | null
          substance_use?: string | null
          supplements?: Json | null
          survival_streak?: number | null
          survivalist_mode?: boolean | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: []
      }
      scan_credits: {
        Row: {
          credits_purchased: number
          credits_remaining: number
          id: string
          purchased_at: string | null
          source: string
          stripe_payment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          credits_purchased?: number
          credits_remaining?: number
          id?: string
          purchased_at?: string | null
          source?: string
          stripe_payment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          credits_purchased?: number
          credits_remaining?: number
          id?: string
          purchased_at?: string | null
          source?: string
          stripe_payment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      viral_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          creator_id: string
          description: string | null
          expires_at: string | null
          id: string
          is_featured: boolean | null
          likes_count: number | null
          parameters: Json | null
          participants_count: number | null
          shares_count: number | null
          title: string
          trending_score: number | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          likes_count?: number | null
          parameters?: Json | null
          participants_count?: number | null
          shares_count?: number | null
          title: string
          trending_score?: number | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          likes_count?: number | null
          parameters?: Json | null
          participants_count?: number | null
          shares_count?: number | null
          title?: string
          trending_score?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          danger_level: number | null
          display_name: string | null
          immortal_mode: boolean | null
          survival_streak: number | null
          survivalist_mode: boolean | null
          total_xp: number | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          danger_level?: number | null
          display_name?: string | null
          immortal_mode?: boolean | null
          survival_streak?: number | null
          survivalist_mode?: boolean | null
          total_xp?: number | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          danger_level?: number | null
          display_name?: string | null
          immortal_mode?: boolean | null
          survival_streak?: number | null
          survivalist_mode?: boolean | null
          total_xp?: number | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      consume_scan_credit: { Args: { p_user_id: string }; Returns: boolean }
      deduct_free_scan: { Args: { p_user_id: string }; Returns: boolean }
      get_global_feed: {
        Args: { p_limit?: number }
        Returns: {
          category: string
          description: string
          id: string
          logged_at: string
          minutes_impact: number
          username: string
        }[]
      }
      grant_scan_credits: {
        Args: {
          p_amount: number
          p_source?: string
          p_stripe_payment_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      increment_xp: {
        Args: { p_user_id: string; p_xp: number }
        Returns: undefined
      }
      join_viral_challenge: {
        Args: { p_challenge_id: string }
        Returns: boolean
      }
      like_viral_challenge: {
        Args: { p_challenge_id: string }
        Returns: boolean
      }
      share_viral_challenge: {
        Args: { p_challenge_id: string }
        Returns: boolean
      }
      submit_duel_response: {
        Args: {
          p_duel_id: string
          p_opponent_id: string
          p_opponent_scenario: string
          p_opponent_score: number
        }
        Returns: boolean
      }
      unlock_achievement: {
        Args: {
          p_achievement_name: string
          p_achievement_type: string
          p_description: string
          p_icon: string
          p_rarity: string
          p_user_id: string
          p_xp_reward: number
        }
        Returns: boolean
      }
      update_trending_scores: { Args: never; Returns: undefined }
      upsert_leaderboard_entry: {
        Args: { p_leaderboard_type: string; p_score: number; p_user_id: string }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
