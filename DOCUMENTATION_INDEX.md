# Documentation Index - Complete System Architecture

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

## Conditions Feature Documentation

### 5. [CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md)
**What it contains**: Figma extraction of 7 condition screens
- Conditions List
- View Condition (collapsed/expanded)
- Edit/Add Condition screens (Chronic, Transient-Recurrent, Transient-Resolved)
- Design specs: typography, colors, spacing, layouts

---

### 6. [CONDITIONS_FLOW_DIAGRAM.md](CONDITIONS_FLOW_DIAGRAM.md)
**What it contains**: 10 text-based ASCII flow diagrams
- User flow overview
- Type selection decision tree
- Date/time period selection
- Expandable section toggle
- Validation and error handling

---

### 7. [DATE_TIME_SELECTION_FRAMEWORK.md](DATE_TIME_SELECTION_FRAMEWORK.md)
**What it defines**: The sophisticated two-framework date selection system for conditions
- **Framework 1**: Chronic/Recurrent (Within 1yr/5yr/Over 5yr/Age)
- **Framework 2**: Resolved end dates (Within 1mo/6mo/2yr/More 2yr)
- Progressive disclosure (year → month → date)
- Voice input + LLM interpretation
- Certainty toggle (certain/somewhat certain/uncertain)
- Age-based input

**Key insight**: Framework selection based on condition type + subtype + field name

---

### 8. [DATE_FRAMEWORK_VALIDATION.md](DATE_FRAMEWORK_VALIDATION.md)
**What it contains**: Complete validation reference
- Correct framework assignments
- Implementation logic
- Testing checklist (40+ scenarios)
- Display examples

---

### 9. [IMPORTANT_DATE_FIELDS_SUMMARY.md](IMPORTANT_DATE_FIELDS_SUMMARY.md)
**What it contains**: Quick reference guide
- Framework assignment summary table
- Field breakdown by condition type
- Implementation checklist

---

### 10. [CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md](CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md)
**What it contains**: Technical addendum
- Field specifications by condition type
- Validation rules
- UI components
- Testing scenarios

---

## Medications Feature Documentation

### 11. [MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md)
**What it contains**: Figma extraction of 8 medication screens
- Medications List (collapsed/expanded)
- View Medication (collapsed/expanded)
- Edit Medication (collapsed/expanded)
- Add Medication (collapsed/expanded)
- Field specifications (Name, Dosage, Frequency, Route, Status)
- Critical questions about dropdown options

**Status**: ⚠️ Partial - missing dropdown option details (Frequency, Route, Status)

---

### 12. [MEDICATIONS_DATE_FIELD_SPEC.md](MEDICATIONS_DATE_FIELD_SPEC.md)
**What it defines**: The "Prescribed / Start day" field specification
- Two options: "Year-Month-Date" OR "I've been on this medication"
- Sub-options: "Right when diagnosed" / "After diagnosed"
- Uses Framework 1 (same as conditions) but NO certainty toggle
- Data model structure

**Key difference from conditions**: No certainty toggle for medications

---

### 13. [MEDICATIONS_DATE_FIELD_LOGIC.md](MEDICATIONS_DATE_FIELD_LOGIC.md)
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

### 14. [MEDICATION_DATE_EXAMPLES.md](MEDICATION_DATE_EXAMPLES.md)
**What it contains**: 10 concrete examples
- Right when diagnosed (year/month/day precision)
- Auto-update scenario
- After diagnosed (year/month/day precision)
- Direct date (no condition link)
- Validation errors
- ALL notation for the logic

**Purpose**: Examples with direct references to logic docs

---

### 15. [MEDICATIONS_MULTI_CONDITION_ASSIGNMENT.md](MEDICATIONS_MULTI_CONDITION_ASSIGNMENT.md)
**What it defines**: Rules for medications used for multiple conditions
- Confirmation dialog when adding 2nd+ condition
- Three response options: "Not sure" / "Yes, I'm certain" / "Actually, I don't think I am"
- Display notation: [ICD + (?)ICD] for database/provider
- Patient display: "(+ 1 other condition)" with hyperlinks
- Data model with certainty flags

**Key feature**: Different display for patient vs provider vs database

---

## Methodology & Analysis

### 16. [EXTRACTION_METHODOLOGY_ANALYSIS.md](EXTRACTION_METHODOLOGY_ANALYSIS.md)
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

### ❓ Not Yet Documented - Other Features

Based on Figma metadata, we have screens for:

1. **Allergies** (7 screens) - NOT extracted yet
   - Allergies list
   - View/Edit/Add Allergy screens
   - Similar pattern to conditions?

2. **Previous Surgeries** (9 screens) - NOT extracted yet
   - Surgeries list
   - View/Edit/Add Surgery screens
   - Date fields? Type selection?

3. **Nutraceutical / Supplement** (7 screens) - NOT extracted yet
   - Similar to medications?
   - Same date logic?

4. **Immunizations** (7 screens) - NOT extracted yet
   - Date fields?
   - Dose tracking?

5. **Social History** (8 screens) - NOT extracted yet
   - Smoking, alcohol, etc.?
   - Date ranges?

6. **Family History** (3 screens) - NOT extracted yet

7. **Personal Information** (15 screens) - NOT extracted yet
   - Demographics
   - Contact info

8. **My Documents** (12 screens) - NOT extracted yet
   - Document management
   - Associations with conditions/medications

---

## Critical Gaps to Address

### Priority 1: Complete Medications
- [ ] Get dropdown options from user or Figma
- [ ] Clarify field labels
- [ ] Document any hidden fields
- [ ] Apply ALL notation to all medication logic
- [ ] Create validation rules document
- [ ] Create navigation rules document

### Priority 2: Extract Remaining Features
- [ ] Allergies screens + logic
- [ ] Surgeries screens + logic
- [ ] Supplements screens + logic
- [ ] Immunizations screens + logic
- [ ] Each will likely have similar patterns

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

## Summary

### What's Written in Rock ✅

**System Architecture**:
- Three-view pattern (UI[Pt], UI[Pr], DB)
- Display column pattern for database
- Armada Logic Language (ALL) for documenting behavior
- Logic documentation standards

**Conditions**:
- Complete Figma extraction (7 screens)
- Two-framework date system
- Progressive disclosure
- Voice + LLM + certainty
- Complete examples and validation

**Medications**:
- Complete Figma extraction (8 screens with all states)
- Date field three-layer logic
- Auto-update on condition change
- Multi-condition assignment with confirmation
- Patient vs Provider display rules
- Complete examples

### What's Missing ⚠️

**Medications**:
- Dropdown option lists (Frequency, Route, Status)
- Field label clarifications
- Potential hidden fields

**Other Features**:
- Allergies, Surgeries, Supplements, Immunizations, etc.
- 50+ more screens to extract
- Similar patterns to apply

**Implementation**:
- Tech stack specification
- OpenSpec proposals for all features
- Code generation from ALL notation

---

**Am I happy?** Almost! We have rock-solid foundation architecture and complete conditions + medications logic. But we need:
1. Dropdown options for medications
2. Extract remaining features
3. Fill in tech stack details

**What did we miss?** The actual dropdown option values - but that's data you need to provide or we need to find in Figma overlays/components.

---

**Status**: ✅ Foundation complete, Conditions complete, Medications 90% complete
**Next**: Get dropdown options → Extract other features → OpenSpec proposals → Implementation
