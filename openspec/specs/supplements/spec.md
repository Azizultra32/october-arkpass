# Supplements Management

## Purpose

Enable patients to track dietary supplements, vitamins, minerals, and herbal products they take. Support quick capture via name-only entry and detailed management with dosage, frequency, and timing information.

## Requirements

### Requirement: Supplement Record Creation

The system SHALL provide two methods for creating supplement records: Quick Add for rapid name-only entry and Standard Add for complete details entry.

#### Scenario: Quick Add supplement
- **WHEN** user enters supplement name in Quick Add input
- **THEN** create record with name only, all other fields null
- **AND** record appears in list
- **AND** Quick Add input clears and refocuses for next entry

#### Scenario: Standard Add supplement
- **WHEN** user taps "+ Add with details" button (or plus icon in header)
- **THEN** open Add Supplement form with all fields
- **AND** require Name field before saving
- **AND** allow optional fields: Dosage, Frequency, Start Date, Details

#### Scenario: Quick Add duplicate supplement
- **WHEN** user attempts to Quick Add supplement name that already exists
- **THEN** show warning "This supplement already exists"
- **AND** highlight input field in red
- **AND** allow user to edit or cancel

### Requirement: Supplement Data Fields

The system SHALL capture the following supplement information with specified validation rules.

#### Scenario: Required name field
- **WHEN** user attempts to save supplement
- **THEN** validate Name field is not empty
- **AND** show error "Name (Incomplete)" with red border if empty
- **AND** prevent save until Name is filled

#### Scenario: Optional dosage field
- **WHEN** user enters dosage information
- **THEN** accept free-text input (e.g., "10mcg", "500mg", "2 tablets")
- **AND** allow save with empty dosage

#### Scenario: Frequency selection
- **WHEN** user selects frequency
- **THEN** provide dropdown options:
  - "Per day"
  - "Twice a day"
  - "Three times a day"
  - "Weekly"
  - "As needed"
- **AND** allow save with empty frequency

#### Scenario: Start date entry
- **WHEN** user taps Start field
- **THEN** open dual-mode date input (Date OR Age mode)
- **AND** support Date mode with calendar picker
- **AND** support Age mode with numeric input
- **AND** validate date not in future
- **AND** validate date not before patient birth date

#### Scenario: Free-text details field
- **WHEN** user enters additional details
- **THEN** accept multi-line text input
- **AND** allow notes about supplement purpose, timing, or instructions

### Requirement: Progressive Disclosure

The system SHALL hide advanced fields by default and reveal them via "Show more" interaction.

#### Scenario: Collapsed view shows essential fields
- **WHEN** viewing or editing supplement in collapsed state
- **THEN** display: Name, Dosage, Frequency
- **AND** hide: Start, Details, Documents
- **AND** show "Show more" link

#### Scenario: Expanded view shows all fields
- **WHEN** user taps "Show more" link
- **THEN** reveal: Start, Details, Documents fields
- **AND** replace "Show more" with "Show less" link
- **AND** maintain expanded state during editing session

### Requirement: Associated Documents

The system SHALL allow attaching documents to supplement records.

#### Scenario: Add document attachment
- **WHEN** user taps "+ Add Documents" in supplement form
- **THEN** open document selection interface
- **AND** allow selection from existing documents
- **AND** allow photo capture for new documents
- **AND** create association between supplement and selected documents

#### Scenario: Display document associations
- **WHEN** viewing supplement record
- **THEN** show DOCUMENTS section
- **AND** display document names
- **AND** allow deletion of association via delete icon in edit mode

#### Scenario: Empty documents state
- **WHEN** no documents are associated
- **THEN** show "No Documents" placeholder
- **AND** show "+ Add Documents" button

### Requirement: Supplement List View

The system SHALL display all supplements in a scrollable list with quick actions.

#### Scenario: Display supplement cards
- **WHEN** viewing supplements list
- **THEN** show each supplement as card containing:
  - Name (bold, 20px)
  - Dosage and frequency (secondary text, 16px)
  - Status indicator dot (red, 10px) next to name
- **AND** sort by most recent first OR alphabetically (configurable)

#### Scenario: Quick Add always visible
- **WHEN** viewing supplements list
- **THEN** display Quick Add input at top of list
- **AND** show placeholder "Enter supplement name..."
- **AND** keep input visible while scrolling

#### Scenario: Tap supplement card
- **WHEN** user taps supplement card
- **THEN** open View Supplement screen
- **AND** show all fields (collapsed by default)
- **AND** show Edit button in header

### Requirement: Supplement Editing

The system SHALL allow editing all supplement fields while preserving data integrity.

#### Scenario: Edit existing supplement
- **WHEN** user taps "Edit" in View screen
- **THEN** convert all fields to editable inputs
- **AND** preserve current values
- **AND** show "Save" and "Cancel" buttons in header
- **AND** validate Name field on save

#### Scenario: Save supplement changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields (Name)
- **AND** update record with changed values
- **AND** update `updated_at` timestamp
- **AND** return to View screen

#### Scenario: Cancel supplement changes
- **WHEN** user taps "Cancel" in Edit screen
- **THEN** discard all changes
- **AND** return to View screen with original values

### Requirement: Supplement Deletion

The system SHALL allow permanent deletion of supplement records with confirmation.

#### Scenario: Delete supplement
- **WHEN** user taps "Delete Supplement" button in Edit screen
- **THEN** show confirmation dialog "Delete this supplement?"
- **AND** if confirmed, soft delete record (set deleted_at)
- **AND** delete all associations (documents)
- **AND** return to list view

#### Scenario: Soft delete for audit trail
- **WHEN** supplement is deleted
- **THEN** mark record as `deleted_at = NOW()`
- **AND** hide from patient view
- **AND** retain in database for audit/compliance

### Requirement: Share Health Record Integration

The system SHALL include supplements in health record sharing feature.

#### Scenario: Export supplements in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all active supplements in export
- **AND** format as FHIR MedicationStatement resources with category="dietary-supplement"
- **AND** include supplement name, dosage, frequency
- **AND** omit ArkPass-specific fields (e.g., `created_via`)

## Data Model

### Database Schema

```sql
CREATE TABLE supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL,
  dosage TEXT, -- Free-form text (e.g., "10mcg", "500mg", "2 tablets")
  frequency TEXT, -- Dropdown value

  -- Date fields (dual-mode JSONB)
  start_raw JSONB, -- Full DualModeDate structure
  start_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN (start_raw->>'inputMode') = 'date'
        THEN (start_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN (start_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (start_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  -- Display columns (three-view pattern)
  start_display_pt TEXT, -- "March 2020" or "Age 25"
  start_display_pr TEXT, -- "2020-03-30" or "Age 25 (est. 1995)"
  start_display_active BOOLEAN DEFAULT TRUE,

  -- Free-text details
  details TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT, -- 'quick_add', 'standard_form', 'import'
  deleted_at TIMESTAMPTZ, -- Soft delete

  -- Constraints
  CONSTRAINT supplements_frequency_valid CHECK (
    frequency IN ('Per day', 'Twice a day', 'Three times a day', 'Weekly', 'As needed') OR frequency IS NULL
  )
);

-- Indexes
CREATE INDEX idx_supplements_patient ON supplements(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_supplements_name ON supplements(patient_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_supplements_computed_date ON supplements(start_computed_date);

-- Junction table for document associations
CREATE TABLE supplement_documents (
  supplement_id UUID REFERENCES supplements(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (supplement_id, document_id)
);

-- Updated trigger
CREATE TRIGGER supplements_updated_at
  BEFORE UPDATE ON supplements
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
- Expanded: Reveal Start, Details, Documents + "Show less"
- Reduces cognitive load, prioritizes essential fields

### Field-Level Editing
- View screen: Read-only fields, Edit button
- Edit screen: All fields become inputs, Save and Cancel buttons
- Delete button in edit mode only

## FHIR Mapping (Export Only)

ArkPass schema is PRIMARY. FHIR R4 mapping happens at export time ONLY.

### MedicationStatement Resource (Category: Dietary Supplement)

```json
{
  "resourceType": "MedicationStatement",
  "id": "{uuid}",
  "status": "active",
  "category": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/medication-statement-category",
      "code": "dietary-supplement",
      "display": "Dietary Supplement"
    }]
  },
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
        "frequency": 1|2|3,
        "period": 1,
        "periodUnit": "d|wk"
      }
    }
  }],
  "effectivePeriod": {
    "start": "{start_computed_date}"
  },
  "note": [{
    "text": "{details}"
  }]
}
```

**ArkPass-specific fields NOT exported to FHIR**:
- `created_via` (internal tracking)
- `start_raw` (internal dual-mode structure)
- `start_display_pt`, `start_display_pr` (view-specific formatting)
- Junction table associations (exported as separate FHIR references)

**FHIR frequency mapping**:
- "Per day" → frequency=1, period=1, periodUnit="d"
- "Twice a day" → frequency=2, period=1, periodUnit="d"
- "Three times a day" → frequency=3, period=1, periodUnit="d"
- "Weekly" → frequency=1, period=1, periodUnit="wk"
- "As needed" → asNeededBoolean=true

## Screen Wireframes

### Supplements List (Collapsed)
```
┌────────────────────────────────────┐
│         Supplements            [+] │  ← Header with Add button
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │ Enter supplement name...   [→] │ │  ← Quick Add
│ └────────────────────────────────┘ │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ • Vitamin D                  │  │  ← Red dot indicator
│ │   10mcg, per day             │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Nav Bar]                          │
└────────────────────────────────────┘
```

### View Supplement (Expanded)
```
┌────────────────────────────────────┐
│ ← Supplements                      │
│                                    │
│  Vitamin D                     [×] │
│                                    │
│  Dosage                            │
│  10mcg                             │
│                                    │
│  Frequency                         │
│  Per day                           │
│                                    │
│  Start                             │
│  March 2020                        │
│                                    │
│  Details                           │
│  For bone health                   │
│                                    │
│  Show less ▲                       │
│                                    │
│  ────────────────────────────      │
│                                    │
│  DOCUMENTS                         │
│  Lab_results.pdf                   │
│                                    │
│  ────────────────────────────      │
│                                    │
│  [Edit]                            │
└────────────────────────────────────┘
```

### Edit Supplement (Expanded)
```
┌────────────────────────────────────┐
│ ← Supplements                      │
│                                    │
│  [Cancel]               [Save]     │
│                                    │
│  Name*                             │
│  [Vitamin D_____________]          │
│                                    │
│  Dosage                            │
│  [10mcg________________]           │
│                                    │
│  Frequency                         │
│  [Per day______________] ▼         │
│                                    │
│  Start                             │
│  [___________________] 📅          │
│                                    │
│  Details                           │
│  [______________________]          │
│  [______________________]          │
│                                    │
│  Documents                         │
│  + Add Documents                   │
│                                    │
│  Show less ▲                       │
│                                    │
│  [Delete Supplement]               │
└────────────────────────────────────┘
```

## Figma References

**Total Screens**: 7

| Node ID | Screen | Purpose |
|---------|--------|---------|
| 1483:8444 | Supplements List | Main list view with Quick Add |
| 1483:8445 | View Supplement (collapsed) | Essential fields only |
| 1483:8446 | View Supplement (expanded) | All fields visible |
| 1483:8447 | Edit Supplement (collapsed) | Edit essential fields |
| 1483:8448 | Edit Supplement (expanded) | Edit all fields |
| 1483:8449 | Add Supplement (collapsed) | Create with essential fields |
| 1483:8450 | Add Supplement (expanded) | Create with all fields |

## Dependencies

- **Dual-Mode Date Input Component**: Start field
- **Quick Add Pattern**: List view rapid entry
- **Documents Feature**: Attachment support
- **Patient Profile**: Birth date for age-to-date conversion
- **Share Health Record**: FHIR export integration

## Compliance

- **HIPAA**: Audit trails via `created_at`, `updated_at`, soft delete
- **RLS (Row-Level Security)**: Patient can only access own supplements
- **Data Integrity**: Foreign key constraints, CHECK constraints on enums

## Notes

### Comparison to Medications

**Similarities**:
- Quick Add feature in list view
- Progressive disclosure (Show more/less)
- Same basic field structure: Name (required), Dosage, Frequency, Start, Details, Documents
- Same Edit/Add pattern (collapsed/expanded states)

**Differences**:
- **No condition linking**: Supplements are standalone records (no medication_conditions junction table)
- **Simpler frequency model**: Fewer options than medication schedules
- **No route field**: Supplements assumed oral (vs medications with route options: Oral, SL, INJ, etc.)
- **No status field**: No "Currently taking" vs "Discontinued" toggle (supplements assumed active if listed)
- **Red dot indicator**: Supplements list shows red dot indicator on cards (visual design element)

### Field Validation Notes

- **Name**: Required, free-text input
- **Dosage**: Optional, free-text (no validation, allows "10mcg", "500mg", "2 tablets", etc.)
- **Frequency**: Optional, dropdown with 5 options
- **Start**: Optional, dual-mode date input (Date OR Age)
- **Details**: Optional, multi-line textarea (90px height)
- **Documents**: Optional, junction table association

### Red Dot Indicator

The red dot (●) shown next to supplement names in the list view is a visual design element. Its purpose is not specified in the Figma screens but may indicate:
- Active status (currently taking)
- New/unreviewed entry
- Visual emphasis for user attention

This should be clarified during implementation.

### Future Considerations

1. **Condition Linking**: Should supplements be linkable to conditions they're addressing?
   - Example: Vitamin D for "Vitamin D Deficiency" condition
   - Example: Iron supplement for "Anemia" condition

2. **Status Tracking**: Should supplements have lifecycle status like medications?
   - "Currently taking" vs "Discontinued"
   - Discontinuation date tracking

3. **Brand/Generic Tracking**: Should supplements distinguish between brand names and generic names?
   - Example: "Centrum" (brand) vs "Multivitamin" (generic)

4. **Interaction Warnings**: Should system warn about supplement-medication interactions?
   - Requires integration with medication records
   - Clinical knowledge base needed
