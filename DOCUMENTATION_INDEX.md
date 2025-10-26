# Documentation Index - Complete System Architecture

**Last Updated**: 2025-10-25
**Phase**: Complete Product Specification - Ready for Implementation
**Status**: ✅ All safety-critical features documented, ready to build complete product
**Build Philosophy**: No cutting corners on safety - EpiPen tracking and severity classification are non-negotiable

---

## 🔄 Active Harmonization Work (2025-10-25)

**Goal**: Harmonize Figma extraction with existing FHIR-based Supabase database

### Legacy Codebases Inventory

**Tmux Sessions Created** for parallel analysis:

| Session Name | Directory | Purpose |
|--------------|-----------|---------|
| `arkpass-classic` | /Users/ali/ARKPASS-CLASSIC | Original attempt |
| `arkpass-attemtpt` | /Users/ali/arkpass-attemtpt | Second attempt |
| `arkpass-2-figma-vscode` | /Users/ali/ARKPASS-2-FIGMA-VSCODE | Figma-based attempt |
| `arkpass-test-anima` | /Users/ali/arkpass test anima | Anima export test |
| `downloads-armada-health-app` | /Users/ali/Downloads/armada-health-app | Health app version |
| `downloads-arkpass-2-figma` | /Users/ali/Downloads/ARKPASS-2-FIGMA-VSCODE | Another Figma version |
| `downloads-arkpass-manus` | /Users/ali/Downloads/arkpass-manus | Manus version |
| `downloads-armada-extract` | /Users/ali/Downloads/ARMADA-EXTRACT | Extract version |
| `october-arkpass` | /Users/ali/october-arkpass | Current working directory (this) |

**Supabase FHIR Database**: Production schema (needs analysis)

### Harmonization Tasks

**Completed**:
1. [x] Create mapping: Figma specs → FHIR resources ✅ [FHIR_HARMONIZATION_MAP.md](FHIR_HARMONIZATION_MAP.md)
2. [x] Identify conflicts between Figma design and FHIR schema ✅ [FHIR_HARMONIZATION_MAP.md](FHIR_HARMONIZATION_MAP.md)
3. [x] Document schema extensions needed ✅ [FHIR_SCHEMA_MIGRATIONS.sql](FHIR_SCHEMA_MIGRATIONS.sql)

**In Progress**:
4. [ ] **CRITICAL**: Validate migration scripts against actual Supabase schema
5. [ ] Test migrations in development environment
6. [ ] Review with team/stakeholders

**Pending**:
7. [ ] Analyze legacy codebases for useful patterns (9 codebases)
8. [ ] Execute schema migrations (after validation)
9. [ ] Build API endpoints for new tables
10. [ ] Implement FHIR export functionality

**Visit Notes Decision**: Deferred to Phase 2 (too complicated for MVP)
- Current: "My Documents" system with "Consult" folder for visit notes
- Future: Structured Visit Notes feature with dedicated fields

### Harmonization Artifacts

**NEW DOCUMENTS CREATED (2025-10-25)**:

#### 28. [FHIR_HARMONIZATION_MAP.md](FHIR_HARMONIZATION_MAP.md) ✅ CRITICAL REFERENCE

**Purpose**: Complete field-level mapping between Figma extraction, FHIR R4 resources, and ARKPASS 6 Supabase schema

**Contents**:
- **All 10 Features Mapped**: Medications, Allergies, Conditions, Immunizations, Surgeries, Supplements, My Documents, Visit Notes, Lab Results, Personal Information, Social History, Family History
- **FHIR R4 Resource Alignment**: Each feature mapped to correct FHIR resource (MedicationStatement, AllergyIntolerance, Condition, etc.)
- **Schema Gap Analysis**: 🚨 Critical gaps identified:
  1. Allergies missing: `category`, `severity`, `requires_epipen` (PATIENT SAFETY)
  2. Documents missing: `name`, `folder_id`, `system`, `tags`, `is_private`, `is_highlighted` (ENTIRE FEATURE SET)
  3. Supplements table: DOES NOT EXIST (7 Figma screens have no backend)
  4. Personal Information: Emergency contacts, insurance, extended demographics MISSING
- **FHIR Export Examples**: JSON examples for each resource type
- **Implementation Priorities**: 4 phases with time estimates (10-15 hours for Phase 1)

**Why Important**: This is the Rosetta Stone connecting UI design to database schema to FHIR standard. Required reading before any implementation.

#### 29. [FHIR_SCHEMA_MIGRATIONS.sql](FHIR_SCHEMA_MIGRATIONS.sql) ⚠️ DRAFT - NEEDS VALIDATION

**Purpose**: SQL migration scripts to extend ARKPASS 6 schema for Figma features

**Contents**:
- **Phase 1 (Critical - MVP Blockers)**:
  - Extend `allergies` table: Add `category`, `severity`, `requires_epipen`
  - Create `supplements` table (NEW)
  - Extend `documents` table: Add 8 missing fields
  - Create `document_folders` table with 5 pre-defined folders
  - Create `patient_demographics`, `emergency_contacts`, `patient_insurance` tables
- **Phase 2 (Document Associations)**:
  - Create 9 junction tables linking documents to PHR records (+ icon workflow)
- **Phase 3 (Vocabulary Support)**:
  - Create `medication_vocabularies`, `allergy_vocabularies`, `condition_vocabularies` for dropdowns
- **Phase 4 (Lab Results Enhancement)**:
  - Extend `lab_results` with normal ranges, LOINC codes, interpretation
- **RLS Policies**: Row-level security for all new tables
- **Triggers**: Auto-update `updated_at` timestamps
- **Seed Data**: Common values for vocabulary tables

**⚠️ WARNING**: These migrations are based on REFERENCE schema only. They MUST be validated against actual production Supabase schema before execution.

**Next Steps**:
1. Get actual Supabase schema dump
2. Compare with harmonized_schema.sql
3. Adjust migrations for any discrepancies
4. Test in development environment
5. Review with team before production deployment

#### 30. [SCHEMA_VALIDATION_CHECKLIST.md](SCHEMA_VALIDATION_CHECKLIST.md) 🚨 CRITICAL NEXT STEP

**Purpose**: Step-by-step validation checklist to ensure migrations are safe before execution

**Why Critical**: Migration scripts are based on REFERENCE schema only. Must validate against actual production Supabase before running.

**Contents**:
- **Prerequisites**: 3 methods to get production schema (Dashboard, SQL dump, Supabase CLI)
- **Validation Steps**: 6-phase checklist
  1. Table existence check (19 tables)
  2. Column existence check (prevent duplicates)
  3. Foreign key validation
  4. Data type compatibility
  5. RLS policy conflicts
  6. Trigger function conflicts
- **Discrepancy Resolution**: Template for documenting differences
- **Testing Strategy**: Dev environment setup before production
- **Test Queries**: SQL to verify migration success
- **Rollback Plan**: How to undo if something goes wrong
- **Sign-off Checklist**: Pre-deployment verification

**Required Actions**:
- [ ] Get production schema (choose one method)
- [ ] Complete Phase 1 (table check)
- [ ] Complete Phase 2 (column check)
- [ ] Complete Phase 3-6 (foreign keys, types, RLS, triggers)
- [ ] Document discrepancies
- [ ] Test in development
- [ ] Get team approval
- [ ] Execute migration

#### 31. [LEGACY_CODEBASE_ANALYSIS_PLAN.md](LEGACY_CODEBASE_ANALYSIS_PLAN.md) 📊 STRATEGIC ANALYSIS

**Purpose**: Systematic plan to analyze 9 legacy ArkPass attempts for reusable patterns and lessons learned

**Inventory of 9 Legacy Codebases**:
1. **armada-health-app** (Production-style) - Priority: 🔴 HIGH
2. **ARKPASS-2-FIGMA-VSCODE** (Automation toolkit) - Priority: 🔴 HIGH
3. **arkpass-manus** (Hybrid analysis hub) - Priority: 🟡 MEDIUM
4. **ARMADA-EXTRACT** (Extraction-focused, Supabase migrations) - Priority: 🔴 HIGH
5. **armada-arkpass-project** (Monorepo) - Priority: 🟡 MEDIUM-HIGH
6. **ARKPASS-CLASSIC** (Archival) - Priority: ⚪ LOW
7. **arkpass-attemtpt** (Early scaffold) - Priority: ⚪ LOW
8. **ARKPASS-2-FIGMA-VSCODE root** (Leaner version) - Priority: 🟡 MEDIUM
9. **arkpass test anima** (Anima export) - Priority: ⚪ LOW-MEDIUM

**Analysis Methodology**:
- **Phase 1**: Quick scan (2-3 hours) - All 9 codebases
- **Phase 2**: Deep dive (4-6 hours) - 3 high-priority codebases
- **Phase 3**: Cross-codebase synthesis (2-3 hours)
- **Total**: 8-12 hours

**Success Criteria** (5 questions to answer):
1. Which legacy schema is closest to FHIR standard?
2. Which component library/patterns should we adopt?
3. Can we reuse any Figma→Code automation?
4. What phasing strategy worked best?
5. Why were previous attempts abandoned?

**Deliverables**:
1. LEGACY_ANALYSIS_QUICK_SCAN.md (all 9)
2. LEGACY_ANALYSIS_ARMADA_EXTRACT.md (deep dive)
3. LEGACY_ANALYSIS_ARMADA_HEALTH_APP.md (deep dive)
4. LEGACY_ANALYSIS_FIGMA_VSCODE.md (deep dive)
5. LEGACY_ANALYSIS_SYNTHESIS.md (recommendations)

**Priority Order**:
- **Immediate**: ARMADA-EXTRACT (schema migrations), armada-health-app (production patterns)
- **Next Week**: ARKPASS-2-FIGMA-VSCODE (automation), armada-arkpass-project (full-stack)
- **Optional**: Remaining 5 codebases

---

## Recent Updates (2025-10-25)

### Phase A Complete: Missing Information Confirmed

**Medications** ([MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md)):
- ✅ Status dropdown: "Taking regularly as directed", "Taking but not regularly", "As needed", "Discontinued"
- ✅ Discontinuation date removed (simplified - status alone is sufficient)

**Allergies** ([ALLERGIES_EXPANSION_SPEC.md](ALLERGIES_EXPANSION_SPEC.md) - NEW):
- 🆕 **Major expansion beyond Figma**: Complete allergy/sensitivity tracking system
- ✅ 5 categories: Medication, Food, Seasonal, Skin/Contact, Environmental
- ✅ Allergy vs Sensitivity distinction
- ✅ Severity classification (Severe/Not Severe)
- ✅ EpiPen tracking (Yes/No)
- ✅ Multi-select symptoms by category (category-specific symptom lists)
- ✅ Complete data model, database schema, UI/UX guidelines

**Social History** ([SOCIAL_HISTORY_SCREENS_SPECS.md](SOCIAL_HISTORY_SCREENS_SPECS.md)):
- ✅ CAGE questionnaire added for alcohol screening (trigger: significant consumption)
- ✅ Recreational drug types expanded to multi-select: Cannabis, Psychoactive medications, Stimulants/MDMA, Opioids, Hallucinogens, Cocaine, Other
- ✅ Repeatable entry pattern with individual frequency per drug

**Personal Information** ([PERSONAL_INFORMATION_SCREENS_SPECS.md](PERSONAL_INFORMATION_SCREENS_SPECS.md)):
- ✅ Gender dropdown confirmed: Male, Female, Non-binary, Prefer not to say, Other
- ✅ Jurisdictions confirmed: International support (Canada, US, other countries)

**Supplements, Immunizations, Family History**:
- ✅ User confirmed existing specifications are adequate

### Phase B Complete: Reusable Patterns Documented

**New Pattern Documentation Created**:

1. **[CONDITIONAL_UI_PATTERN.md](CONDITIONAL_UI_PATTERN.md)** 🆕
   - Dynamic field visibility based on user selections
   - 5 pattern variations (binary, multi-state, threshold, nested, category-based)
   - Found in: Social History (5 screens), Allergies (severity-based)

2. **[MULTI_SELECT_PATTERN.md](MULTI_SELECT_PATTERN.md)** 🆕
   - Checkbox lists with "Other" option
   - Category-specific vocabularies (symptoms, drug types)
   - Found in: Allergies (symptoms), Social History (recreational drugs)

3. **[FIELD_LEVEL_EDITING_PATTERN.md](FIELD_LEVEL_EDITING_PATTERN.md)** 🆕
   - Dedicated edit screen per field (mobile-first UX)
   - Field grouping rules and audit trail support
   - Found in: Personal Information (15 screens), Social History (8 screens)

**Existing Patterns Confirmed**:
- ✅ [DUAL_MODE_DATE_INPUT_COMPONENT.md](DUAL_MODE_DATE_INPUT_COMPONENT.md) - System-wide
- ✅ [REPEATABLE_ENTRY_PATTERN.md](REPEATABLE_ENTRY_PATTERN.md) - Immunizations, Recreational Drugs
- ✅ [QUICK_ADD_PATTERN.md](QUICK_ADD_PATTERN.md) - Medications, Allergies, Supplements

**Pattern Library Status**: 6 reusable patterns documented and ready for component library implementation

---

## Foundation Documents (System-Wide)

### 1. [SYSTEM_LOGIC_FRAMEWORK.md](SYSTEM_LOGIC_FRAMEWORK.md)
**What it defines**: The three core principles of the entire system
- Three-view architecture (UI[Pt], UI[Pr], DB)
- Logic notation language (Armada Logic Language - ALL)
- Logic documentation standards

**Key insight**: Every complex data element needs three views; logic must be documented in standardized notation

---

### 2. [ARMADA_LOGIC_LANGUAGE.md](ARMADA_LOGIC_LANGUAGE.md)
**What it defines**: The ALL (Armada Logic Language) specification
- Grammar and syntax
- Keywords and operators
- Rule categories (Display, Validation, Triggers, Confirmation, Navigation)
- File organization for `.all` files

**Key insight**: Two parallel outputs from Figma extraction - database schema AND logic rules in ALL

---

### 3. [DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md](DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md)
**What it defines**: The universal column pattern for fields with display variation
```
{field}_raw              - Source of truth
{field}_display_pt       - Patient view
{field}_display_pr       - Provider view
{field}_display_active   - Which views enabled
```

**Key insight**: Database stores ALL display variations; `display_active` flag indicates if Pt/Pr distinction needed

---

### 4. [DISPLAY_RULES_PATIENT_VS_PROVIDER.md](DISPLAY_RULES_PATIENT_VS_PROVIDER.md)
**What it defines**: How patient and provider views differ
- Patient view: Simple, human-readable, no medical codes
- Provider view: Clinical precision, ICD codes, medical terminology
- Examples of multi-condition medication display

**Key insight**: Patients see "(+ 1 other condition)" with hyperlinks; providers see "[I50.9 + E87.6]"

---

## OpenSpec UI Patterns (Reusable Components) 🆕

### OpenSpec Consolidated Specification

**[openspec/specs/ui-patterns/spec.md](openspec/specs/ui-patterns/spec.md)** ✅ NEW - MASTER SPECIFICATION
- **Purpose**: Consolidated OpenSpec specification for all 6 UI patterns
- **Requirements**: Complete OpenSpec-formatted requirements with scenarios
- **Implementation Details**: Component structures, data models, database schemas
- **Where Used**: Feature-by-feature usage mapping
- **Dependencies**: Cross-pattern dependencies and integrations
- **Compliance**: Accessibility, data integrity, performance, audit trail
- **Line Count**: 529 lines
- **Status**: ✅ Complete OpenSpec master spec - ready for implementation

### Individual OpenSpec Pattern Files

All pattern files converted to OpenSpec format with Purpose, Requirements, Implementation Details, Where Used, Dependencies, and Compliance sections:

1. **[openspec/specs/ui-patterns/quick-add.md](openspec/specs/ui-patterns/quick-add.md)** (201 lines)
2. **[openspec/specs/ui-patterns/dual-mode-date-input.md](openspec/specs/ui-patterns/dual-mode-date-input.md)** (236 lines)
3. **[openspec/specs/ui-patterns/repeatable-entry.md](openspec/specs/ui-patterns/repeatable-entry.md)** (325 lines)
4. **[openspec/specs/ui-patterns/field-level-editing.md](openspec/specs/ui-patterns/field-level-editing.md)** (264 lines)
5. **[openspec/specs/ui-patterns/conditional-ui.md](openspec/specs/ui-patterns/conditional-ui.md)** (291 lines)
6. **[openspec/specs/ui-patterns/multi-select.md](openspec/specs/ui-patterns/multi-select.md)** (323 lines)

**Total**: 2,169 lines of OpenSpec UI pattern documentation

---

## Original UI/UX Pattern Documentation (Reference)

These are the original detailed pattern documents. The OpenSpec versions above are the canonical specifications for implementation.

### 5. [DUAL_MODE_DATE_INPUT_COMPONENT.md](DUAL_MODE_DATE_INPUT_COMPONENT.md)
**What it defines**: System-wide date input component supporting two input modes
- **Date Mode**: Calendar picker with progressive disclosure (Framework 1 or 2)
- **Age Mode**: Text input for age-based entry ("I was 25 years old")
- Mode selector (107px) + flexible input component (16px gap)
- Age-to-date conversion logic using patient birth date
- Data model with JSONB storage
- Validation rules for both modes
- ALL notation rules for mode switching, conversion, validation

**Discovered in**: Surgeries "When" field (Node 1483:8455), confirmed in Immunizations
**Status**: 🚨 CRITICAL - System-wide pattern for ALL date inputs

---

### 6. [REPEATABLE_ENTRY_PATTERN.md](REPEATABLE_ENTRY_PATTERN.md)
**What it defines**: UI pattern for entering multiple related items within single parent record
- "+ Add more" link to create additional entries
- "✕ Remove" action for deleting entries (except first)
- Visual separators between entries
- Auto-numbering logic (dose 1, 2, 3, ...)
- Parent-child data model with foreign keys
- Validation rules (minimum one entry required)
- ALL notation rules for add/remove/renumber

**Discovered in**: Immunizations multiple doses (Node 1483:8462)
**Potential reuse**: Conditions episodes, Medication dose changes, Allergy reactions
**Status**: ✅ New pattern discovered and documented

---

### 7. [QUICK_ADD_PATTERN.md](QUICK_ADD_PATTERN.md)
**What it defines**: Inline single-field entry in list view for rapid data capture
- Inline text input at top of list (always visible)
- Name-only entry, full details added later via edit
- Submit via arrow button or Enter key
- Auto-complete suggestions (optional)

**Discovered in**: Medications (Node 1483:8410), Allergies, Supplements
**Confirmed absence in**: Conditions (type required), Surgeries/Immunizations (date critical)
**Status**: ✅ Pattern documented

---

### 8. [CONDITIONAL_UI_PATTERN.md](CONDITIONAL_UI_PATTERN.md) 🆕 NEW
**What it defines**: Dynamic field visibility based on user selections
- **Binary conditionals**: Yes/No triggers (e.g., "Uses caffeine?" → quantity field)
- **Multi-state conditionals**: Radio/dropdown triggers (e.g., "Smoker/Quit/Never" → different field sets)
- **Threshold conditionals**: Numeric triggers (e.g., "≥3-4 drinks" → CAGE questionnaire)
- **Nested conditionals**: Multiple trigger levels (e.g., Drinking frequency + Quantity → CAGE)
- Data persistence options (clear on hide vs. preserve)
- Validation rules for conditional required fields
- Accessibility (screen reader announcements, focus management)

**Discovered in**: Social History (Smoking, Alcohol, Drugs, Caffeine), Allergies (Severity → EpiPen)
**Pattern variations**: 5 examples documented with state management and transitions
**Status**: ✅ Pattern documented - ready for implementation

---

### 9. [MULTI_SELECT_PATTERN.md](MULTI_SELECT_PATTERN.md) 🆕 NEW
**What it defines**: Checkbox lists for selecting multiple items from predefined vocabulary
- **Category-specific lists**: Different symptom lists per allergy category/severity
- **"Other" field**: Optional free-text for unlisted items
- **Validation**: "Other" text required if "Other" checkbox checked
- **Data model**: Array storage for standard selections + separate "other" field
- **Display rules**: Three-view architecture (patient/provider/database)
- Database schema (PostgreSQL array or JSONB)
- Accessibility (ARIA attributes, keyboard navigation)

**Discovered in**: Allergies (symptoms by category), Social History (recreational drug types)
**Confirmed variations**: Severe symptoms (11 options), Seasonal symptoms (11 options), Drug types (7 options)
**Status**: ✅ Pattern documented - ready for implementation

---

### 10. [FIELD_LEVEL_EDITING_PATTERN.md](FIELD_LEVEL_EDITING_PATTERN.md) 🆕 NEW
**What it defines**: Dedicated edit screen per field (vs. single large form)
- **Main view**: Read-only values with inline [Edit] buttons
- **Edit screen**: Full-screen focused UI for single field or field group
- **Navigation**: Back arrow discards, Save button commits and returns
- **Field grouping rules**: When to combine related fields vs. keep separate
- **Audit trail**: Optional per-field change tracking
- Unsaved changes handling (auto-discard vs. confirmation dialog)
- Comparison with single large form approach

**Discovered in**: Personal Information (15 screens), Social History (8 screens)
**Field groups**: Name (First/Middle/Last), Height+Weight, Address
**Individual fields**: Gender, DOB, Email, Phone, etc.
**Status**: ✅ Pattern documented - mobile-first UX best practice
- Duplicate detection with warnings
- Post-submit: Clear and refocus for rapid bulk entry
- ALL notation rules for submit, validation, success/error states

**Present in**: Medications, Allergies, Supplements
**Not present in**: Conditions (type selection required), Surgeries (date critical), Immunizations (doses required)
**Status**: ✅ Confirmed pattern across 3 features

---

## Conditions Feature Documentation

### 8. [CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md)
**What it contains**: Figma extraction of 7 condition screens
- Conditions List
- View Condition (collapsed/expanded)
- Edit/Add Condition screens (Chronic, Transient-Recurrent, Transient-Resolved)
- Design specs: typography, colors, spacing, layouts

---

### 9. [CONDITIONS_FLOW_DIAGRAM.md](CONDITIONS_FLOW_DIAGRAM.md)
**What it contains**: 10 text-based ASCII flow diagrams
- User flow overview
- Type selection decision tree
- Date/time period selection
- Expandable section toggle
- Validation and error handling

---

### 10. [DATE_TIME_SELECTION_FRAMEWORK.md](DATE_TIME_SELECTION_FRAMEWORK.md)
**What it defines**: The sophisticated two-framework date selection system for conditions
- **Framework 1**: Chronic/Recurrent (Within 1yr/5yr/Over 5yr/Age)
- **Framework 2**: Resolved end dates (Within 1mo/6mo/2yr/More 2yr)
- Progressive disclosure (year → month → date)
- Voice input + LLM interpretation
- Certainty toggle (certain/somewhat certain/uncertain)
- Age-based input

**Key insight**: Framework selection based on condition type + subtype + field name

---

### 11. [DATE_FRAMEWORK_VALIDATION.md](DATE_FRAMEWORK_VALIDATION.md)
**What it contains**: Complete validation reference
- Correct framework assignments
- Implementation logic
- Testing checklist (40+ scenarios)
- Display examples

---

### 12. [IMPORTANT_DATE_FIELDS_SUMMARY.md](IMPORTANT_DATE_FIELDS_SUMMARY.md)
**What it contains**: Quick reference guide
- Framework assignment summary table
- Field breakdown by condition type
- Implementation checklist

---

### 13. [CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md](CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md)
**What it contains**: Technical addendum
- Field specifications by condition type
- Validation rules
- UI components
- Testing scenarios

---

## Medications Feature Documentation

### 14. [MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md) ✅ UPDATED
**What it contains**: Figma extraction of 8 medication screens
- Medications List (collapsed/expanded)
- View Medication (collapsed/expanded)

**Recent Updates (2025-10-25)**:
- ✅ **Status dropdown confirmed**: "Taking regularly as directed", "Taking but not regularly", "As needed", "Discontinued"
- ✅ **Discontinuation date removed**: Status = "Discontinued" alone is sufficient (simplified approach)
- ✅ No additional date tracking needed for discontinued medications
- Edit Medication (collapsed/expanded)
- Add Medication (collapsed/expanded)
- Field specifications (Name, Dosage, Frequency, Route, Status)
- Critical questions about dropdown options

**Status**: ⚠️ Partial - missing dropdown option details (Frequency, Route, Status)

---

### 15. [MEDICATIONS_DATE_FIELD_SPEC.md](MEDICATIONS_DATE_FIELD_SPEC.md)
**What it defines**: The "Prescribed / Start day" field specification
- Two options: "Year-Month-Date" OR "I've been on this medication"
- Sub-options: "Right when diagnosed" / "After diagnosed"
- Uses Framework 1 (same as conditions) but NO certainty toggle
- Data model structure

**Key difference from conditions**: No certainty toggle for medications

---

### 16. [MEDICATIONS_DATE_FIELD_LOGIC.md](MEDICATIONS_DATE_FIELD_LOGIC.md)
**What it defines**: Three-layer logic for medication dates
- **Layer 1 (Presentation)**: How question is asked
  - "(Since) Right when I was diagnosed"
  - "(Later or added) After I was diagnosed"
- **Layer 2 (Database)**: Storage with linked references
  - Type: at_diagnosis / after_diagnosis / direct_date
  - Auto-update trigger when condition date changes
- **Layer 3 (Display)**: How answer is shown
  - Context text if year-only: "(Since) Right when I was diagnosed"
  - Formatted date if month/day: "March 2020 (@_dx)"

**Critical feature**: Auto-update when condition diagnosis date changes

---

### 17. [MEDICATION_DATE_EXAMPLES.md](MEDICATION_DATE_EXAMPLES.md)
**What it contains**: 10 concrete examples
- Right when diagnosed (year/month/day precision)
- Auto-update scenario
- After diagnosed (year/month/day precision)
- Direct date (no condition link)
- Validation errors
- ALL notation for the logic

**Purpose**: Examples with direct references to logic docs

---

### 18. [MEDICATIONS_MULTI_CONDITION_ASSIGNMENT.md](MEDICATIONS_MULTI_CONDITION_ASSIGNMENT.md)
**What it defines**: Rules for medications used for multiple conditions
- Confirmation dialog when adding 2nd+ condition
- Three response options: "Not sure" / "Yes, I'm certain" / "Actually, I don't think I am"
- Display notation: [ICD + (?)ICD] for database/provider
- Patient display: "(+ 1 other condition)" with hyperlinks
- Data model with certainty flags

**Key feature**: Different display for patient vs provider vs database

---

## Methodology & Analysis

### 19. [EXTRACTION_METHODOLOGY_ANALYSIS.md](EXTRACTION_METHODOLOGY_ANALYSIS.md)
**What it contains**: Analysis of what went wrong with initial extraction
- Root causes of missing date/time fields
- Four key failures identified
- New extraction protocol to prevent missing details
- Lessons learned
- Pre-extraction questions checklist

**Purpose**: Ensure systematic, complete extraction going forward

---

## What We Have Documented

### ✅ Complete Documentation

1. **System Architecture**
   - Three-view pattern (Pt/Pr/DB) ✅
   - Display column pattern ✅
   - ALL notation language ✅
   - Logic documentation standards ✅

2. **Conditions Feature**
   - Figma screens (7 screens) ✅
   - Flow diagrams ✅
   - Date/time framework (2 frameworks) ✅
   - Framework validation ✅
   - Examples and testing ✅

3. **Medications Feature**
   - Figma screens (8 screens) ✅
   - Date field logic (3 layers) ✅
   - Date field examples ✅
   - Multi-condition assignment ✅
   - Patient vs Provider display ✅

4. **Allergies Feature**
   - Figma screens (7 screens) ✅
   - Quick Add pattern ✅
   - Category grouping ✅

5. **Surgeries Feature**
   - Figma screens (9 screens) ✅
   - Dual-mode date input discovery ✅
   - System-wide date pattern confirmed ✅

6. **Supplements Feature**
   - Figma screens (7 screens) ✅
   - Quick Add pattern ✅
   - Comparison to medications ✅

7. **Immunizations Feature**
   - Figma screens (7 screens) ✅
   - Multiple doses pattern ✅
   - Repeatable entry pattern discovery ✅
   - Dual-mode date confirmation ✅

---

## What We're Missing

### ⚠️ Incomplete - Medications

1. **Dropdown Options NOT Extracted**
   - Frequency dropdown: What are ALL the options?
     - Current: Only saw "2 times a day", "1 time a day" as examples
     - Need: Complete list of all frequency options
   - Route dropdown (ORAL/SL/INJ/DROPS): What are ALL the options?
     - Current: Only placeholder "Select" visible
     - Need: Complete list (Oral, Sublingual, Injection, Drops, Topical, Inhaler, Patch, Other?)
   - Status dropdown: What are ALL the options?
     - Current: Only placeholder "Select" visible
     - Need: Complete list (Active, Inactive, Discontinued, As Needed?)

2. **Field Clarifications Needed**
   - Is "ORAL/SL/INJ/DROPS" the actual label or should it be "Route"?
   - Is "Prescribed / Start day" ONE field or TWO separate fields?

3. **Potential Hidden Fields**
   - Are there other date fields? (End date? Refill date? Last taken?)
   - Are there other hidden fields in expanded states?

---

## Allergies Feature Documentation

### 20. [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md) ✅ UPDATED
**What it contains**: Figma extraction of 7 allergy screens
- Allergies List with Quick Add feature
- View Allergy (collapsed/expanded)

**Recent Updates (2025-10-25)**:
- ✅ **Expansion reference added**: Links to comprehensive ALLERGIES_EXPANSION_SPEC.md
- ✅ **Categories documented**: Medication, Food, Seasonal, Skin/Contact, Environmental
- ✅ **Quick Add pattern clarified**: Name-only entry, complete details later

**⚠️ IMPORTANT**: See ALLERGIES_EXPANSION_SPEC.md for complete product requirements beyond Figma screens
- Edit/Add Allergy screens
- Field specifications (Name, Onset, Details)
- Category grouping (Medication Allergies, Environmental/Seasonal/Skin/Other)

---

### 20a. [ALLERGIES_EXPANSION_SPEC.md](ALLERGIES_EXPANSION_SPEC.md) 🆕 NEW
**What it defines**: Complete allergy/sensitivity tracking system (MAJOR EXPANSION beyond Figma)
- **5 Allergy Categories**: Medication, Food, Seasonal, Skin/Contact, Environmental
- **Allergy vs Sensitivity**: Separate field for clinical accuracy
- **Severity Classification**: Severe (anaphylaxis) vs Not Severe
- **EpiPen Tracking**: Yes/No field for severe allergies
- **Multi-Select Symptoms**: Category-specific symptom lists (Medication/Food severe: Anaphylaxis, difficulty breathing, swelling; Not severe: Hives, itchiness, rash; Seasonal: Runny nose, itchy eyes/nose, cough)
- **CAGE Questionnaire**: Alcohol screening if significant consumption
- **Complete data model**: TypeScript interfaces, database schema, UI/UX guidelines

**Created**: 2025-10-25
**Status**: ✅ Complete specification - ready for implementation planning

**Key Decisions Documented**:
- EpiPen field conditional on Severity = "Severe" + Category = "Medication/Food"
- Symptom vocabularies: Hybrid approach (core symptoms hardcoded, "Other" allows custom)
- Type field (Allergy vs Sensitivity): Required field
- Migration strategy for existing records

---

## Surgeries Feature Documentation

### 21. [SURGERIES_SCREENS_SPECS.md](SURGERIES_SCREENS_SPECS.md)
**What it contains**: Figma extraction of 9 surgery screens
- Surgeries List
- View Surgery (collapsed/expanded)
- Edit/Add Surgery screens with dual-mode date input
- Field specifications (Name, When, Details, Complications, Attending Surgeon)

**🚨 CRITICAL DISCOVERY**: Dual-mode "When" field
- Mode selector (107px): "Date" OR "Age"
- Date mode: Calendar picker
- Age mode: Text input "Enter Age"
- This pattern is system-wide for ALL date inputs

**Status**: ✅ Complete extraction - dual-mode pattern confirmed

---

## Supplements Feature Documentation

### 22. [SUPPLEMENTS_SCREENS_SPECS.md](SUPPLEMENTS_SCREENS_SPECS.md) ✅ COMPLETE
**What it contains**: Figma extraction of 7 supplement screens
- Supplements List with Quick Add feature (inline name-only entry)
- View Supplement (collapsed/expanded)
- Edit/Add Supplement screens (collapsed/expanded states)
- Field specifications (Name, Dosage, Frequency, Start, Details)
- Comparison to Medications structure
- TypeScript interface and database schema proposals

**Fields documented**:
- Name* (required, text input)
- Dosage (optional, free-form text: "10mcg", "500mg")
- Frequency (optional, dropdown with chevron - options need verification)
- Start (optional, date picker with calendar icon - dual-mode hypothesis)
- Details (optional, textarea 90px)
- Documents (optional, document attachment section)

**Critical questions documented**:
- What are Frequency dropdown options? (Hypothesis: "Per day", "Twice a day", "Weekly", "As needed")
- Does Start date use dual-mode input (Date OR Age)? (No mode selector visible in screens - needs verification)
- What does red dot indicator on cards mean? (Active status? Alert? Needs clarification)
- Should supplements have status tracking like medications?
- Should supplements link to conditions they're addressing?

**Status**: ✅ Complete extraction - comprehensive 624-line specification with data models and unanswered questions

---

## Immunizations Feature Documentation

### 23. [IMMUNIZATIONS_SCREENS_SPECS.md](IMMUNIZATIONS_SCREENS_SPECS.md) ✅ COMPLETE
**What it contains**: Figma extraction of 7 immunization screens
- Immunizations List (two-line cards: Vaccine name + Purpose)
- View Immunization (collapsed/expanded)
- Edit/Add Immunization screens (collapsed/expanded states)
- Field specifications (Name, Description/Purpose, When, Date Administered, Location Administered)
- TypeScript interfaces, database schema, and multiple doses pattern

**Fields documented**:
- Name* (required, text input: vaccine product name like "Moderna Spikevax")
- Description/Purpose (optional, textarea 90px: disease protected against like "Covid-19")
- When (optional, dual-mode: Date OR Age with 107px selector)
- Date Administered (optional, calendar picker)
- Location Administered (optional, dropdown - example: "Arm/gluteal")
- Documents (optional, document attachment section)

**🚨 CRITICAL DISCOVERIES**:
1. **Multiple doses support**: "+ Add more" link for multiple doses/boosters
   - Each dose: When, Date Administered, Location Administered
   - Array structure: `doses: ImmunizationDose[]`
   - Use case: Primary series + boosters for same vaccine
2. **Dual-mode date CONFIRMED**: "When" field uses same 107px selector pattern as Surgeries
   - Left component (107px): "Date" ▼ or "Age" ▼
   - Right component (flexible): Calendar picker OR "Enter Age" text input
   - Gap: 16px between components
3. **Repeatable entry pattern**: New UI pattern for array data (same as Social History Recreational Drugs)
   - First dose always shown, "+ Add more" for additional
   - Individual "✕ Remove" for 2nd+ doses
   - Visual separators between entries

**Data model**:
```typescript
interface Immunization {
  name: string; // Vaccine name (required)
  descriptionPurpose?: string; // What it protects against
  doses: ImmunizationDose[]; // Array of doses
}

interface ImmunizationDose {
  when?: DualModeDate; // Dual-mode: Date OR Age
  dateAdministered?: Date;
  locationAdministered?: string; // Dropdown value
  doseNumber?: number; // Auto-calculated
}
```

**Critical questions documented**:
- What are Location Administered dropdown options? (Hypothesis: "Arm", "Gluteal", "Thigh", "Arm/gluteal" shown as example)
- When vs Date Administered - why both fields? (When = patient recall, Date Administered = actual record?)
- How are dose numbers tracked? (Auto-calculated 1st, 2nd, booster, or user-selected?)
- Does "Add more" auto-number doses?

**Status**: ✅ Complete extraction - comprehensive 820-line specification with data models, dual-mode confirmation, and multiple doses pattern

---

## Personal Information Feature Documentation

### 24. [PERSONAL_INFORMATION_SCREENS_SPECS.md](PERSONAL_INFORMATION_SCREENS_SPECS.md) ✅ UPDATED
**What it contains**: Figma extraction of 15 personal information screens
- Main view (single record with all fields)
- Individual edit screens per field (Name, Gender, DOB, Height/Weight, etc.)

**Recent Updates (2025-10-25)**:
- ✅ **Gender dropdown confirmed**: Male, Female, Non-binary, Prefer not to say, Other
- ✅ **Jurisdictions confirmed**: International support (Canada provinces, US states, other countries)
- ✅ Health insurance # jurisdiction field supports worldwide coverage
- Delete account confirmation flow
- Field specifications with validation indicators (red dots)

**🚨 CRITICAL DISCOVERY**: Date of Birth is source of truth
- DOB is used by dual-mode date input component system-wide
- Age entries in other features (Surgeries, Immunizations) convert to dates using patient DOB
- Example: Patient DOB = Mar 15, 1974 → "Age 25" input → Calculated date = Mar 15, 1999

**Fields documented**:
- Primary Info: Name, Gender, DOB, Height/Weight, Profile Photo
- Contact: Mobile Phone (required + SMS verification), Email (with confirmation), Legal Mailing Address
- Health System: Health Insurance #, Family Doctor
- Emergency: Emergency Contact
- Account: Delete account capability

**Critical questions**:
- Gender dropdown options (Male, Female, Non-binary, Other?)
- Health Insurance jurisdiction options (Canadian provinces? US states?)
- Photo upload specifications

**Status**: ✅ Complete extraction - critical DOB discovery documented

---

## Social History Feature Documentation

### 25. [SOCIAL_HISTORY_SCREENS_SPECS.md](SOCIAL_HISTORY_SCREENS_SPECS.md) ✅ UPDATED
**What it contains**: Figma extraction of 8 social history screens
- Main view (single record with lifestyle categories)
- Individual edit screens per category (Smoking, Alcohol, Drugs, Caffeine, Living, Occupation)

**Recent Updates (2025-10-25)**:
- ✅ **CAGE Questionnaire added**: Alcohol screening trigger for significant consumption (frequency = "More than once a week" + drinks ≥3-4)
  - 4 Yes/No questions: Cut down, Annoyed, Guilty, Eye-opener
  - Score ≥2 suggests alcohol dependence
  - Assessment date tracking
- ✅ **Recreational drug types expanded**: Multi-select with standardized categories
  - Cannabis
  - Psychoactive medications
  - Stimulants/MDMA
  - Opioids
  - Hallucinogens
  - Cocaine
  - Other (with free-text)
- ✅ **Repeatable entry pattern**: Multiple drug entries with individual frequency tracking per drug
- ✅ **Data model updated**: JSONB for CAGE assessment, standardized drug type enums
- Conditional field logic (fields appear/disappear based on selections)

**🚨 CRITICAL DISCOVERIES**:
1. **Conditional UI patterns**: Radio button selections trigger field visibility
   - Smoker → Quantity + Duration fields
   - Quit → Quit date + Past quantity fields
   - Never → No sub-fields
2. **Repeatable entry pattern confirmed again**: Recreational Drugs uses "+ Add more" link
   - Multiple drug types with individual frequencies
   - Same pattern as Immunizations doses
3. **All fields optional**: No required fields (lifestyle data is optional)

**Categories documented**:
- Smoking (Smoker/Quit/Never with conditional sub-fields)
- Drinking Alcohol (Never/Occasionally/Regular with quantity + type)
- Recreational Drugs (Yes/No with repeatable drug entries)
- Caffeine (Yes/No with daily quantity)
- Living Situation (free text)
- Occupation (free text)

**Critical questions**:
- Smoking duration unit options (Years, Months, Days?)
- Drinks per day options (1-2, 3-4, 5-6, 7+?)
- Alcohol type options (Beer, Wine, Spirits?)
- Drug frequency options (based on standard screening tools?)
- Does Smoking Quit date use dual-mode input?

**Status**: ✅ Complete extraction - repeatable pattern confirmed in 3rd feature

---

## Family History Feature Documentation

### 26. [FAMILY_HISTORY_SCREENS_SPECS.md](FAMILY_HISTORY_SCREENS_SPECS.md)
**What it contains**: Figma extraction of 3 family history screens
- List view with multiple relatives
- Edit relative (dropdowns + textarea)
- Add relative (same fields, empty)

**Simplest feature**: Basic list/add/edit pattern with minimal complexity
- No type selection (unlike Conditions)
- No progressive disclosure
- No date tracking (could be enhanced later)

**Fields documented**:
- Relative dropdown (Mother, Father, Grandparents, etc.)
- Status dropdown (Alive, Deceased, Unknown)
- Medical conditions / cause of death (free-form textarea)

**Red dot indicator**: Shows if status = Deceased but no medical conditions listed

**Critical questions**:
- Complete Relative dropdown options (Parents, Grandparents, Siblings, Extended family?)
- Status dropdown options (Alive, Deceased, Unknown?)
- Medical conditions: Free text or structured/linked to Conditions database?
- Can user add multiple same relatives (two sisters)?
- Is there a delete capability?

**Status**: ✅ Complete extraction - simplest feature documented

---

## My Documents Feature Documentation

### 27. [MY_DOCUMENTS_SCREENS_SPECS.md](MY_DOCUMENTS_SCREENS_SPECS.md) ✅ COMPLETE (11/12 screens)
**What it contains**: Figma extraction of 11 "My Documents" screens (12 total, 1 timed out)
- My Documents (Browse) - main list view with folders + files
- My Documents (Private Folder) - Prescriptions folder view
- My Documents (Shared Folder) - Lab Results folder view
- My Documents (Inbox) - Incoming documents view
- Add/Associate Documents (3 screens) - Link docs to PHR records
- Add another Photo + Details - Multi-photo upload
- New Document Details - Add metadata to new document
- Document Details (View) - Read-only view of existing document
- Missing: Screen #8 (Add New initiation), Screen #12 (Edit Document)

**🎯 CRITICAL FINDINGS**:
1. **This is NOT Visit Notes** - It's a comprehensive document management system
2. **5 Pre-defined Folders**: Prescriptions, Lab Results, Imaging, Consult, Other
3. **Lab Results** ✅ - Dedicated folder (fills ARKPASS 6 gap)
4. **Consult Notes** ⚠️ - Partial Visit Notes (stores documents, not structured data)
5. **Export Integration** ✅ - "Share Your Health Record" button confirmed
6. **Document Associations** ✅ - Link to allergies, medications, surgeries, etc. with + icon workflow

**Fields documented**:
- **Required**: Name, Folder (dropdown), System (body system dropdown)
- **Optional**: Date (date picker), Tags (multi-add with delete)
- **Privacy**: Private/Public toggle, Highlighted toggle
- **Metadata**: File type (image/pdf/audio/word), Upload date, Size

**Pre-defined Folders** (5 total):
| Folder | Example Count | Purpose |
|--------|---------------|---------|
| Prescriptions | 3 documents | Prescription images, pharmacy receipts |
| Lab Results | 2 documents | Blood work, test results, imaging reports |
| Imaging | 1 document | X-rays, MRIs, CT scans, ultrasounds |
| Consult | 1 document | Specialist consult notes, referral letters |
| Other | 1 document | Catch-all for misc documents |

**Data Model**:
```typescript
interface Document {
  id: string;
  patientId: string;
  name: string; // Required
  folderId: string; // FK to pre-defined folders
  system: BodySystem; // Cardiac, Endocrine, etc.
  date?: Date;
  tags?: string[];
  isPrivate: boolean; // Default: false
  isHighlighted: boolean; // Default: false (starred)
  fileUrl: string;
  fileType: 'image' | 'pdf' | 'audio' | 'word' | 'other';
}

interface DocumentAssociation {
  documentId: string;
  entityType: 'allergy' | 'medication' | 'surgery' | 'immunization' | 'supplement' | 'condition';
  entityId: string; // FK to PHR record
}
```

**Browse/Inbox Toggle**:
- **Browse tab**: Organized view with folders + named files
- **Inbox tab**: Incoming documents (date-only, no names) - for provider-shared docs

**Association Pattern**:
- Every PHR record (allergies, medications, etc.) has "+ Add Documents" button
- Opens document picker with + icons
- User selects multiple docs, taps "Done"
- Documents linked to PHR record

**Critical questions**:
- Screen #8 (Add New initiation) - camera/upload workflow?
- Screen #12 (Edit Document) - likely same as New Document Details
- Can users create custom folders or only 5 pre-defined?
- File size limits?
- Storage provider (S3, Supabase Storage)?
- FHIR mapping to DocumentReference resource?

**Status**: ✅ Complete extraction (11/12 screens, 900+ lines) - comprehensive document management system documented

**Comparison to ARKPASS 6 Gaps**:
- ✅ **Lab Results**: Fully addressed with dedicated folder
- ⚠️ **Visit Notes**: Partially addressed (Consult folder stores documents, but no structured fields for visit type, chief complaint, diagnosis)
- ✅ **Export Feature**: Confirmed integration with "Share Your Health Record"
- ✅ **Document Attachments**: Advanced association system with + icon workflow

**Recommendation**: Keep "My Documents" as-is for MVP. Add structured "Visit Notes" feature in Phase 2 that can link to documents in Consult folder.

---

## Critical Gaps to Address

### Priority 1: Resolve Open Questions
**Medications**:
- [ ] Get dropdown options (Frequency, Route, Status)
- [ ] Clarify field labels
- [ ] Document any hidden fields

**Allergies**:
- [ ] Confirm Onset date framework assignment
- [ ] Verify complete category list
- [ ] Check for Severity field

**Supplements**:
- [ ] Get Frequency dropdown options
- [ ] Confirm Start date dual-mode support
- [ ] Clarify red dot indicator meaning

**Immunizations**:
- [ ] Get Location Administered dropdown options
- [ ] Clarify When vs Date Administered distinction
- [ ] Define dose numbering mechanism

### Priority 2: Document New Patterns
- [ ] Create DUAL_MODE_DATE_INPUT_COMPONENT.md (system-wide pattern)
- [ ] Create REPEATABLE_ENTRY_PATTERN.md (immunizations "Add more")
- [ ] Create QUICK_ADD_PATTERN.md (allergies/supplements/medications)
- [ ] Apply ALL notation to all feature logic
- [ ] Create validation rules documents

### Priority 3: Extract Remaining Features
- [ ] Social History screens + logic
- [ ] Family History screens + logic
- [ ] Personal Information screens + logic
- [ ] My Documents screens + logic

### Priority 3: OpenSpec Integration
- [ ] Create OpenSpec proposal for medications
- [ ] Create OpenSpec proposal for other features
- [ ] Fill out `openspec/project.md` with tech stack
- [ ] Answer open questions in design docs

---

## Questions to Answer

### Medications
1. What are ALL the Frequency options?
2. What are ALL the Route options?
3. What are ALL the Status options?
4. Are there any other hidden fields?
5. Does Frequency need a complex schedule builder or just a dropdown?

### Other Features
1. Do Allergies use the same date framework as Conditions?
2. Do Surgeries have a date field? (Surgery date)
3. Do Supplements use the same logic as Medications?
4. Do Immunizations have dose tracking? Date tracking?
5. What's in Social History? Date ranges?

### Tech Stack
1. What's the mobile platform? (React Native? Flutter? PWA?)
2. What's the styling system? (Not Tailwind - what is it?)
3. What's the API framework? (REST? GraphQL? tRPC?)
4. What's the testing strategy?
5. What's the deployment approach?

---

## Summary Statistics

### Extraction Progress

**Total screens extracted**: 75 screens across 10 features (11/12 My Documents screens added)
- System Architecture: 4 foundation documents
- Conditions: 7 screens + 6 supplementary docs
- Medications: 8 screens + 4 supplementary docs
- Allergies: 7 screens (+ expansion spec)
- Surgeries: 9 screens
- Supplements: 7 screens ✅ NEW COMPREHENSIVE SPEC (624 lines)
- Immunizations: 7 screens ✅ NEW COMPREHENSIVE SPEC (820 lines)
- Personal Information: 15 screens
- Social History: 8 screens
- Family History: 3 screens
- My Documents: 11 screens ✅ NEW COMPREHENSIVE SPEC (900+ lines) **THIS SESSION**

**Documentation files created**: 27 comprehensive specs (21 feature docs + 6 pattern docs)
- **New this session**: SUPPLEMENTS_SCREENS_SPECS.md, IMMUNIZATIONS_SCREENS_SPECS.md

**Critical patterns discovered**:
1. Three-view architecture (UI[Pt], UI[Pr], DB)
2. Display column pattern (`{field}_raw`, `{field}_display_pt`, `{field}_display_pr`, `{field}_display_active`)
3. Dual-mode date input (Date OR Age) - system-wide
4. Progressive disclosure (Show more/less)
5. Quick Add pattern (Allergies, Supplements, Medications)
6. Repeatable entry pattern (Immunizations "Add more")
7. Multi-condition assignment with confirmation (Medications)
8. Auto-update triggers (Medication dates when condition dates change)

---

## Summary

### What's Written in Rock ✅

**System Architecture**:
- Three-view pattern (UI[Pt], UI[Pr], DB)
- Display column pattern for database
- Armada Logic Language (ALL) for documenting behavior
- Logic documentation standards

**Conditions** (Complete):
- 7 screens extracted with all states
- Two-framework date system
- Progressive disclosure
- Voice + LLM + certainty
- Complete examples and validation

**Medications** (90% Complete):
- 8 screens extracted with all states
- Date field three-layer logic
- Auto-update on condition change
- Multi-condition assignment with confirmation
- Patient vs Provider display rules
- Complete examples
- Missing: Dropdown options (Frequency, Route, Status)

**Allergies** (Complete Extraction):
- 7 screens extracted with all states
- Quick Add pattern
- Category grouping
- Pending: Framework assignment for Onset field

**Surgeries** (Complete Extraction + Critical Discovery):
- 9 screens extracted (including dual-mode variants)
- 🚨 Dual-mode date input discovered
- System-wide pattern confirmed
- Pending: Clarifications on field mappings

**Supplements** (Complete Extraction):
- 7 screens extracted with all states
- Quick Add pattern
- Comparison to Medications
- Pending: Frequency options, Start date dual-mode confirmation

**Immunizations** (Complete Extraction + Critical Discovery):
- 7 screens extracted with all states
- 🚨 Multiple doses pattern discovered
- 🚨 Repeatable entry pattern discovered
- Dual-mode date confirmed in this feature too
- Pending: Location options, dose tracking mechanism

### What's Missing ⚠️

**Dropdown Options**:
- Medications: Frequency, Route, Status
- Supplements: Frequency
- Immunizations: Location Administered

**Field Clarifications**:
- Allergies: Onset framework assignment, complete categories
- Supplements: Red dot indicator meaning
- Immunizations: When vs Date Administered distinction, dose numbering

**Remaining Features**:
- Social History (8 screens)
- Family History (3 screens)
- Personal Information (15 screens)
- My Documents (12 screens)
- Total: 38 screens remaining

**Implementation**:
- Tech stack specification
- OpenSpec proposals for all features
- Code generation from ALL notation
- Pattern documentation (dual-mode, repeatable entry, quick add)

---

**Am I happy?** Yes! We've made massive progress:
1. ✅ Solid foundation architecture documented
2. ✅ 7 features fully extracted (38 screens)
3. ✅ 2 critical system-wide patterns discovered (dual-mode date, repeatable entry)
4. ✅ 20 comprehensive documentation files created

**What we achieved this session**:
- Extracted 56 screens total (30 in continuation session + 26 in this session)
- **Session 1** (continuation): Allergies, Surgeries, Supplements, Immunizations (30 screens)
- **Session 2** (current): Personal Information, Social History, Family History (26 screens)
- Discovered dual-mode date input pattern (system-wide)
- Discovered repeatable entry pattern (immunizations doses, recreational drugs)
- Confirmed Quick Add pattern across multiple features
- **CRITICAL**: Discovered Date of Birth is source of truth for age-to-date calculations
- Documented conditional UI patterns (Social History)
- Created 7 comprehensive specification documents (4 in session 1, 3 in session 2)

**What did we miss?**
- My Documents feature (12 screens) - skipped, similar patterns
- Dropdown option values need verification across all features
- Some field clarifications pending

---

**Status**: ✅ Foundation complete, 10 of 11 features extracted, 64 screens documented, 28 documentation files created
**Critical discoveries**:
1. Dual-mode date input (system-wide component)
2. Repeatable entry pattern (3 features confirmed: Immunizations, Recreational Drugs, potentially more)
3. Date of Birth = source of truth for age calculations
4. Conditional UI patterns (Social History)
5. Field-level editing pattern (Personal Info, Social History)
6. Quick Add pattern (3 features: Medications, Allergies, Supplements)

**Next**: Resolve dropdown options → Verify dual-mode on all date fields → OpenSpec proposals → Implementation
