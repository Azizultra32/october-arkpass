-- TEST MIGRATION - Phase 0 Only
-- Purpose: Test extending existing medications and conditions tables
-- Run this in a DEV Supabase project first

-- =============================================================================
-- PHASE 0: EXTEND EXISTING TABLES (Test Version)
-- =============================================================================

BEGIN;

-- Test: Extend medications table
ALTER TABLE medications RENAME COLUMN medication TO name;
ALTER TABLE medications RENAME COLUMN date TO start_date;

ALTER TABLE medications
  ADD COLUMN IF NOT EXISTS frequency TEXT,
  ADD COLUMN IF NOT EXISTS indication TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'stopped', 'on-hold')),
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS prescribing_doctor TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'add_with_details'
    CHECK (created_via IN ('quick_add', 'add_with_details', 'edit'));

-- Test: Extend conditions table
ALTER TABLE conditions RENAME COLUMN condition TO name;
ALTER TABLE conditions RENAME COLUMN date TO start_date;

ALTER TABLE conditions
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'resolved', 'inactive', 'recurrent')),
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS severity TEXT
    CHECK (severity IN ('mild', 'moderate', 'severe')),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Verify changes
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('medications', 'conditions')
ORDER BY table_name, ordinal_position;

COMMIT;

-- If errors occur, changes will be rolled back automatically
