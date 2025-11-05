# Database Migrations - Complete Guide

## Overview

This directory contains SQL migration scripts for the ArkPass PHR database, implementing:
- ✅ FHIR-aligned schema for 10 PHR features
- ✅ Dual-mode date support (Date OR Age input)
- ✅ Patient safety features (EpiPen tracking, severity classification)
- ✅ HIPAA compliance (audit trails, soft delete, RLS)

## Files

### Core Migration Scripts

1. **`dual-mode-date-functions.sql`** (PREREQUISITE)
   - Database functions for dual-mode date system
   - Run FIRST before any migrations
   - Creates: `compute_date_from_age()`, `extract_computed_date()`, `generate_patient_display()`, `generate_provider_display()`
   - Idempotent: Safe to run multiple times

2. **`enhanced-migration-with-dates.sql`** (PRODUCTION READY)
   - Complete migration for medications + conditions tables
   - Includes dual-mode JSONB date fields
   - Migrates legacy data automatically
   - Wrapped in transaction (auto-rollback on error)
   - **Run after:** `dual-mode-date-functions.sql`

3. **`test-migration.sql`** (TESTING ONLY)
   - Simplified test version (Phase 0 only)
   - No dual-mode dates (basic schema only)
   - Use for initial testing in dev environment

### Guides

4. **`MIGRATION_TESTING_GUIDE.md`**
   - Step-by-step testing instructions
   - Dev environment setup
   - Validation queries
   - Troubleshooting

5. **`README_MIGRATIONS.md`** (THIS FILE)
   - Overview and quick start

## Quick Start

### Step 1: Prerequisites

- ✅ Dev Supabase project (DO NOT test in production)
- ✅ Existing tables: `medications`, `conditions` (old schema)
- ✅ Backup taken
- ✅ SQL Editor access in Supabase

### Step 2: Run Migrations (in order)

```sql
-- 1. Create dual-mode date functions
\i scripts/dual-mode-date-functions.sql

-- 2. Run enhanced migration
\i scripts/enhanced-migration-with-dates.sql
```

**Or** copy/paste file contents into Supabase SQL Editor and run manually.

### Step 3: Validate

Check migration results:

```sql
-- Verify medications schema
SELECT column_name, data_type, is_generated
FROM information_schema.columns
WHERE table_name = 'medications'
ORDER BY ordinal_position;

-- Expected: start_date_raw (jsonb), start_date_computed (timestamp, generated),
--           start_date_display_pt (text, generated), start_date_display_pr (text, generated)

-- Verify data migration
SELECT
  id,
  name,
  start_date_legacy,
  start_date_raw,
  start_date_computed,
  start_date_display_pt
FROM medications
LIMIT 5;
```

### Step 4: Test Dual-Mode Dates

```sql
-- Test 1: Insert with date mode
INSERT INTO medications (patient_id, name, dosage, start_date_raw)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Lisinopril',
  '10mg',
  '{"mode": "date", "year": 2020, "month": 5, "day": 15, "precision": "day", "certainty": "certain"}'::JSONB
);

-- Verify computed columns auto-generated
SELECT
  name,
  start_date_raw,
  start_date_computed,        -- Should be: 2020-05-15 00:00:00
  start_date_display_pt,      -- Should be: "May      2020" (trimmed to "May 2020")
  start_date_display_pr       -- Should be: "05/15/2020"
FROM medications WHERE name = 'Lisinopril';

-- Test 2: Insert with age mode (requires patient birth date in function call)
INSERT INTO medications (patient_id, name, dosage, start_date_raw)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Aspirin',
  '81mg',
  '{"mode": "age", "ageAtEvent": 25, "precision": "age"}'::JSONB
);

-- Verify
SELECT
  name,
  start_date_raw,
  start_date_computed,        -- Will be NULL (needs patient birth date parameter)
  start_date_display_pt       -- Should be: "When I was 25"
FROM medications WHERE name = 'Aspirin';
```

## Dual-Mode Date Structure

### JSONB Format

```json
{
  "mode": "date|age|relative",

  // Date mode fields
  "year": 2020,
  "month": 5,              // Optional: 1-12
  "day": 15,               // Optional: 1-31

  // Age mode fields
  "ageAtEvent": 25,

  // Relative mode fields
  "relativeTime": "2 weeks ago",
  "computedDate": "2024-10-15T00:00:00Z",

  // Metadata
  "precision": "year|month|day|age|relative",
  "certainty": null|"certain"|"somewhat_certain"|"uncertain",
  "voiceTranscript": "I started taking it in May two thousand twenty",
  "llmInterpretation": "Parsed as May 2020",
  "displayText": "May 2020"  // Optional override
}
```

### Generated Columns

- **`{field}_computed`**: TIMESTAMP for querying/sorting
- **`{field}_display_pt`**: TEXT for patient view ("May 2020", "When I was 25")
- **`{field}_display_pr`**: TEXT for provider view ("05/15/2020 (approximate)")

### Tables Using Dual-Mode Dates

| Table | Date Fields |
|-------|------------|
| **medications** | `start_date`, `end_date` |
| **conditions** | `diagnosis_date` (chronic), `last_occurrence` (recurrent), `start_date`+`end_date` (resolved) |
| **allergies** | `onset_date` |
| **surgeries** | `surgery_date` |
| **immunizations** | `administered_date` (per dose) |
| **supplements** | `start_date` |

## Migration Phases

### Phase 0: Extend Existing Tables (DONE)
- ✅ Medications: 5 → 15+ columns
- ✅ Conditions: 4 → 20+ columns
- ✅ Dual-mode date support
- ✅ Audit trails, soft delete

### Phase 1: Create Missing Tables (NEXT)
- Allergies (16 columns) - PATIENT SAFETY CRITICAL
- Surgeries (9 columns)
- Supplements (10 columns)
- Immunizations + doses (7+7 columns)
- Documents + folders (14+5 columns)
- Personal information (23 columns)
- Social history (11 columns)
- Family history (7 columns)
- User profiles (6 columns)

### Phase 2: Junction Tables
- Document associations (9 junction tables)
- Immunization doses (already included in Phase 1)

### Phase 3: RLS Policies
- Row-level security for all patient tables
- Policy: `patient_id = auth.uid()`

### Phase 4: Triggers & Functions
- `update_updated_at_column()` trigger
- Display column update triggers (for dual-mode dates)

## Rollback

If migration fails:

```sql
-- Automatic rollback (if in transaction)
ROLLBACK;

-- Manual rollback (after commit)
BEGIN;

-- Medications
ALTER TABLE medications RENAME COLUMN name TO medication;
ALTER TABLE medications RENAME COLUMN start_date_legacy TO date;
ALTER TABLE medications DROP COLUMN IF EXISTS start_date_raw CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS start_date_computed CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS start_date_display_pt CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS start_date_display_pr CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS end_date_raw CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS end_date_computed CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS frequency CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS indication CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS status CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS prescribing_doctor CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS notes CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS created_at CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS updated_at CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS deleted_at CASCADE;
ALTER TABLE medications DROP COLUMN IF EXISTS created_via CASCADE;

-- Conditions (similar pattern)
-- ...

COMMIT;
```

## Production Deployment Checklist

Before running in production:

- [ ] ✅ All tests passed in dev environment
- [ ] ✅ Validated schema matches design
- [ ] ✅ Tested dual-mode date inserts
- [ ] ✅ Verified computed columns work
- [ ] ✅ Tested rollback procedure
- [ ] ✅ Backup production database
- [ ] ✅ Scheduled maintenance window (if needed)
- [ ] ✅ Team approval obtained
- [ ] ✅ Monitoring alerts configured
- [ ] ✅ API endpoints ready to consume new schema
- [ ] ✅ Frontend code updated for JSONB date structure

## Next Steps After Migration

1. **Test API Integration**
   - Update backend queries to use `{field}_computed` for sorting
   - Return `{field}_raw` in API responses for frontend
   - Use `{field}_display_pt` for read-only displays

2. **Frontend Integration**
   - Implement dual-mode date input component
   - Parse JSONB structure from API
   - Submit proper JSONB format on save

3. **Complete Phase 1**
   - Create remaining 21 tables
   - Apply same dual-mode date pattern

4. **RLS & Security**
   - Enable RLS on all tables
   - Test patient isolation
   - Verify no data leaks

## Support

- **Design Reference**: `/Users/ali/october-arkpass/openspec/changes/fhir-database-harmonization/design.md`
- **Date Fields Spec**: `/Users/ali/october-arkpass/IMPORTANT_DATE_FIELDS_SUMMARY.md`
- **Tasks**: `/Users/ali/october-arkpass/openspec/changes/fhir-database-harmonization/tasks.md`
- **FHIR Mapping**: `/Users/ali/october-arkpass/FHIR_HARMONIZATION_MAP.md`

## Status

- **Phase 0**: Ready for dev testing
- **Phase 1-4**: Pending Phase 0 validation
- **Production**: Awaiting dev test results + approval
