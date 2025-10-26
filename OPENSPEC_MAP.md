# OpenSpec Documentation Map

Complete navigation guide for ArkPass OpenSpec specifications.

## Quick Links

- **Project Context**: [openspec/project.md](openspec/project.md) - Tech stack, database philosophy, conventions
- **Agent Instructions**: [openspec/AGENTS.md](openspec/AGENTS.md) - How to create proposals, apply changes, archive

## Directory Structure

```
openspec/
├── project.md                 # Project-wide conventions and context
├── AGENTS.md                  # Instructions for AI assistants
├── specs/                     # Current specifications (what IS built)
│   ├── medications/
│   ├── allergies/
│   ├── conditions/
│   ├── surgeries/
│   ├── supplements/
│   ├── immunizations/
│   ├── my-documents/
│   ├── personal-information/
│   ├── social-history/
│   ├── family-history/
│   └── ui-patterns/
└── changes/                   # Proposals (what SHOULD change)
    ├── fhir-database-harmonization/
    └── archive/
```

## Specifications (11 total)

### Core PHR Features (10 specs)

| Spec | Path | Purpose | Validation |
|------|------|---------|------------|
| **Medications** | [openspec/specs/medications/spec.md](openspec/specs/medications/spec.md) | Track prescriptions, OTC drugs, dosage, frequency | ✅ PASS |
| **Allergies** | [openspec/specs/allergies/spec.md](openspec/specs/allergies/spec.md) | Track allergies/sensitivities, EpiPen, severity (PATIENT SAFETY) | ✅ PASS |
| **Conditions** | [openspec/specs/conditions/spec.md](openspec/specs/conditions/spec.md) | Track chronic/transient conditions, type-specific dates | ✅ PASS |
| **Surgeries** | [openspec/specs/surgeries/spec.md](openspec/specs/surgeries/spec.md) | Track surgical history, procedures, dual-mode When field | ✅ PASS |
| **Supplements** | [openspec/specs/supplements/spec.md](openspec/specs/supplements/spec.md) | Track vitamins, supplements, non-prescription treatments | ✅ PASS |
| **Immunizations** | [openspec/specs/immunizations/spec.md](openspec/specs/immunizations/spec.md) | Track vaccines, boosters, multiple doses pattern | ✅ PASS |
| **My Documents** | [openspec/specs/my-documents/spec.md](openspec/specs/my-documents/spec.md) | Document management, folders, privacy controls | ✅ PASS |
| **Personal Information** | [openspec/specs/personal-information/spec.md](openspec/specs/personal-information/spec.md) | Demographics, contact, emergency contacts, insurance | ✅ PASS |
| **Social History** | [openspec/specs/social-history/spec.md](openspec/specs/social-history/spec.md) | Lifestyle habits, CAGE questionnaire, conditional UI | ✅ PASS |
| **Family History** | [openspec/specs/family-history/spec.md](openspec/specs/family-history/spec.md) | Hereditary conditions, genetic risk factors | ✅ PASS |

### UI Patterns (1 consolidated spec)

| Spec | Path | Purpose | Validation |
|------|------|---------|------------|
| **UI Patterns** | [openspec/specs/ui-patterns/spec.md](openspec/specs/ui-patterns/spec.md) | 6 reusable patterns: Quick Add, Dual-Mode Date, etc. | ✅ PASS |

**Individual Pattern Files** (supplementary documentation):
- [quick-add.md](openspec/specs/ui-patterns/quick-add.md) - Name-only rapid entry
- [dual-mode-date-input.md](openspec/specs/ui-patterns/dual-mode-date-input.md) - Date OR Age input
- [repeatable-entry.md](openspec/specs/ui-patterns/repeatable-entry.md) - Multiple entries (doses, episodes)
- [field-level-editing.md](openspec/specs/ui-patterns/field-level-editing.md) - Individual field edit screens
- [conditional-ui.md](openspec/specs/ui-patterns/conditional-ui.md) - Show/hide based on selection
- [multi-select.md](openspec/specs/ui-patterns/multi-select.md) - Checkboxes with "Other" option

## Change Proposals (1 active)

| Change | Path | Status | Purpose |
|--------|------|--------|---------|
| **FHIR Database Harmonization** | [openspec/changes/fhir-database-harmonization/](openspec/changes/fhir-database-harmonization/) | PROPOSED | Production schema migration: 2 → 23 tables |

**Files in change**:
- [proposal.md](openspec/changes/fhir-database-harmonization/proposal.md) - Why, what, impact
- [tasks.md](openspec/changes/fhir-database-harmonization/tasks.md) - 12-phase implementation checklist
- [NOTE.md](openspec/changes/fhir-database-harmonization/NOTE.md) - Explanation (foundational change, no deltas)

## Validation Status

**All Specs**: ✅ 11/11 PASS (strict mode)

```bash
# Validate all specs
openspec validate --specs --strict

# Validate specific spec
openspec validate medications --type spec --strict

# List all specs
openspec list --specs
```

## Key Cross-Cutting Patterns

### Quick Add Pattern
**Used in**: Medications, Allergies, Supplements
**NOT in**: Conditions (type required), Surgeries (date required), Immunizations (dose info required)

### Dual-Mode Date Input
**Used in**: All date fields across Medications, Allergies, Conditions, Surgeries, Supplements, Immunizations
**Modes**: Date (calendar picker) OR Age ("I was 25 years old")

### Progressive Disclosure
**Used in**: All features with optional fields
**Pattern**: Collapsed (essential fields) + "Show more" → Expanded (all fields) + "Show less"

### Document Association
**Used in**: Medications, Allergies, Conditions, Surgeries (link documents via + icon)
**NOT in**: Personal Information, Social History, Family History

### Three-View Architecture
**Pattern**: UI[Pt] (patient view), UI[Pr] (provider view), DB (database storage)
**Used in**: All date fields, all PHR data display

## Database Schema Overview

### Tables by Feature

| Feature | Tables | Key Fields |
|---------|--------|------------|
| Medications | `medications` + `medication_conditions` + `medication_documents` | name, dosage, frequency, route, status, start_date |
| Allergies | `allergies` + `allergy_documents` | name, category, type, severity, **requires_epipen** |
| Conditions | `conditions` + `condition_medications` + `condition_documents` | name, **type** (chronic/transient), diagnosis/start/end dates |
| Surgeries | `surgeries` + `surgery_conditions` + `surgery_documents` | name, **when** (dual-mode), details |
| Supplements | `supplements` + `supplement_documents` | name, dosage, frequency, start_date |
| Immunizations | `immunizations` + `immunization_doses` | name, description, doses (repeatable) |
| Documents | `documents` | name, folder, system, privacy flags |
| Personal Info | `user_profiles` + `personal_information` | demographics, contact, insurance |
| Social History | `social_history` | smoking, alcohol, drugs (CAGE questionnaire) |
| Family History | `family_history` | relative, status, conditions |

**Total Tables**: 23 (18 feature tables + 5 system tables)

### FHIR Mapping (Export Only)

| ArkPass Feature | FHIR R4 Resource |
|-----------------|------------------|
| Medications | MedicationStatement |
| Allergies | AllergyIntolerance |
| Conditions | Condition |
| Surgeries | Procedure |
| Supplements | MedicationStatement (category="dietary-supplement") |
| Immunizations | Immunization |
| Personal Information | Patient |

**Critical Philosophy**: ArkPass schema is PRIMARY, FHIR is SECONDARY (export-only). Database NOT constrained by FHIR limitations.

## Patient Safety Features

| Feature | Safety Element | Database Field | Clinical Importance |
|---------|---------------|----------------|---------------------|
| Allergies | EpiPen Tracking | `requires_epipen` | Life-threatening allergy indicator |
| Allergies | Severity Classification | `severity` (severe/not_severe) | Anaphylaxis risk assessment |
| Allergies | Category-Specific Symptoms | `symptoms` JSONB | Reaction documentation |
| Medications | Status Tracking | `status` (discontinued) | Prevents outdated medication lists |
| Conditions | Type Classification | `type` (chronic/transient) | Clinical accuracy for providers |

## Compliance Features

- **HIPAA**: Audit trails (`created_at`, `updated_at`, soft delete via `deleted_at`)
- **RLS (Row-Level Security)**: All patient tables enforce `patient_id = auth.uid()`
- **Privacy Controls**: `is_private` flag on documents (exclude from "Share Health Record")
- **Data Integrity**: CHECK constraints on enums, foreign key constraints, conditional validation

## Related Documentation

### Root Directory (Original Specs)
- [MEDICATIONS_SCREENS_SPECS.md](/MEDICATIONS_SCREENS_SPECS.md) - Source Figma extraction
- [ALLERGIES_SCREENS_SPECS.md](/ALLERGIES_SCREENS_SPECS.md) + [ALLERGIES_EXPANSION_SPEC.md](/ALLERGIES_EXPANSION_SPEC.md)
- [CONDITIONS_SCREENS_SPECS.md](/CONDITIONS_SCREENS_SPECS.md)
- [SURGERIES_SCREENS_SPECS.md](/SURGERIES_SCREENS_SPECS.md)
- [SUPPLEMENTS_SCREENS_SPECS.md](/SUPPLEMENTS_SCREENS_SPECS.md)
- [IMMUNIZATIONS_SCREENS_SPECS.md](/IMMUNIZATIONS_SCREENS_SPECS.md)
- And 4 more feature specs...

### Database & Architecture
- [FHIR_HARMONIZATION_MAP.md](/FHIR_HARMONIZATION_MAP.md) - ArkPass > FHIR priority
- [SCHEMA_COMPARISON.md](/SCHEMA_COMPARISON.md) - Production vs reference analysis
- [FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql](/FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql) - Migration script
- [DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md](/DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md) - Three-view pattern

### Patterns (Original)
- [QUICK_ADD_PATTERN.md](/QUICK_ADD_PATTERN.md)
- [DUAL_MODE_DATE_INPUT_COMPONENT.md](/DUAL_MODE_DATE_INPUT_COMPONENT.md)
- [REPEATABLE_ENTRY_PATTERN.md](/REPEATABLE_ENTRY_PATTERN.md)
- [FIELD_LEVEL_EDITING_PATTERN.md](/FIELD_LEVEL_EDITING_PATTERN.md)
- [CONDITIONAL_UI_PATTERN.md](/CONDITIONAL_UI_PATTERN.md)
- [MULTI_SELECT_PATTERN.md](/MULTI_SELECT_PATTERN.md)

## CLI Commands

```bash
# List all specs
openspec list --specs

# Show specific spec
openspec show medications --type spec

# Show spec in JSON
openspec show medications --type spec --json

# Validate all specs
openspec validate --specs --strict

# List changes
openspec list --changes

# Show change proposal
openspec show fhir-database-harmonization

# Create new change
openspec init  # Follow prompts

# Archive change after deployment
openspec archive fhir-database-harmonization --yes
```

## Workflow Summary

### 1. Creating Changes
See [openspec/AGENTS.md](openspec/AGENTS.md) - "Three-Stage Workflow" → "Stage 1: Creating Changes"

### 2. Implementing Changes
See [openspec/AGENTS.md](openspec/AGENTS.md) - "Stage 2: Implementing Changes"

### 3. Archiving Changes
See [openspec/AGENTS.md](openspec/AGENTS.md) - "Stage 3: Archiving Changes"

## Success Metrics

- ✅ **11 specifications validated** (10 features + 1 UI patterns)
- ✅ **1 change proposal** (FHIR database harmonization)
- ✅ **6 UI patterns documented** (reusable across features)
- ✅ **75 Figma screens** covered across all specs
- ✅ **23 database tables** specified
- ✅ **Zero validation errors** in strict mode

---

**Last Updated**: 2025-10-26 (Phase 2 OpenSpec Conversion Complete)
