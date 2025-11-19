import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WindData {
  id: string;
  timestamp_utc: string;
  wind_speed_ms: number | null;
  wind_direction_deg: number | null;
  wind_gust_ms: number | null;
  temperature_c: number | null;
  pressure_hpa: number | null;
  source_type: 'MEASURED' | 'PREDICTED_LSTM';
  created_at: string;
}
