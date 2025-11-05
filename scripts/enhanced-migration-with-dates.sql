-- ENHANCED PRODUCTION MIGRATION - With Dual-Mode Dates
-- Purpose: Extend medications and conditions with JSONB date fields
-- Reference: IMPORTANT_DATE_FIELDS_SUMMARY.md, dual-mode-date-functions.sql

BEGIN;

-- =============================================================================
-- STEP 1: Create Dual-Mode Date Functions (prerequisite)
-- =============================================================================
\i scripts/dual-mode-date-functions.sql

-- =============================================================================
-- STEP 2: Extend Medications Table
-- =============================================================================

-- Rename existing columns
ALTER TABLE medications RENAME COLUMN medication TO name;
ALTER TABLE medications RENAME COLUMN date TO start_date_legacy;

-- Add new columns with dual-mode date support
ALTER TABLE medications
  ADD COLUMN IF NOT EXISTS frequency TEXT,
  ADD COLUMN IF NOT EXISTS indication TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'stopped', 'on-hold')),

  -- Dual-mode date fields (JSONB + computed + display)
  ADD COLUMN IF NOT EXISTS start_date_raw JSONB,
  ADD COLUMN IF NOT EXISTS start_date_computed TIMESTAMP GENERATED ALWAYS AS (
    extract_computed_date(start_date_raw)
  ) STORED,
  ADD COLUMN IF NOT EXISTS start_date_display_pt TEXT GENERATED ALWAYS AS (
    generate_patient_display(start_date_raw)
  ) STORED,
  ADD COLUMN IF NOT EXISTS start_date_display_pr TEXT GENERATED ALWAYS AS (
    generate_provider_display(start_date_raw)
  ) STORED,

  ADD COLUMN IF NOT EXISTS end_date_raw JSONB,
  ADD COLUMN IF NOT EXISTS end_date_computed TIMESTAMP GENERATED ALWAYS AS (
    extract_computed_date(end_date_raw)
  ) STORED,

  -- Standard fields
  ADD COLUMN IF NOT EXISTS prescribing_doctor TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'add_with_details'
    CHECK (created_via IN ('quick_add', 'add_with_details', 'import'));

-- Migrate legacy date data to JSONB format
UPDATE medications
SET start_date_raw = json_build_object(
  'mode', 'date',
  'year', EXTRACT(YEAR FROM start_date_legacy),
  'month', EXTRACT(MONTH FROM start_date_legacy),
  'day', EXTRACT(DAY FROM start_date_legacy),
  'precision', 'day',
  'certainty', NULL
)::JSONB
WHERE start_date_legacy IS NOT NULL AND start_date_raw IS NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_status ON medications(patient_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_medications_start_computed ON medications(start_date_computed) WHERE deleted_at IS NULL;

COMMENT ON TABLE medications IS 'FHIR MedicationStatement - patient-reported medications';
COMMENT ON COLUMN medications.start_date_raw IS 'Dual-mode date: supports date/age/relative input';
COMMENT ON COLUMN medications.start_date_computed IS 'Indexed computed date for queries';
COMMENT ON COLUMN medications.start_date_display_pt IS 'Patient-friendly display (e.g., "May 2020")';
COMMENT ON COLUMN medications.start_date_display_pr IS 'Provider display with precision (e.g., "05/15/2020")';

-- =============================================================================
-- STEP 3: Extend Conditions Table
-- =============================================================================

-- Rename existing columns
ALTER TABLE conditions RENAME COLUMN condition TO name;
ALTER TABLE conditions RENAME COLUMN date TO diagnosis_date_legacy;

-- Add new columns with dual-mode date support
ALTER TABLE conditions
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'resolved', 'inactive', 'recurrent')),
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'chronic'
    CHECK (type IN ('chronic', 'transient')),
  ADD COLUMN IF NOT EXISTS subtype TEXT
    CHECK (subtype IN ('recurrent', 'resolved', NULL)),
  ADD COLUMN IF NOT EXISTS tags TEXT[],

  -- Dual-mode date fields (different fields based on type/subtype)
  -- Chronic: diagnosis_date
  ADD COLUMN IF NOT EXISTS diagnosis_date_raw JSONB,
  ADD COLUMN IF NOT EXISTS diagnosis_date_computed TIMESTAMP GENERATED ALWAYS AS (
    extract_computed_date(diagnosis_date_raw)
  ) STORED,
  ADD COLUMN IF NOT EXISTS diagnosis_date_display_pt TEXT GENERATED ALWAYS AS (
    generate_patient_display(diagnosis_date_raw)
  ) STORED,

  -- Transient-Recurrent: last_occurrence_date
  ADD COLUMN IF NOT EXISTS last_occurrence_raw JSONB,
  ADD COLUMN IF NOT EXISTS last_occurrence_computed TIMESTAMP GENERATED ALWAYS AS (
    extract_computed_date(last_occurrence_raw)
  ) STORED,

  -- Transient-Resolved: start_date + end_date
  ADD COLUMN IF NOT EXISTS start_date_raw JSONB,
  ADD COLUMN IF NOT EXISTS start_date_computed TIMESTAMP GENERATED ALWAYS AS (
    extract_computed_date(start_date_raw)
  ) STORED,

  ADD COLUMN IF NOT EXISTS end_date_raw JSONB,
  ADD COLUMN IF NOT EXISTS end_date_computed TIMESTAMP GENERATED ALWAYS AS (
    extract_computed_date(end_date_raw)
  ) STORED,
  ADD COLUMN IF NOT EXISTS end_date_display_pt TEXT GENERATED ALWAYS AS (
    generate_patient_display(end_date_raw)
  ) STORED,

  -- Standard fields
  ADD COLUMN IF NOT EXISTS severity TEXT
    CHECK (severity IN ('mild', 'moderate', 'severe')),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS diagnosed_by TEXT;

-- Migrate legacy date data to JSONB format (chronic conditions)
UPDATE conditions
SET
  type = 'chronic',
  diagnosis_date_raw = json_build_object(
    'mode', 'date',
    'year', EXTRACT(YEAR FROM diagnosis_date_legacy),
    'month', EXTRACT(MONTH FROM diagnosis_date_legacy),
    'day', EXTRACT(DAY FROM diagnosis_date_legacy),
    'precision', 'day',
    'certainty', NULL
  )::JSONB
WHERE diagnosis_date_legacy IS NOT NULL AND diagnosis_date_raw IS NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_conditions_patient ON conditions(patient_id);
CREATE INDEX IF NOT EXISTS idx_conditions_status ON conditions(patient_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conditions_type ON conditions(patient_id, type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conditions_tags ON conditions USING GIN(tags) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conditions_diagnosis_computed ON conditions(diagnosis_date_computed) WHERE deleted_at IS NULL;

COMMENT ON TABLE conditions IS 'FHIR Condition - patient medical conditions';
COMMENT ON COLUMN conditions.type IS 'Chronic (ongoing) vs Transient (temporary)';
COMMENT ON COLUMN conditions.subtype IS 'For transient: Recurrent (ongoing episodes) vs Resolved (cured)';
COMMENT ON COLUMN conditions.diagnosis_date_raw IS 'For chronic conditions - dual-mode date';
COMMENT ON COLUMN conditions.last_occurrence_raw IS 'For transient-recurrent - when last episode occurred';
COMMENT ON COLUMN conditions.start_date_raw IS 'For transient-resolved - when condition started';
COMMENT ON COLUMN conditions.end_date_raw IS 'For transient-resolved - when condition resolved';

-- =============================================================================
-- STEP 4: Create Update Trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER conditions_updated_at
  BEFORE UPDATE ON conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- STEP 5: Validation
-- =============================================================================

-- Verify medications schema
SELECT
  'medications' as table_name,
  column_name,
  data_type,
  is_generated
FROM information_schema.columns
WHERE table_name = 'medications'
ORDER BY ordinal_position;

-- Verify conditions schema
SELECT
  'conditions' as table_name,
  column_name,
  data_type,
  is_generated
FROM information_schema.columns
WHERE table_name = 'conditions'
ORDER BY ordinal_position;

-- Verify migration of legacy data
SELECT
  'medications' as table_name,
  COUNT(*) as total_records,
  COUNT(start_date_legacy) as legacy_dates,
  COUNT(start_date_raw) as migrated_jsonb,
  COUNT(start_date_computed) as computed_dates
FROM medications;

SELECT
  'conditions' as table_name,
  COUNT(*) as total_records,
  COUNT(diagnosis_date_legacy) as legacy_dates,
  COUNT(diagnosis_date_raw) as migrated_jsonb,
  COUNT(diagnosis_date_computed) as computed_dates
FROM conditions;

COMMIT;

-- =============================================================================
-- ROLLBACK INSTRUCTIONS
-- =============================================================================
-- If something goes wrong, run:
-- ROLLBACK;
--
-- To manually rollback after commit:
-- ALTER TABLE medications RENAME COLUMN name TO medication;
-- ALTER TABLE medications RENAME COLUMN start_date_legacy TO date;
-- ALTER TABLE medications DROP COLUMN IF EXISTS start_date_raw CASCADE;
-- ... (drop other columns)
