/*
  # Create Wind Data Table for Barranquilla Wind Intelligence Platform

  ## Summary
  Creates the core table for storing historical measured wind data and future LSTM predictions
  for Barranquilla. This table is optimized for time-series queries and supports the platform's
  long-term wind forecasting requirements.

  ## New Tables
  1. `wind_data`
    - `id` (uuid, primary key): Unique identifier for each record
    - `timestamp_utc` (timestamptz): UTC timestamp for the measurement/prediction (indexed)
    - `wind_speed_ms` (numeric): Wind speed in meters per second
    - `wind_direction_deg` (numeric): Wind direction in degrees (0-360°)
    - `wind_gust_ms` (numeric): Maximum wind gust speed in m/s
    - `temperature_c` (numeric): Temperature in Celsius (for multivariate LSTM)
    - `pressure_hpa` (numeric): Atmospheric pressure in hectopascals
    - `source_type` (varchar): Differentiates 'MEASURED' vs 'PREDICTED_LSTM'
    - `created_at` (timestamptz): Record creation timestamp

  ## Indexes
  - Primary index on timestamp_utc for efficient time-range queries
  - Composite index on (source_type, timestamp_utc) for filtered queries
  - Index on created_at for data management

  ## Security
  - Enable RLS on wind_data table
  - Policy: Public read access for all authenticated users (data is not sensitive)
  - Policy: Insert restricted to authenticated users only
*/

-- Create the wind_data table
CREATE TABLE IF NOT EXISTS wind_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp_utc timestamptz NOT NULL,
  wind_speed_ms numeric(6,2),
  wind_direction_deg numeric(5,2) CHECK (wind_direction_deg >= 0 AND wind_direction_deg <= 360),
  wind_gust_ms numeric(6,2),
  temperature_c numeric(5,2),
  pressure_hpa numeric(7,2),
  source_type varchar(50) NOT NULL DEFAULT 'MEASURED' CHECK (source_type IN ('MEASURED', 'PREDICTED_LSTM')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for optimized time-series queries
CREATE INDEX IF NOT EXISTS idx_wind_data_timestamp 
  ON wind_data (timestamp_utc DESC);

CREATE INDEX IF NOT EXISTS idx_wind_data_source_timestamp 
  ON wind_data (source_type, timestamp_utc DESC);

CREATE INDEX IF NOT EXISTS idx_wind_data_created 
  ON wind_data (created_at DESC);

-- Enable Row Level Security
ALTER TABLE wind_data ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read wind data (public information)
CREATE POLICY "Authenticated users can read all wind data"
  ON wind_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow anonymous users to read wind data (public platform)
CREATE POLICY "Anonymous users can read wind data"
  ON wind_data
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Only authenticated users can insert data
CREATE POLICY "Authenticated users can insert wind data"
  ON wind_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE wind_data IS 'Historical and predicted wind data for Barranquilla. Stores both measured data from weather stations (NOAA, Meteostat SKBQ) and LSTM model predictions.';