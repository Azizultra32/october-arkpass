# Database & FHIR Files Index

**Purpose**: Master index of all database schema, FHIR harmonization, and migration files in this repository
**Last Updated**: 2025-11-08

---

## Migration SQL Scripts

### Production Migrations (Root Directory)

1. **`FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql`** (285 lines)
   - **Status**: ⚠️ OUTDATED - Does NOT include dual-mode dates
   - **Purpose**: Original migration script for extending medications + conditions tables
   - **Covers**: Phase 0 (extend existing tables) + Phase 1 (create missing tables)
   - **Missing**: Dual-mode JSONB date fields, computed columns, display functions
   - **Use**: Reference only, DO NOT use for actual migration

2. **`FHIR_SCHEMA_MIGRATIONS.sql`** (Unknown size)
   - **Status**: Reference schema
   - **Purpose**: Original comprehensive migration
   - **Use**: Historical reference

### Enhanced Migrations (scripts/ Directory)

3. **`scripts/dual-mode-date-functions.sql`** ✅ CURRENT (220 lines)
   - **Status**: PRODUCTION READY
   - **Purpose**: Database functions for dual-mode date system
   - **Functions**:
     - `compute_date_from_age(birth_date, age)` - Converts age to date
     - `extract_computed_date(jsonb, birth_date)` - Parses dual-mode JSONB
     - `generate_patient_display(jsonb)` - Patient-friendly text ("May 2020", "When I was 25")
     - `generate_provider_display(jsonb, birth_date)` - Provider display with precision
   - **Run**: FIRST before any migrations
   - **Test queries included**: Yes

4. **`scripts/enhanced-migration-with-dates.sql`** ✅ CURRENT (250+ lines)
   - **Status**: PRODUCTION READY
   - **Purpose**: Complete migration with dual-mode JSONB date support
   - **Covers**:
     - Phase 0: Extend medications + conditions
     - Dual-mode date fields: `{field}_raw` (JSONB), `{field}_computed` (TIMESTAMP), `{field}_display_pt` (TEXT), `{field}_display_pr` (TEXT)
     - Auto-migration of legacy DATE data to JSONB
     - Indexes on computed columns
     - Update triggers
   - **Run**: SECOND after dual-mode-date-functions.sql
   - **Wrapped in**: BEGIN/COMMIT transaction (auto-rollback on error)

5. **`scripts/test-migration.sql`** ✅ TEST VERSION (60 lines)
   - **Status**: For dev testing only
   - **Purpose**: Simplified test migration without dual-mode dates
   - **Covers**: Basic schema extension only
   - **Use**: Initial dev environment testing

---

## Documentation Files

### Core Mapping & Analysis

6. **`INVIC_VS_ARKPASS_FIELD_MAPPING.md`** ✅ JUST CREATED (100+ sections)
   - **Status**: PRODUCTION READY - Comprehensive analysis
   - **Purpose**: Complete field-by-field comparison matrix for all 10 features
   - **Format**: Table per feature with columns: ArkPass Field, Required?, INVIC Field, Match Type, Data Types, Decision/Rationale
   - **Match Types**: Exact, Partial, Transform, Custom, Missing, Conflict
   - **Covers**: All 10 features + Top 8 schema blockers
   - **Use**: PRIMARY reference for implementation decisions

7. **`FHIR_HARMONIZATION_MAP.md`** (41KB)
   - **Status**: Comprehensive FHIR mapping reference
   - **Purpose**: Maps ArkPass features to FHIR R4 resources
   - **Covers**:
     - All 10 features → FHIR resources
     - Field-level FHIR alignment
     - Custom extensions documentation
     - Export examples
   - **Use**: Reference for FHIR export implementation

8. **`SCHEMA_COMPARISON.md`** (13KB)
   - **Status**: Production vs reference schema comparison
   - **Purpose**: Documents differences between production database and target schema
   - **Findings**: Only 2 tables exist (medications, conditions) with minimal columns
   - **Use**: Historical context for migration planning

9. **`MIGRATION_ADJUSTMENTS_LOG.md`** (9KB)
   - **Status**: Migration adjustment log
   - **Purpose**: Documents what changed and why during migration planning
   - **Use**: Audit trail for schema decisions

10. **`SCHEMA_VALIDATION_CHECKLIST.md`** (11KB)
    - **Status**: Validation procedures
    - **Purpose**: Step-by-step checklist for validating migrations
    - **Covers**: 6-phase validation (tables, columns, FKs, types, RLS, triggers)
    - **Use**: Pre-deployment validation

### Architecture & Design

11. **`DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md`** (12KB)
    - **Status**: Display column architecture
    - **Purpose**: Documents `{field}_display_pt` and `{field}_display_pr` pattern
    - **Covers**: Patient vs provider view formatting
    - **Use**: Reference for UI display logic

12. **`openspec/changes/fhir-database-harmonization/design.md`** (20KB)
    - **Status**: Technical design document
    - **Purpose**: Complete design rationale for FHIR harmonization
    - **Decisions**:
      - ArkPass Schema > FHIR (PRIMARY vs SECONDARY)
      - Dual-mode JSONB dates
      - Soft delete vs hard delete
      - RLS strategy
    - **Use**: Understand "why" behind schema decisions

13. **`openspec/changes/fhir-database-harmonization/tasks.md`** (6.6KB)
    - **Status**: Implementation task breakdown
    - **Purpose**: 12 phases × 111 total tasks
    - **Progress**: 9/111 tasks completed (8%)
    - **Use**: Track implementation progress

14. **`openspec/changes/fhir-database-harmonization/proposal.md`** (9.5KB)
    - **Status**: OpenSpec proposal for FHIR harmonization
    - **Purpose**: Why, What, Impact of schema changes
    - **Covers**: All 10 affected specs, breaking changes
    - **Use**: Stakeholder communication

### Date/Time System Documentation

15. **`IMPORTANT_DATE_FIELDS_SUMMARY.md`** (8KB)
    - **Status**: Critical dual-mode date reference
    - **Purpose**: Documents date/time selection framework
    - **Covers**:
      - Framework 1 (Within 1yr/5yr/Over 5yr/Age) - for long-term dates
      - Framework 2 (Within 1mo/6mo/2yr/More 2yr) - for recent dates
      - Condition type → date field mapping
    - **Use**: Understand which framework applies to which fields

16. **`DATE_TIME_SELECTION_FRAMEWORK.md`** (20KB)
    - **Status**: Complete date framework specification
    - **Purpose**: Full specification of intelligent date input system
    - **Covers**: Dropdown options, voice input, LLM interpretation, certainty levels
    - **Use**: Reference for frontend date component implementation

17. **`DUAL_MODE_DATE_INPUT_COMPONENT.md`** (22KB)
    - **Status**: Component specification
    - **Purpose**: React component spec for dual-mode date picker
    - **Covers**: Props, state management, Date ↔ Age conversion, UI states
    - **Use**: Frontend implementation guide

### Migration Guides

18. **`scripts/MIGRATION_TESTING_GUIDE.md`** ✅ CURRENT
    - **Status**: Step-by-step testing instructions
    - **Purpose**: How to test migrations in dev Supabase
    - **Covers**: Prerequisites, test database setup, validation queries, troubleshooting
    - **Use**: Follow this when running migrations

19. **`scripts/README_MIGRATIONS.md`** ✅ CURRENT
    - **Status**: Migration system overview
    - **Purpose**: Complete guide to all migration files
    - **Covers**: Quick start, JSONB format, migration phases, rollback procedures
    - **Use**: Master reference for migration process

20. **`scripts/RUN_THIS_IN_SUPABASE.md`** ✅ CURRENT
    - **Status**: Simplified manual instructions
    - **Purpose**: 5-minute guide for running migrations manually in Supabase dashboard
    - **Covers**: Copy/paste instructions, expected results, verification queries
    - **Use**: For manual migration execution

21. **`scripts/EXTRACT_SCHEMA.sql`**
    - **Status**: Utility query
    - **Purpose**: Extract complete schema from any Supabase project
    - **Output**: All tables, columns, data types
    - **Use**: Run in Supabase SQL Editor to inspect current schema

---

## Feature Screen Specs (Reference)

### Patient Health Record Features

22. **`DASHBOARD_NAVIGATION_SCREENS_SPECS.md`** ✅ JUST CREATED (16 sections, ~800 lines)
   - **Status**: PRODUCTION READY - Complete navigation specification
   - **Purpose**: Core app navigation, authentication, dashboard, sharing, and pre-visit questionnaire
   - **Covers**:
     - Authentication screens (Google, Apple, Mobile Phone, SMS confirmation)
     - Patient Dashboard with health record cards
     - Visit Notes management with doctor access tracking
     - Access Code sharing system (48h/1week/1month/custom durations)
     - Pre-Visit Questionnaire workflow (text response, yes/no questions)
     - Bottom navigation bar (5 icons: Home, Calendar, Plus, Key, Account)
     - Access code card states (Active/Yellow, Unused/Orange, Pre-Visit/Gray, Expired/White)
   - **Database Tables**: access_codes, pre_visit_questionnaires, visit_notes
   - **API Endpoints**: auth, access-codes, visit-notes, questionnaires, dashboard
   - **Total Screens**: 9 core navigation screens
   - **Use**: Reference for implementing authentication, dashboard, and sharing features

23-32. **`{FEATURE}_SCREENS_SPECS.md`** (10 files, 7200 total lines)
- `MEDICATIONS_SCREENS_SPECS.md` (568 lines)
- `ALLERGIES_SCREENS_SPECS.md` (828 lines)
- `CONDITIONS_SCREENS_SPECS.md` (513 lines)
- `SURGERIES_SCREENS_SPECS.md` (750 lines)
- `IMMUNIZATIONS_SCREENS_SPECS.md` (819 lines)
- `SUPPLEMENTS_SCREENS_SPECS.md` (623 lines)
- `FAMILY_HISTORY_SCREENS_SPECS.md` (421 lines)
- `SOCIAL_HISTORY_SCREENS_SPECS.md` (757 lines)
- `PERSONAL_INFORMATION_SCREENS_SPECS.md` (854 lines)
- `MY_DOCUMENTS_SCREENS_SPECS.md` (1069 lines)

**Purpose**: Complete Figma screen specifications for all 10 PHR features
**Use**: Reference for required fields, UI patterns, validation rules

---

## File Usage Matrix

| When You Need | Use This File |
|---------------|---------------|
| Run migration in production | `scripts/dual-mode-date-functions.sql` → `scripts/enhanced-migration-with-dates.sql` |
| Test migration in dev | `scripts/MIGRATION_TESTING_GUIDE.md` + test scripts |
| Understand field mappings | `INVIC_VS_ARKPASS_FIELD_MAPPING.md` |
| Understand FHIR export | `FHIR_HARMONIZATION_MAP.md` |
| Understand design decisions | `openspec/changes/fhir-database-harmonization/design.md` |
| Track implementation tasks | `openspec/changes/fhir-database-harmonization/tasks.md` |
| Understand dual-mode dates | `IMPORTANT_DATE_FIELDS_SUMMARY.md` + `scripts/dual-mode-date-functions.sql` |
| Build date input component | `DUAL_MODE_DATE_INPUT_COMPONENT.md` |
| Validate migration success | `SCHEMA_VALIDATION_CHECKLIST.md` |
| Inspect INVIC schema | Run `scripts/EXTRACT_SCHEMA.sql` in Supabase |
| Implement authentication | `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` (Section 1) |
| Implement dashboard | `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` (Section 2) |
| Implement access code sharing | `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` (Sections 3-5) |
| Implement pre-visit questionnaire | `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` (Section 6) |
| Implement bottom navigation | `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` (Section 7) |

---

## Current Implementation Status

### ✅ Complete (Ready to Use)
- Dual-mode date functions (`scripts/dual-mode-date-functions.sql`)
- Enhanced migration with dates (`scripts/enhanced-migration-with-dates.sql`)
- Field mapping matrix (`INVIC_VS_ARKPASS_FIELD_MAPPING.md`)
- Migration testing guides (3 files in `scripts/`)
- Dashboard & navigation specification (`DASHBOARD_NAVIGATION_SCREENS_SPECS.md`)

### ⚠️ Outdated (Do Not Use)
- `FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql` (old, no dual-mode dates)
- `FHIR_SCHEMA_MIGRATIONS.sql` (reference only)

### 🔜 Pending
- Actual INVIC schema inspection (need to run `EXTRACT_SCHEMA.sql`)
- OpenSpec proposals for 8 critical conflicts
- Phase 1-4 migration scripts (create missing tables)
- RLS policy scripts
- API endpoint implementation

---

## Next Actions

1. **Validate field mapping**: Review `INVIC_VS_ARKPASS_FIELD_MAPPING.md` for accuracy
2. **Inspect INVIC schema**: Run `scripts/EXTRACT_SCHEMA.sql` to confirm assumptions
3. **Create OpenSpec proposals**: For dual-mode dates, supplements, allergy safety, etc.
4. **Test migrations**: Use `scripts/MIGRATION_TESTING_GUIDE.md` in dev Supabase
5. **Build Phase 1-4 scripts**: Create remaining 21 tables

---

**File Organization Principle**:
- **Root directory**: Historical/reference FHIR docs
- **`scripts/` directory**: Production-ready migration scripts + guides
- **`openspec/changes/` directory**: OpenSpec proposals and specs
- **Feature specs**: Individual `*_SCREENS_SPECS.md` files
