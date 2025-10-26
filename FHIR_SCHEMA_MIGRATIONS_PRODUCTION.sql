-- PRODUCTION Supabase Schema Migrations for ArkPass
-- Date: 2025-10-26
-- Purpose: Migrate minimal production database (2 tables) to full ArkPass schema
-- Reference: SCHEMA_COMPARISON.md
--
-- PRODUCTION STATE: Only 2 tables exist (medications, conditions) with minimal columns
-- TARGET STATE: 23 tables with comprehensive FHIR-aligned + ArkPass-specific fields
--
-- CRITICAL: ArkPass Schema > FHIR Compliance
-- - Figma designs drive database structure (PRIMARY)
-- - FHIR mapping is for export only (SECONDARY)
-- - Custom fields without FHIR equivalents are acceptable

-- =============================================================================
-- PHASE 0: EXTEND EXISTING TABLES (Production-Specific)
-- =============================================================================
-- Production has 2 minimal tables that need extension, not recreation

-- -----------------------------------------------------------------------------
-- 0.1 EXTEND MEDICATIONS TABLE
-- -----------------------------------------------------------------------------
-- Current: id, patient_id, medication, dosage, date
-- Target: Full schema with proper naming and all Figma fields

-- Rename columns to match reference schema naming
ALTER TABLE medications RENAME COLUMN medication TO name;
ALTER TABLE medications RENAME COLUMN date TO start_date;

-- Add missing columns
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

COMMENT ON TABLE medications IS 'FHIR MedicationStatement - patient-reported medications';
COMMENT ON COLUMN medications.name IS 'FHIR MedicationStatement.medicationCodeableConcept.text';
COMMENT ON COLUMN medications.status IS 'FHIR MedicationStatement.status';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_status ON medications(patient_id, status);

-- -----------------------------------------------------------------------------
-- 0.2 EXTEND CONDITIONS TABLE
-- -----------------------------------------------------------------------------
-- Current: id, patient_id, condition, date
-- Target: Full schema with proper naming and all Figma fields

-- Rename columns to match reference schema naming
ALTER TABLE conditions RENAME COLUMN condition TO name;
ALTER TABLE conditions RENAME COLUMN date TO start_date;

-- Add missing columns
ALTER TABLE conditions
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'resolved', 'inactive', 'recurrent')),
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS severity TEXT
    CHECK (severity IN ('mild', 'moderate', 'severe')),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS onset_type TEXT CHECK (onset_type IN ('date', 'age', 'unknown')),
  ADD COLUMN IF NOT EXISTS onset_age INTEGER,
  ADD COLUMN IF NOT EXISTS first_symptoms_date DATE,
  ADD COLUMN IF NOT EXISTS diagnosed_by TEXT;

COMMENT ON TABLE conditions IS 'FHIR Condition - patient medical conditions';
COMMENT ON COLUMN conditions.name IS 'FHIR Condition.code.text';
COMMENT ON COLUMN conditions.status IS 'FHIR Condition.clinicalStatus';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_conditions_patient ON conditions(patient_id);
CREATE INDEX IF NOT EXISTS idx_conditions_status ON conditions(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_conditions_tags ON conditions USING GIN(tags);

-- =============================================================================
-- PHASE 1: CREATE CORE PHR TABLES (From Reference Schema)
-- =============================================================================
-- Note: Skipping medications and conditions (handled in Phase 0)

-- -----------------------------------------------------------------------------
-- 1.1 USER MANAGEMENT TABLES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
  role TEXT PRIMARY KEY,
  description TEXT
);

COMMENT ON TABLE roles IS 'User role definitions for RBAC';

INSERT INTO roles (role, description) VALUES
  ('patient', 'Patient user with access to their own PHR'),
  ('provider', 'Healthcare provider with granted access to patient records'),
  ('admin', 'System administrator'),
  ('superuser', 'Emergency access with full audit trail')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT REFERENCES roles(role),
  full_name TEXT,
  date_of_birth DATE,
  contact_phone TEXT,
  specialty TEXT, -- For providers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS 'Extended user profile information beyond auth.users';

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- -----------------------------------------------------------------------------
-- 1.2 ALLERGIES TABLE (CRITICAL - Patient Safety)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL, -- Allergen name
  category TEXT CHECK (category IN ('medication', 'environmental', 'food', 'insect_animal')),

  -- Severity & Safety (CRITICAL)
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening')),
  requires_epipen BOOLEAN DEFAULT FALSE, -- PATIENT SAFETY FLAG

  -- Additional fields
  onset_date DATE,
  onset_age INTEGER,
  onset_precision TEXT CHECK (onset_precision IN ('year', 'month', 'day')),
  reaction TEXT, -- e.g., "Hives", "Anaphylaxis"
  details TEXT,
  verification_status TEXT DEFAULT 'unconfirmed'
    CHECK (verification_status IN ('unconfirmed', 'confirmed', 'refuted', 'entered-in-error')),
  notes TEXT,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT DEFAULT 'add_with_details'
    CHECK (created_via IN ('quick_add', 'add_with_details', 'edit'))
);

COMMENT ON TABLE allergies IS 'FHIR AllergyIntolerance - patient allergies and sensitivities';
COMMENT ON COLUMN allergies.category IS 'FHIR AllergyIntolerance.category';
COMMENT ON COLUMN allergies.severity IS 'FHIR AllergyIntolerance.criticality - clinical severity';
COMMENT ON COLUMN allergies.requires_epipen IS 'ArkPass-specific: Patient safety flag for life-threatening allergies';

CREATE INDEX IF NOT EXISTS idx_allergies_patient ON allergies(patient_id);
CREATE INDEX IF NOT EXISTS idx_allergies_category ON allergies(category);
CREATE INDEX IF NOT EXISTS idx_allergies_epipen ON allergies(patient_id, requires_epipen) WHERE requires_epipen = TRUE;

-- =============================================================================
-- Remaining tables from original FHIR_SCHEMA_MIGRATIONS.sql
-- For brevity, key additions only. Full migration in separate file if needed.
-- =============================================================================

-- (Continue with supplements, immunizations, surgeries, family_history,
--  social_history, lab_results, documents, document_folders, patient_demographics,
--  emergency_contacts, patient_insurance, access_grants, proxy_access, audit_logs,
--  notifications, appointments, data_exports, and all junction tables)

-- =============================================================================
-- ABBREVIATED VERSION - See FHIR_SCHEMA_MIGRATIONS.sql for complete tables
-- =============================================================================

-- This file focuses on PRODUCTION-SPECIFIC adjustments (Phase 0)
-- For full table creation (Phase 1-4), execute FHIR_SCHEMA_MIGRATIONS.sql
-- AFTER this file, skipping medications and conditions creation.

-- =============================================================================
-- RLS POLICIES (Add to existing tables)
-- =============================================================================

-- Medications RLS
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS medications_select ON medications FOR SELECT
  USING (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS medications_insert ON medications FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS medications_update ON medications FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS medications_delete ON medications FOR DELETE
  USING (auth.uid() = patient_id);

-- Conditions RLS
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS conditions_select ON conditions FOR SELECT
  USING (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS conditions_insert ON conditions FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS conditions_update ON conditions FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS conditions_delete ON conditions FOR DELETE
  USING (auth.uid() = patient_id);

-- Allergies RLS
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS allergies_select ON allergies FOR SELECT
  USING (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS allergies_insert ON allergies FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS allergies_update ON allergies FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY IF NOT EXISTS allergies_delete ON allergies FOR DELETE
  USING (auth.uid() = patient_id);

-- =============================================================================
-- TRIGGERS (Auto-update timestamps)
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conditions_updated_at BEFORE UPDATE ON conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- MIGRATION VERSION TRACKING
-- =============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_migrations (version, description) VALUES
  ('2025-10-26-production-phase0', 'Extend existing medications and conditions tables'),
  ('2025-10-26-production-phase1', 'Create core PHR tables (allergies, user_profiles, roles)')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- NOTES FOR NEXT STEPS
-- =============================================================================
/*
PRODUCTION MIGRATION SEQUENCE:

1. Execute this file (FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql)
   - Extends existing medications table
   - Extends existing conditions table
   - Creates allergies, roles, user_profiles

2. Then execute FHIR_SCHEMA_MIGRATIONS.sql with modifications:
   - SKIP CREATE TABLE medications (already done)
   - SKIP CREATE TABLE conditions (already done)
   - CREATE all other tables (supplements, immunizations, surgeries, etc.)

3. Verify:
   - Run test queries on extended tables
   - Check RLS policies work
   - Verify triggers update timestamps
   - Confirm foreign keys

4. Seed test data if needed

CRITICAL REMINDERS:
- ArkPass schema PRIMARY, FHIR export SECONDARY
- Custom fields (requires_epipen, folders, etc.) are acceptable
- FHIR mapping happens at export time, not database constraint
*/
