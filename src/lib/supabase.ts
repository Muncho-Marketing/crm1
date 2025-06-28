import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          owner_id: string | null
          street_address: string | null
          city: string | null
          pincode: string | null
          gstin: string | null
          restaurant_type: string | null
          pos_system: string | null
          custom_pos_name: string | null
          number_of_outlets: number | null
          goals: string[] | null
          onboarding_complete: boolean | null
          created_at: string | null
          updated_at: string | null
        }
      }
      customers: {
        Row: {
          id: string
          restaurant_id: string | null
          email: string | null
          phone: string
          first_name: string
          last_name: string | null
          birthday: string | null
          anniversary: string | null
          total_visits: number | null
          total_spent: number | null
          last_visit: string | null
          loyalty_points: number | null
          profile_completion: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string | null
          customer_id: string | null
          order_number: string
          total_amount: number
          order_date: string | null
          status: string | null
          payment_method: string | null
          created_at: string | null
        }
      }
      campaigns: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          type: string
          status: string | null
          message_content: string
          target_audience: any | null
          scheduled_at: string | null
          sent_at: string | null
          total_sent: number | null
          total_delivered: number | null
          total_opened: number | null
          total_clicked: number | null
          revenue_generated: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
      loyalty_rewards: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          description: string | null
          points_required: number
          reward_type: string
          reward_value: number
          is_active: boolean | null
          total_redeemed: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
      reward_redemptions: {
        Row: {
          id: string
          restaurant_id: string | null
          customer_id: string | null
          reward_id: string | null
          points_used: number
          order_id: string | null
          redeemed_at: string | null
        }
      }
      feedback: {
        Row: {
          id: string
          restaurant_id: string | null
          customer_id: string | null
          order_id: string | null
          rating: number
          comment: string | null
          feedback_type: string | null
          is_public: boolean | null
          created_at: string | null
        }
      }
      qr_codes: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          code: string
          type: string
          target_url: string
          scan_count: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
      }
      credits_balance: {
        Row: {
          id: string
          restaurant_id: string | null
          sms_credits: number | null
          email_credits: number | null
          whatsapp_utility_credits: number | null
          whatsapp_marketing_credits: number | null
          updated_at: string | null
        }
      }
    }
  }
}