# FHIR Harmonization Mapping

**Date**: 2025-10-26 (Updated)
**Purpose**: Map Figma-extracted specifications to FHIR R4 resources and ArkPass Supabase schema
**Status**: Phase 1 Complete - Production Schema Validated

---

## 🎯 Database Design Philosophy (CRITICAL)

### Priority Order

**1. ArkPass Schema (PRIMARY)**
- Figma UI designs dictate database structure
- Database optimized for ArkPass app functionality
- Fields serve patient needs and app workflows FIRST

**2. FHIR R4 Export (SECONDARY)**
- FHIR is for interoperability and data exchange ONLY
- FHIR mapping happens at **export time**, NOT database design time
- Database is NOT constrained by FHIR limitations

### Core Principle

> **"We want compliance with FHIR but not limited to what the FHIR guys were thinking. Sometimes we may need to input the content under the comments for FHIR as it doesn't have the straight match."**
>
> — Project Directive

### Implementation Rules

✅ **DO**:
- Add custom fields for ArkPass features (e.g., `requires_epipen`, folder structure)
- Use ArkPass-specific categories (5 allergy categories vs. FHIR's 4)
- Optimize schema for mobile app UX (quick add, field-level editing)
- Create ArkPass-unique tables (supplements, document_folders, etc.)

❌ **DON'T**:
- Remove fields because FHIR doesn't have them
- Change UI to fit FHIR constraints
- Limit functionality to FHIR spec
- Reject features that need custom FHIR extensions

### When FHIR Doesn't Fit

Use one of these strategies:

**Strategy A: FHIR Custom Extension**
```json
{
  "resourceType": "AllergyIntolerance",
  "extension": [{
    "url": "http://arkpass.com/fhir/StructureDefinition/requires-epipen",
    "valueBoolean": true
  }]
}
```

**Strategy B: FHIR Comment/Note Field**
```json
{
  "resourceType": "DocumentReference",
  "note": [{
    "text": "ArkPass folder: Prescriptions | Tags: Annual Checkup, Cardiac"
  }]
}
```

**Strategy C: Omit from FHIR Export**
- Some internal fields don't need FHIR export
- Example: `created_via` (quick_add vs add_with_details) → Internal audit only

### Examples

**Example 1: Allergy Categories**
- **Figma**: 5 categories (Medication, Food, Environmental/Seasonal, Skin/Contact, Insect & Animal)
- **FHIR**: 4 categories (medication, food, environment, biologic)
- **ArkPass Database**: Uses 5 categories (Figma drives schema)
- **FHIR Export**: Maps 5 → 4 at export time + custom extension for detail

**Example 2: Document Folders**
- **Figma**: 5 pre-defined folders (Prescriptions, Lab Results, Imaging, Consult, Other)
- **FHIR**: No folder concept in DocumentReference
- **ArkPass Database**: `document_folders` table with 5 system folders
- **FHIR Export**: Use custom extension or include folder name in note

**Example 3: EpiPen Flag**
- **Figma**: "Requires EpiPen" toggle (patient safety)
- **FHIR**: No native field for EpiPen
- **ArkPass Database**: `requires_epipen BOOLEAN` column
- **FHIR Export**: Custom extension (strategy A above)

---

## Overview

This document provides the critical bridge between:
1. **Figma UI Extraction** (27 specification files, 75 screens)
2. **ArkPass Production Supabase Database** (actual production state documented)
3. **FHIR R4 Standard** (HL7 FHIR specification for export/interoperability)

### Harmonization Goals

- ✅ **PRIMARY**: Preserve all Figma UI features and workflows
- ✅ **PRIMARY**: Optimize database for ArkPass app functionality
- ✅ **SECONDARY**: Enable FHIR export for interoperability
- ✅ Identify schema gaps and extensions needed
- ✅ Document field-level mappings for implementation

---

## Table of Contents

1. [Core Medical Records](#1-core-medical-records)
   - [Medications](#11-medications)
   - [Allergies](#12-allergies)
   - [Conditions](#13-conditions)
   - [Immunizations](#14-immunizations)
   - [Surgeries](#15-surgeries)
   - [Supplements](#16-supplements)
2. [Clinical Documentation](#2-clinical-documentation)
   - [My Documents](#21-my-documents)
   - [Visit Notes](#22-visit-notes)
   - [Lab Results](#23-lab-results)
3. [Patient Information](#3-patient-information)
   - [Personal Information](#31-personal-information)
   - [Social History](#32-social-history)
   - [Family History](#33-family-history)
4. [System Features](#4-system-features)
   - [Access Grants](#41-access-grants)
   - [Audit Logs](#42-audit-logs)
   - [Notifications](#43-notifications)
5. [Schema Gaps & Extensions](#5-schema-gaps--extensions)
6. [Implementation Priorities](#6-implementation-priorities)

---

## 1. Core Medical Records

### 1.1 Medications

**Figma Source**: [MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md) (8 screens)

#### FHIR R4 Resource
**Primary**: `MedicationStatement` (patient-reported medications)
**Alternative**: `MedicationRequest` (for prescriptions)
**Reference**: http://hl7.org/fhir/R4/medicationstatement.html

#### Supabase Schema Mapping

| Figma Field | Supabase Column | FHIR Path | Notes |
|-------------|-----------------|-----------|-------|
| `name` | `medications.name` | `MedicationStatement.medicationCodeableConcept.text` | Required field |
| `dosage` | `medications.dosage` | `MedicationStatement.dosage[0].doseAndRate[0].doseQuantity.value` + `.unit` | Combine value + unit |
| `frequency` | `medications.frequency` | `MedicationStatement.dosage[0].timing.code.text` | e.g., "Once daily", "Twice daily" |
| `indication` | `medications.indication` | `MedicationStatement.reasonCode[0].text` | Why medication is taken |
| `status` | `medications.status` | `MedicationStatement.status` | Values: `active`, `completed`, `stopped` |
| `startDate` | `medications.start_date` | `MedicationStatement.effectivePeriod.start` | Date or Age framework |
| `endDate` | `medications.end_date` | `MedicationStatement.effectivePeriod.end` | Optional |
| `prescribingDoctor` | `medications.prescribing_doctor` | `MedicationStatement.informationSource.display` | Free-text provider name |
| `notes` | `medications.notes` | `MedicationStatement.note[0].text` | Free-form notes |

#### Schema Gaps & Extensions

**✅ Already Compatible**:
- Core fields (name, dosage, frequency) fully supported
- Status tracking (active/completed) matches FHIR
- Date ranges supported

**⚠️ Figma Features Requiring Extensions**:
1. **Document Associations** (+ icon workflow)
   - **Solution**: Add `medication_documents` junction table
   - Maps to: `MedicationStatement.derivedFrom` (DocumentReference)

2. **Dropdown Vocabulary** (medication names, frequencies)
   - **Solution**: Add `medication_vocabularies` table
   - Maps to: RxNorm codes for medications, UCUM for units

3. **Field-Level Editing** (tap individual field to edit)
   - **Implementation**: Frontend pattern, no schema change needed

4. **Quick Add** (minimal fields) vs. **Add with Details** (full form)
   - **Implementation**: Frontend workflow, same schema

#### Recommended Schema Extensions

```sql
-- Medication-Document associations (for + icon workflow)
CREATE TABLE medication_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(medication_id, document_id)
);

-- Medication vocabularies (for dropdowns)
CREATE TABLE medication_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'medication_name', 'frequency', 'dosage_unit'
  value TEXT NOT NULL,
  display_text TEXT,
  rxnorm_code TEXT, -- For medication names
  ucum_code TEXT, -- For dosage units
  sort_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(type, value)
);
```

#### FHIR Export Example

```json
{
  "resourceType": "MedicationStatement",
  "id": "med-123",
  "status": "active",
  "medicationCodeableConcept": {
    "text": "Lisinopril 10mg",
    "coding": [
      {
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "314076",
        "display": "Lisinopril 10 MG Oral Tablet"
      }
    ]
  },
  "subject": {
    "reference": "Patient/patient-456"
  },
  "effectivePeriod": {
    "start": "2024-01-15"
  },
  "dosage": [
    {
      "text": "Take 10mg once daily",
      "timing": {
        "code": {
          "text": "Once daily"
        }
      },
      "doseAndRate": [
        {
          "doseQuantity": {
            "value": 10,
            "unit": "mg",
            "system": "http://unitsofmeasure.org",
            "code": "mg"
          }
        }
      ]
    }
  ],
  "reasonCode": [
    {
      "text": "High blood pressure"
    }
  ],
  "note": [
    {
      "text": "Take with food in the morning"
    }
  ],
  "informationSource": {
    "display": "Dr. Smith"
  }
}
```

---

### 1.2 Allergies

**Figma Source**: [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md) (7 screens + expansion spec)

#### FHIR R4 Resource
**Primary**: `AllergyIntolerance`
**Reference**: http://hl7.org/fhir/R4/allergyintolerance.html

#### Supabase Schema Mapping

| Figma Field | Supabase Column | FHIR Path | Notes |
|-------------|-----------------|-----------|-------|
| `name` | `allergies.allergen` | `AllergyIntolerance.code.text` | Required field |
| `category` | **MISSING** | `AllergyIntolerance.category` | **GAP**: Need to add |
| `reaction` | `allergies.reaction` | `AllergyIntolerance.reaction[0].manifestation[0].text` | e.g., "Hives", "Rash" |
| `severity` | `allergies.severity` | `AllergyIntolerance.criticality` | **GAP**: Field exists in FHIR, missing in schema |
| `onsetDate` | **MISSING** | `AllergyIntolerance.onsetDateTime` | **GAP**: Need date framework |
| `details/notes` | `allergies.notes` | `AllergyIntolerance.note[0].text` | Free-form notes |
| `requiresEpiPen` | **MISSING** | Custom extension | **CRITICAL SAFETY FEATURE** |

#### Schema Gaps & Extensions

**🚨 CRITICAL GAPS** (Figma has, Supabase missing):

1. **Category** (Medication / Environmental / Food / Insect & Animal)
   - **Priority**: HIGH - Core classification feature in Figma
   - Maps to FHIR: `AllergyIntolerance.category` (medication, food, environment, biologic)

2. **Severity** (Mild / Moderate / Severe / Life-Threatening)
   - **Priority**: HIGH - Clinical decision support
   - Maps to FHIR: `AllergyIntolerance.criticality` (low, high, unable-to-assess)

3. **Onset Date** (Date OR Age framework)
   - **Priority**: MEDIUM - Useful for tracking allergy history
   - Maps to FHIR: `AllergyIntolerance.onsetDateTime` or `onsetAge`

4. **Requires EpiPen** (Boolean toggle for life-threatening allergies)
   - **Priority**: CRITICAL - Patient safety feature
   - Maps to FHIR: Custom extension (no standard FHIR field)

#### Recommended Schema Extensions

```sql
-- Extend allergies table with Figma features
ALTER TABLE allergies
  ADD COLUMN category TEXT, -- 'medication', 'environmental', 'food', 'insect_animal'
  ADD COLUMN severity TEXT, -- 'mild', 'moderate', 'severe', 'life_threatening'
  ADD COLUMN onset_date DATE,
  ADD COLUMN onset_age INTEGER, -- Alternative to date
  ADD COLUMN onset_precision TEXT, -- 'year', 'month', 'day'
  ADD COLUMN requires_epipen BOOLEAN DEFAULT FALSE, -- CRITICAL SAFETY
  ADD COLUMN verification_status TEXT DEFAULT 'unconfirmed'; -- FHIR requirement

-- Allergy-Document associations
CREATE TABLE allergy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allergy_id UUID REFERENCES allergies(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(allergy_id, document_id)
);

-- Allergy vocabularies
CREATE TABLE allergy_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'allergen_name', 'reaction_type', 'category'
  value TEXT NOT NULL,
  display_text TEXT,
  snomed_code TEXT, -- For allergen names
  sort_order INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(type, value)
);
```

#### FHIR Export Example

```json
{
  "resourceType": "AllergyIntolerance",
  "id": "allergy-789",
  "clinicalStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
        "code": "active"
      }
    ]
  },
  "verificationStatus": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
        "code": "unconfirmed"
      }
    ]
  },
  "category": ["medication"],
  "criticality": "high",
  "code": {
    "text": "Penicillin",
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "373270004",
        "display": "Penicillin"
      }
    ]
  },
  "patient": {
    "reference": "Patient/patient-456"
  },
  "onsetAge": {
    "value": 15,
    "unit": "years",
    "system": "http://unitsofmeasure.org",
    "code": "a"
  },
  "reaction": [
    {
      "manifestation": [
        {
          "text": "Anaphylaxis"
        }
      ],
      "severity": "severe"
    }
  ],
  "note": [
    {
      "text": "Requires EpiPen - life-threatening allergy"
    }
  ],
  "extension": [
    {
      "url": "http://arkpass.com/fhir/StructureDefinition/requires-epipen",
      "valueBoolean": true
    }
  ]
}
```

---

### 1.3 Conditions

**Figma Source**: [CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md) (7 screens)

#### FHIR R4 Resource
**Primary**: `Condition`
**Reference**: http://hl7.org/fhir/R4/condition.html

#### Supabase Schema Mapping

| Figma Field | Supabase Column | FHIR Path | Notes |
|-------------|-----------------|-----------|-------|
| `name` | `conditions.name` | `Condition.code.text` | Required field |
| `status` | `conditions.status` | `Condition.clinicalStatus.coding[0].code` | `active`, `resolved`, etc. |
| `tags` | `conditions.tags` | `Condition.category` | Array of categories |
| `startDate` | `conditions.start_date` | `Condition.onsetDateTime` | Date OR Age framework |
| `endDate` | `conditions.end_date` | `Condition.abatementDateTime` | Optional |
| `severity` | `conditions.severity` | `Condition.severity.coding[0].code` | `mild`, `moderate`, `severe` |
| `notes` | `conditions.notes` | `Condition.note[0].text` | Free-form notes |

#### Schema Gaps & Extensions

**✅ Already Compatible**:
- Core fields well-aligned with FHIR
- Tags array matches FHIR category concept
- Status/severity tracking supported

**⚠️ Minor Enhancements Needed**:
1. **Document Associations** - Add junction table
2. **Diagnosis Date vs. First Symptoms Date** - Figma has dual-date framework
3. **Vocabularies** - SNOMED codes for condition names

#### Recommended Schema Extensions

```sql
-- Condition-Document associations
CREATE TABLE condition_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(condition_id, document_id)
);

-- Optional: Track both diagnosis date and symptom onset
ALTER TABLE conditions
  ADD COLUMN onset_type TEXT, -- 'date', 'age', 'unknown'
  ADD COLUMN onset_age INTEGER,
  ADD COLUMN first_symptoms_date DATE, -- Different from diagnosis date
  ADD COLUMN diagnosed_by TEXT; -- Provider name
```

---

### 1.4 Immunizations

**Figma Source**: [IMMUNIZATIONS_SCREENS_SPECS.md](IMMUNIZATIONS_SCREENS_SPECS.md) (7 screens)

#### FHIR R4 Resource
**Primary**: `Immunization`
**Reference**: http://hl7.org/fhir/R4/immunization.html

#### Supabase Schema Mapping

| Figma Field | Supabase Column | FHIR Path | Notes |
|-------------|-----------------|-----------|-------|
| `name` | `immunizations.name` | `Immunization.vaccineCode.text` | Required field |
| `date` | `immunizations.date` | `Immunization.occurrenceDateTime` | Date administered |
| `location` | `immunizations.location` | `Immunization.location.display` | Where administered |
| `complications` | `immunizations.complications` | `Immunization.reaction[0].detail.display` | Adverse reactions |
| `batch` | `immunizations.batch` | `Immunization.lotNumber` | Lot/batch number |

#### Schema Gaps & Extensions

**✅ Already Compatible**: Schema well-aligned with FHIR

**⚠️ Enhancements**:
1. **Document Associations** - Add junction table
2. **Vaccine Codes** - CVX/NDC coding for vaccines
3. **Dose Number** - Track which dose in series (1st, 2nd, booster)

#### Recommended Schema Extensions

```sql
-- Immunization-Document associations
CREATE TABLE immunization_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immunization_id UUID REFERENCES immunizations(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(immunization_id, document_id)
);

-- Track vaccine series
ALTER TABLE immunizations
  ADD COLUMN dose_number INTEGER, -- 1, 2, 3, etc.
  ADD COLUMN series_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN vaccine_cvx_code TEXT, -- CDC CVX code
  ADD COLUMN manufacturer TEXT,
  ADD COLUMN expiration_date DATE;
```

---

### 1.5 Surgeries

**Figma Source**: [SURGERIES_SCREENS_SPECS.md](SURGERIES_SCREENS_SPECS.md) (9 screens)

#### FHIR R4 Resource
**Primary**: `Procedure`
**Reference**: http://hl7.org/fhir/R4/procedure.html

#### Supabase Schema Mapping

| Figma Field | Supabase Column | FHIR Path | Notes |
|-------------|-----------------|-----------|-------|
| `name` | `surgeries.name` | `Procedure.code.text` | Required field |
| `date` | `surgeries.date` | `Procedure.performedDateTime` | Date of surgery |
| `description` | `surgeries.description` | `Procedure.note[0].text` | Details |
| `complications` | `surgeries.complications` | `Procedure.complication[0].text` | Post-op issues |
| `surgeon` | `surgeries.surgeon` | `Procedure.performer[0].actor.display` | Surgeon name |

#### Schema Gaps & Extensions

**✅ Already Compatible**: Core fields well-aligned

**⚠️ Enhancements**:
1. **Document Associations** - Add junction table
2. **Hospital/Facility** - Where surgery performed
3. **Outcome Status** - Success, complications, etc.

#### Recommended Schema Extensions

```sql
-- Surgery-Document associations
CREATE TABLE surgery_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surgery_id UUID REFERENCES surgeries(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(surgery_id, document_id)
);

-- Additional surgery details
ALTER TABLE surgeries
  ADD COLUMN facility TEXT, -- Hospital/clinic name
  ADD COLUMN outcome_status TEXT, -- 'successful', 'complications', 'failed'
  ADD COLUMN anesthesia_type TEXT,
  ADD COLUMN recovery_notes TEXT;
```

---

### 1.6 Supplements

**Figma Source**: [SUPPLEMENTS_SCREENS_SPECS.md](SUPPLEMENTS_SCREENS_SPECS.md) (7 screens)

#### FHIR R4 Resource
**Primary**: `MedicationStatement` (supplements are non-prescription medications)
**Alternative**: Use `category` to distinguish from medications
**Reference**: http://hl7.org/fhir/R4/medicationstatement.html

#### Supabase Schema Mapping

**🚨 CRITICAL GAP**: Supabase schema does NOT have `supplements` table!

**Options**:
1. **Option A**: Add `supplements` table (separate from medications)
2. **Option B**: Merge into `medications` with `type` column ('medication' vs 'supplement')
3. **Option C**: Use `medications` table with `category` field

**Recommendation**: **Option A** - Separate table for clarity

#### Recommended Schema

```sql
-- New supplements table (mirrors medications structure)
CREATE TABLE supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  indication TEXT, -- Why taking supplement
  status TEXT, -- 'active', 'stopped'
  start_date DATE,
  end_date DATE,
  brand TEXT, -- Brand name (e.g., "Nature Made", "Centrum")
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplement-Document associations
CREATE TABLE supplement_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplement_id UUID REFERENCES supplements(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supplement_id, document_id)
);
```

---

## 2. Clinical Documentation

### 2.1 My Documents

**Figma Source**: [MY_DOCUMENTS_SCREENS_SPECS.md](MY_DOCUMENTS_SCREENS_SPECS.md) (11/12 screens)

#### FHIR R4 Resource
**Primary**: `DocumentReference`
**Reference**: http://hl7.org/fhir/R4/documentreference.html

#### Supabase Schema Mapping

| Figma Field | Supabase Column | FHIR Path | Notes |
|-------------|-----------------|-----------|-------|
| `name` | **MISSING** | `DocumentReference.description` | **GAP**: Only `type` exists |
| `folderId` | **MISSING** | Custom extension | **GAP**: 5 pre-defined folders |
| `system` | **MISSING** | `DocumentReference.category` | **GAP**: Body system classification |
| `date` | `documents.date` | `DocumentReference.date` | Document date |
| `tags` | **MISSING** | `DocumentReference.securityLabel` | **GAP**: Multi-tag system |
| `isPrivate` | **MISSING** | `DocumentReference.securityLabel` | **GAP**: Privacy control |
| `isHighlighted` | **MISSING** | Custom extension | **GAP**: Starred/favorite |
| `fileUrl` | `documents.file_url` | `DocumentReference.content[0].attachment.url` | File storage URL |
| `type` | `documents.type` | `DocumentReference.type.text` | Document type |
| `description` | `documents.description` | `DocumentReference.description` | Free-text description |

#### Schema Gaps & Extensions

**🚨 MAJOR GAPS** - Figma has rich document management, Supabase schema is minimal:

1. **Document Name** - Only `type` and `description` exist, no `name` field
2. **Pre-defined Folders** - No folder system (Prescriptions, Lab Results, Imaging, Consult, Other)
3. **Body System Classification** - No `system` field (Cardiac, Endocrine, etc.)
4. **Tags** - No tag array support
5. **Privacy Controls** - No `is_private` toggle
6. **Highlighted/Starred** - No favorite system
7. **Document Associations** - No links to allergies, medications, etc.
8. **Browse/Inbox Toggle** - No workflow state tracking

#### Recommended Schema Extensions

```sql
-- Extend documents table
ALTER TABLE documents
  ADD COLUMN name TEXT NOT NULL, -- Document name (separate from type)
  ADD COLUMN folder_id UUID REFERENCES document_folders(id),
  ADD COLUMN system TEXT, -- Body system: 'cardiac', 'endocrine', etc.
  ADD COLUMN tags TEXT[],
  ADD COLUMN is_private BOOLEAN DEFAULT FALSE,
  ADD COLUMN is_highlighted BOOLEAN DEFAULT FALSE,
  ADD COLUMN file_type TEXT, -- 'image', 'pdf', 'audio', 'word', 'other'
  ADD COLUMN file_size_bytes INTEGER,
  ADD COLUMN uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN inbox_status TEXT DEFAULT 'processed'; -- 'inbox', 'processed'

-- Pre-defined document folders
CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'Prescriptions', 'Lab Results', 'Imaging', 'Consult', 'Other'
  icon TEXT,
  sort_order INTEGER,
  is_system_folder BOOLEAN DEFAULT TRUE, -- Pre-defined vs. user-created
  patient_id UUID REFERENCES user_profiles(user_id), -- NULL for system folders
  UNIQUE(name, patient_id) -- System folders unique globally, user folders per patient
);

-- Insert pre-defined folders
INSERT INTO document_folders (name, icon, sort_order, is_system_folder, patient_id) VALUES
  ('Prescriptions', 'folder', 1, TRUE, NULL),
  ('Lab Results', 'folder', 2, TRUE, NULL),
  ('Imaging', 'folder', 3, TRUE, NULL),
  ('Consult', 'folder', 4, TRUE, NULL),
  ('Other', 'folder', 5, TRUE, NULL);

-- Document associations (link documents to PHR records)
CREATE TABLE document_associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'allergy', 'medication', 'surgery', 'immunization', 'supplement', 'condition'
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, entity_type, entity_id)
);

-- Indexes for performance
CREATE INDEX idx_documents_folder ON documents(folder_id);
CREATE INDEX idx_documents_system ON documents(system);
CREATE INDEX idx_documents_patient_inbox ON documents(patient_id, inbox_status);
CREATE INDEX idx_document_associations_entity ON document_associations(entity_type, entity_id);
```

#### FHIR Export Example

```json
{
  "resourceType": "DocumentReference",
  "id": "doc-123",
  "status": "current",
  "type": {
    "text": "Lab Results"
  },
  "category": [
    {
      "text": "Cardiac"
    }
  ],
  "subject": {
    "reference": "Patient/patient-456"
  },
  "date": "2024-10-15",
  "description": "Cholesterol test results from Dr. Smith",
  "securityLabel": [
    {
      "text": "private"
    },
    {
      "text": "highlighted"
    }
  ],
  "content": [
    {
      "attachment": {
        "contentType": "application/pdf",
        "url": "https://storage.arkpass.com/documents/doc-123.pdf",
        "size": 245760,
        "title": "Cholesterol Test - Oct 2024"
      }
    }
  ],
  "extension": [
    {
      "url": "http://arkpass.com/fhir/StructureDefinition/document-folder",
      "valueString": "Lab Results"
    },
    {
      "url": "http://arkpass.com/fhir/StructureDefinition/document-tags",
      "valueString": ["Annual Checkup", "Cardiac"]
    }
  ]
}
```

---

### 2.2 Visit Notes

**Figma Source**: Deferred to Phase 2 (too complicated for MVP)
**Supabase Table**: `visit_notes` (exists but minimal fields)

#### FHIR R4 Resource
**Primary**: `Encounter` + `DocumentReference`
**Reference**: http://hl7.org/fhir/R4/encounter.html

#### Current Schema vs. Needs

**Current Supabase Schema**:
```sql
CREATE TABLE visit_notes (
  id uuid PRIMARY KEY,
  patient_id uuid,
  date date,
  provider_name text,
  notes text,
  attachments_url text, -- Single URL, not flexible
  created_at timestamptz,
  updated_at timestamptz
);
```

**Gaps for Future**:
- No visit type (Office, ER, Hospital, Telehealth)
- No chief complaint
- No diagnosis codes
- No structured sections (HPI, Assessment, Plan)
- Attachments as single URL instead of document references

**Recommendation**: Keep minimal for MVP, enhance in Phase 2 with Encounter resource

---

### 2.3 Lab Results

**Figma Source**: Part of "My Documents" (Lab Results folder)
**Supabase Table**: `lab_results` (exists but minimal)

#### FHIR R4 Resource
**Primary**: `Observation` (for individual results) + `DiagnosticReport` (for full report)
**Reference**: http://hl7.org/fhir/R4/observation.html

#### Current Schema vs. Needs

**Current Supabase Schema**:
```sql
CREATE TABLE lab_results (
  id uuid PRIMARY KEY,
  patient_id uuid,
  test_type text,
  result_value text,
  result_unit text,
  date date,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
);
```

**Gaps**:
- No ordering provider
- No normal ranges (critical for patient understanding)
- No status (Normal, Abnormal, Critical)
- No LOINC codes for test types
- No link to document attachments

#### Recommended Schema Extensions

```sql
-- Extend lab_results
ALTER TABLE lab_results
  ADD COLUMN test_name TEXT, -- Separate from test_type
  ADD COLUMN ordering_provider TEXT,
  ADD COLUMN performing_lab TEXT,
  ADD COLUMN normal_range_min DECIMAL,
  ADD COLUMN normal_range_max DECIMAL,
  ADD COLUMN normal_range_text TEXT, -- "70-100 mg/dL"
  ADD COLUMN status TEXT, -- 'normal', 'abnormal', 'critical'
  ADD COLUMN interpretation TEXT, -- 'low', 'normal', 'high'
  ADD COLUMN loinc_code TEXT, -- Standard test code
  ADD COLUMN specimen_type TEXT; -- Blood, Urine, etc.

-- Lab result - Document associations
CREATE TABLE lab_result_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_result_id UUID REFERENCES lab_results(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lab_result_id, document_id)
);
```

---

## 3. Patient Information

### 3.1 Personal Information

**Figma Source**: [PERSONAL_INFORMATION_SCREENS_SPECS.md](PERSONAL_INFORMATION_SCREENS_SPECS.md) (15 screens)

#### FHIR R4 Resource
**Primary**: `Patient`
**Reference**: http://hl7.org/fhir/R4/patient.html

#### Schema Gaps

**🚨 CRITICAL GAP**: Supabase has `user_profiles` but it's minimal (role, name, DOB, contact_phone, specialty)

**Figma has extensive personal information**:
- Demographics (name, DOB, gender, preferred language)
- Contact (phone, email, address)
- Emergency contacts (multiple)
- Insurance information
- Primary care provider
- Pharmacy preferences
- Height, weight, blood type
- Organ donor status
- Advanced directives

**Recommendation**: Create dedicated `patient_profiles` table with full demographics

#### Recommended Schema

```sql
-- Extend user_profiles or create patient_demographics
CREATE TABLE patient_demographics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE UNIQUE,

  -- Demographics
  legal_first_name TEXT,
  legal_last_name TEXT,
  preferred_name TEXT,
  date_of_birth DATE,
  biological_sex TEXT, -- 'male', 'female', 'intersex'
  gender_identity TEXT, -- 'male', 'female', 'non-binary', 'other', 'prefer_not_to_say'
  preferred_pronouns TEXT,
  preferred_language TEXT,

  -- Contact
  primary_phone TEXT,
  secondary_phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,

  -- Health basics
  height_cm DECIMAL,
  weight_kg DECIMAL,
  blood_type TEXT,

  -- Providers
  primary_care_provider TEXT,
  primary_pharmacy TEXT,

  -- Legal
  organ_donor BOOLEAN,
  has_advance_directive BOOLEAN,
  advance_directive_location TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relationship TEXT,
  phone_number TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insurance information
CREATE TABLE patient_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  insurance_provider TEXT,
  policy_number TEXT,
  group_number TEXT,
  subscriber_name TEXT,
  relationship_to_subscriber TEXT,
  effective_date DATE,
  expiration_date DATE,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.2 Social History

**Figma Source**: [SOCIAL_HISTORY_SCREENS_SPECS.md](SOCIAL_HISTORY_SCREENS_SPECS.md) (8 screens)

#### FHIR R4 Resource
**Primary**: `Observation` (with LOINC codes for social history)
**Reference**: http://hl7.org/fhir/R4/observation.html

#### Supabase Schema Analysis

**✅ Schema is well-aligned**: Existing `social_history` table has comprehensive fields

**Minor Enhancements**:
- Add document associations
- Add LOINC codes for standard reporting

```sql
-- Social history - Document associations
CREATE TABLE social_history_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_history_id UUID REFERENCES social_history(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(social_history_id, document_id)
);

-- Add LOINC codes for standard fields
ALTER TABLE social_history
  ADD COLUMN smoking_status_loinc TEXT DEFAULT '72166-2', -- LOINC for tobacco use
  ADD COLUMN alcohol_use_loinc TEXT DEFAULT '11331-6', -- LOINC for alcohol use
  ADD COLUMN drug_use_loinc TEXT DEFAULT '11343-1'; -- LOINC for drug use
```

---

### 3.3 Family History

**Figma Source**: [FAMILY_HISTORY_SCREENS_SPECS.md](FAMILY_HISTORY_SCREENS_SPECS.md) (3 screens)

#### FHIR R4 Resource
**Primary**: `FamilyMemberHistory`
**Reference**: http://hl7.org/fhir/R4/familymemberhistory.html

#### Supabase Schema Analysis

**✅ Schema is adequate**: Existing `family_history` table covers basics

**Minor Enhancements**:
- Add age at diagnosis for relatives
- Add multiple conditions per relative (current schema has single `medical_conditions` text field)

```sql
-- Family history - Document associations
CREATE TABLE family_history_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_history_id UUID REFERENCES family_history(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_history_id, document_id)
);

-- Support multiple conditions per relative
CREATE TABLE family_history_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_history_id UUID REFERENCES family_history(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  age_at_diagnosis INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. System Features

### 4.1 Access Grants

**Figma Source**: "Share Your Health Record" button on all list screens
**Supabase Table**: `access_grants` (well-designed)

#### FHIR R4 Resource
**Primary**: `Consent`
**Reference**: http://hl7.org/fhir/R4/consent.html

#### Schema Analysis

**✅ Schema is FHIR-aligned and comprehensive**

**Enhancement**: Add scope control (which sections are shared)

```sql
-- Access grant scopes (granular sharing control)
CREATE TABLE access_grant_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_grant_id UUID REFERENCES access_grants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'medications', 'allergies', 'all', etc.
  can_read BOOLEAN DEFAULT TRUE,
  can_write BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(access_grant_id, entity_type)
);
```

---

### 4.2 Audit Logs

**Supabase Table**: `audit_logs` (excellent schema)

#### FHIR R4 Resource
**Primary**: `AuditEvent`
**Reference**: http://hl7.org/fhir/R4/auditevent.html

#### Schema Analysis

**✅ Schema is HIPAA-compliant and FHIR-aligned**

**No changes needed** - This is one of the best-designed tables in the schema.

---

### 4.3 Notifications

**Supabase Table**: `notifications`

#### Schema Analysis

**✅ Basic schema is adequate**

**Enhancement**: Add notification preferences

```sql
-- Notification preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE UNIQUE,
  medication_reminders BOOLEAN DEFAULT TRUE,
  appointment_reminders BOOLEAN DEFAULT TRUE,
  access_granted_alerts BOOLEAN DEFAULT TRUE,
  access_expiring_alerts BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Schema Gaps & Extensions Summary

### 🚨 CRITICAL GAPS (Must Fix for MVP)

1. **Allergies Table** - Missing critical safety fields:
   - `category` (medication, food, environmental, insect)
   - `severity` (mild, moderate, severe, life-threatening)
   - `requires_epipen` (boolean - patient safety)

2. **Documents Table** - Missing entire feature set:
   - `name` field (only `type` exists)
   - Pre-defined folder system (5 folders)
   - `system` (body system classification)
   - `tags` array
   - `is_private` / `is_highlighted` toggles
   - Document associations (link to PHR records)

3. **Supplements Table** - DOES NOT EXIST:
   - Entire table missing from schema
   - 7 Figma screens have no backend support

4. **Personal Information** - Minimal demographics:
   - Emergency contacts missing
   - Insurance information missing
   - Extended demographics missing (height, weight, blood type, etc.)

### ⚠️ MEDIUM PRIORITY GAPS (Phase 1.5)

5. **Lab Results** - Missing clinical context:
   - Normal ranges (min/max)
   - Status interpretation (normal, abnormal, critical)
   - LOINC codes
   - Link to ordering provider

6. **Document Associations** - No junction tables:
   - medication_documents
   - allergy_documents
   - condition_documents
   - surgery_documents
   - immunization_documents
   - supplement_documents

7. **Vocabulary Tables** - No dropdown support:
   - medication_vocabularies
   - allergy_vocabularies
   - condition_vocabularies

### ✅ WELL-DESIGNED (No Changes Needed)

- `access_grants` - Excellent FHIR alignment
- `audit_logs` - HIPAA-compliant and comprehensive
- `medications` - Core fields well-structured
- `conditions` - Good FHIR mapping
- `immunizations` - Adequate for MVP

---

## 6. Implementation Priorities

### Phase 1: Critical Fixes (MVP Blockers)

**Goal**: Make Figma designs implementable

1. **Extend Allergies Table** (1-2 hours)
   ```sql
   ALTER TABLE allergies ADD COLUMN category TEXT;
   ALTER TABLE allergies ADD COLUMN severity TEXT;
   ALTER TABLE allergies ADD COLUMN requires_epipen BOOLEAN DEFAULT FALSE;
   ```

2. **Create Supplements Table** (2-3 hours)
   - Mirror medications structure
   - Add supplement_documents junction table

3. **Extend Documents Table** (3-4 hours)
   - Add `name`, `folder_id`, `system`, `tags`, `is_private`, `is_highlighted`
   - Create `document_folders` table with 5 pre-defined folders
   - Create `document_associations` junction table

4. **Create Patient Demographics** (4-6 hours)
   - `patient_demographics` table
   - `emergency_contacts` table
   - `patient_insurance` table

**Estimated Total**: 10-15 hours

### Phase 2: Document Associations (High Value)

**Goal**: Enable + icon workflow (link documents to PHR records)

5. **Create Junction Tables** (4-6 hours)
   - medication_documents
   - allergy_documents
   - condition_documents
   - surgery_documents
   - immunization_documents
   - supplement_documents
   - lab_result_documents
   - social_history_documents
   - family_history_documents

**Estimated Total**: 4-6 hours

### Phase 3: Vocabulary Support (UX Enhancement)

**Goal**: Enable smart dropdowns with autocomplete

6. **Create Vocabulary Tables** (6-8 hours)
   - medication_vocabularies (RxNorm integration)
   - allergy_vocabularies (SNOMED integration)
   - condition_vocabularies (SNOMED integration)
   - Seed with common values

**Estimated Total**: 6-8 hours

### Phase 4: Lab Results Enhancement (Clinical Value)

**Goal**: Provide actionable lab result insights

7. **Extend Lab Results** (3-4 hours)
   - Add normal ranges, status, interpretation
   - Add LOINC codes
   - Link to documents

**Estimated Total**: 3-4 hours

---

## 7. FHIR Export Strategy

### Export Formats

1. **FHIR Bundle** (JSON)
   - Full PHR as FHIR Bundle resource
   - Compliant with FHIR R4 standard
   - Importable to other EHR systems

2. **PDF** (Human-readable)
   - Formatted patient health summary
   - Printable for appointments
   - Includes document thumbnails/links

3. **CSV** (Spreadsheet)
   - Medications list
   - Allergies list
   - Lab results
   - Useful for personal tracking

### FHIR Bundle Structure

```json
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    { "resource": { "resourceType": "Patient", ... } },
    { "resource": { "resourceType": "MedicationStatement", ... } },
    { "resource": { "resourceType": "AllergyIntolerance", ... } },
    { "resource": { "resourceType": "Condition", ... } },
    { "resource": { "resourceType": "Immunization", ... } },
    { "resource": { "resourceType": "Procedure", ... } },
    { "resource": { "resourceType": "DocumentReference", ... } },
    { "resource": { "resourceType": "Observation", ... } },
    { "resource": { "resourceType": "FamilyMemberHistory", ... } }
  ]
}
```

---

## 8. Next Steps

### Immediate Actions

1. **Review this mapping** with team/stakeholders
2. **Prioritize schema extensions** (Phase 1 critical for MVP)
3. **Create migration scripts** for Supabase schema updates
4. **Test FHIR export** with sample data
5. **Document API endpoints** for CRUD operations

### Documentation Needed

- [ ] SQL migration scripts for each phase
- [ ] FHIR export implementation guide
- [ ] API endpoint specifications (REST + GraphQL)
- [ ] RLS (Row-Level Security) policies for all new tables
- [ ] Data validation rules and constraints

---

## Appendix A: Complete Schema Extension Script

See [FHIR_SCHEMA_MIGRATIONS.sql](FHIR_SCHEMA_MIGRATIONS.sql) (to be created)

## Appendix B: FHIR Code Systems

- **LOINC**: Lab tests, observations (https://loinc.org)
- **SNOMED CT**: Clinical terms, conditions, procedures (https://www.snomed.org)
- **RxNorm**: Medications (https://www.nlm.nih.gov/research/umls/rxnorm)
- **CVX**: Vaccines (https://www2.cdc.gov/vaccines/iis/iisstandards/vaccines.asp)
- **UCUM**: Units of measure (https://ucum.org)

---

**Document Status**: Draft v1.0
**Last Updated**: 2025-10-25
**Next Review**: After Phase 1 schema extensions complete
