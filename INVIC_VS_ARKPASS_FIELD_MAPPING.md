# INVIC-Headless vs ArkPass - Complete Field Mapping

**Date**: 2025-11-07
**Purpose**: Comprehensive field-by-field comparison between INVIC-headless FHIR database and ArkPass Figma specifications
**Status**: Based on documentation analysis (actual INVIC schema inspection pending)

---

## Match Type Legend

| Type | Description | Action Required |
|------|-------------|-----------------|
| **Exact** | Same field name and purpose, no transformation | None - use as-is |
| **Partial** | Same purpose, different name or minor structure diff | Rename or simple mapping |
| **Transform** | Major transformation needed (e.g., DATE → JSONB) | Database function + migration script |
| **Custom** | ArkPass-only field, not in INVIC or FHIR | Create new column/table |
| **Missing** | INVIC has it, ArkPass doesn't need it | Document for reference, don't use |
| **Conflict** | Incompatible approaches requiring resolution | Design decision + OpenSpec proposal |

---

## Feature 1: Medications

**ArkPass Screens**: 8 screens (List, View, Edit, Add - each with collapsed/expanded states)
**INVIC Table**: `medications` (exists with basic fields)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | `medications.name` | Exact | text→text | FHIR MedicationStatement.medicationCodeableConcept.text - Direct 1:1 mapping |
| **`dosage`** | No | `medications.dosage` | Exact | text→text | Free-form dosage entry (e.g., "10mg", "1 tablet") - Matches FHIR dosage.text |
| **`frequency`** | No | `medications.frequency` | Exact | dropdown→text | Dropdown options: "Once daily", "Twice daily", "As needed" - Store as text, future: vocabulary table |
| **`route`** | No | **N/A** | **Custom** | **dropdown→text** | **🆕 ArkPass-specific: ORAL/SL/INJ/DROPS - Not in standard FHIR, add new column** |
| **`prescribed_start_day`** | No | `medications.start_date` | **Transform** | **dual-mode JSONB→DATE** | **⚠️ CRITICAL: ArkPass uses "Date OR Age" dual-mode input. INVIC uses simple DATE. Requires JSONB migration** |
| **`status`** | No | `medications.status` | Exact | dropdown→text | Both support: active, completed, stopped, on-hold - FHIR MedicationStatement.status |
| **`indication`** | No | `medications.indication` | Partial | text→text | "Why are you taking this?" field - Likely exists in INVIC as indication or reason |
| **`prescribing_doctor`** | No | `medications.prescribing_doctor` | Partial | text→text | Free-text doctor name - May exist in INVIC |
| **`notes`** | No | `medications.notes` | Exact | textarea→text | Additional notes field |
| **`created_via`** | No | **N/A** | **Custom** | **text** | **🆕 Track entry method: 'quick_add', 'add_with_details', 'import' - Audit trail, not in FHIR** |
| **`documents`** (associations) | No | **MISSING** | **Custom** | **junction table** | **⚠️ CRITICAL: No `medication_documents` junction table in INVIC. Need universal document association system** |
| **`conditions`** (associations) | No | **MISSING** | **Custom** | **junction table** | **⚠️ Medications can link to multiple conditions (bidirectional). Not in FHIR standard, need `medication_conditions` table** |

**Critical Gaps:**
1. **Dual-mode date input**: `prescribed_start_day` needs JSONB structure + computed columns
2. **Route field**: Add `route TEXT` column
3. **Document associations**: Create `medication_documents` junction table
4. **Condition linking**: Create `medication_conditions` junction table for "Which condition is this for?" feature

---

## Feature 2: Allergies

**ArkPass Screens**: 7 screens (List, View collapsed/expanded, Edit collapsed/expanded, Add collapsed/expanded)
**INVIC Table**: `allergies` (exists with minimal fields)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | `allergies.allergen` or `allergies.name` | Exact | text→text | Allergen name (e.g., "Penicillin", "Peanuts") |
| **`category`** | ✅ Yes | **MISSING** | **Custom** | **dropdown→text** | **🚨 CRITICAL SAFETY: 5 categories (Medication, Food, Environmental, Skin/Contact, Insect/Animal) - NOT IN INVIC** |
| **`severity`** | No | **MISSING** | **Custom** | **dropdown→text** | **🚨 CRITICAL SAFETY: Mild, Moderate, Severe, Life-threatening - NOT IN INVIC, required for triage** |
| **`requires_epipen`** | No | **MISSING** | **Custom** | **boolean** | **🚨 CRITICAL PATIENT SAFETY: EpiPen prescription flag - ArkPass-specific, no FHIR equivalent, MUST ADD** |
| **`reaction`** | No | `allergies.reaction` | Exact | text→text | Symptoms/manifestation (e.g., "Hives", "Anaphylaxis") |
| **`onset`** | No | **MISSING** | **Transform** | **dual-mode JSONB→DATE** | **⚠️ Dual-mode date: "Date OR Age" input. Not in INVIC** |
| **`details`** | No | `allergies.notes` or `allergies.details` | Exact | textarea→text | Additional information |
| **`documents`** | No | **MISSING** | **Custom** | **junction table** | **No `allergy_documents` junction table** |

**Critical Gaps:**
1. **🚨 PATIENT SAFETY FIELDS MISSING**: `category`, `severity`, `requires_epipen` are essential for clinical decision support
2. **Dual-mode onset date**: Needs JSONB structure
3. **Document associations**: Create `allergy_documents` junction table

**Why we can't compromise on patient safety fields:**
- **Category**: Differentiates medication allergies (critical for prescribing) from environmental allergies
- **Severity**: Informs urgency of reaction and treatment protocols
- **EpiPen flag**: Life-saving information, must be highly visible in UI (🔴 badge), not in FHIR standard but medically critical

---

## Feature 3: Conditions

**ArkPass Screens**: 7 screens (List, View collapsed/expanded, Edit Chronic, Add Chronic/Transient-Recurrent/Transient-Resolved)
**INVIC Table**: `conditions` (exists with basic FHIR alignment)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | `conditions.name` | Exact | text→text | Condition name (e.g., "Asthma", "Migraine") |
| **`type`** | ✅ Yes | **MISSING** | **Conflict** | **radio→text** | **⚠️ CRITICAL UX DIVERGENCE: ArkPass has custom type system (Chronic / Transient), FHIR only has ClinicalStatus. Need new column** |
| **`subtype`** | Conditional | **MISSING** | **Conflict** | **radio→text** | **⚠️ For Transient: Recurrent vs Resolved. Not in FHIR. Changes UI flow and date fields shown** |
| **`diagnosis_date`** (Chronic) | No | `conditions.start_date` or `conditions.onset_date` | **Transform** | **dual-mode JSONB (Framework 1)→DATE** | **⚠️ Dual-mode with Framework 1 dropdown: "Within 1 year / Within 5 years / Over 5 years / I was...years old"** |
| **`last_occurrence`** (Recurrent) | No | **MISSING** | **Transform** | **dual-mode JSONB (Framework 1)→DATE** | **⚠️ "When was the last time you had this?" - Uses Framework 1 dropdown. Not in INVIC** |
| **`start_date`** (Resolved) | No | **MISSING** | **Transform** | **dual-mode JSONB (Framework 1)→DATE** | **⚠️ When condition started (for resolved). Framework 1 dropdown** |
| **`end_date`** (Resolved) | No | `conditions.end_date` | **Transform** | **dual-mode JSONB (Framework 2)→DATE** | **⚠️ When condition resolved. Uses Framework 2 dropdown: "Within 1 month / Within 6 months / Within 2 years / More than 2 years"** |
| **`details`** | No | `conditions.notes` | Exact | textarea→text | Free-form details |
| **`severity`** | No | `conditions.severity` | Exact | dropdown→text | Mild, Moderate, Severe |
| **`tags`** | No | `conditions.tags` | Exact | multi-select→text[] | Multiple category tags |
| **`documents`** | No | **MISSING** | **Custom** | **junction table** | **No `condition_documents` junction table** |
| **`medications`** (associations) | No | **MISSING** | **Custom** | **junction table** | **Bidirectional: Conditions ↔ Medications linking. Not in FHIR. Need `condition_medications` table** |

**Critical Conflicts:**
1. **⚠️ CONDITION TYPE SYSTEM**: ArkPass's Chronic/Transient-Recurrent/Transient-Resolved classification is custom UX design, not in FHIR
   - **Why**: Patients think about conditions differently than clinicians. "Is this ongoing or temporary?" is more intuitive than FHIR's ClinicalStatus codes
   - **Impact**: Different date fields appear based on type (diagnosis_date vs last_occurrence vs start_date/end_date)
   - **Resolution**: Add `type` and `subtype` columns, keep all date fields, show/hide based on type

2. **⚠️ DUAL DATE FRAMEWORKS**: Framework 1 (long-term) vs Framework 2 (recent)
   - **Why**: Chronic conditions may have started decades ago ("I was 10 years old"), but end dates are usually recent ("6 months ago")
   - **Impact**: Different dropdown options, different certainty levels
   - **Resolution**: Store framework type in JSONB metadata

3. **Medication linking**: Conditions can be associated with medications treating them (not in FHIR Condition resource)

---

## Feature 4: Surgeries

**ArkPass Screens**: 9 screens (List, View collapsed/expanded, Edit with Date/Age selector variations, Add with Date/Age selector variations)
**INVIC Table**: `surgeries` (likely exists with basic FHIR Procedure alignment)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | `surgeries.name` or `surgeries.procedure_name` | Exact | text→text | Surgery/procedure name |
| **`when`** | No | `surgeries.date` or `surgeries.performed_date` | **Transform** | **dual-mode JSONB→DATE** | **⚠️ CRITICAL UX: 107px mode selector (Date/Age) + input field. Most innovative dual-mode implementation. INVIC uses simple DATE** |
| **`details`** | No | `surgeries.description` or `surgeries.notes` | Exact | textarea→text | Free-form surgery details |
| **`complications`** | No | `surgeries.complications` | Exact | textarea→text | Post-operative complications |
| **`attending_surgeon`** | No | `surgeries.surgeon` or `surgeries.performer` | Exact | text→text | Surgeon name (free-text or provider lookup) |
| **`documents`** | No | **MISSING** | **Custom** | **junction table** | **No `surgery_documents` junction table** |

**Critical UX Innovation:**
- **107px Mode Selector**: Surgeries screen showcases the most polished dual-mode date implementation
  - Mode selector (Date/Age) is exactly 107px wide
  - Screen variants show Date selector expanded vs Age selector expanded
  - This is THE reference implementation for dual-mode pattern across app

---

## Feature 5: Immunizations

**ArkPass Screens**: 7 screens (List, View collapsed/expanded, Edit collapsed/expanded, Add collapsed/expanded)
**INVIC Table**: `immunizations` (likely exists)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | `immunizations.name` or `immunizations.vaccine` | Exact | text→text | Vaccine name |
| **`description_purpose`** | No | `immunizations.description` | Partial | textarea→text | "What does it protect against?" - May exist as description |
| **MULTIPLE DOSES** | No | **MISSING** | **Custom** | **array/table** | **⚠️ CRITICAL: "Add more" link creates repeatable dose entries (1st dose, 2nd dose, booster). INVIC likely has 1 row per immunization, not per dose. Need `immunization_doses` table** |
| **`when`** (per dose) | No | **MISSING** | **Transform** | **dual-mode JSONB** | **Dual-mode date per dose** |
| **`date_administered`** (per dose) | No | `immunizations.date` | Partial | date→date | Actual administration date (may be per dose or per immunization in INVIC) |
| **`location_administered`** | No | `immunizations.location` or `immunizations.site` | Partial | dropdown→text | Body location: Arm (left/right), Gluteal, Other |
| **`documents`** | No | **MISSING** | **Custom** | **junction table** | **No `immunization_documents` junction table** |

**Critical Gap:**
- **Multiple Doses Pattern**: INVIC likely stores 1 row = 1 immunization. ArkPass stores 1 row = 1 dose. Need parent-child relationship:
  ```
  immunizations (parent)
    ↓ has many
  immunization_doses (child)
    - dose_number (1st, 2nd, booster)
    - when_raw (dual-mode JSONB)
    - date_administered
    - location_administered
  ```

---

## Feature 6: Supplements

**ArkPass Screens**: 7 screens (List, View collapsed/expanded, Edit collapsed/expanded, Add collapsed/expanded)
**INVIC Table**: **DOES NOT EXIST**

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | **TABLE MISSING** | **Custom** | **text** | **🚨 CRITICAL: Entire supplements table missing from INVIC. 7 Figma screens with no backend support!** |
| **`dosage`** | No | **N/A** | **Custom** | **text** | **e.g., "1000mg", "2 capsules"** |
| **`frequency`** | No | **N/A** | **Custom** | **dropdown→text** | **Per day, Twice a day, Weekly, etc.** |
| **`start`** | No | **N/A** | **Transform** | **dual-mode JSONB** | **Dual-mode date input** |
| **`details`** | No | **N/A** | **Custom** | **textarea** | **Free-form notes** |
| **`documents`** | No | **N/A** | **Custom** | **junction table** | **No associations** |

**CRITICAL BLOCKER:**
- **ENTIRE TABLE MISSING**: Supplements are NOT in INVIC-headless database
- **FHIR Mapping**: Would use `MedicationStatement` with `category = "dietary-supplement"`
- **Database Impact**: Need to create full `supplements` table from scratch
- **Priority**: HIGH - 7 screens are unusable without this table

---

## Feature 7: Family History

**ArkPass Screens**: 3 screens (List, Edit Family Member, Add Family Member)
**INVIC Table**: `family_history` (likely exists)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`relative`** | ✅ Yes | `family_history.relationship` | Partial | dropdown→text | Mother, Father, Sister, Brother, Grandparent, etc. |
| **`status`** | No | `family_history.status` | Partial | dropdown→text | Alive, Deceased, Unknown |
| **`medical_conditions`** | No | `family_history.medical_conditions` or `family_history.conditions` | Partial | text→text or structured | Could be free-text or array of condition names |
| **`cause_of_death`** | Conditional | `family_history.cause_of_death` | Partial | text→text | If status = Deceased |

**UI Logic:**
- **Red Dot Indicator**: Shows if status="Deceased" but no conditions entered (incomplete data)
- **Multiple Same Relatives**: Can add multiple "Sister" entries - needs array handling

---

## Feature 8: Social History

**ArkPass Screens**: 8 screens (Main, Edit Smoking (Smoker), Edit Smoking (Quit), Edit Drinking, Edit Recreational Drugs, Edit Caffeine, Edit Living Situation, Edit Occupation)
**INVIC Table**: `social_history` (likely exists with comprehensive fields)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`smoking_status`** | No | `social_history.smoking_status` | Exact | radio→text | Smoker / Quit / Never |
| **`smoking_quantity`** | Conditional | `social_history.smoking_quantity` | Exact | text→text | Packs per day, cigarettes per day |
| **`smoking_duration`** | Conditional | `social_history.smoking_duration` | Partial | {value,unit}→text | ArkPass: separate value + dropdown unit (days/weeks/months/years). INVIC: likely single text field |
| **`smoking_quit_date`** | Conditional | `social_history.quit_date` | **Transform** | **dual-mode JSONB→DATE** | **⚠️ Dual-mode: "Date OR Age" when patient quit smoking** |
| **`drinking_frequency`** | No | `social_history.alcohol_frequency` | Exact | radio→text | Never / Occasionally / More than once a week |
| **`drinks_per_day`** | Conditional | `social_history.drinks_per_day` | Exact | dropdown→text | 1-2, 3-4, 5-6, 7+ |
| **`alcohol_type`** | Conditional | `social_history.alcohol_type` | Exact | dropdown→text | Beer, Wine, Spirits |
| **`cage_assessment`** | Conditional | **MISSING** | **Custom** | **JSONB** | **⚠️ CAGE questionnaire (4 Yes/No questions) for alcohol dependency screening. NOT IN INVIC. Conditional: shown if drinks_per_day ≥ '5-6'** |
| **`recreational_drugs`** | No | `social_history.recreational_drugs` | **Conflict** | **multi-select + array→text** | **⚠️ CRITICAL CHANGE: INVIC likely has free-text field. ArkPass uses standardized multi-select checkboxes (7 drug types: Cannabis, Psychoactive Medications, Stimulants/MDMA, Opioids, Hallucinogens, Cocaine, Other) with repeatable frequency entry per drug. Need `recreational_drugs` table** |
| **`caffeine`** | No | `social_history.caffeine` | Partial | boolean + quantity | Yes/No + quantity if yes |
| **`living_situation`** | No | `social_history.living_situation` | Exact | text→text | Free-form |
| **`occupation`** | No | `social_history.occupation` | Exact | text→text | Free-form |

**Critical Changes:**
1. **CAGE Questionnaire**: 4 standardized questions for alcohol screening
   - Cut down: "Have you ever felt you should cut down on your drinking?"
   - Annoyed: "Have people annoyed you by criticizing your drinking?"
   - Guilty: "Have you ever felt guilty about your drinking?"
   - Eye-opener: "Have you ever had a drink first thing in the morning?"
   - **Scoring**: Each Yes = 1 point. Score ≥2 suggests alcohol dependence
   - **INVIC Status**: Not implemented
   - **Storage**: JSONB `{"cutDown": true, "annoyed": false, "guilty": true, "eyeOpener": false, "score": 2}`

2. **Recreational Drugs Standardization**:
   - **INVIC**: Likely free-text field
   - **ArkPass**: Multi-select checkboxes + repeatable entry pattern
   - **Drug Types**: Cannabis, Psychoactive Medications, Stimulants/MDMA, Opioids, Hallucinogens, Cocaine, Other (with custom name if Other)
   - **Need**: `recreational_drugs` table with `drug_type`, `frequency`, `social_history_id`

---

## Feature 9: Personal Information

**ArkPass Screens**: 15 screens (Main, Edit Name, Edit Gender, Edit DOB, Edit Height/Weight, Edit Mobile, Edit Email, Edit Address, Edit Insurance, Edit Family Doctor, Edit Emergency Contact, Edit Photo, Delete Account Confirmation, Account Deleted Success, Edit Living Situation)
**INVIC Table**: `user_profiles` (exists with minimal demographics)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`first_name`** | ✅ Yes | `user_profiles.name` | **Conflict** | **text→text** | **⚠️ INVIC likely has single "name" field. ArkPass has First/Middle/Last separate. Need to split** |
| **`middle_name`** | No | **MISSING** | **Custom** | **text** | **Separate middle name field** |
| **`last_name`** | ✅ Yes | **MISSING** | **Custom** | **text** | **Separate last name field** |
| **`gender`** | ✅ Yes | `user_profiles.gender` | Partial | dropdown→text | Male / Female / Non-binary / Prefer not to say |
| **`date_of_birth`** | ✅ Yes | `user_profiles.date_of_birth` or `user_profiles.DOB` | Exact | date→date | **🚨 CRITICAL: Source of truth for all dual-mode age calculations across app** |
| **`height`** | No | **MISSING** | **Custom** | **{value,unit}** | **173 cm OR 5'8" - separate value + unit fields** |
| **`weight`** | No | **MISSING** | **Custom** | **{value,unit}** | **75 kg OR 165 lbs - separate value + unit fields** |
| **`bmi`** | No | **N/A** | **Computed** | **decimal** | **Calculated from height + weight, not stored** |
| **`mobile_phone`** | ✅ Yes | `user_profiles.contact_phone` | Exact | text→text | Primary auth method (SMS) |
| **`mobile_phone_verified`** | No | **MISSING** | **Custom** | **boolean** | **SMS verification status - not in INVIC** |
| **`email`** | No | **MISSING** | **Custom** | **text** | **Optional but recommended** |
| **`email_verified`** | No | **MISSING** | **Custom** | **boolean** | **Email confirmation status - not in INVIC** |
| **`legal_mailing_address`** | No | **MISSING** | **Custom** | **textarea** | **Multi-line address field** |
| **`health_insurance_number`** | No | **MISSING** | **Custom** | **text** | **Insurance card number** |
| **`health_insurance_jurisdiction`** | No | **MISSING** | **Custom** | **dropdown** | **BC, AB, SK, MB, ON, QC, NB, NS, PE, NL, NT, YT, NU + 50 US states - International support** |
| **`family_doctor_name`** | No | **MISSING** | **Custom** | **text** | **Primary care physician name** |
| **`family_doctor_phone`** | No | **MISSING** | **Custom** | **text** | **Doctor's phone number** |
| **`emergency_contact_name`** | No | **MISSING** | **Custom** | **text** | **🚨 CRITICAL SAFETY: Emergency contact information** |
| **`emergency_contact_relationship`** | No | **MISSING** | **Custom** | **text** | **Relationship to patient** |
| **`emergency_contact_phone`** | No | **MISSING** | **Custom** | **text** | **Emergency contact phone** |
| **`profile_photo_url`** | No | **MISSING** | **Custom** | **text** | **Avatar image URL** |

**Critical Gaps:**
1. **Name Structure**: INVIC likely has single `name` field, ArkPass has First/Middle/Last separate
2. **Extended Demographics**: Height, weight, BMI tracking not in INVIC
3. **Emergency Contact**: Critical safety feature, may need separate `emergency_contacts` table (multiple contacts)
4. **Insurance**: International jurisdiction support (Canada provinces + US states + others)
5. **Verification Flags**: Email/phone verified status not in INVIC (for auth security)

**Red Dot Indicator Logic**:
- Shows on fields with incomplete data (e.g., Family Doctor name entered but no phone)
- Implemented in UI layer, not database constraint

---

## Feature 10: My Documents

**ArkPass Screens**: 11 screens (Browse, Private Folder (Prescriptions), Shared Folder (Lab Results), Inbox, Add/Associate Documents variations, Add another Photo, New Document Details, Document Details View)
**INVIC Table**: `documents` (exists with minimal FHIR DocumentReference fields)

| ArkPass Field | Required? | INVIC Field | Match Type | Data Types | Decision/Rationale |
|---------------|-----------|-------------|------------|------------|-------------------|
| **`name`** | ✅ Yes | **MISSING** | **Custom** | **text** | **🚨 CRITICAL: INVIC only has `type` and `description`, no `name` field for document title** |
| **`folder_id`** | No | **MISSING** | **Custom** | **FK** | **🚨 CRITICAL: 5 pre-defined folders (Prescriptions, Lab Results, Imaging, Consult, Other) - folder system not in INVIC** |
| **`system`** | No | **MISSING** | **Custom** | **dropdown** | **🚨 CRITICAL: Body system classification (Cardiac, Respiratory, Endocrine, Gastrointestinal, Musculoskeletal, Nervous, Renal, Dermatology, HEENT, Other) - not in INVIC** |
| **`date`** | No | `documents.date` | Exact | date→date | Document date |
| **`tags`** | No | **MISSING** | **Custom** | **text[]** | **Multi-tag system (e.g., #prescription, #urgent) - not in INVIC** |
| **`is_private`** | No | **MISSING** | **Custom** | **boolean** | **Privacy toggle (🔒 icon). Private docs NOT included in "Share Your Health Record" exports - not in INVIC** |
| **`is_highlighted`** | No | **MISSING** | **Custom** | **boolean** | **Starred/favorite (⭐ icon) - not in INVIC** |
| **`file_url`** | ✅ Yes | `documents.file_url` | Exact | text→text | S3/Supabase Storage URL |
| **`type`** | No | `documents.type` | Exact | text→text | Document type (PDF, image, etc.) |
| **`description`** | No | `documents.description` | Exact | text→text | Free-text description |
| **`inbox_status`** | No | **MISSING** | **Custom** | **text** | **Browse vs Inbox workflow state. Inbox = "Documents received from providers/clinics before patient has reviewed/organized" - not in INVIC** |
| **Document Associations** | No | **MISSING** | **Custom** | **junction table** | **🚨 CRITICAL: Universal `document_associations` table to link documents to ANY PHR record (medications, allergies, conditions, etc.). "+" icon workflow. Not in INVIC** |

**Critical Gaps - Document Management System:**

1. **🚨 MAJOR FEATURE GAP**: INVIC has minimal document schema (`type`, `date`, `description`, `file_url`). ArkPass has rich document management:
   - **Folder system**: 5 pre-defined folders need `document_folders` table
   - **Tags**: Multi-tag system for cross-folder organization
   - **Privacy**: Private documents excluded from sharing
   - **Highlights**: Favorite/starred documents
   - **Inbox workflow**: Separate view for unprocessed documents
   - **Universal associations**: Link documents to medications, allergies, conditions, surgeries, immunizations, supplements, lab results, etc.

2. **Folder System Design**:
   ```sql
   CREATE TABLE document_folders (
     id UUID PRIMARY KEY,
     name TEXT NOT NULL UNIQUE, -- 'Prescriptions', 'Lab Results', 'Imaging', 'Consult', 'Other'
     icon TEXT, -- Icon name/URL
     is_private BOOLEAN DEFAULT FALSE, -- Private folder (not shared)
     sort_order INTEGER
   );
   ```

3. **Universal Document Associations**:
   ```sql
   CREATE TABLE document_associations (
     id UUID PRIMARY KEY,
     document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
     entity_type TEXT NOT NULL, -- 'medication', 'allergy', 'condition', 'surgery', 'immunization', 'supplement', 'lab_result', 'social_history', 'family_history'
     entity_id UUID NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(document_id, entity_type, entity_id)
   );
   ```

4. **"+" Icon Workflow**:
   - Every PHR screen (Medications, Allergies, etc.) has "+" icon to associate documents
   - Clicking "+" opens Documents screen in "Add/Associate" mode
   - User can select existing documents OR upload new ones
   - Selected documents are linked via `document_associations` table
   - This is NOT in FHIR DocumentReference standard

---

## Summary: Critical Conflicts & Custom Fields

### Top 8 Schema Blockers (Must Resolve Before Implementation)

**1. Dual-Mode Date System** (Affects ALL features)
- **Impact**: Every date field across system (15+ fields)
- **ArkPass**: User can enter "Date OR Age" via 107px mode selector
- **INVIC**: Simple DATE columns
- **Resolution**: JSONB structure + computed columns + database functions
- **Priority**: 🔴 CRITICAL - Blocks all feature implementation
- **OpenSpec Needed**: Yes - `add-dual-mode-date-system`

**2. Supplements Table Missing** (Entire feature blocked)
- **Impact**: 7 Figma screens with no backend
- **ArkPass**: Dedicated supplements feature
- **INVIC**: Table does not exist
- **Resolution**: Create full `supplements` table
- **Priority**: 🔴 CRITICAL - Feature unusable without this
- **OpenSpec Needed**: Yes - `add-supplements-table`

**3. Allergy Safety Fields Missing** (Patient safety compromised)
- **Impact**: Category, Severity, EpiPen flag all missing
- **ArkPass**: 🚨 `requires_epipen` boolean, 5 categories, 4 severity levels
- **INVIC**: Minimal allergy fields
- **Resolution**: Add columns: `category`, `severity`, `requires_epipen`
- **Priority**: 🔴 CRITICAL - Patient safety feature
- **OpenSpec Needed**: Yes - `enhance-allergy-safety`

**4. Document Management System** (Major feature gap)
- **Impact**: Folders, tags, privacy, highlights, associations all missing
- **ArkPass**: Full-featured document system with 11 screens
- **INVIC**: Minimal DocumentReference (type, date, description, file_url)
- **Resolution**: 3 new tables + many columns
- **Priority**: 🔴 CRITICAL - Core feature incomplete
- **OpenSpec Needed**: Yes - `add-document-management-system`

**5. Condition Type System** (UX divergence from FHIR)
- **Impact**: Chronic/Transient classification changes date fields shown
- **ArkPass**: Custom type system (Chronic / Transient-Recurrent / Transient-Resolved)
- **INVIC**: Standard FHIR ClinicalStatus
- **Resolution**: Add `type`, `subtype` columns + conditional date fields
- **Priority**: 🟡 HIGH - Affects Conditions feature UX
- **OpenSpec Needed**: Yes - `add-condition-type-system`

**6. Immunization Doses** (Multiple doses pattern)
- **Impact**: "Add more" link creates multiple dose entries per immunization
- **ArkPass**: 1 immunization → many doses (1st, 2nd, booster)
- **INVIC**: Likely 1 row = 1 immunization (not per dose)
- **Resolution**: Create `immunization_doses` table (parent-child relationship)
- **Priority**: 🟡 MEDIUM - Affects Immunizations feature
- **OpenSpec Needed**: Yes - `add-immunization-doses`

**7. Social History Enhancements** (CAGE + Recreational Drugs)
- **Impact**: Alcohol screening + standardized drug tracking missing
- **ArkPass**: CAGE questionnaire (4 questions) + 7-type drug multi-select
- **INVIC**: Basic social history fields
- **Resolution**: Add `cage_assessment` JSONB + `recreational_drugs` table
- **Priority**: 🟡 MEDIUM - Clinical screening features
- **OpenSpec Needed**: Yes - `enhance-social-history`

**8. Personal Information Extended Demographics** (Patient profile incomplete)
- **Impact**: Name structure, height/weight, emergency contact, insurance all missing/incomplete
- **ArkPass**: First/Middle/Last name separate, height/weight with units, emergency contacts table, international insurance
- **INVIC**: Single name field, minimal demographics
- **Resolution**: Split name fields + add many columns + `emergency_contacts` table
- **Priority**: 🟡 MEDIUM - Profile management features
- **OpenSpec Needed**: Yes - `enhance-personal-info`

---

## Next Steps

1. **Review this mapping** with stakeholders for accuracy
2. **Inspect actual INVIC schema** to validate assumptions (run `scripts/EXTRACT_SCHEMA.sql` in Supabase)
3. **Create OpenSpec proposals** for each of the 8 critical conflicts
4. **Prioritize implementation** (likely order: Dual-mode dates → Supplements → Allergy safety → Document system → Others)
5. **Build migration scripts** for each phase
6. **No database changes** until OpenSpec proposals approved

**Estimated Planning Time**: 8-12 hours to create all OpenSpec proposals + migration strategy
**Estimated Implementation Time**: 13-18 days of database work + API development

---

**This mapping demonstrates that ArkPass has intentionally diverged from vanilla FHIR to prioritize patient UX and safety, requiring substantial custom schema work.**
