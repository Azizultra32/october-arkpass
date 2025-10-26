# Schema Validation Checklist

**Date Created**: 2025-10-25
**Purpose**: Validate FHIR_SCHEMA_MIGRATIONS.sql against actual production Supabase schema
**Status**: 🚨 CRITICAL - Must complete before any schema changes

---

## ⚠️ WARNING

The migration scripts in [FHIR_SCHEMA_MIGRATIONS.sql](FHIR_SCHEMA_MIGRATIONS.sql) were created based on **REFERENCE SCHEMA ONLY** from:
- `/Users/ali/Downloads/ARKPASS 6/arkpass_harmonized_schema.sql`

This reference schema may NOT match your actual production Supabase database. **DO NOT RUN MIGRATIONS** until validation is complete.

---

## Prerequisites

### 1. Get Actual Production Schema

You need to obtain the actual schema from your Supabase project. Choose one method:

**Option A: Supabase Dashboard** (Recommended - Easy)
1. Log in to [https://app.supabase.com](https://app.supabase.com)
2. Select your ArkPass project
3. Go to "Database" → "Tables"
4. Take screenshots OR note which tables exist

**Option B: SQL Dump** (Complete - Requires psql)
```bash
# Get connection string from Supabase Dashboard → Project Settings → Database
# Format: postgres://postgres:[password]@[host]:[port]/postgres

pg_dump -s -h [host] -U postgres -d postgres > actual_supabase_schema.sql
# -s flag = schema only (no data)
```

**Option C: Supabase CLI** (Modern - Recommended)
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase login
supabase link --project-ref [your-project-ref]

# Generate migration from remote database
supabase db pull
# This creates a migration file in supabase/migrations/
```

---

## Validation Steps

### Phase 1: Table Existence Check

For each table referenced in migrations, check if it exists in production:

- [ ] `roles` - EXISTS? ⬜ YES ⬜ NO
- [ ] `user_profiles` - EXISTS? ⬜ YES ⬜ NO
- [ ] `medications` - EXISTS? ⬜ YES ⬜ NO
- [ ] `allergies` - EXISTS? ⬜ YES ⬜ NO
- [ ] `conditions` - EXISTS? ⬜ YES ⬜ NO
- [ ] `immunizations` - EXISTS? ⬜ YES ⬜ NO
- [ ] `surgeries` - EXISTS? ⬜ YES ⬜ NO
- [ ] `family_history` - EXISTS? ⬜ YES ⬜ NO
- [ ] `social_history` - EXISTS? ⬜ YES ⬜ NO
- [ ] `lab_results` - EXISTS? ⬜ YES ⬜ NO
- [ ] `documents` - EXISTS? ⬜ YES ⬜ NO
- [ ] `visit_notes` - EXISTS? ⬜ YES ⬜ NO
- [ ] `access_grants` - EXISTS? ⬜ YES ⬜ NO
- [ ] `proxy_access` - EXISTS? ⬜ YES ⬜ NO
- [ ] `audit_logs` - EXISTS? ⬜ YES ⬜ NO
- [ ] `notifications` - EXISTS? ⬜ YES ⬜ NO
- [ ] `appointments` - EXISTS? ⬜ YES ⬜ NO
- [ ] `data_exports` - EXISTS? ⬜ YES ⬜ NO
- [ ] `supplements` - EXISTS? ⬜ YES ⬜ NO (Expected: NO - we're creating this)

**If ANY table is missing** (except `supplements`):
- 🚨 **STOP** - Reference schema does not match production
- Re-assess migration strategy

---

### Phase 2: Column Existence Check

For each ALTER TABLE statement, verify columns don't already exist:

#### `allergies` Table

Current columns in production:
```
List actual columns here after checking production database
Example:
- id
- patient_id
- allergen
- reaction
- severity (if exists, migration will fail!)
- notes
- created_at
- updated_at
```

Columns to be ADDED by migration:
- [ ] `category` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)
- [ ] `severity` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)
- [ ] `onset_date` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)
- [ ] `onset_age` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)
- [ ] `onset_precision` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)
- [ ] `requires_epipen` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)
- [ ] `verification_status` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists (skip)

#### `documents` Table

Current columns in production:
```
List actual columns here
```

Columns to be ADDED:
- [ ] `name` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `folder_id` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `system` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `tags` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `is_private` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `is_highlighted` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `file_type` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `file_size_bytes` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `uploaded_at` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists
- [ ] `inbox_status` - Confirm NOT EXISTS ⬜ Safe to add ⬜ Already exists

#### `lab_results` Table

Current columns in production:
```
List actual columns here
```

Columns to be ADDED:
- [ ] `test_name` - Confirm NOT EXISTS
- [ ] `ordering_provider` - Confirm NOT EXISTS
- [ ] `performing_lab` - Confirm NOT EXISTS
- [ ] `normal_range_min` - Confirm NOT EXISTS
- [ ] `normal_range_max` - Confirm NOT EXISTS
- [ ] `normal_range_text` - Confirm NOT EXISTS
- [ ] `status` - Confirm NOT EXISTS
- [ ] `interpretation` - Confirm NOT EXISTS
- [ ] `loinc_code` - Confirm NOT EXISTS
- [ ] `specimen_type` - Confirm NOT EXISTS

#### `conditions`, `immunizations`, `surgeries`, `social_history` Tables

Check for columns added in Phase 5 (optional enhancements):
- [ ] Review actual schemas
- [ ] Document any conflicts
- [ ] Adjust migrations if needed

---

### Phase 3: Foreign Key Validation

Verify referenced tables/columns exist:

- [ ] `user_profiles.user_id` - EXISTS and references `auth.users(id)`?
- [ ] `patients` table - Does this exist? Or is it `user_profiles`?
  - ⚠️ Migration uses `user_profiles`, reference schema shows both
  - **CRITICAL**: Confirm correct patient reference table

---

### Phase 4: Data Type Compatibility

For existing columns, check data types match:

Example:
```sql
-- If production has:
CREATE TABLE allergies (
  severity VARCHAR(50)  -- String type
);

-- But migration adds CHECK constraint expecting specific values:
ALTER TABLE allergies ADD COLUMN severity TEXT
  CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening'));

-- This will FAIL if column already exists with different type
```

Action items:
- [ ] Get data types for all existing columns
- [ ] Compare with migration ALTER TABLE statements
- [ ] Adjust CHECK constraints to match existing data patterns

---

### Phase 5: RLS Policy Conflicts

Supabase may have existing RLS policies. Check for:

- [ ] Are RLS policies already enabled on tables?
- [ ] Do policy names conflict with migration?
- [ ] Do existing policies need to be updated?

Example conflict:
```sql
-- Migration creates:
CREATE POLICY supplements_select ON supplements FOR SELECT
  USING (auth.uid() = patient_id);

-- But if policy already exists with same name, migration fails
```

Action:
- [ ] List existing RLS policies
- [ ] Use `CREATE POLICY IF NOT EXISTS` (if Postgres version supports)
- [ ] OR: Use unique policy names with versioning

---

### Phase 6: Trigger Function Conflicts

Migration creates `update_updated_at_column()` trigger function.

- [ ] Does this function already exist?
- [ ] Are there existing triggers on these tables?
- [ ] Do trigger names conflict?

Mitigation:
```sql
-- Use OR REPLACE to avoid conflicts
CREATE OR REPLACE FUNCTION update_updated_at_column()
...
```

---

## Discrepancy Resolution

### If Production Schema Differs from Reference

Document differences here:

| Table/Column | Reference Schema | Production Schema | Resolution |
|--------------|------------------|-------------------|------------|
| Example: `medications.dosage` | `TEXT` | `VARCHAR(100)` | Use VARCHAR in migration |
| | | | |
| | | | |

---

## Testing Strategy

### Development Environment Setup

Before running on production:

1. [ ] Create Supabase development project (free tier OK)
2. [ ] Apply ARKPASS 6 reference schema to dev project
3. [ ] Run migrations on dev project
4. [ ] Test for errors
5. [ ] Fix any issues
6. [ ] Document fixes in migration file
7. [ ] Re-test until clean
8. [ ] ONLY THEN consider production deployment

### Test Queries

After migration, run these to verify success:

```sql
-- Check allergies extensions
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'allergies'
  AND column_name IN ('category', 'severity', 'requires_epipen');

-- Verify should return 3 rows

-- Check supplements table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'supplements';

-- Check document_folders pre-defined entries
SELECT name, is_system_folder
FROM document_folders
WHERE is_system_folder = TRUE
ORDER BY sort_order;

-- Should return: Prescriptions, Lab Results, Imaging, Consult, Other

-- Verify RLS policies
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('supplements', 'document_folders', 'patient_demographics');
```

---

## Sign-Off Checklist

Before executing migrations on production:

- [ ] All validation steps completed
- [ ] Discrepancies documented and resolved
- [ ] Migrations tested successfully in development
- [ ] Database backup created (Supabase dashboard → Database → Backups)
- [ ] Team/stakeholders reviewed migration plan
- [ ] Rollback plan documented (see below)
- [ ] Maintenance window scheduled (if needed)
- [ ] Monitoring plan in place (check for errors post-migration)

---

## Rollback Plan

If migration fails or causes issues:

### Immediate Rollback (Development)
```sql
-- Phase 1 rollback: Drop new tables
DROP TABLE IF EXISTS supplements CASCADE;
DROP TABLE IF EXISTS document_folders CASCADE;
DROP TABLE IF EXISTS patient_demographics CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS patient_insurance CASCADE;

-- Remove added columns (can't easily rollback ALTER TABLE ADD COLUMN)
-- Best practice: Use Supabase backup restore
```

### Production Rollback
- [ ] Restore from pre-migration backup (Supabase dashboard)
- [ ] Estimated restore time: ~5-10 minutes (depends on DB size)
- [ ] Communication plan: Notify users of temporary downtime

---

## Next Steps After Validation

Once validation is complete and migrations are adjusted:

1. Update [FHIR_SCHEMA_MIGRATIONS.sql](FHIR_SCHEMA_MIGRATIONS.sql) with production-specific changes
2. Create development test migration file (separate from production)
3. Document test results
4. Schedule production migration
5. Execute migration
6. Verify with test queries
7. Update [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) with "✅ Schema migrations complete"

---

## Resources

- **Supabase Schema Migrations Docs**: https://supabase.com/docs/guides/cli/managing-environments
- **Postgres ALTER TABLE Docs**: https://www.postgresql.org/docs/current/sql-altertable.html
- **FHIR R4 Specification**: http://hl7.org/fhir/R4/

---

**Document Status**: Template - Awaiting Production Schema
**Owner**: Database Team / DevOps
**Review Required**: Before any production schema changes
