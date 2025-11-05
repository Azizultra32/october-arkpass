-- Dual-Mode Date System - Database Functions
-- Purpose: Support "Date OR Age" input pattern across all PHR features
-- Reference: IMPORTANT_DATE_FIELDS_SUMMARY.md, DUAL_MODE_DATE_INPUT_COMPONENT.md

-- =============================================================================
-- FUNCTION: Compute Date from Age
-- =============================================================================
-- Converts age-based input to an estimated date based on patient's birth date
-- Example: Patient born 1990-05-15, "I was 25 years old" → 2015-05-15

CREATE OR REPLACE FUNCTION compute_date_from_age(
  patient_birth_date DATE,
  age_at_event INTEGER
) RETURNS DATE AS $$
BEGIN
  IF patient_birth_date IS NULL OR age_at_event IS NULL THEN
    RETURN NULL;
  END IF;

  -- Calculate date when patient was that age (using birth date anniversary)
  RETURN patient_birth_date + (age_at_event * INTERVAL '1 year');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION compute_date_from_age IS
  'Converts age at event to estimated date based on patient birth date';

-- =============================================================================
-- FUNCTION: Extract Computed Date from Dual-Mode JSONB
-- =============================================================================
-- Parses dual-mode date JSONB and returns best date estimate
-- Handles: date mode, age mode, relative time, partial dates

CREATE OR REPLACE FUNCTION extract_computed_date(
  date_field_jsonb JSONB,
  patient_birth_date DATE DEFAULT NULL
) RETURNS TIMESTAMP AS $$
DECLARE
  mode TEXT;
  computed TIMESTAMP;
BEGIN
  IF date_field_jsonb IS NULL THEN
    RETURN NULL;
  END IF;

  mode := date_field_jsonb->>'mode';

  CASE mode
    WHEN 'date' THEN
      -- Direct date entry
      computed := (date_field_jsonb->>'year')::INTEGER || '-' ||
                  COALESCE((date_field_jsonb->>'month')::TEXT, '01') || '-' ||
                  COALESCE((date_field_jsonb->>'day')::TEXT, '01');
      RETURN computed::TIMESTAMP;

    WHEN 'age' THEN
      -- Age-based entry (requires patient birth date)
      IF patient_birth_date IS NOT NULL AND (date_field_jsonb->>'ageAtEvent')::INTEGER IS NOT NULL THEN
        RETURN compute_date_from_age(
          patient_birth_date,
          (date_field_jsonb->>'ageAtEvent')::INTEGER
        )::TIMESTAMP;
      END IF;
      RETURN NULL;

    WHEN 'relative' THEN
      -- Relative time (e.g., "2 weeks ago")
      -- This requires current timestamp interpretation, stored as metadata only
      RETURN (date_field_jsonb->>'computedDate')::TIMESTAMP;

    ELSE
      RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION extract_computed_date IS
  'Extracts best date estimate from dual-mode JSONB structure';

-- =============================================================================
-- FUNCTION: Generate Patient Display Text
-- =============================================================================
-- Formats date for patient view (UI[Pt])
-- Examples: "May 2020", "2 weeks ago", "When I was 25"

CREATE OR REPLACE FUNCTION generate_patient_display(
  date_field_jsonb JSONB
) RETURNS TEXT AS $$
DECLARE
  mode TEXT;
  display TEXT;
BEGIN
  IF date_field_jsonb IS NULL THEN
    RETURN NULL;
  END IF;

  -- Use pre-computed display text if available
  IF date_field_jsonb ? 'displayText' THEN
    RETURN date_field_jsonb->>'displayText';
  END IF;

  mode := date_field_jsonb->>'mode';

  CASE mode
    WHEN 'date' THEN
      -- Format: "May 2020" or "May 15, 2020"
      display := TO_CHAR(
        extract_computed_date(date_field_jsonb)::DATE,
        'Month YYYY'
      );
      RETURN TRIM(display);

    WHEN 'age' THEN
      -- Format: "When I was 25"
      RETURN 'When I was ' || (date_field_jsonb->>'ageAtEvent')::TEXT;

    WHEN 'relative' THEN
      -- Format: "2 weeks ago"
      RETURN date_field_jsonb->>'relativeTime';

    ELSE
      RETURN 'Unknown date';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION generate_patient_display IS
  'Generates patient-friendly display text for dual-mode dates';

-- =============================================================================
-- FUNCTION: Generate Provider Display Text
-- =============================================================================
-- Formats date for provider view (UI[Pr])
-- Always shows computed date if available, plus precision indicator

CREATE OR REPLACE FUNCTION generate_provider_display(
  date_field_jsonb JSONB,
  patient_birth_date DATE DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
  computed TIMESTAMP;
  precision TEXT;
  certainty TEXT;
  display TEXT;
BEGIN
  IF date_field_jsonb IS NULL THEN
    RETURN NULL;
  END IF;

  computed := extract_computed_date(date_field_jsonb, patient_birth_date);
  precision := date_field_jsonb->>'precision';
  certainty := date_field_jsonb->>'certainty';

  IF computed IS NULL THEN
    RETURN 'Unknown date';
  END IF;

  -- Format based on precision
  CASE precision
    WHEN 'year' THEN
      display := TO_CHAR(computed::DATE, 'YYYY');
    WHEN 'month' THEN
      display := TO_CHAR(computed::DATE, 'Mon YYYY');
    WHEN 'day' THEN
      display := TO_CHAR(computed::DATE, 'MM/DD/YYYY');
    ELSE
      display := TO_CHAR(computed::DATE, 'MM/DD/YYYY');
  END CASE;

  -- Add certainty indicator if uncertain
  IF certainty = 'uncertain' THEN
    display := display || ' (uncertain)';
  ELSIF certainty = 'somewhat_certain' THEN
    display := display || ' (approximate)';
  END IF;

  RETURN display;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION generate_provider_display IS
  'Generates provider-focused display text with precision and certainty indicators';

-- =============================================================================
-- TEST QUERIES
-- =============================================================================

-- Test 1: Date mode
SELECT generate_patient_display('{
  "mode": "date",
  "year": 2020,
  "month": 5,
  "precision": "month",
  "certainty": "certain"
}'::JSONB);
-- Expected: "May      2020" (with trimming → "May 2020")

-- Test 2: Age mode
SELECT generate_patient_display('{
  "mode": "age",
  "ageAtEvent": 25,
  "precision": "age"
}'::JSONB);
-- Expected: "When I was 25"

-- Test 3: Computed date from age
SELECT extract_computed_date('{
  "mode": "age",
  "ageAtEvent": 25
}'::JSONB, '1990-05-15'::DATE);
-- Expected: 2015-05-15 00:00:00

-- Test 4: Provider display with uncertainty
SELECT generate_provider_display('{
  "mode": "date",
  "year": 2020,
  "month": 5,
  "precision": "month",
  "certainty": "uncertain"
}'::JSONB);
-- Expected: "May 2020 (uncertain)"
