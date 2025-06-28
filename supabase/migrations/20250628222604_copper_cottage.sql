/*
  # Fix credits balance RLS policies and constraints

  1. Security Updates
    - Add INSERT policy for credits_balance table to allow users to create initial credits for their restaurants
    - Ensure existing policies work correctly

  2. Changes
    - Add policy for users to insert credits for restaurants they own
    - Keep existing SELECT and UPDATE policies intact
*/

-- Add INSERT policy for credits_balance table
CREATE POLICY "Users can insert credits for own restaurants"
  ON credits_balance
  FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurants.id
      FROM restaurants
      WHERE restaurants.owner_id = auth.uid()
    )
  );