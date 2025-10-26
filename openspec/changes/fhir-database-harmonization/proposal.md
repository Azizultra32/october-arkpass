# FHIR Database Harmonization

## Why

ArkPass requires a production-ready database schema that supports both patient-focused UX and healthcare interoperability. Current production has only 2 minimal tables (medications, conditions) with 4-5 columns each. We need 23 comprehensive tables with FHIR-aligned fields, patient safety features (EpiPen tracking), and support for all 10 core features documented in Figma designs.

**Critical Context**: ArkPass schema is PRIMARY, FHIR R4 is SECONDARY (export-only). Database design prioritizes app functionality and patient needs first, with FHIR mapping handled at export time.

## What Changes

### Database Schema Changes

**Phase 0: Extend Existing Tables (Production-Specific)**
- Extend `medications` table: 5 → 13 columns (rename `medication` → `name`, `date` → `start_date`, add 8 fields)
- Extend `conditions` table: 4 → 11 columns (rename `condition` → `name`, `date` → `start_date`, add 7 fields)
- **BREAKING** (minor): Column renames preserve data but change API contract

**Phase 1-4: Create Missing Tables (From FHIR_SCHEMA_MIGRATIONS.sql)**
- Create `allergies` table (16 columns) - **PATIENT SAFETY CRITICAL** (EpiPen tracking)
- Create `surgeries` table (9 columns)
- Create `immunizations` table (7 columns) + `immunization_doses` junction (7 columns)
- Create `supplements` table (10 columns)
- Create `personal_information` table (23 columns)
- Create `social_history` table (11 columns)
- Create `family_history` table (7 columns)
- Create `documents` table (14 columns) + folder system
- Create junction tables for associations (9 tables total)
- Create `user_profiles` table (6 columns) - patient master record

**Total Tables**: 2 existing → 23 comprehensive (21 new + 2 extended)

### FHIR Harmonization Strategy

**Export-Time Mapping (NOT Database Constraint)**
- Medications → FHIR MedicationStatement
- Allergies → FHIR AllergyIntolerance
- Conditions → FHIR Condition
- Surgeries → FHIR Procedure
- Immunizations → FHIR Immunization
- Supplements → FHIR MedicationStatement (category="dietary-supplement")
- Personal Information → FHIR Patient

**Custom Extensions for ArkPass-Specific Fields**
- `allergies.requires_epipen` → Custom FHIR extension (no native field)
- `documents.is_private` → Custom extension (privacy control)
- `conditions.type` (Chronic/Transient-Recurrent/Transient-Resolved) → Custom extension

**Fields Omitted from FHIR Export**
- `created_via` (internal tracking)
- `*_display_pt`, `*_display_pr` (view-specific formatting)
- `deleted_at` (soft delete flag)

### Dual-Mode Date Input Support

All date fields use JSONB structure supporting:
- **Date Mode**: Calendar picker with progressive disclosure
- **Age Mode**: "I was 25 years old" → computed date from patient birth date
- **Storage**: `{field}_raw` (JSONB), `{field}_computed_date` (TIMESTAMP, indexed)
- **Display**: `{field}_display_pt` (patient view), `{field}_display_pr` (provider view)

**Tables Affected**: medications, allergies, conditions, surgeries, supplements, immunizations

### Row-Level Security (RLS)

All patient data tables require RLS policies:
```sql
CREATE POLICY patient_access ON {table_name}
  FOR ALL USING (patient_id = auth.uid());
```

**Tables with RLS**: All 18 PHR feature tables + user_profiles

### Audit Trails

All tables include:
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ DEFAULT NOW(), trigger-updated)
- `created_via` (TEXT - 'quick_add', 'standard_form', 'import')
- `deleted_at` (TIMESTAMPTZ - soft delete)

## Impact

### Affected Specs
- `specs/medications/spec.md` - Database schema section
- `specs/allergies/spec.md` - Database schema section (PATIENT SAFETY CRITICAL)
- `specs/conditions/spec.md` - Database schema section
- `specs/surgeries/spec.md` - Database schema section
- `specs/supplements/spec.md` - Database schema section
- `specs/immunizations/spec.md` - Database schema section
- `specs/my-documents/spec.md` - Database schema section
- `specs/personal-information/spec.md` - Database schema section
- `specs/social-history/spec.md` - Database schema section
- `specs/family-history/spec.md` - Database schema section
- `specs/ui-patterns/spec.md` - Dual-mode date input implementation

### Affected Code
- **Backend**: Supabase migration scripts, API endpoints for all 10 features
- **Frontend**: React components for data entry, display, editing (all features)
- **Database Functions**: `compute_date_from_age()`, display column triggers
- **RLS Policies**: 18 patient data tables + user_profiles
- **FHIR Export**: Mapping logic for 7 resource types

### Migration Risk

**Risk Level**: LOW
- All changes are additive (ALTER TABLE ADD COLUMN, CREATE TABLE)
- Column renames preserve data (ALTER TABLE RENAME COLUMN)
- No data loss or breaking changes to existing records
- Rollback: Restore from pre-migration backup

**Migration Steps**:
1. Test in dev Supabase project first
2. Backup production database
3. Execute Phase 0 (extend existing tables) - ~5 seconds
4. Execute Phase 1-4 (create new tables) - ~10 seconds
5. Verify 23 tables exist and RLS policies active
6. Test one record creation per table
7. Deploy updated frontend/backend code

### Data Integrity

**Constraints Added**:
- CHECK constraints on enum fields (status, category, severity, etc.)
- Foreign key constraints on junction tables
- NOT NULL on required fields
- Conditional validation (e.g., EpiPen required if severity='severe')
- Date order validation (end_date >= start_date for resolved conditions)

**Indexes Added**:
- Patient ID indexes on all tables (WHERE deleted_at IS NULL)
- Computed date indexes for chronological queries
- Compound indexes for category filtering (allergies, documents)
- Full-text search indexes (future enhancement)

### Performance Impact

**Expected Performance**:
- Single-table queries: <10ms (indexed patient_id)
- Join queries (e.g., medication + conditions): <50ms
- FHIR export (all records): <500ms for typical patient (~100 records)
- Dual-mode date conversion: <1ms (SQL function)

**Optimization Strategy**:
- GENERATED ALWAYS AS STORED for computed dates (pre-calculated, indexed)
- JSONB for flexible dual-mode structure (GIN indexes supported)
- Soft delete (deleted_at) instead of hard delete (preserves audit trail)

## Patient Safety Considerations

### Critical Features

**EpiPen Tracking (Allergies)**
- `allergies.requires_epipen` BOOLEAN - life-threatening allergy flag
- Database constraint: Required if `severity='severe'`
- Frontend: Warning banner, visual emphasis
- Export: Custom FHIR extension

**Medication Status**
- `medications.status` - tracks "Discontinued" vs active
- Prevents accidental overdose from outdated medication lists
- Export: FHIR status mapping (active/stopped/on-hold)

**Condition Type Classification**
- `conditions.type` - Chronic/Transient-Recurrent/Transient-Resolved
- Determines which date fields required (diagnosis date vs end date)
- Clinical accuracy for provider handoffs

### Data Privacy

**Private Documents**
- `documents.is_private` BOOLEAN - exclude from "Share Health Record"
- Patient control over what providers see
- FHIR export respects privacy flag

**Soft Delete Audit Trail**
- All records soft-deleted (`deleted_at` NOT NULL)
- HIPAA compliance: 7-year retention requirement
- Recovery: `UPDATE {table} SET deleted_at = NULL WHERE id = ?`

## Rollback Plan

**If Migration Fails**:
1. Restore from backup (pre-migration snapshot)
2. Revert frontend/backend deployments
3. Investigate failure cause (constraints, RLS policies, functions)
4. Fix migration script
5. Retry in dev environment

**Partial Rollback** (Phase 0 only):
- If Phase 0 succeeds but Phase 1-4 fails, existing data intact
- Can rollback Phase 0 column additions: `ALTER TABLE {table} DROP COLUMN {col}`
- Cannot rollback column renames without data migration

**Zero-Downtime Migration**:
- Execute during low-traffic window (2-5 AM UTC)
- Frontend gracefully handles missing tables (shows loading state)
- Migration completes in <15 seconds total
- No user-facing impact

## Success Criteria

**Schema Validation**:
- ✅ 23 tables exist in production
- ✅ All columns match reference schema (SCHEMA_COMPARISON.md)
- ✅ RLS policies active on all patient tables
- ✅ Indexes created and optimized
- ✅ Triggers active (updated_at, display columns)

**Data Integrity**:
- ✅ Existing medications/conditions data preserved
- ✅ Column renames successful (medication→name, date→start_date)
- ✅ Foreign key constraints enforced
- ✅ CHECK constraints prevent invalid data

**Functional Testing**:
- ✅ Create one record in each of 10 features
- ✅ Quick Add pattern works (medications, allergies, supplements)
- ✅ Dual-mode date input converts age→date correctly
- ✅ Progressive disclosure shows/hides fields
- ✅ Document association creates junction records
- ✅ Soft delete preserves audit trail
- ✅ "Share Health Record" exports FHIR correctly

**Performance Testing**:
- ✅ List queries <10ms (100 records)
- ✅ Create/update <50ms
- ✅ FHIR export <500ms (typical patient)
- ✅ No N+1 queries (check with EXPLAIN ANALYZE)

## Timeline

**Phase 1 (Complete)**: Schema validation, migration script creation
**Phase 2 (This Change)**: Dev environment testing, stakeholder approval
**Phase 3 (Next)**: Production migration execution
**Phase 4 (Next)**: Frontend/backend deployment, feature activation

**Total Time**: 2-4 hours including testing and validation
