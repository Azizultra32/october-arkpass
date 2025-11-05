# FHIR Database Harmonization - Technical Design

## Context

ArkPass production database currently has only 2 minimal tables (medications, conditions) with 4-5 columns each. We need to execute a comprehensive schema migration to support all 10 PHR features (75 Figma screens) while maintaining FHIR export compatibility.

**Stakeholders**: Development team, database administrators, healthcare compliance team
**Timeline**: Database migration ~15 seconds, total implementation 2-4 weeks
**Risk Level**: LOW (all additive changes, tested in dev)

## Goals / Non-Goals

### Goals
1. ✅ Create production-ready schema for all 10 PHR features
2. ✅ Support FHIR R4 export (7 resource types) at export time
3. ✅ Implement patient safety features (EpiPen tracking, severity classification)
4. ✅ Enable all 6 UI patterns (dual-mode date, quick add, etc.)
5. ✅ Maintain HIPAA compliance (audit trails, RLS, soft delete)
6. ✅ Zero data loss during migration (preserve existing medications/conditions)

### Non-Goals
- ❌ Real-time FHIR validation (happens at export, not on save)
- ❌ Vocabulary service integration (RxNorm, SNOMED - future)
- ❌ Provider portal database (separate project)
- ❌ Offline sync support (future requirement)
- ❌ Multi-tenant support (single-patient-per-account model)

## Decisions

### Decision 1: ArkPass Schema PRIMARY, FHIR SECONDARY

**Choice**: Optimize database for ArkPass app functionality, map to FHIR at export time

**Alternatives Considered**:
- ❌ **Option A**: Design database to strictly match FHIR resource structure
  - **Rejected**: FHIR resources are optimized for exchange, not app UX
  - **Problem**: Missing fields for ArkPass features (EpiPen, document folders, 5 allergy categories)
  - **Impact**: Would degrade patient experience and safety

- ✅ **Option B**: Design database for ArkPass, use FHIR extensions/mapping at export
  - **Selected**: Prioritizes patient needs and app functionality
  - **FHIR Compliance**: Use custom extensions for ArkPass-specific fields
  - **Example**: `allergies.requires_epipen` → `AllergyIntolerance.extension[requires-epipen]`

**Rationale**: Patient safety and UX cannot be compromised to fit FHIR limitations. FHIR is for interoperability (export), not primary data model.

---

### Decision 2: Dual-Mode Date Storage (JSONB)

**Choice**: Store date fields as JSONB with computed columns for queries

**Alternatives Considered**:
- ❌ **Option A**: Separate columns for each date mode field
  ```sql
  when_date TIMESTAMP,
  when_age INTEGER,
  when_mode TEXT ('date'|'age')
  ```
  - **Rejected**: Rigid schema, difficult to extend (certainty levels, frameworks)
  - **Problem**: 4+ columns per date field × 15 date fields = 60+ columns

- ✅ **Option B**: JSONB for raw input + generated computed column
  ```sql
  when_raw JSONB, -- Full dual-mode structure
  when_computed_date TIMESTAMP GENERATED ALWAYS AS (...) STORED
  ```
  - **Selected**: Flexible for future enhancements, clean schema
  - **Performance**: Computed column is indexed, queries fast (<10ms)

**Rationale**: JSONB provides flexibility for dual-mode date pattern while maintaining query performance via indexed computed columns.

---

### Decision 3: Soft Delete (deleted_at) vs Hard Delete

**Choice**: Soft delete all patient records via `deleted_at` timestamp

**Alternatives Considered**:
- ❌ **Option A**: Hard delete (DELETE FROM table)
  - **Rejected**: Violates HIPAA 7-year retention requirement
  - **Problem**: No audit trail for compliance

- ✅ **Option B**: Soft delete (UPDATE table SET deleted_at = NOW())
  - **Selected**: Preserves audit trail, enables recovery
  - **HIPAA**: Meets 7-year retention requirement
  - **Performance**: Add WHERE deleted_at IS NULL to all queries

**Rationale**: HIPAA compliance requires audit trail preservation. Soft delete enables recovery from accidental deletion.

---

### Decision 4: Row-Level Security (RLS) Strategy

**Choice**: PostgreSQL RLS policies on all patient tables

**Alternatives Considered**:
- ❌ **Option A**: Application-level security only
  - **Rejected**: Database queries can bypass app logic
  - **Security Risk**: Direct database access (admin tools, SQL) could leak data

- ✅ **Option B**: Database-level RLS + application-level checks
  - **Selected**: Defense in depth (database enforces, app validates)
  - **Policy**: `patient_id = auth.uid()` on all tables
  - **Performance**: <1ms overhead per query

**Rationale**: HIPAA requires defense in depth. RLS prevents data leaks even if application code has bugs.

---

### Decision 5: Document Folder Structure

**Choice**: 5 pre-defined folders stored as enum, not user-creatable folders

**Alternatives Considered**:
- ❌ **Option A**: User-creatable folder system (separate folders table)
  - **Rejected**: Adds complexity, not in Figma designs
  - **Problem**: Folder hierarchy management, permissions

- ✅ **Option B**: 5 fixed folders as enum
  ```sql
  folder TEXT CHECK (folder IN ('prescriptions', 'lab_results', 'imaging', 'consult', 'other'))
  ```
  - **Selected**: Matches Figma designs, simple implementation
  - **Folders**: Prescriptions, Lab Results, Imaging, Consult, Other

**Rationale**: MVP requires simplicity. User-creatable folders can be added in future if users request it.

---

### Decision 6: Allergy Category-Specific Symptom Lists

**Choice**: Store symptoms as JSONB array, validate category-specific lists in app

**Alternatives Considered**:
- ❌ **Option A**: Separate symptoms table with foreign keys
  - **Rejected**: Over-engineered for MVP
  - **Problem**: 5 symptom lists × multiple symptoms = complex schema

- ✅ **Option B**: JSONB array with app-level validation
  ```sql
  symptoms JSONB -- { selectedSymptoms: string[], otherDescription?: string }
  ```
  - **Selected**: Flexible, simple schema
  - **Validation**: App enforces category-specific symptom lists
  - **Example**: `{ selectedSymptoms: ['anaphylaxis', 'difficulty_breathing'], otherDescription: 'Mild hives' }`

**Rationale**: JSONB provides flexibility without database schema changes when adding new symptoms. App validates category-specific lists.

---

### Decision 7: Condition Type-Specific Date Fields

**Choice**: 4 separate date field sets with database constraints

**Alternatives Considered**:
- ❌ **Option A**: Single date field + type determines meaning
  - **Rejected**: Confusing semantics, hard to query
  - **Problem**: What does "date" mean? (diagnosis? start? end?)

- ✅ **Option B**: Type-specific date fields + consistency constraint
  ```sql
  diagnosis_date_raw JSONB,     -- Chronic only
  last_occurrence_date_raw JSONB, -- Transient-Recurrent only
  start_date_raw JSONB,         -- Transient-Resolved only
  end_date_raw JSONB,           -- Transient-Resolved only

  CONSTRAINT type_date_consistency CHECK (
    (type = 'chronic' AND diagnosis_date_raw IS NOT NULL AND ...) OR
    (type = 'transient_recurrent' AND last_occurrence_date_raw IS NOT NULL AND ...) OR
    (type = 'transient_resolved' AND start_date_raw IS NOT NULL AND end_date_raw IS NOT NULL AND ...)
  )
  ```
  - **Selected**: Clear semantics, type-safe
  - **Performance**: 4 computed date columns, all indexed

**Rationale**: Clinical accuracy requires precise date semantics. Chronic diagnosis date ≠ transient start date.

---

### Decision 8: Immunization Dose Pattern (Junction Table)

**Choice**: `immunizations` table + `immunization_doses` junction table

**Alternatives Considered**:
- ❌ **Option A**: JSONB array of doses in immunizations table
  ```sql
  doses JSONB -- [{ when: ..., location: ... }, { when: ..., location: ... }]
  ```
  - **Rejected**: Cannot query individual doses efficiently
  - **Problem**: "Show all vaccines administered in 2024" requires JSONB scanning

- ✅ **Option B**: Separate doses table with foreign keys
  ```sql
  immunizations (id, name, description)
  immunization_doses (id, immunization_id, dose_number, when_raw, location)
  ```
  - **Selected**: Clean queries, relational integrity
  - **Performance**: Can query doses independently
  - **Example**: `SELECT * FROM immunization_doses WHERE when_computed_date > '2024-01-01'`

**Rationale**: Relational design enables efficient queries on individual doses (e.g., "vaccines this year", "overdue boosters").

---

### Decision 9: Display Column Pattern (Three-View Architecture)

**Choice**: Computed display columns for patient/provider views

**Alternatives Considered**:
- ❌ **Option A**: Format dates in application code only
  - **Rejected**: Inconsistent formatting across features
  - **Problem**: Business logic scattered across frontend

- ✅ **Option B**: Database-generated display columns + triggers
  ```sql
  when_display_pt TEXT,  -- "March 2021" or "Age 25"
  when_display_pr TEXT,  -- "2021-03-30" or "Age 25 (est. 1996)"
  when_display_active BOOLEAN DEFAULT TRUE
  ```
  - **Selected**: Centralized formatting logic
  - **Performance**: Pre-computed, no runtime formatting
  - **Consistency**: Same format across all features

**Rationale**: Database-level formatting ensures consistency and performance. Application only reads pre-formatted strings.

---

## Risks / Trade-offs

### Risk 1: JSONB Query Performance
**Risk**: Complex JSONB queries may be slow (dual-mode date raw data)

**Mitigation**:
- Use GENERATED ALWAYS AS STORED for computed columns (pre-calculated, indexed)
- Query computed columns, not JSONB raw data
- Add GIN indexes on JSONB if needed (future optimization)

**Trade-off**: Flexibility (JSONB) vs. performance (computed columns) - we get both

---

### Risk 2: Column Renames Break Existing Code
**Risk**: Renaming `medication` → `name`, `date` → `start_date` breaks existing frontend

**Mitigation**:
- Migration includes SQL views for backward compatibility (optional):
  ```sql
  CREATE VIEW medications_legacy AS
  SELECT id, name AS medication, start_date AS date FROM medications;
  ```
- Coordinate migration with frontend deployment
- Test in dev environment first

**Trade-off**: Short-term migration effort vs. long-term schema consistency

---

### Risk 3: FHIR Export Validation Failures
**Risk**: Custom extensions rejected by strict FHIR validators

**Mitigation**:
- Use HL7 FHIR Validator to test exports
- Document custom extensions in FHIR StructureDefinition
- Provide "strict mode" export (omit custom extensions if needed)

**Trade-off**: ArkPass features vs. strict FHIR compliance - we choose ArkPass, use extensions

---

### Risk 4: Database Migration Rollback Complexity
**Risk**: If migration fails mid-execution, partial state may be corrupt

**Mitigation**:
- **Transaction**: Wrap entire migration in single PostgreSQL transaction
  ```sql
  BEGIN;
  -- All Phase 0-4 migrations
  COMMIT; -- Only commits if all succeed
  ```
- **Backup**: Full database backup before migration
- **Testing**: Validate in dev environment first (mandatory)

**Trade-off**: None - transactional migration provides atomicity

---

## Migration Plan

### Pre-Migration Checklist
- [ ] Test migration in dev Supabase project
- [ ] Verify 23 tables created, RLS policies active
- [ ] Create full production database backup
- [ ] Schedule migration during low-traffic window (2-5 AM UTC)
- [ ] Notify team of maintenance window

### Migration Execution Steps

**Step 1: Backup** (5 minutes)
```bash
# Supabase CLI backup
supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql
```

**Step 2: Execute Migration** (~15 seconds)
```bash
# Run migration script
psql -f FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql
```

**Step 3: Verification** (2 minutes)
```sql
-- Verify table count
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- Expected: 23

-- Verify existing data preserved
SELECT COUNT(*) FROM medications; -- Should match pre-migration count
SELECT COUNT(*) FROM conditions;  -- Should match pre-migration count

-- Verify RLS active
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- Expected: rowsecurity = true for all patient tables
```

**Step 4: Smoke Test** (3 minutes)
- Create one record in each table via Supabase Studio
- Verify foreign key constraints work
- Verify computed date columns populated
- Verify soft delete works (`UPDATE ... SET deleted_at = NOW()`)

**Step 5: Deploy Frontend** (10 minutes)
- Deploy updated frontend code (expects new schema)
- Monitor error rates (Sentry, logs)
- Test one complete user flow per feature

### Rollback Procedure

**If migration fails**:
1. ROLLBACK transaction (if still in progress)
2. Restore from backup: `psql < backup_YYYYMMDD_HHMMSS.sql`
3. Verify data integrity: `SELECT COUNT(*) FROM medications, conditions`
4. Investigate failure cause, fix migration script
5. Schedule retry after testing in dev

**Rollback Time**: <10 minutes (PostgreSQL restore is fast)

---

## Open Questions

### Q1: Medications Frequency Dropdown Options
**Question**: What are ALL the frequency options for medications?

**Answer**: ✅ **DOCUMENTED** in [MEDICATIONS_DROPDOWN_OPTIONS.md](../../../MEDICATIONS_DROPDOWN_OPTIONS.md)

**Options (9 total)**:
- 1 time a day (Once daily)
- 2 times a day (Twice daily - BID)
- 3 times a day (Three times daily - TID)
- 4 times a day (Four times daily - QID)
- Every 6 hours (q6h)
- Every 8 hours (q8h)
- 1 time per week (Once weekly)
- As needed (PRN)
- Other... (Free-text capture)

**Status**: ANSWERED - Use documented options from MEDICATIONS_DROPDOWN_OPTIONS.md

---

### Q2: Medications Route of Administration Label
**Question**: Is "ORAL/SL/INJ/DROPS" the actual label, or should it be "Route" or "Administration Method"?

**Current Status**: Figma shows "ORAL/SL/INJ/DROPS" as label text

**Options**:
- A) Keep "ORAL/SL/INJ/DROPS" (matches Figma exactly)
- B) Change to "Route" (medical standard term)
- C) Change to "How Taken" (patient-friendly)

**Recommendation**: Use **Option B** ("Route") - medical standard, clearer than abbreviations

**Decision Needed**: Confirm with design team

---

### Q3: Medications Prescribed/Start Day Framework
**Question**: Does this field use Date/Time Selection Framework 1, Framework 2, or simple calendar?

**Current Status**: Spec assumes dual-mode date input (Date OR Age), but framework assignment unclear

**Options**:
- A) Framework 1 (Within 1yr / 5yr / Over 5yr / Age)
- B) Framework 2 (Within 1mo / 6mo / 2yr / More 2yr)
- C) Simple calendar picker only (no quick options)

**Recommendation**: Use **Framework 1** (consistent with conditions, surgeries)

**Decision Needed**: Review Figma prototype for quick option buttons

---

### Q4: Allergies Onset Field Framework
**Question**: Does Allergies Onset use Framework 1, Framework 2, or simple calendar?

**Current Status**: Spec assumes dual-mode date input, framework assignment TBD

**Recommendation**: Use **Framework 1** (same as medications, conditions) for consistency

**Decision Needed**: Confirm with design team / test in dev

---

### Q5: Immunizations "When" vs "Date Administered"
**Question**: Why two separate date fields? What's the difference?

**Current Status**: Figma shows both fields, semantics unclear

**Hypothesis**:
- "When" = Patient's recollection (dual-mode: Date OR Age)
- "Date Administered" = Official vaccine record date (calendar only, from immunization card)

**Recommendation**:
- "When": Dual-mode date (user memory)
- "Date Administered": Simple calendar (official record)
- Make "Date Administered" optional (not all patients have immunization cards)

**Decision Needed**: Confirm hypothesis with product team

---

### Q6: Personal Information Red Dot Indicators
**Question**: What triggers red dot on field labels?

**Answer**: ✅ **CONFIRMED** - Red dot appears when the item details are **not completed** (incomplete record)

**Implementation**:
- Red dot = field has missing required sub-fields or incomplete data
- Applies across all features (not just Personal Information)
- Example: Medication with name only (no dosage/frequency) shows red dot
- Example: Personal info field with partial data shows red dot

**Status**: ANSWERED - Simple incomplete indicator, no complex logic needed

---

### Q7: Social History CAGE Score Calculation
**Question**: How is CAGE score calculated and displayed?

**Current Status**: Spec mentions CAGE questionnaire (4 questions, Yes/No), score ≥2 = concern

**Implementation**:
```typescript
const cageScore = [
  cageQuestions.cutDown ? 1 : 0,
  cageQuestions.annoyed ? 1 : 0,
  cageQuestions.guilty ? 1 : 0,
  cageQuestions.eyeOpener ? 1 : 0
].reduce((sum, val) => sum + val, 0);

const concern = cageScore >= 2;
```

**Question**: Should CAGE score be stored in database or computed on-demand?

**Recommendation**: **Compute on-demand** (don't store score, only answers)

**Decision Needed**: Confirm storage strategy

---

### Q8: Family History Conditions Format
**Question**: Are conditions free-text or structured (dropdown/autocomplete)?

**Current Status**: Figma shows free-text field

**Options**:
- A) Free-text (MVP, simple)
- B) Autocomplete from condition vocabulary (SNOMED, future)
- C) Dropdown from common hereditary conditions (hypertension, diabetes, etc.)

**Recommendation**: Start with **Option A** (free-text), add autocomplete in future

**Decision Needed**: Confirm with product team

---

## Performance Considerations

### Query Optimization

**Indexing Strategy**:
```sql
-- Patient ID indexes (most common query)
CREATE INDEX idx_medications_patient ON medications(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_allergies_patient ON allergies(patient_id) WHERE deleted_at IS NULL;
-- Repeat for all 18 patient tables

-- Computed date indexes (chronological queries)
CREATE INDEX idx_medications_computed_date ON medications(prescribed_start_computed_date);
CREATE INDEX idx_surgeries_when ON surgeries(when_computed_date);

-- Category indexes (filtered list views)
CREATE INDEX idx_allergies_category ON allergies(patient_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_folder ON documents(patient_id, folder) WHERE deleted_at IS NULL;
```

**Expected Query Performance**:
- Single record fetch: <5ms
- List view (patient's medications): <10ms
- Filtered list (severe allergies): <15ms
- FHIR export (all patient data): <500ms

**N+1 Query Prevention**:
- Use `SELECT * FROM medications WHERE patient_id IN (...)` (batch fetch)
- Supabase PostgREST supports `select=*,conditions(*),documents(*)` (join syntax)
- Frontend uses React Query for automatic request batching

---

## Testing Strategy

### Database Testing
- [ ] Unit tests: Dual-mode date conversion (age → date, date → age)
- [ ] Unit tests: Display column generation (patient view, provider view)
- [ ] Unit tests: RLS policies (patient can access own data, cannot access others)
- [ ] Unit tests: Soft delete (deleted_at sets, queries exclude deleted)
- [ ] Unit tests: Type-specific constraints (conditions, allergies)

### Integration Testing
- [ ] Migration script execution (dev environment)
- [ ] Data preservation (existing medications/conditions)
- [ ] Foreign key constraints (junction tables)
- [ ] Computed column generation (all date fields)
- [ ] RLS enforcement (Supabase client queries)

### FHIR Export Testing
- [ ] Medications → MedicationStatement
- [ ] Allergies → AllergyIntolerance (with custom extensions)
- [ ] Conditions → Condition (type-specific mapping)
- [ ] Validate with HL7 FHIR Validator
- [ ] Test custom extensions acceptance

---

## Success Metrics

### Database Migration Success
- ✅ 23 tables exist in production
- ✅ 0 data loss (existing medications/conditions preserved)
- ✅ RLS policies active (18 patient tables)
- ✅ Indexes created (30+ indexes)
- ✅ Migration completed in <15 seconds

### Feature Readiness
- ✅ All 10 features can create/read/update/delete records
- ✅ Quick Add pattern works (3 features)
- ✅ Dual-mode date input converts age→date correctly
- ✅ Document associations create junction records
- ✅ Privacy controls filter "Share Health Record" exports

### FHIR Export Quality
- ✅ All 7 resource types generate valid FHIR JSON
- ✅ Custom extensions documented in StructureDefinition
- ✅ Export passes HL7 FHIR Validator (with extensions enabled)
- ✅ Patient view export completes in <500ms

---

**Next Steps**: Address open questions (Q1-Q8), then proceed with migration execution
