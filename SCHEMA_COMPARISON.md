# Supabase Production Schema Comparison

**Date**: 2025-10-26
**Supabase Project**: `https://gqahazcatpgzzfujnidk.supabase.co`
**Comparison**: ARKPASS 6 Reference Schema vs. Actual Production Database

---

## 🚨 CRITICAL FINDING

**The production Supabase database is nearly empty.**

### Current Production State
- **Tables exist**: 2 (medications, conditions)
- **Tables from ARKPASS 6 reference**: 18
- **Status**: This is a **minimal test/development database**, NOT the comprehensive ARKPASS 6 production schema

### Impact
✅ **POSITIVE**: We can build from scratch with clean migrations
✅ **POSITIVE**: No legacy data to migrate or transform
✅ **POSITIVE**: No schema conflicts to resolve
⚠️ **NEUTRAL**: Reference schema is aspirational, not actual production

---

## Production Database Schema (Actual)

### Table 1: `medications`

**Columns** (5 total):
| Column Name | Data Type | Notes |
|-------------|-----------|-------|
| `id` | (detected from row) | Primary key |
| `patient_id` | (detected from row) | Foreign key |
| `date` | (detected from row) | Date field |
| `medication` | (detected from row) | Medication name |
| `dosage` | (detected from row) | Dosage information |

**Rows**: 1 (test data)

**Missing from Reference Schema**:
- `name` (reference uses this, production uses `medication`)
- `frequency`, `indication`, `status`, `start_date`, `end_date`, `prescribing_doctor`, `notes`
- `created_at`, `updated_at` (audit timestamps)

**Conclusion**: Production `medications` table is **minimal prototype**, missing most fields from reference schema.

---

### Table 2: `conditions`

**Columns** (4 total):
| Column Name | Data Type | Notes |
|-------------|-----------|-------|
| `id` | (detected from row) | Primary key |
| `patient_id` | (detected from row) | Foreign key |
| `date` | (detected from row) | Date field |
| `condition` | (detected from row) | Condition name |

**Rows**: 3 (test data)

**Missing from Reference Schema**:
- `name` (reference uses this, production uses `condition`)
- `status`, `tags`, `start_date`, `end_date`, `severity`, `notes`
- `created_at`, `updated_at` (audit timestamps)

**Conclusion**: Production `conditions` table is **minimal prototype**, missing most fields from reference schema.

---

## ARKPASS 6 Reference Schema (Aspirational)

### Tables in Reference (18 total)

| Table Name | Production Status | Action Needed |
|------------|-------------------|---------------|
| `roles` | ❌ Does not exist | **CREATE** |
| `user_profiles` | ❌ Does not exist | **CREATE** |
| `medications` | ✅ EXISTS (minimal) | **EXTEND** with 8+ fields |
| `visit_notes` | ❌ Does not exist | **CREATE** |
| `allergies` | ❌ Does not exist | **CREATE** |
| `immunizations` | ❌ Does not exist | **CREATE** |
| `conditions` | ✅ EXISTS (minimal) | **EXTEND** with 6+ fields |
| `surgeries` | ❌ Does not exist | **CREATE** |
| `family_history` | ❌ Does not exist | **CREATE** |
| `social_history` | ❌ Does not exist | **CREATE** |
| `lab_results` | ❌ Does not exist | **CREATE** |
| `documents` | ❌ Does not exist | **CREATE** |
| `access_grants` | ❌ Does not exist | **CREATE** |
| `proxy_access` | ❌ Does not exist | **CREATE** |
| `audit_logs` | ❌ Does not exist | **CREATE** |
| `notifications` | ❌ Does not exist | **CREATE** |
| `appointments` | ❌ Does not exist | **CREATE** |
| `data_exports` | ❌ Does not exist | **CREATE** |

**Additional Tables Needed** (from Figma extraction):
| Table Name | Source | Action Needed |
|------------|--------|---------------|
| `supplements` | Figma (7 screens) | **CREATE** (not in reference either) |
| `document_folders` | Figma (My Documents) | **CREATE** (not in reference) |
| `patient_demographics` | Figma (Personal Info) | **CREATE** (not in reference) |
| `emergency_contacts` | Figma (Personal Info) | **CREATE** (not in reference) |
| `patient_insurance` | Figma (Personal Info) | **CREATE** (not in reference) |

---

## Schema Comparison Matrix

### medications Table

| Field | Reference Schema | Production Schema | Figma Requirement | Action |
|-------|------------------|-------------------|-------------------|--------|
| `id` | UUID PRIMARY KEY | ✅ EXISTS | ✅ Required | ✅ Keep |
| `patient_id` | UUID (FK) | ✅ EXISTS | ✅ Required | ✅ Keep |
| `name` | TEXT | ❌ Missing (uses `medication`) | ✅ Required | **RENAME** `medication` → `name` |
| `dosage` | TEXT | ✅ EXISTS | ✅ Required | ✅ Keep |
| `frequency` | TEXT | ❌ Missing | ✅ Required | **ADD** |
| `indication` | TEXT | ❌ Missing | ✅ Required | **ADD** |
| `status` | TEXT | ❌ Missing | ✅ Required | **ADD** |
| `start_date` | DATE | ❌ Missing (uses `date`) | ✅ Required | **RENAME** `date` → `start_date` |
| `end_date` | DATE | ❌ Missing | Optional | **ADD** |
| `prescribing_doctor` | TEXT | ❌ Missing | Optional | **ADD** |
| `notes` | TEXT | ❌ Missing | Optional | **ADD** |
| `created_at` | TIMESTAMPTZ | ❌ Missing | Audit | **ADD** |
| `updated_at` | TIMESTAMPTZ | ❌ Missing | Audit | **ADD** |

**Migration Strategy**: **EXTEND** with 8 new columns + **RENAME** 2 columns

---

### conditions Table

| Field | Reference Schema | Production Schema | Figma Requirement | Action |
|-------|------------------|-------------------|-------------------|--------|
| `id` | UUID PRIMARY KEY | ✅ EXISTS | ✅ Required | ✅ Keep |
| `patient_id` | UUID (FK) | ✅ EXISTS | ✅ Required | ✅ Keep |
| `name` | TEXT | ❌ Missing (uses `condition`) | ✅ Required | **RENAME** `condition` → `name` |
| `status` | TEXT | ❌ Missing | ✅ Required | **ADD** |
| `tags` | TEXT[] | ❌ Missing | ✅ Required | **ADD** |
| `start_date` | DATE | ❌ Missing (uses `date`) | ✅ Required | **RENAME** `date` → `start_date` |
| `end_date` | DATE | ❌ Missing | Optional | **ADD** |
| `severity` | TEXT | ❌ Missing | Optional | **ADD** |
| `notes` | TEXT | ❌ Missing | Optional | **ADD** |
| `created_at` | TIMESTAMPTZ | ❌ Missing | Audit | **ADD** |
| `updated_at` | TIMESTAMPTZ | ❌ Missing | Audit | **ADD** |

**Migration Strategy**: **EXTEND** with 7 new columns + **RENAME** 2 columns

---

## Migration Strategy

### Phase 0: Handle Existing Tables (CRITICAL - Do First)

**Option A: Extend Existing Tables (Preserves Data)**
```sql
-- Medications: Rename + Extend
ALTER TABLE medications RENAME COLUMN medication TO name;
ALTER TABLE medications RENAME COLUMN date TO start_date;
ALTER TABLE medications
  ADD COLUMN frequency TEXT,
  ADD COLUMN indication TEXT,
  ADD COLUMN status TEXT DEFAULT 'active',
  ADD COLUMN end_date DATE,
  ADD COLUMN prescribing_doctor TEXT,
  ADD COLUMN notes TEXT,
  ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Conditions: Rename + Extend
ALTER TABLE conditions RENAME COLUMN condition TO name;
ALTER TABLE conditions RENAME COLUMN date TO start_date;
ALTER TABLE conditions
  ADD COLUMN status TEXT DEFAULT 'active',
  ADD COLUMN tags TEXT[],
  ADD COLUMN end_date DATE,
  ADD COLUMN severity TEXT,
  ADD COLUMN notes TEXT,
  ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
```

**Option B: Drop and Recreate (Clean Slate)**
```sql
-- WARNING: Destroys existing test data
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS conditions CASCADE;

-- Then run full schema creation from FHIR_SCHEMA_MIGRATIONS.sql
```

**Recommendation**: **Option A** (Extend) - Preserves any test data, simpler migration.

---

### Phase 1: Create All Missing Tables (16 from Reference + 5 from Figma)

Use `FHIR_SCHEMA_MIGRATIONS.sql` but with adjustments:
1. **Skip** `CREATE TABLE medications` → Use `ALTER TABLE` from Phase 0
2. **Skip** `CREATE TABLE conditions` → Use `ALTER TABLE` from Phase 0
3. **CREATE** all other 16 reference tables
4. **CREATE** 5 new Figma-specific tables (supplements, document_folders, patient_demographics, etc.)

**Total Tables After Migration**: 23 tables

---

## Validation Checklist Results

### Phase 1: Table Existence ✅ COMPLETE

| Table | Expected | Actual | Status |
|-------|----------|--------|--------|
| `roles` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `user_profiles` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `medications` | Should exist (ref) | ✅ EXISTS (minimal) | ⚠️ EXTEND |
| `visit_notes` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `allergies` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `immunizations` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `conditions` | Should exist (ref) | ✅ EXISTS (minimal) | ⚠️ EXTEND |
| `surgeries` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `family_history` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `social_history` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `lab_results` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `documents` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `access_grants` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `proxy_access` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `audit_logs` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `notifications` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `appointments` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `data_exports` | Should exist (ref) | ❌ Missing | ⚠️ CREATE |
| `supplements` | Should NOT exist | ❌ Missing | ✅ Expected (will create) |

### Phase 2: Column Existence ✅ COMPLETE

**medications**:
- Existing columns: `id, patient_id, medication, dosage, date`
- Missing columns: 8 fields from reference schema
- Action: Extend with ALTER TABLE

**conditions**:
- Existing columns: `id, patient_id, condition, date`
- Missing columns: 7 fields from reference schema
- Action: Extend with ALTER TABLE

### Phase 3: Foreign Key Validation ⚠️ CANNOT COMPLETE

- Cannot verify FK references without service_role key
- Assumption: `patient_id` references `user_profiles(user_id)` or `auth.users(id)`
- **ACTION REQUIRED**: Verify FK targets before migration

### Phase 4: Data Type Compatibility ⚠️ PARTIAL

- Can see column names, but not data types (anon key limitation)
- Assumption: Using UUID for IDs, TEXT for strings, DATE for dates
- **ACTION REQUIRED**: Verify data types in Supabase Dashboard

### Phase 5: RLS Policy Conflicts ⚠️ CANNOT CHECK

- Anon key cannot query `pg_policies`
- **ACTION REQUIRED**: Check RLS policies in Supabase Dashboard before adding new ones

### Phase 6: Trigger Function Conflicts ⚠️ CANNOT CHECK

- Anon key cannot query trigger metadata
- **ACTION REQUIRED**: Check triggers in Supabase Dashboard

---

## Discrepancies Summary

### Critical Discrepancies

1. **Database is nearly empty**: Only 2 minimal tables exist
2. **Column naming mismatch**:
   - Production uses `medication` (singular), reference uses `name`
   - Production uses `condition` (singular), reference uses `name`
   - Production uses generic `date`, reference uses `start_date`
3. **16 tables completely missing**: Entire ARKPASS 6 schema not deployed
4. **No audit timestamps**: `created_at`, `updated_at` missing from existing tables
5. **No RLS policies visible**: Cannot verify security implementation

### Non-Critical Discrepancies

- Cannot verify data types (anon key limitation)
- Cannot verify foreign key targets
- Cannot verify indexes
- Cannot verify triggers

---

## Recommendations

### Immediate Actions (Before Migration)

1. **✅ DO NOT** assume reference schema matches production
2. **✅ DO** extend existing `medications` and `conditions` tables (Option A)
3. **✅ DO** create all 16 missing reference tables
4. **✅ DO** create 5 Figma-specific tables
5. **⚠️ VERIFY** foreign key targets (`patient_id` → where?)
6. **⚠️ CHECK** Supabase Dashboard for:
   - Data types of existing columns
   - Any existing RLS policies
   - Any existing triggers
   - Any existing indexes

### Migration File Adjustments Needed

**FHIR_SCHEMA_MIGRATIONS.sql** needs:
1. **Phase 0 (NEW)**: Extend existing tables
   - ALTER medications (rename + add columns)
   - ALTER conditions (rename + add columns)
2. **Phase 1 (ADJUST)**: Create missing tables
   - SKIP medications (already exists)
   - SKIP conditions (already exists)
   - CREATE all other 21 tables
3. **Phases 2-4**: No changes needed

---

## Next Steps

1. ✅ **DONE**: Schema probe complete
2. ⏭️ **NEXT**: Adjust `FHIR_SCHEMA_MIGRATIONS.sql` for production reality
3. ⏭️ **THEN**: Create Phase 0 migration (extend existing tables)
4. ⏭️ **VERIFY**: Test migrations in development Supabase project
5. ⏭️ **EXECUTE**: Run migrations on production after validation

---

**Document Status**: Complete - Production Schema Documented
**Last Updated**: 2025-10-26
**Production Database**: Nearly empty (2 minimal tables)
**Migration Strategy**: Extend existing + Create missing (23 total tables)
