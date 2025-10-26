-- FHIR Schema Migrations for ArkPass
-- Date: 2025-10-25
-- Purpose: Extend ARKPASS 6 Supabase schema to support Figma-extracted features
-- Reference: FHIR_HARMONIZATION_MAP.md

-- =============================================================================
-- PHASE 1: CRITICAL FIXES (MVP BLOCKERS)
-- Estimated Time: 10-15 hours
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1.1 EXTEND ALLERGIES TABLE (Critical Safety Features)
-- -----------------------------------------------------------------------------

ALTER TABLE allergies
  ADD COLUMN IF NOT EXISTS category TEXT
    CHECK (category IN ('medication', 'environmental', 'food', 'insect_animal')),
  ADD COLUMN IF NOT EXISTS severity TEXT
    CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening')),
  ADD COLUMN IF NOT EXISTS onset_date DATE,
  ADD COLUMN IF NOT EXISTS onset_age INTEGER,
  ADD COLUMN IF NOT EXISTS onset_precision TEXT
    CHECK (onset_precision IN ('year', 'month', 'day')),
  ADD COLUMN IF NOT EXISTS requires_epipen BOOLEAN DEFAULT FALSE, -- CRITICAL SAFETY
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unconfirmed'
    CHECK (verification_status IN ('unconfirmed', 'confirmed', 'refuted', 'entered-in-error'));

COMMENT ON COLUMN allergies.category IS 'FHIR AllergyIntolerance.category - medication, food, environment, biologic';
COMMENT ON COLUMN allergies.severity IS 'FHIR AllergyIntolerance.criticality - clinical severity assessment';
COMMENT ON COLUMN allergies.requires_epipen IS 'Custom extension - patient safety flag for life-threatening allergies';

-- -----------------------------------------------------------------------------
-- 1.2 CREATE SUPPLEMENTS TABLE (Missing Table)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields (mirrors medications structure)
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  indication TEXT, -- Why taking supplement
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'stopped', 'on-hold')),

  -- Dates
  start_date DATE,
  end_date DATE,

  -- Supplement-specific
  brand TEXT, -- Brand name (e.g., "Nature Made", "Centrum")
  supplement_type TEXT, -- 'vitamin', 'mineral', 'herbal', 'protein', 'other'

  -- Notes
  notes TEXT,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT DEFAULT 'add_with_details'
    CHECK (created_via IN ('quick_add', 'add_with_details', 'edit'))
);

COMMENT ON TABLE supplements IS 'FHIR MedicationStatement with category=supplement - patient-reported supplements';
COMMENT ON COLUMN supplements.name IS 'FHIR MedicationStatement.medicationCodeableConcept.text';
COMMENT ON COLUMN supplements.status IS 'FHIR MedicationStatement.status';

CREATE INDEX idx_supplements_patient ON supplements(patient_id);
CREATE INDEX idx_supplements_status ON supplements(patient_id, status);

-- -----------------------------------------------------------------------------
-- 1.3 EXTEND DOCUMENTS TABLE (Major Feature Set Missing)
-- -----------------------------------------------------------------------------

-- First, create document_folders table
CREATE TABLE IF NOT EXISTS document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'folder',
  sort_order INTEGER,
  is_system_folder BOOLEAN DEFAULT TRUE, -- Pre-defined vs. user-created
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE, -- NULL for system folders
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, patient_id) -- System folders unique globally, user folders per patient
);

COMMENT ON TABLE document_folders IS 'Pre-defined and user-created document folders (Figma: 5 system folders)';

-- Insert 5 pre-defined system folders
INSERT INTO document_folders (name, icon, sort_order, is_system_folder, patient_id) VALUES
  ('Prescriptions', 'folder', 1, TRUE, NULL),
  ('Lab Results', 'folder', 2, TRUE, NULL),
  ('Imaging', 'folder', 3, TRUE, NULL),
  ('Consult', 'folder', 4, TRUE, NULL),
  ('Other', 'folder', 5, TRUE, NULL)
ON CONFLICT DO NOTHING;

-- Extend documents table
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS name TEXT, -- Document name (separate from type)
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES document_folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS system TEXT, -- Body system: 'cardiac', 'endocrine', 'nervous', etc.
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT FALSE, -- Starred/favorite
  ADD COLUMN IF NOT EXISTS file_type TEXT
    CHECK (file_type IN ('image', 'pdf', 'audio', 'word', 'other')),
  ADD COLUMN IF NOT EXISTS file_size_bytes INTEGER,
  ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS inbox_status TEXT DEFAULT 'processed'
    CHECK (inbox_status IN ('inbox', 'processed'));

-- Make name required after adding column
-- UPDATE documents SET name = COALESCE(description, type, 'Untitled Document') WHERE name IS NULL;
-- ALTER TABLE documents ALTER COLUMN name SET NOT NULL; -- Uncomment after data migration

COMMENT ON COLUMN documents.name IS 'FHIR DocumentReference.description - user-friendly name';
COMMENT ON COLUMN documents.folder_id IS 'Custom extension - 5 pre-defined folders + user folders';
COMMENT ON COLUMN documents.system IS 'FHIR DocumentReference.category - body system classification';
COMMENT ON COLUMN documents.tags IS 'FHIR DocumentReference.securityLabel - multi-tag system';
COMMENT ON COLUMN documents.is_private IS 'FHIR DocumentReference.securityLabel - privacy control';
COMMENT ON COLUMN documents.is_highlighted IS 'Custom extension - starred/favorite flag';
COMMENT ON COLUMN documents.inbox_status IS 'Workflow state - inbox (needs processing) or processed';

CREATE INDEX idx_documents_folder ON documents(folder_id);
CREATE INDEX idx_documents_system ON documents(system);
CREATE INDEX idx_documents_patient_inbox ON documents(patient_id, inbox_status);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags); -- GIN index for array search

-- -----------------------------------------------------------------------------
-- 1.4 CREATE PATIENT DEMOGRAPHICS (Missing Extended Demographics)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS patient_demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE UNIQUE,

  -- Demographics
  legal_first_name TEXT,
  legal_last_name TEXT,
  preferred_name TEXT,
  date_of_birth DATE, -- Duplicate from user_profiles for completeness
  biological_sex TEXT CHECK (biological_sex IN ('male', 'female', 'intersex', 'unknown')),
  gender_identity TEXT CHECK (gender_identity IN ('male', 'female', 'non-binary', 'other', 'prefer_not_to_say')),
  preferred_pronouns TEXT,
  preferred_language TEXT, -- ISO 639-1 language code

  -- Contact (extends user_profiles.contact_phone)
  primary_phone TEXT,
  secondary_phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',

  -- Health basics
  height_cm DECIMAL(5,2), -- e.g., 175.50 cm
  weight_kg DECIMAL(5,2), -- e.g., 70.25 kg
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown')),

  -- Providers
  primary_care_provider TEXT,
  primary_care_provider_phone TEXT,
  primary_pharmacy TEXT,
  primary_pharmacy_phone TEXT,

  -- Legal
  organ_donor BOOLEAN DEFAULT FALSE,
  has_advance_directive BOOLEAN DEFAULT FALSE,
  advance_directive_location TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE patient_demographics IS 'FHIR Patient - extended demographics from Figma (15 screens)';
COMMENT ON COLUMN patient_demographics.biological_sex IS 'FHIR Patient.gender - administrative gender';
COMMENT ON COLUMN patient_demographics.gender_identity IS 'FHIR Patient extension - gender identity';

CREATE INDEX idx_patient_demographics_user ON patient_demographics(user_id);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  full_name TEXT NOT NULL,
  relationship TEXT, -- 'spouse', 'parent', 'child', 'sibling', 'friend', 'other'
  phone_number TEXT NOT NULL,
  alternate_phone TEXT,
  email TEXT,

  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE emergency_contacts IS 'FHIR Patient.contact - emergency contact persons';

CREATE INDEX idx_emergency_contacts_patient ON emergency_contacts(patient_id);

-- Insurance information
CREATE TABLE IF NOT EXISTS patient_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  insurance_provider TEXT,
  policy_number TEXT,
  group_number TEXT,
  subscriber_name TEXT,
  relationship_to_subscriber TEXT, -- 'self', 'spouse', 'child', 'other'

  effective_date DATE,
  expiration_date DATE,

  is_primary BOOLEAN DEFAULT TRUE, -- Primary vs. secondary insurance

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE patient_insurance IS 'FHIR Coverage - insurance information';

CREATE INDEX idx_patient_insurance_patient ON patient_insurance(patient_id);

-- =============================================================================
-- PHASE 2: DOCUMENT ASSOCIATIONS (High Value)
-- Estimated Time: 4-6 hours
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2.1 CREATE DOCUMENT ASSOCIATION JUNCTION TABLES
-- -----------------------------------------------------------------------------

-- Master document_associations table (polymorphic approach)
CREATE TABLE IF NOT EXISTS document_associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL
    CHECK (entity_type IN ('allergy', 'medication', 'surgery', 'immunization', 'supplement', 'condition', 'lab_result', 'social_history', 'family_history')),
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, entity_type, entity_id)
);

COMMENT ON TABLE document_associations IS 'Polymorphic links between documents and PHR records (+ icon workflow)';

CREATE INDEX idx_document_associations_document ON document_associations(document_id);
CREATE INDEX idx_document_associations_entity ON document_associations(entity_type, entity_id);

-- Alternative: Individual junction tables (type-safe approach)

CREATE TABLE IF NOT EXISTS medication_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(medication_id, document_id)
);

CREATE TABLE IF NOT EXISTS allergy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allergy_id UUID REFERENCES allergies(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(allergy_id, document_id)
);

CREATE TABLE IF NOT EXISTS condition_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(condition_id, document_id)
);

CREATE TABLE IF NOT EXISTS surgery_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surgery_id UUID REFERENCES surgeries(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(surgery_id, document_id)
);

CREATE TABLE IF NOT EXISTS immunization_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immunization_id UUID REFERENCES immunizations(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(immunization_id, document_id)
);

CREATE TABLE IF NOT EXISTS supplement_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplement_id UUID REFERENCES supplements(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supplement_id, document_id)
);

CREATE TABLE IF NOT EXISTS lab_result_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_result_id UUID REFERENCES lab_results(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lab_result_id, document_id)
);

CREATE TABLE IF NOT EXISTS social_history_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_history_id UUID REFERENCES social_history(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(social_history_id, document_id)
);

CREATE TABLE IF NOT EXISTS family_history_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_history_id UUID REFERENCES family_history(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_history_id, document_id)
);

-- =============================================================================
-- PHASE 3: VOCABULARY SUPPORT (UX Enhancement)
-- Estimated Time: 6-8 hours
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 CREATE VOCABULARY TABLES (Dropdown Support)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS medication_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('medication_name', 'frequency', 'dosage_unit', 'indication')),
  value TEXT NOT NULL,
  display_text TEXT,

  -- Standard codes
  rxnorm_code TEXT, -- For medication names
  ucum_code TEXT, -- For dosage units
  snomed_code TEXT, -- For indications

  sort_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0, -- Track popularity for autocomplete ranking

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(type, value)
);

COMMENT ON TABLE medication_vocabularies IS 'Autocomplete vocabulary for medication fields - RxNorm/UCUM codes';

CREATE INDEX idx_medication_vocab_type ON medication_vocabularies(type, is_active);
CREATE INDEX idx_medication_vocab_search ON medication_vocabularies(type, value);

CREATE TABLE IF NOT EXISTS allergy_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('allergen_name', 'reaction_type', 'category')),
  value TEXT NOT NULL,
  display_text TEXT,

  -- Standard codes
  snomed_code TEXT, -- For allergen names and reactions

  sort_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(type, value)
);

COMMENT ON TABLE allergy_vocabularies IS 'Autocomplete vocabulary for allergy fields - SNOMED codes';

CREATE INDEX idx_allergy_vocab_type ON allergy_vocabularies(type, is_active);

CREATE TABLE IF NOT EXISTS condition_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('condition_name', 'tag', 'severity')),
  value TEXT NOT NULL,
  display_text TEXT,

  -- Standard codes
  snomed_code TEXT, -- For condition names
  icd10_code TEXT, -- ICD-10 diagnosis codes

  sort_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(type, value)
);

COMMENT ON TABLE condition_vocabularies IS 'Autocomplete vocabulary for condition fields - SNOMED/ICD-10 codes';

CREATE INDEX idx_condition_vocab_type ON condition_vocabularies(type, is_active);

-- =============================================================================
-- PHASE 4: LAB RESULTS ENHANCEMENT (Clinical Value)
-- Estimated Time: 3-4 hours
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 4.1 EXTEND LAB RESULTS TABLE
-- -----------------------------------------------------------------------------

ALTER TABLE lab_results
  ADD COLUMN IF NOT EXISTS test_name TEXT, -- Separate from test_type
  ADD COLUMN IF NOT EXISTS ordering_provider TEXT,
  ADD COLUMN IF NOT EXISTS performing_lab TEXT,
  ADD COLUMN IF NOT EXISTS normal_range_min DECIMAL,
  ADD COLUMN IF NOT EXISTS normal_range_max DECIMAL,
  ADD COLUMN IF NOT EXISTS normal_range_text TEXT, -- "70-100 mg/dL"
  ADD COLUMN IF NOT EXISTS status TEXT
    CHECK (status IN ('final', 'preliminary', 'amended', 'corrected', 'cancelled')),
  ADD COLUMN IF NOT EXISTS interpretation TEXT
    CHECK (interpretation IN ('low', 'normal', 'high', 'critical_low', 'critical_high')),
  ADD COLUMN IF NOT EXISTS loinc_code TEXT, -- Standard test code
  ADD COLUMN IF NOT EXISTS specimen_type TEXT; -- Blood, Urine, etc.

COMMENT ON COLUMN lab_results.loinc_code IS 'LOINC code for test type - standard lab test identifier';
COMMENT ON COLUMN lab_results.interpretation IS 'Automated interpretation based on normal ranges';

CREATE INDEX idx_lab_results_patient_date ON lab_results(patient_id, date DESC);
CREATE INDEX idx_lab_results_loinc ON lab_results(loinc_code);

-- =============================================================================
-- PHASE 5: ADDITIONAL ENHANCEMENTS (Optional)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 5.1 EXTEND OTHER TABLES (Minor Improvements)
-- -----------------------------------------------------------------------------

-- Conditions: Add diagnosis vs. symptom onset tracking
ALTER TABLE conditions
  ADD COLUMN IF NOT EXISTS onset_type TEXT CHECK (onset_type IN ('date', 'age', 'unknown')),
  ADD COLUMN IF NOT EXISTS onset_age INTEGER,
  ADD COLUMN IF NOT EXISTS first_symptoms_date DATE, -- Different from diagnosis date
  ADD COLUMN IF NOT EXISTS diagnosed_by TEXT; -- Provider name

-- Immunizations: Track vaccine series
ALTER TABLE immunizations
  ADD COLUMN IF NOT EXISTS dose_number INTEGER,
  ADD COLUMN IF NOT EXISTS series_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS vaccine_cvx_code TEXT, -- CDC CVX code
  ADD COLUMN IF NOT EXISTS manufacturer TEXT,
  ADD COLUMN IF NOT EXISTS expiration_date DATE;

-- Surgeries: Add facility and outcome
ALTER TABLE surgeries
  ADD COLUMN IF NOT EXISTS facility TEXT, -- Hospital/clinic name
  ADD COLUMN IF NOT EXISTS outcome_status TEXT CHECK (outcome_status IN ('successful', 'complications', 'failed')),
  ADD COLUMN IF NOT EXISTS anesthesia_type TEXT,
  ADD COLUMN IF NOT EXISTS recovery_notes TEXT;

-- Social History: Add LOINC codes
ALTER TABLE social_history
  ADD COLUMN IF NOT EXISTS smoking_status_loinc TEXT DEFAULT '72166-2',
  ADD COLUMN IF NOT EXISTS alcohol_use_loinc TEXT DEFAULT '11331-6',
  ADD COLUMN IF NOT EXISTS drug_use_loinc TEXT DEFAULT '11343-1';

-- Family History: Support multiple conditions per relative
CREATE TABLE IF NOT EXISTS family_history_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_history_id UUID REFERENCES family_history(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  age_at_diagnosis INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_history_conditions ON family_history_conditions(family_history_id);

-- -----------------------------------------------------------------------------
-- 5.2 ACCESS GRANT SCOPES (Granular Sharing Control)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS access_grant_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_grant_id UUID REFERENCES access_grants(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL
    CHECK (entity_type IN ('all', 'medications', 'allergies', 'conditions', 'surgeries', 'immunizations', 'supplements', 'documents', 'lab_results', 'social_history', 'family_history')),
  can_read BOOLEAN DEFAULT TRUE,
  can_write BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(access_grant_id, entity_type)
);

COMMENT ON TABLE access_grant_scopes IS 'Granular scope control for access grants - specify which sections are shared';

-- -----------------------------------------------------------------------------
-- 5.3 NOTIFICATION PREFERENCES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE UNIQUE,

  medication_reminders BOOLEAN DEFAULT TRUE,
  appointment_reminders BOOLEAN DEFAULT TRUE,
  access_granted_alerts BOOLEAN DEFAULT TRUE,
  access_expiring_alerts BOOLEAN DEFAULT TRUE,

  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE notification_preferences IS 'User preferences for notification delivery';

-- =============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunization_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_result_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_history_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_history_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergy_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_history_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_grant_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (patients can only see their own data)

-- Supplements
CREATE POLICY supplements_select ON supplements FOR SELECT
  USING (auth.uid() = patient_id);
CREATE POLICY supplements_insert ON supplements FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY supplements_update ON supplements FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY supplements_delete ON supplements FOR DELETE
  USING (auth.uid() = patient_id);

-- Document folders (system folders visible to all, user folders only to owner)
CREATE POLICY document_folders_select ON document_folders FOR SELECT
  USING (patient_id IS NULL OR auth.uid() = patient_id);
CREATE POLICY document_folders_insert ON document_folders FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY document_folders_update ON document_folders FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY document_folders_delete ON document_folders FOR DELETE
  USING (auth.uid() = patient_id);

-- Patient demographics
CREATE POLICY patient_demographics_select ON patient_demographics FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY patient_demographics_insert ON patient_demographics FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY patient_demographics_update ON patient_demographics FOR UPDATE
  USING (auth.uid() = user_id);

-- Emergency contacts
CREATE POLICY emergency_contacts_select ON emergency_contacts FOR SELECT
  USING (auth.uid() = patient_id);
CREATE POLICY emergency_contacts_insert ON emergency_contacts FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY emergency_contacts_update ON emergency_contacts FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY emergency_contacts_delete ON emergency_contacts FOR DELETE
  USING (auth.uid() = patient_id);

-- Patient insurance
CREATE POLICY patient_insurance_select ON patient_insurance FOR SELECT
  USING (auth.uid() = patient_id);
CREATE POLICY patient_insurance_insert ON patient_insurance FOR INSERT
  WITH CHECK (auth.uid() = patient_id);
CREATE POLICY patient_insurance_update ON patient_insurance FOR UPDATE
  USING (auth.uid() = patient_id);
CREATE POLICY patient_insurance_delete ON patient_insurance FOR DELETE
  USING (auth.uid() = patient_id);

-- Vocabularies (read-only for all authenticated users)
CREATE POLICY medication_vocabularies_select ON medication_vocabularies FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY allergy_vocabularies_select ON allergy_vocabularies FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY condition_vocabularies_select ON condition_vocabularies FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Notification preferences
CREATE POLICY notification_preferences_select ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY notification_preferences_insert ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY notification_preferences_update ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================================================
-- TRIGGERS (Auto-update timestamps)
-- =============================================================================

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_supplements_updated_at BEFORE UPDATE ON supplements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_demographics_updated_at BEFORE UPDATE ON patient_demographics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_insurance_updated_at BEFORE UPDATE ON patient_insurance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SEED DATA (Vocabulary Tables)
-- =============================================================================

-- Common medication frequencies
INSERT INTO medication_vocabularies (type, value, display_text, sort_order) VALUES
  ('frequency', 'once_daily', 'Once daily', 1),
  ('frequency', 'twice_daily', 'Twice daily', 2),
  ('frequency', 'three_times_daily', 'Three times daily', 3),
  ('frequency', 'four_times_daily', 'Four times daily', 4),
  ('frequency', 'every_other_day', 'Every other day', 5),
  ('frequency', 'once_weekly', 'Once weekly', 6),
  ('frequency', 'as_needed', 'As needed', 7)
ON CONFLICT DO NOTHING;

-- Common dosage units
INSERT INTO medication_vocabularies (type, value, display_text, ucum_code, sort_order) VALUES
  ('dosage_unit', 'mg', 'mg', 'mg', 1),
  ('dosage_unit', 'g', 'g', 'g', 2),
  ('dosage_unit', 'mcg', 'mcg', 'ug', 3),
  ('dosage_unit', 'mL', 'mL', 'mL', 4),
  ('dosage_unit', 'units', 'units', '[IU]', 5),
  ('dosage_unit', 'tablet', 'tablet(s)', '{tablet}', 6),
  ('dosage_unit', 'capsule', 'capsule(s)', '{capsule}', 7)
ON CONFLICT DO NOTHING;

-- Common allergy categories
INSERT INTO allergy_vocabularies (type, value, display_text, sort_order) VALUES
  ('category', 'medication', 'Medication', 1),
  ('category', 'food', 'Food', 2),
  ('category', 'environmental', 'Environmental (Seasonal/Skin/Other)', 3),
  ('category', 'insect_animal', 'Insect & Animal', 4)
ON CONFLICT DO NOTHING;

-- Common allergy reactions
INSERT INTO allergy_vocabularies (type, value, display_text, sort_order) VALUES
  ('reaction_type', 'hives', 'Hives', 1),
  ('reaction_type', 'rash', 'Rash', 2),
  ('reaction_type', 'itching', 'Itching', 3),
  ('reaction_type', 'swelling', 'Swelling', 4),
  ('reaction_type', 'anaphylaxis', 'Anaphylaxis', 5),
  ('reaction_type', 'difficulty_breathing', 'Difficulty breathing', 6),
  ('reaction_type', 'nausea', 'Nausea', 7),
  ('reaction_type', 'vomiting', 'Vomiting', 8)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Version tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_migrations (version, description) VALUES
  ('2025-10-25-fhir-harmonization-phase1', 'FHIR Harmonization Phase 1: Critical fixes (allergies, supplements, documents, demographics)'),
  ('2025-10-25-fhir-harmonization-phase2', 'FHIR Harmonization Phase 2: Document associations'),
  ('2025-10-25-fhir-harmonization-phase3', 'FHIR Harmonization Phase 3: Vocabulary support'),
  ('2025-10-25-fhir-harmonization-phase4', 'FHIR Harmonization Phase 4: Lab results enhancement')
ON CONFLICT DO NOTHING;
