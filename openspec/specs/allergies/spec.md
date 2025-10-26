# Allergies and Sensitivities Management

## Purpose

Enable patients to track allergic reactions and sensitivities to medications, foods, environmental factors, and contact allergens. Support critical patient safety features including EpiPen tracking and severity classification for life-threatening allergies.

## Requirements

### Requirement: Allergy Record Creation

The system SHALL provide Quick Add and Standard Add methods for creating allergy records with complete clinical classification.

#### Scenario: Quick Add allergy
- **WHEN** user enters allergen name in Quick Add input
- **THEN** create minimal record with name only
- **AND** flag record as incomplete (requires category, type, severity)
- **AND** show in appropriate category section once edited

#### Scenario: Standard Add allergy with full details
- **WHEN** user taps "+ Add with details" button
- **THEN** open Add Allergy form with all fields
- **AND** require Name, Category, and Type fields before saving
- **AND** recommend Severity field for patient safety
- **AND** require EpiPen field if Severity = "Severe"

#### Scenario: Quick Add duplicate allergy
- **WHEN** user attempts to Quick Add allergen that already exists
- **THEN** show warning "This allergy already exists"
- **AND** allow user to edit or cancel

### Requirement: Allergy Classification Fields

The system SHALL capture clinical classification including Category, Type, and Severity with appropriate validation.

#### Scenario: Select allergy category
- **WHEN** user selects category
- **THEN** provide dropdown/radio options:
  - Medication
  - Food
  - Seasonal
  - Skin/Contact
  - Environmental
- **AND** require category selection before save
- **AND** determine symptom list based on category

#### Scenario: Distinguish allergy vs sensitivity
- **WHEN** user selects type
- **THEN** provide radio button options:
  - Allergy (immune system response)
  - Sensitivity (intolerance/adverse reaction)
- **AND** require type selection before save
- **AND** adjust severity importance based on type

#### Scenario: Classify severity for patient safety
- **WHEN** user selects severity
- **THEN** provide radio button options:
  - Severe (anaphylaxis risk, life-threatening)
  - Not Severe (mild to moderate reactions)
- **AND** show warning icon for Severe classification
- **AND** make EpiPen field required if Severe selected

#### Scenario: Track EpiPen prescription for severe allergies
- **WHEN** user selects Severity = "Severe"
- **THEN** show EpiPen field with Yes/No options
- **AND** require EpiPen field to be filled
- **AND** display EpiPen status prominently in view mode

### Requirement: Category-Specific Symptom Tracking

The system SHALL provide multi-select symptom lists tailored to allergy category and severity.

#### Scenario: Select symptoms for severe medication/food allergy
- **WHEN** Category = "Medication" OR "Food" AND Severity = "Severe"
- **THEN** display severe symptom checkboxes:
  - Anaphylaxis
  - Difficulty breathing
  - Swelling of face/throat/tongue
  - Swelling of lips
  - Tightness in chest
  - Rapid heartbeat
  - Dizziness or fainting
  - Severe drop in blood pressure
  - Nausea or vomiting
  - Abdominal pain/cramping
  - Other (with free-text input)
- **AND** allow multiple selections
- **AND** show emergency warning banner

#### Scenario: Select symptoms for non-severe medication/food allergy
- **WHEN** Category = "Medication" OR "Food" AND Severity = "Not Severe"
- **THEN** display non-severe symptom checkboxes:
  - Hives
  - Itchiness
  - Rash
  - Mild swelling
  - Runny nose
  - Watery eyes
  - Mild nausea
  - Headache
  - Other (with free-text input)

#### Scenario: Select symptoms for seasonal allergy
- **WHEN** Category = "Seasonal"
- **THEN** display seasonal symptom checkboxes:
  - Runny nose
  - Itchy eyes
  - Itchy nose
  - Cough
  - Sneezing
  - Congestion
  - Watery eyes
  - Post-nasal drip
  - Sinus pressure
  - Fatigue
  - Other (with free-text input)

#### Scenario: Select symptoms for skin/contact allergy
- **WHEN** Category = "Skin/Contact"
- **THEN** display skin symptom checkboxes:
  - Rash
  - Itchiness
  - Redness
  - Swelling
  - Blisters
  - Dry, cracked skin
  - Burning sensation
  - Hives
  - Other (with free-text input)

#### Scenario: Select symptoms for environmental allergy
- **WHEN** Category = "Environmental"
- **THEN** display environmental symptom checkboxes:
  - Runny nose
  - Itchy eyes
  - Sneezing
  - Cough
  - Wheezing
  - Shortness of breath
  - Watery eyes
  - Congestion
  - Skin rash
  - Other (with free-text input)

### Requirement: Onset Date Tracking

The system SHALL capture when the allergy first occurred using dual-mode date input.

#### Scenario: Enter onset date
- **WHEN** user taps Onset field
- **THEN** open dual-mode date input (Date OR Age mode)
- **AND** support Date mode with calendar picker
- **AND** support Age mode with "I was X years old"
- **AND** validate date not in future
- **AND** validate date not before patient birth date

### Requirement: Progressive Disclosure

The system SHALL hide advanced fields by default and reveal via "Show more" interaction.

#### Scenario: Collapsed view shows essential fields
- **WHEN** viewing or editing allergy in collapsed state
- **THEN** display: Name, Category, Type, Severity, EpiPen (if severe)
- **AND** hide: Onset, Symptoms, Details
- **AND** show "Show more" link

#### Scenario: Expanded view shows all fields
- **WHEN** user taps "Show more" link
- **THEN** reveal: Onset, Symptoms, Details fields
- **AND** replace "Show more" with "Show less" link

### Requirement: Categorized List Display

The system SHALL display allergies grouped by category with appropriate visual hierarchy.

#### Scenario: Display medication allergies section
- **WHEN** viewing allergies list
- **THEN** show "MEDICATION ALLERGIES" section header
- **AND** list all medication allergies in cards
- **AND** show empty state "No medication allergies" if none exist

#### Scenario: Display other allergies section
- **WHEN** viewing allergies list
- **THEN** show "ENVIRONMENTAL/SEASONAL/SKIN/OTHER" section header
- **AND** list non-medication allergies in cards
- **AND** show category tag on each card (Food, Seasonal, etc.)

#### Scenario: Highlight severe allergies
- **WHEN** displaying allergy card with Severity = "Severe"
- **THEN** show warning icon (⚠️) on card
- **AND** show EpiPen indicator if prescribed
- **AND** use visual emphasis (bold, red accent)

### Requirement: Associated Documents

The system SHALL allow attaching medical documents to allergy records.

#### Scenario: Add document attachment
- **WHEN** user taps "+ Add Documents" in allergy form
- **THEN** open document selection interface
- **AND** allow selection from existing documents
- **AND** allow photo capture for new documents
- **AND** create association between allergy and document

#### Scenario: Display document associations
- **WHEN** viewing allergy record
- **THEN** show DOCUMENTS section
- **AND** display document names with delete icons in edit mode

#### Scenario: Empty documents state
- **WHEN** no documents are associated
- **THEN** show "No Documents" placeholder
- **AND** show "+ Add Documents" button

### Requirement: Allergy Editing and Deletion

The system SHALL allow editing all allergy fields with validation and safe deletion.

#### Scenario: Edit existing allergy
- **WHEN** user taps "Edit" in View screen
- **THEN** convert all fields to editable inputs
- **AND** preserve current values
- **AND** validate required fields (Name, Category, Type)
- **AND** validate conditional required fields (EpiPen if Severe)

#### Scenario: Delete allergy with confirmation
- **WHEN** user taps "Delete" button
- **THEN** show confirmation dialog "Delete this allergy?"
- **AND** if confirmed, soft delete record (set deleted_at)
- **AND** delete all associations (documents)
- **AND** return to list view

### Requirement: Share Health Record Integration

The system SHALL export allergies in FHIR AllergyIntolerance format.

#### Scenario: Export allergies in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all allergies in export
- **AND** format as FHIR AllergyIntolerance resources
- **AND** map ArkPass fields to FHIR:
  - Category → allergyintolerance.category
  - Type → allergyintolerance.type
  - Severity → allergyintolerance.criticality
  - Symptoms → allergyintolerance.reaction.manifestation
- **AND** use FHIR extensions for EpiPen field (no native FHIR equivalent)

## Data Model

### Database Schema

```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medication', 'food', 'seasonal', 'skin_contact', 'environmental')),
  type TEXT NOT NULL CHECK (type IN ('allergy', 'sensitivity')),

  -- Patient safety fields
  severity TEXT CHECK (severity IN ('severe', 'not_severe')),
  requires_epipen BOOLEAN DEFAULT FALSE,

  -- Symptoms (JSONB array of selected symptoms + other description)
  symptoms JSONB, -- { selectedSymptoms: string[], otherDescription?: string }

  -- Onset date (dual-mode JSONB)
  onset_raw JSONB,
  onset_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN (onset_raw->>'inputMode') = 'date'
        THEN (onset_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN (onset_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (onset_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  -- Display columns
  onset_display_pt TEXT,
  onset_display_pr TEXT,
  onset_display_active BOOLEAN DEFAULT TRUE,

  -- Free-text details
  details TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT, -- 'quick_add', 'standard_form', 'import'
  deleted_at TIMESTAMPTZ, -- Soft delete

  -- Constraints
  CONSTRAINT allergies_epipen_if_severe CHECK (
    (severity = 'severe' AND requires_epipen IS NOT NULL) OR
    (severity != 'severe' OR severity IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_allergies_patient ON allergies(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_allergies_category ON allergies(patient_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_allergies_severe ON allergies(patient_id) WHERE severity = 'severe' AND deleted_at IS NULL;
CREATE INDEX idx_allergies_computed_date ON allergies(onset_computed_date);

-- Junction table for document associations
CREATE TABLE allergy_documents (
  allergy_id UUID REFERENCES allergies(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (allergy_id, document_id)
);

-- Updated trigger
CREATE TRIGGER allergies_updated_at
  BEFORE UPDATE ON allergies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for ArkPass-specific fields
COMMENT ON COLUMN allergies.requires_epipen IS 'ArkPass-specific: Patient safety flag for life-threatening allergies (no native FHIR equivalent)';
COMMENT ON COLUMN allergies.symptoms IS 'Category-specific symptom arrays: severe_medication_food, nonSevere_medication_food, seasonal, skin_contact, environmental';
```

## UI Patterns

### Quick Add Pattern
- See [QUICK_ADD_PATTERN.md](/QUICK_ADD_PATTERN.md)
- Creates minimal record (name only)
- Flags as incomplete until category/type/severity added

### Dual-Mode Date Input
- See [DUAL_MODE_DATE_INPUT_COMPONENT.md](/DUAL_MODE_DATE_INPUT_COMPONENT.md)
- Onset field: Date OR Age mode

### Progressive Disclosure
- Collapsed: Name, Category, Type, Severity, EpiPen (if severe)
- Expanded: + Onset, Symptoms, Details

### Categorized Sections
- "MEDICATION ALLERGIES" section
- "ENVIRONMENTAL/SEASONAL/SKIN/OTHER" section
- Visual separation with headers

## FHIR Mapping (Export Only)

ArkPass schema is PRIMARY. FHIR R4 mapping at export time.

### AllergyIntolerance Resource

```json
{
  "resourceType": "AllergyIntolerance",
  "id": "{uuid}",
  "clinicalStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
      "code": "active"
    }]
  },
  "type": "{type}",
  "category": ["{category}"],
  "criticality": "{severity === 'severe' ? 'high' : 'low'}",
  "code": {
    "text": "{name}"
  },
  "patient": {
    "reference": "Patient/{patient_id}"
  },
  "onsetDateTime": "{onset_computed_date}",
  "reaction": [{
    "manifestation": [{
      "text": "{symptoms.selectedSymptoms.join(', ')}"
    }],
    "severity": "{severity === 'severe' ? 'severe' : 'mild'}"
  }],
  "extension": [{
    "url": "http://arkpass.com/fhir/StructureDefinition/requires-epipen",
    "valueBoolean": "{requires_epipen}"
  }]
}
```

**FHIR Mapping Notes**:
- `requires_epipen` → Custom FHIR extension (no native field)
- `symptoms` → reaction.manifestation (array of text)
- Category-specific symptom lists → Flattened to text array
- `onset_raw` (dual-mode structure) → Not exported, use computed date only

## Figma References

**Total Screens**: 7

| Node ID | Screen | Purpose |
|---------|--------|---------|
| 1483:8437 | Allergies List | Categorized list with Quick Add |
| 1483:8438 | View Allergy (collapsed) | Essential fields only |
| 1483:8439 | View Allergy (expanded) | All fields visible |
| 1483:8440 | Edit Allergy (collapsed) | Edit essential fields |
| 1483:8441 | Edit Allergy (expanded) | Edit all fields |
| 1483:8442 | Add Allergy (collapsed) | Create with essential fields |
| 1483:8443 | Add Allergy (expanded) | Create with all fields |

## Dependencies

- **Dual-Mode Date Input Component**: Onset field
- **Quick Add Pattern**: List view rapid entry
- **Documents Feature**: Attachment support
- **Patient Profile**: Birth date for age-to-date conversion
- **Share Health Record**: FHIR export integration

## Compliance

- **PATIENT SAFETY CRITICAL**: EpiPen tracking, severity classification
- **HIPAA**: Audit trails, soft delete, RLS
- **RLS (Row-Level Security)**: Patient can only access own allergies
- **Data Integrity**: CHECK constraints on enums, conditional validation
