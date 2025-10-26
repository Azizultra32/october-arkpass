# Medications Management

## Purpose

Enable patients to track all medications they take, including prescriptions, over-the-counter drugs, and other pharmaceutical treatments. Support quick capture via name-only entry and detailed management with full medication information.

## Requirements

### Requirement: Medication Record Creation

The system SHALL provide two methods for creating medication records: Quick Add for rapid name-only entry and Standard Add for complete details entry.

#### Scenario: Quick Add medication
- **WHEN** user enters medication name in Quick Add input
- **THEN** create record with name only, all other fields null
- **AND** record appears in list
- **AND** Quick Add input clears and refocuses for next entry

#### Scenario: Standard Add medication
- **WHEN** user taps "+ Add with details" button
- **THEN** open Add Medication form with all fields
- **AND** require Name field before saving
- **AND** allow optional fields: Dosage, Frequency, Route, Start Date, Status

#### Scenario: Quick Add duplicate medication
- **WHEN** user attempts to Quick Add medication name that already exists
- **THEN** show warning "This medication already exists"
- **AND** highlight input field in red
- **AND** allow user to edit or cancel

### Requirement: Medication Data Fields

The system SHALL capture the following medication information with specified validation rules.

#### Scenario: Required name field
- **WHEN** user attempts to save medication
- **THEN** validate Name field is not empty
- **AND** show error "Name (Incomplete)" with red border if empty
- **AND** prevent save until Name is filled

#### Scenario: Optional dosage field
- **WHEN** user enters dosage information
- **THEN** accept free-text input (e.g., "232mcg", "10mg")
- **AND** allow save with empty dosage

#### Scenario: Frequency selection
- **WHEN** user selects frequency
- **THEN** provide dropdown options:
  - "1 time a day"
  - "2 times a day"
  - "3 times a day"
  - "4 times a day"
  - "As needed"
- **AND** allow save with empty frequency

#### Scenario: Route of administration selection
- **WHEN** user selects route (ORAL/SL/INJ/DROPS)
- **THEN** provide dropdown options:
  - Oral
  - Sublingual (SL)
  - Injection (INJ)
  - Drops
  - Inhaler
  - Topical
  - Patch
  - Other
- **AND** allow save with empty route

#### Scenario: Medication status tracking
- **WHEN** user selects medication status
- **THEN** provide dropdown options:
  - "Taking regularly as directed"
  - "Taking but not regularly"
  - "As needed"
  - "Discontinued"
- **AND** allow save with empty status
- **AND** default to null (no discontinuation date needed)

#### Scenario: Prescribed/Start date entry
- **WHEN** user taps Prescribed/Start day field
- **THEN** open dual-mode date input (Date OR Age mode)
- **AND** support Date mode with calendar picker
- **AND** support Age mode with numeric input
- **AND** validate date not in future
- **AND** validate date not before patient birth date

### Requirement: Progressive Disclosure

The system SHALL hide advanced fields by default and reveal them via "Show more" interaction.

#### Scenario: Collapsed view shows essential fields
- **WHEN** viewing or editing medication in collapsed state
- **THEN** display: Name, Dosage, Frequency
- **AND** hide: Route, Prescribed/Start day, Status
- **AND** show "Show more" link

#### Scenario: Expanded view shows all fields
- **WHEN** user taps "Show more" link
- **THEN** reveal: Route, Prescribed/Start day, Status fields
- **AND** replace "Show more" with "Show less" link
- **AND** maintain expanded state during editing session

### Requirement: Associated Conditions

The system SHALL allow linking medications to one or more conditions.

#### Scenario: Add condition association
- **WHEN** user taps "+ Add Condition" in medication form
- **THEN** open condition selection list
- **AND** display existing conditions with checkbox selection
- **AND** create association between medication and selected condition(s)

#### Scenario: Display condition associations
- **WHEN** viewing medication record
- **THEN** show CONDITION section
- **AND** display condition name and type (e.g., "Asthma (Chronic)")
- **AND** allow deletion of association via delete icon

#### Scenario: Empty condition state
- **WHEN** no conditions are associated
- **THEN** show "No Conditions" placeholder
- **AND** show "+ Add Condition" button

### Requirement: Associated Documents

The system SHALL allow attaching documents to medication records.

#### Scenario: Add document attachment
- **WHEN** user taps "+ Add Documents" in medication form
- **THEN** open document selection interface
- **AND** allow selection from existing documents
- **AND** allow photo capture for new documents
- **AND** create association between medication and selected documents

#### Scenario: Display document associations
- **WHEN** viewing medication record
- **THEN** show DOCUMENTS section
- **AND** display document names
- **AND** allow deletion of association via delete icon

#### Scenario: Empty documents state
- **WHEN** no documents are associated
- **THEN** show "No Documents" placeholder
- **AND** show "+ Add Documents" button

### Requirement: Medication List View

The system SHALL display all medications in a scrollable list with quick actions.

#### Scenario: Display medication cards
- **WHEN** viewing medications list
- **THEN** show each medication as card containing:
  - Name (bold, 20px)
  - Dosage, frequency, linked condition (secondary text)
  - Status indicator dot (10px, green for active)
- **AND** sort by most recent first OR alphabetically (configurable)

#### Scenario: Quick Add always visible
- **WHEN** viewing medications list
- **THEN** display Quick Add input at top of list
- **AND** show placeholder "Enter medication name..."
- **AND** keep input visible while scrolling

#### Scenario: Tap medication card
- **WHEN** user taps medication card
- **THEN** open View Medication screen
- **AND** show all fields (collapsed by default)
- **AND** show Edit button in header

### Requirement: Medication Editing

The system SHALL allow editing all medication fields while preserving data integrity.

#### Scenario: Edit existing medication
- **WHEN** user taps "Edit" in View screen
- **THEN** convert all fields to editable inputs
- **AND** preserve current values
- **AND** show "Save" button in header
- **AND** validate Name field on save

#### Scenario: Save medication changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields (Name)
- **AND** update record with changed values
- **AND** update `updated_at` timestamp
- **AND** return to View screen

### Requirement: Medication Deletion

The system SHALL allow permanent deletion of medication records with confirmation.

#### Scenario: Delete medication
- **WHEN** user taps "Delete" button in View/Edit screen
- **THEN** show confirmation dialog "Delete this medication?"
- **AND** if confirmed, permanently delete record
- **AND** delete all associations (conditions, documents)
- **AND** return to list view

#### Scenario: Soft delete for audit trail
- **WHEN** medication is deleted
- **THEN** mark record as `deleted_at = NOW()`
- **AND** hide from patient view
- **AND** retain in database for audit/compliance

### Requirement: Share Health Record Integration

The system SHALL include medications in health record sharing feature.

#### Scenario: Export medications in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all active medications in export
- **AND** format as FHIR MedicationStatement resources (at export time)
- **AND** include medication name, dosage, frequency, status
- **AND** omit ArkPass-specific fields (e.g., `created_via`)

## Data Model

### Database Schema

```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  route TEXT, -- Oral, SL, INJ, Drops, Inhaler, Topical, Patch, Other
  status TEXT, -- "Taking regularly as directed", "Taking but not regularly", "As needed", "Discontinued"

  -- Date fields (dual-mode JSONB)
  prescribed_start_raw JSONB, -- Full DualModeDate structure
  prescribed_start_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN (prescribed_start_raw->>'inputMode') = 'date'
        THEN (prescribed_start_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN (prescribed_start_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (prescribed_start_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  -- Display columns (three-view pattern)
  prescribed_start_display_pt TEXT, -- "March 2021" or "Age 25"
  prescribed_start_display_pr TEXT, -- "2021-03-30" or "Age 25 (est. 1996)"
  prescribed_start_display_active BOOLEAN DEFAULT TRUE,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT, -- 'quick_add', 'standard_form', 'import'
  deleted_at TIMESTAMPTZ, -- Soft delete

  -- Constraints
  CONSTRAINT medications_frequency_valid CHECK (
    frequency IN ('1 time a day', '2 times a day', '3 times a day', '4 times a day', 'As needed') OR frequency IS NULL
  ),
  CONSTRAINT medications_route_valid CHECK (
    route IN ('Oral', 'Sublingual (SL)', 'Injection (INJ)', 'Drops', 'Inhaler', 'Topical', 'Patch', 'Other') OR route IS NULL
  ),
  CONSTRAINT medications_status_valid CHECK (
    status IN ('Taking regularly as directed', 'Taking but not regularly', 'As needed', 'Discontinued') OR status IS NULL
  )
);

-- Indexes
CREATE INDEX idx_medications_patient ON medications(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_medications_name ON medications(patient_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_medications_computed_date ON medications(prescribed_start_computed_date);

-- Junction table for condition associations
CREATE TABLE medication_conditions (
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (medication_id, condition_id)
);

-- Junction table for document associations
CREATE TABLE medication_documents (
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (medication_id, document_id)
);

-- Updated trigger
CREATE TRIGGER medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## UI Patterns

### Quick Add Pattern
- See [QUICK_ADD_PATTERN.md](/QUICK_ADD_PATTERN.md)
- Inline text input at top of list
- Submit creates minimal record (name only)
- Auto-clear and refocus for rapid bulk entry

### Dual-Mode Date Input
- See [DUAL_MODE_DATE_INPUT_COMPONENT.md](/DUAL_MODE_DATE_INPUT_COMPONENT.md)
- Mode selector: Date OR Age
- Date mode: Calendar picker with progressive disclosure
- Age mode: Numeric input, converts to approximate date

### Progressive Disclosure
- Collapsed: Show Name, Dosage, Frequency + "Show more"
- Expanded: Reveal Route, Prescribed/Start day, Status + "Show less"
- Reduces cognitive load, prioritizes essential fields

### Field-Level Editing
- View screen: Read-only fields, Edit button
- Edit screen: All fields become inputs, Save button
- Tap field label to edit individual field (future enhancement)

## FHIR Mapping (Export Only)

ArkPass schema is PRIMARY. FHIR R4 mapping happens at export time ONLY.

### MedicationStatement Resource

```json
{
  "resourceType": "MedicationStatement",
  "id": "{uuid}",
  "status": "active|completed|stopped|on-hold",
  "medicationCodeableConcept": {
    "text": "{name}"
  },
  "subject": {
    "reference": "Patient/{patient_id}"
  },
  "dosage": [{
    "text": "{dosage}",
    "timing": {
      "repeat": {
        "frequency": 1|2|3|4,
        "period": 1,
        "periodUnit": "d"
      }
    },
    "route": {
      "text": "{route}"
    }
  }],
  "effectivePeriod": {
    "start": "{prescribed_start_computed_date}"
  }
}
```

**ArkPass-specific fields NOT exported to FHIR**:
- `created_via` (internal tracking)
- `prescribed_start_raw` (internal dual-mode structure)
- `display_pt`, `display_pr` (view-specific formatting)
- Junction table associations (exported as separate FHIR references)

**FHIR status mapping**:
- "Taking regularly as directed" → `active`
- "Taking but not regularly" → `active` (with note in extension)
- "As needed" → `active` (with `asNeeded` flag)
- "Discontinued" → `stopped`

## Screen Wireframes

### Medications List (Collapsed)
```
┌────────────────────────────────────┐
│ [Share Your Health Record]  (58px)│
│                                    │
│         Medications                │
│                                    │
│ ┌────────────────────────────────┐│
│ │ Enter medication name...   [→] ││  ← Quick Add
│ └────────────────────────────────┘│
│                                    │
│ [+ Add with details] [Take Photo]  │
│                                    │
│ ─────────────────────────────      │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Fluticasone             ●    │  │
│ │ 232mcg, 2 times a day        │  │
│ │ for Asthma                   │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Benadryl                ●    │  │
│ │ 10mg, 1 time a day           │  │
│ │ for Allergic rhinitis        │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Nav Bar]                          │
└────────────────────────────────────┘
```

### View Medication (Expanded)
```
┌────────────────────────────────────┐
│ ← Fluticasone           [Edit]     │
│                                    │
│ Name                          ●    │
│ Fluticasone                        │
│                                    │
│ Dosage                             │
│ 232mcg                             │
│                                    │
│ Frequency                          │
│ 2 times a day                      │
│                                    │
│ ORAL/SL/INJ/DROPS                  │
│ Inhaler                            │
│                                    │
│ Prescribed / Start day             │
│ March 2021                         │
│                                    │
│ Status                             │
│ Taking regularly as directed       │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ Asthma (Chronic)                   │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ Prescription.pdf                   │
│                                    │
│ ────────────────────────────       │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

## Figma References

**Total Screens**: 8

| Node ID | Screen | Purpose |
|---------|--------|---------|
| 1483:8410 | Medications List (collapsed) | Main list view with Quick Add |
| 1483:8417 | Medications List (expanded) | Selection mode for associations |
| 1483:8411 | View Medication (collapsed) | Essential fields only |
| 1483:8412 | View Medication (expanded) | All fields visible |
| 1483:8413 | Edit Medication (collapsed) | Edit essential fields |
| 1483:8414 | Edit Medication (expanded) | Edit all fields |
| 1483:8415 | Add Medication (collapsed) | Create with essential fields |
| 1483:8416 | Add Medication (expanded) | Create with all fields |

## Dependencies

- **Dual-Mode Date Input Component**: Prescribed/Start day field
- **Quick Add Pattern**: List view rapid entry
- **Conditions Feature**: Association support
- **Documents Feature**: Attachment support
- **Patient Profile**: Birth date for age-to-date conversion
- **Share Health Record**: FHIR export integration

## Compliance

- **HIPAA**: Audit trails via `created_at`, `updated_at`, soft delete
- **RLS (Row-Level Security)**: Patient can only access own medications
- **Data Integrity**: Foreign key constraints, CHECK constraints on enums
