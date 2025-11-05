# Database Migration Testing Guide

## Prerequisites

1. **Dev Supabase Project** - DO NOT test in production
2. **Existing tables** - medications and conditions tables must exist with old schema
3. **Backup** - Take snapshot of dev database before testing

## Step 1: Prepare Test Database

### Option A: Use existing dev Supabase project
If you already have a dev project, ensure it has the old schema:

```sql
-- Check current schema
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('medications', 'conditions')
ORDER BY table_name, ordinal_position;

-- Expected: medications has columns: id, patient_id, medication, dosage, date
-- Expected: conditions has columns: id, patient_id, condition, date
```

### Option B: Create fresh dev project
1. Go to https://app.supabase.com
2. Create new project: "arkpass-dev"
3. Create minimal schema:

```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  medication TEXT,
  dosage TEXT,
  date DATE
);

CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  condition TEXT,
  date DATE
);
```

## Step 2: Run Test Migration

1. **Open Supabase SQL Editor** (in your dev project)
2. **Paste contents of** `scripts/test-migration.sql`
3. **Click "Run"**

### Expected Results

✅ **Success Indicators:**
- No errors in output
- Query returns column list showing new columns
- medications table has `name` column (not `medication`)
- conditions table has `name` column (not `condition`)

❌ **Failure Indicators:**
- Error: "column already exists" - table already migrated
- Error: "column does not exist" - wrong starting schema
- Transaction rolled back - check error message

## Step 3: Validate Migration

Run these validation queries:

```sql
-- Check medications schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'medications'
ORDER BY ordinal_position;

-- Expected columns: id, patient_id, name, dosage, start_date, frequency,
--                   indication, status, end_date, prescribing_doctor,
--                   notes, created_at, updated_at, created_via

-- Check conditions schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'conditions'
ORDER BY ordinal_position;

-- Expected columns: id, patient_id, name, start_date, status, tags,
--                   end_date, severity, notes, created_at, updated_at
```

## Step 4: Test Data Operations

```sql
-- Test inserting a medication
INSERT INTO medications (patient_id, name, dosage, start_date, frequency, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Lisinopril',
  '10mg',
  '2024-01-15',
  'Once daily',
  'active'
);

-- Test querying
SELECT * FROM medications WHERE status = 'active';

-- Test updating
UPDATE medications
SET end_date = '2024-12-31', status = 'stopped'
WHERE name = 'Lisinopril';

-- Test inserting a condition
INSERT INTO conditions (patient_id, name, start_date, status, severity)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Hypertension',
  '2024-01-01',
  'active',
  'moderate'
);

-- Verify
SELECT * FROM conditions WHERE status = 'active';
```

## Step 5: Test Rollback (Optional)

To test rollback capability:

```sql
BEGIN;

-- Make a change
ALTER TABLE medications ADD COLUMN test_column TEXT;

-- Verify column exists
SELECT column_name FROM information_schema.columns
WHERE table_name = 'medications' AND column_name = 'test_column';

-- Rollback
ROLLBACK;

-- Verify column no longer exists
SELECT column_name FROM information_schema.columns
WHERE table_name = 'medications' AND column_name = 'test_column';
-- Should return empty
```

## Next Steps After Successful Test

If Phase 0 migration succeeds:

1. ✅ Mark task 1.4 complete in `openspec/changes/fhir-database-harmonization/tasks.md`
2. **Run full migration** (`FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql`) in dev
3. **Validate all 23 tables** created
4. **Test RLS policies**
5. **Test one record per table**
6. **Get approval** before production deployment

## Troubleshooting

### Error: "column already exists"
- Database already migrated or partially migrated
- Solution: Drop and recreate tables OR use fresh dev database

### Error: "column does not exist"
- Wrong starting schema
- Solution: Verify you're using correct database with old schema

### Transaction rolled back
- Check error message for specific issue
- Common: constraint violations, type mismatches
- Solution: Fix SQL and re-run

## Production Deployment (DO NOT RUN YET)

Only after all dev tests pass:

1. **Backup production database** (Supabase Dashboard → Database → Backups)
2. **Schedule maintenance window** (if needed)
3. **Run full migration** in production
4. **Validate** all tables and data
5. **Test API endpoints**
6. **Monitor** for errors

---

**Current Status**: Ready for dev testing
**Next Task**: Run test-migration.sql in dev Supabase project
