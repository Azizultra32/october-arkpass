# Conditions Management

## Purpose

Enable patients to track medical conditions across their lifespan with type-specific date tracking for chronic ongoing conditions, transient-recurrent conditions, and transient-resolved conditions. Support clinical documentation through condition-medication associations and document attachments.

## Requirements

### Requirement: Condition Record Creation

The system SHALL provide Standard Add method only for creating condition records, requiring type selection before creation.

#### Scenario: Standard Add condition
- **WHEN** user taps "+ Add with details" button
- **THEN** open Add Condition form with all fields
- **AND** require Name and Type fields before saving
- **AND** show type-specific date fields based on selection
- **AND** allow optional fields: Details, associated medications, documents

#### Scenario: No Quick Add for conditions
- **WHEN** viewing conditions list
- **THEN** do NOT show Quick Add input field
- **AND** only show "+ Add with details" button
- **AND** ensure type selection happens during creation (not after)

### Requirement: Condition Type Classification

The system SHALL support three condition types with different temporal patterns and date field requirements.

#### Scenario: Select Chronic condition type
- **WHEN** user selects Type = "Chronic"
- **THEN** show radio button as selected
- **AND** display only "Diagnosis Date" field
- **AND** hide Last Occurrence Date field
- **AND** hide Start Date and End Date fields
- **AND** use progressive disclosure for Diagnosis Date

#### Scenario: Select Transient-Recurrent condition type
- **WHEN** user selects Type = "Transient" then "Recurrent"
- **THEN** show both radio buttons as selected
- **AND** display only "Last Occurrence Date" field
- **AND** hide Diagnosis Date field
- **AND** hide Start Date and End Date fields
- **AND** use progressive disclosure for Last Occurrence Date

#### Scenario: Select Transient-Resolved condition type
- **WHEN** user selects Type = "Transient" then "Resolved"
- **THEN** show both radio buttons as selected
- **AND** display "Start Date" and "End Date" fields
- **AND** hide Diagnosis Date field
- **AND** hide Last Occurrence Date field
- **AND** use progressive disclosure for both date fields

### Requirement: Condition Data Fields

The system SHALL capture condition information with type-dependent date fields and validation.

#### Scenario: Required name field
- **WHEN** user attempts to save condition
- **THEN** validate Name field is not empty
- **AND** show error "Name / Diagnosis (Required)" with red border if empty
- **AND** prevent save until Name is filled

#### Scenario: Required type selection
- **WHEN** user attempts to save condition
- **THEN** validate Type is selected (Chronic OR Transient)
- **AND** if Transient, validate sub-type (Recurrent OR Resolved)
- **AND** prevent save until Type is fully selected

#### Scenario: Optional details field
- **WHEN** user enters details information
- **THEN** accept free-text input
- **AND** allow save with empty details

#### Scenario: Diagnosis date entry for chronic conditions
- **WHEN** Type = "Chronic" AND user taps Diagnosis Date field
- **THEN** open dual-mode date input (Date OR Age mode)
- **AND** support Date mode with calendar picker
- **AND** support Age mode with numeric input
- **AND** validate date not in future
- **AND** validate date not before patient birth date
- **AND** allow save with empty diagnosis date

#### Scenario: Last occurrence date entry for recurrent conditions
- **WHEN** Type = "Transient-Recurrent" AND user taps Last Occurrence Date field
- **THEN** open dual-mode date input (Date OR Age mode)
- **AND** validate date not in future
- **AND** validate date not before patient birth date
- **AND** allow save with empty last occurrence date

#### Scenario: Start and end date entry for resolved conditions
- **WHEN** Type = "Transient-Resolved" AND user taps Start Date or End Date
- **THEN** open dual-mode date input for each field
- **AND** validate Start Date not in future
- **AND** validate End Date not before Start Date
- **AND** validate End Date not in future
- **AND** allow save with empty dates

### Requirement: Progressive Disclosure

The system SHALL hide advanced fields by default and reveal them via "Show more" interaction.

#### Scenario: Collapsed view shows essential fields
- **WHEN** viewing or editing condition in collapsed state
- **THEN** display: Name, Type (with sub-type)
- **AND** hide: type-specific date fields, Details, Medications, Documents
- **AND** show "Show more" link

#### Scenario: Expanded view shows all fields
- **WHEN** user taps "Show more" link
- **THEN** reveal: type-specific date fields, Details, Medications, Documents sections
- **AND** replace "Show more" with "Show less" link
- **AND** maintain expanded state during editing session

### Requirement: Associated Medications

The system SHALL allow linking conditions to one or more medications.

#### Scenario: Add medication association
- **WHEN** user taps "+ Add Medications" in condition form
- **THEN** open medication selection list
- **AND** display existing medications with checkbox selection
- **AND** create association between condition and selected medication(s)

#### Scenario: Display medication associations
- **WHEN** viewing condition record in expanded state
- **THEN** show MEDICATIONS section
- **AND** display medication details (name, dosage, frequency)
- **AND** show "for [Condition Name]" under each medication
- **AND** allow deletion of association via delete icon in edit mode

#### Scenario: Empty medications state
- **WHEN** no medications are associated
- **THEN** show "No Medications" placeholder in expanded view
- **AND** show "+ Add Medications" button in edit mode

### Requirement: Associated Documents

The system SHALL allow attaching documents to condition records.

#### Scenario: Add document attachment
- **WHEN** user taps "+ Add Documents" in condition form
- **THEN** open document selection interface
- **AND** allow selection from existing documents
- **AND** allow photo capture for new documents
- **AND** create association between condition and selected documents

#### Scenario: Display document associations
- **WHEN** viewing condition record in expanded state
- **THEN** show DOCUMENTS section
- **AND** display document names
- **AND** allow deletion of association via delete icon in edit mode

#### Scenario: Empty documents state
- **WHEN** no documents are associated
- **THEN** show "No Documents" placeholder in expanded view
- **AND** show "+ Add Documents" button in edit mode

### Requirement: Categorized List Display

The system SHALL display conditions grouped by type (Chronic/Transient) with appropriate visual hierarchy.

#### Scenario: Display chronic conditions section
- **WHEN** viewing conditions list
- **THEN** show "CHRONIC" section header
- **AND** list all chronic conditions in cards
- **AND** show condition name and optional status indicator
- **AND** show empty state "No Chronic Conditions" if none exist

#### Scenario: Display transient conditions section
- **WHEN** viewing conditions list
- **THEN** show "TRANSIENT" section header
- **AND** list all transient conditions (recurrent and resolved) in cards
- **AND** show condition name and sub-type indicator
- **AND** show empty state "No Transient Conditions" if none exist

#### Scenario: Tap condition card
- **WHEN** user taps condition card
- **THEN** open View Condition screen
- **AND** show all fields (collapsed by default)
- **AND** show Edit button in header

### Requirement: Condition Editing

The system SHALL allow editing all condition fields while maintaining type-specific date field display.

#### Scenario: Edit existing condition
- **WHEN** user taps "Edit" in View screen
- **THEN** convert all fields to editable inputs
- **AND** preserve current values
- **AND** maintain type selection and date field visibility
- **AND** show "Save" button in header
- **AND** validate Name and Type fields on save

#### Scenario: Change condition type during edit
- **WHEN** user changes Type from Chronic to Transient or vice versa
- **THEN** hide previous type's date fields
- **AND** show new type's date fields
- **AND** clear previous date field values
- **AND** warn user "Changing type will clear date information"

#### Scenario: Save condition changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields (Name, Type)
- **AND** validate date fields per type rules
- **AND** update record with changed values
- **AND** update `updated_at` timestamp
- **AND** return to View screen

### Requirement: Condition Deletion

The system SHALL allow permanent deletion of condition records with confirmation.

#### Scenario: Delete condition
- **WHEN** user taps "Delete" button in View/Edit screen
- **THEN** show confirmation dialog "Delete this condition?"
- **AND** if confirmed, permanently delete record
- **AND** delete all associations (medications, documents)
- **AND** return to list view

#### Scenario: Soft delete for audit trail
- **WHEN** condition is deleted
- **THEN** mark record as `deleted_at = NOW()`
- **AND** hide from patient view
- **AND** retain in database for audit/compliance

### Requirement: Share Health Record Integration

The system SHALL include conditions in health record sharing feature.

#### Scenario: Export conditions in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all conditions in export
- **AND** format as FHIR Condition resources (at export time)
- **AND** include condition name, type, date information, clinical status
- **AND** map type to FHIR:
  - Chronic → clinicalStatus: active, category: problem-list-item
  - Transient-Recurrent → clinicalStatus: relapse, category: encounter-diagnosis
  - Transient-Resolved → clinicalStatus: resolved, category: encounter-diagnosis
- **AND** omit ArkPass-specific fields (e.g., `created_via`)

## Data Model

### Database Schema

```sql
CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('chronic', 'transient_recurrent', 'transient_resolved')),
  details TEXT,

  -- Type-specific date fields (dual-mode JSONB)
  -- Only ONE of these will be populated based on type
  diagnosis_date_raw JSONB, -- Used when type = 'chronic'
  diagnosis_date_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN type = 'chronic' AND (diagnosis_date_raw->>'inputMode') = 'date'
        THEN (diagnosis_date_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN type = 'chronic' AND (diagnosis_date_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (diagnosis_date_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  last_occurrence_date_raw JSONB, -- Used when type = 'transient_recurrent'
  last_occurrence_date_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN type = 'transient_recurrent' AND (last_occurrence_date_raw->>'inputMode') = 'date'
        THEN (last_occurrence_date_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN type = 'transient_recurrent' AND (last_occurrence_date_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (last_occurrence_date_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  start_date_raw JSONB, -- Used when type = 'transient_resolved'
  start_date_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN type = 'transient_resolved' AND (start_date_raw->>'inputMode') = 'date'
        THEN (start_date_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN type = 'transient_resolved' AND (start_date_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (start_date_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  end_date_raw JSONB, -- Used when type = 'transient_resolved'
  end_date_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN type = 'transient_resolved' AND (end_date_raw->>'inputMode') = 'date'
        THEN (end_date_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN type = 'transient_resolved' AND (end_date_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (end_date_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  -- Display columns (three-view pattern) for each date type
  diagnosis_date_display_pt TEXT,
  diagnosis_date_display_pr TEXT,
  diagnosis_date_display_active BOOLEAN DEFAULT TRUE,

  last_occurrence_date_display_pt TEXT,
  last_occurrence_date_display_pr TEXT,
  last_occurrence_date_display_active BOOLEAN DEFAULT TRUE,

  start_date_display_pt TEXT,
  start_date_display_pr TEXT,
  start_date_display_active BOOLEAN DEFAULT TRUE,

  end_date_display_pt TEXT,
  end_date_display_pr TEXT,
  end_date_display_active BOOLEAN DEFAULT TRUE,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT, -- 'standard_form', 'import' (no quick_add for conditions)
  deleted_at TIMESTAMPTZ, -- Soft delete

  -- Constraints
  CONSTRAINT conditions_type_date_consistency CHECK (
    (type = 'chronic' AND diagnosis_date_raw IS NOT NULL AND last_occurrence_date_raw IS NULL AND start_date_raw IS NULL AND end_date_raw IS NULL) OR
    (type = 'transient_recurrent' AND diagnosis_date_raw IS NULL AND last_occurrence_date_raw IS NOT NULL AND start_date_raw IS NULL AND end_date_raw IS NULL) OR
    (type = 'transient_resolved' AND diagnosis_date_raw IS NULL AND last_occurrence_date_raw IS NULL AND start_date_raw IS NOT NULL AND end_date_raw IS NOT NULL) OR
    (diagnosis_date_raw IS NULL AND last_occurrence_date_raw IS NULL AND start_date_raw IS NULL AND end_date_raw IS NULL)
  ),
  CONSTRAINT conditions_resolved_dates_order CHECK (
    type != 'transient_resolved' OR
    start_date_computed_date IS NULL OR
    end_date_computed_date IS NULL OR
    end_date_computed_date >= start_date_computed_date
  )
);

-- Indexes
CREATE INDEX idx_conditions_patient ON conditions(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_conditions_type ON conditions(patient_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_conditions_name ON conditions(patient_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_conditions_diagnosis_date ON conditions(diagnosis_date_computed_date);
CREATE INDEX idx_conditions_last_occurrence ON conditions(last_occurrence_date_computed_date);
CREATE INDEX idx_conditions_start_date ON conditions(start_date_computed_date);
CREATE INDEX idx_conditions_end_date ON conditions(end_date_computed_date);

-- Junction table for medication associations
CREATE TABLE condition_medications (
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (condition_id, medication_id)
);

-- Junction table for document associations
CREATE TABLE condition_documents (
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (condition_id, document_id)
);

-- Updated trigger
CREATE TRIGGER conditions_updated_at
  BEFORE UPDATE ON conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for ArkPass-specific fields
COMMENT ON COLUMN conditions.type IS 'Three types: chronic (ongoing), transient_recurrent (episodic), transient_resolved (past)';
COMMENT ON COLUMN conditions.diagnosis_date_raw IS 'Only used for chronic conditions';
COMMENT ON COLUMN conditions.last_occurrence_date_raw IS 'Only used for transient_recurrent conditions';
COMMENT ON COLUMN conditions.start_date_raw IS 'Only used for transient_resolved conditions';
COMMENT ON COLUMN conditions.end_date_raw IS 'Only used for transient_resolved conditions';
```

## UI Patterns

### NO Quick Add Pattern
- Conditions do NOT support Quick Add
- Only "+ Add with details" button shown
- Type selection required during creation prevents minimal records

### Dual-Mode Date Input
- See [DUAL_MODE_DATE_INPUT_COMPONENT.md](/DUAL_MODE_DATE_INPUT_COMPONENT.md)
- Used for all date fields: Diagnosis Date, Last Occurrence Date, Start Date, End Date
- Mode selector: Date OR Age
- Date mode: Calendar picker with progressive disclosure
- Age mode: Numeric input, converts to approximate date

### Progressive Disclosure
- Collapsed: Show Name, Type (with sub-type) + "Show more"
- Expanded: Reveal type-specific date fields, Details, Medications, Documents + "Show less"
- Reduces cognitive load, prioritizes essential fields

### Type-Dependent Date Fields
- Chronic: Show only Diagnosis Date
- Transient-Recurrent: Show only Last Occurrence Date
- Transient-Resolved: Show Start Date AND End Date
- Dynamic field visibility based on radio button selection

### Categorized Sections
- "CHRONIC" section with chronic condition cards
- "TRANSIENT" section with transient condition cards
- Visual separation with uppercase headers
- Empty states per section

## FHIR Mapping (Export Only)

ArkPass schema is PRIMARY. FHIR R4 mapping happens at export time ONLY.

### Condition Resource

```json
{
  "resourceType": "Condition",
  "id": "{uuid}",
  "clinicalStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
      "code": "{chronic: 'active', transient_recurrent: 'relapse', transient_resolved: 'resolved'}"
    }]
  },
  "verificationStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
      "code": "confirmed"
    }]
  },
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-category",
      "code": "{chronic: 'problem-list-item', transient: 'encounter-diagnosis'}"
    }]
  }],
  "code": {
    "text": "{name}"
  },
  "subject": {
    "reference": "Patient/{patient_id}"
  },
  "onsetDateTime": "{chronic: diagnosis_date_computed_date, transient_recurrent: last_occurrence_date_computed_date, transient_resolved: start_date_computed_date}",
  "abatementDateTime": "{transient_resolved: end_date_computed_date, otherwise: null}",
  "note": [{
    "text": "{details}"
  }]
}
```

**ArkPass-specific fields NOT exported to FHIR**:
- `created_via` (internal tracking)
- `*_raw` fields (internal dual-mode structure)
- `display_pt`, `display_pr`, `display_active` (view-specific formatting)
- Junction table associations (exported as separate FHIR references)

**FHIR mapping notes**:
- Type determines `clinicalStatus` and `category`
- Chronic → active, problem-list-item (ongoing problem)
- Transient-Recurrent → relapse, encounter-diagnosis (episodic)
- Transient-Resolved → resolved, encounter-diagnosis (past condition)
- Date field selection depends on type:
  - Chronic: onsetDateTime = diagnosis_date_computed_date
  - Transient-Recurrent: onsetDateTime = last_occurrence_date_computed_date
  - Transient-Resolved: onsetDateTime = start_date_computed_date, abatementDateTime = end_date_computed_date

## Screen Wireframes

### Conditions List
```
┌────────────────────────────────────┐
│ [Share Your Health Record]  (58px)│
│                                    │
│         Conditions                 │
│                                    │
│ [+ Add with details]               │
│                                    │
│ CHRONIC                            │
│ ──────────────────────────────     │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Asthma                    ●  │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Allergic rhinitis            │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Bronchitis                ●  │  │
│ └──────────────────────────────┘  │
│                                    │
│ TRANSIENT                          │
│ ──────────────────────────────     │
│                                    │
│ No Transient Conditions            │
│                                    │
│ [Nav Bar]                          │
└────────────────────────────────────┘
```

### View Condition - Chronic (Expanded)
```
┌────────────────────────────────────┐
│ ← Asthma                [Edit]     │
│                                    │
│ Name (Diagnosis)                   │
│ Asthma                             │
│                                    │
│ Type                               │
│ Chronic                            │
│                                    │
│ Diagnosis Date                     │
│ N/a                                │
│                                    │
│ Details                            │
│ N/a                                │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ MEDICATIONS                        │
│ Fluticasone, 232mcg, 2 times a day │
│ for Asthma                         │
│                                    │
│ Benadryl, 10mg, 1 time a day       │
│ for Allergic rhinitis              │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ Document 1                         │
│ Document 2                         │
│                                    │
│ ────────────────────────────       │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

### Add Condition - Transient Resolved
```
┌────────────────────────────────────┐
│ ← Add Condition         [Save]     │
│                                    │
│ Name / Diagnosis (Required)        │
│ [                              ]   │
│                                    │
│ ○ Chronic     ● Transient          │
│                                    │
│ ○ Recurrent   ● Resolved           │
│                                    │
│ Show more                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ MEDICATIONS FOR THIS CONDITION     │
│ No Medications                     │
│ [+ Add Medications]                │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ No Documents                       │
│ [+ Add Documents]                  │
└────────────────────────────────────┘
```

## Figma References

**Total Screens**: 7

| Node ID | Screen | Purpose |
|---------|--------|---------|
| 1534-33530 | Conditions List | Categorized list (no Quick Add) |
| 1534-33532 | View Condition (collapsed) | Essential fields only |
| 1534-33533 | View Condition (expanded) | All fields visible |
| 1534-33534 | Edit Condition - Chronic | Edit chronic condition |
| 1534-33536 | Add Condition - Chronic | Create chronic condition |
| 1534-33538 | Add Condition - Transient Recurrent | Create recurrent condition |
| 1534-33540 | Add Condition - Transient Resolved | Create resolved condition |

## Dependencies

- **Dual-Mode Date Input Component**: All date fields (type-specific)
- **Medications Feature**: Association support (bidirectional)
- **Documents Feature**: Attachment support
- **Patient Profile**: Birth date for age-to-date conversion
- **Share Health Record**: FHIR export integration
- **Repeatable Entry Pattern**: NOT used (no Quick Add for conditions)

## Compliance

- **HIPAA**: Audit trails via `created_at`, `updated_at`, soft delete
- **RLS (Row-Level Security)**: Patient can only access own conditions
- **Data Integrity**: Foreign key constraints, CHECK constraints on type, date consistency validation
- **Clinical Accuracy**: Type-specific date fields ensure proper temporal documentation
