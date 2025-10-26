# Previous Surgeries Management

## Purpose

Enable patients to track surgical procedures they have undergone, including the surgery name, when it occurred, details, complications, and attending surgeon. Support critical date tracking via dual-mode date input (Date OR Age) for accurate surgical history.

## Requirements

### Requirement: Surgery Record Creation

The system SHALL provide Standard Add method for creating surgery records with required temporal information.

#### Scenario: Add surgery with required fields
- **WHEN** user taps "+ Add Previous Surgery" button
- **THEN** open Add Surgery form with all fields
- **AND** require Name field before saving
- **AND** require When field before saving (date is critical for surgical history)
- **AND** allow optional fields: Details, Complications, Attending Surgeon

#### Scenario: Prevent duplicate surgery
- **WHEN** user attempts to add surgery name that already exists
- **THEN** show warning "This surgery already exists"
- **AND** allow user to edit existing or cancel
- **AND** highlight input field in red

### Requirement: Surgery Data Fields

The system SHALL capture the following surgery information with specified validation rules.

#### Scenario: Required name field
- **WHEN** user attempts to save surgery
- **THEN** validate Name field is not empty
- **AND** show error "Name (Required)" with red border if empty
- **AND** prevent save until Name is filled

#### Scenario: Required when field with dual-mode input
- **WHEN** user taps When field
- **THEN** open dual-mode date input (Date OR Age mode)
- **AND** require field to be filled (surgery date is critical)
- **AND** support Date mode with calendar picker
- **AND** support Age mode with numeric input ("I was X years old")
- **AND** validate date not in future
- **AND** validate date not before patient birth date

#### Scenario: Optional details field
- **WHEN** user enters surgical details
- **THEN** accept multi-line free-text input
- **AND** allow save with empty details

#### Scenario: Optional complications field
- **WHEN** user enters complications information
- **THEN** accept multi-line free-text input
- **AND** allow save with empty complications
- **AND** display "None" or "N/a" if empty in view mode

#### Scenario: Optional attending surgeon field
- **WHEN** user enters attending surgeon name
- **THEN** accept free-text input
- **AND** allow save with empty attending surgeon
- **AND** display "N/a" if empty in view mode

### Requirement: Dual-Mode When Field

The system SHALL support two distinct input modes for the When field with bidirectional conversion.

#### Scenario: Date mode selection
- **WHEN** When field mode selector shows "Date"
- **THEN** display calendar picker input with calendar icon
- **AND** show placeholder "Select Date"
- **AND** use simple date picker (not framework-based)
- **AND** allow progressive disclosure: year → month → day

#### Scenario: Age mode selection
- **WHEN** When field mode selector shows "Age"
- **THEN** display numeric text input
- **AND** show placeholder "Enter Age"
- **AND** accept age value (0-150 years)
- **AND** calculate approximate surgery date from age and patient birthdate

#### Scenario: Switch from Date to Age mode
- **WHEN** user switches mode selector from "Date" to "Age"
- **THEN** calculate age at surgery from selected date and birthdate
- **AND** display calculated age in input field
- **AND** preserve original date selection in database

#### Scenario: Switch from Age to Date mode
- **WHEN** user switches mode selector from "Age" to "Date"
- **THEN** calculate approximate date from age and birthdate
- **AND** display calculated year (and optionally month)
- **AND** preserve original age value in database

### Requirement: Progressive Disclosure

The system SHALL hide advanced fields by default and reveal them via "Show more" interaction.

#### Scenario: Collapsed view shows essential fields
- **WHEN** viewing or editing surgery in collapsed state
- **THEN** display: Name field only
- **AND** hide: When, Details, Complications, Attending Surgeon
- **AND** show "Show more" link

#### Scenario: Expanded view shows all fields
- **WHEN** user taps "Show more" link
- **THEN** reveal: When, Details, Complications, Attending Surgeon fields
- **AND** replace "Show more" with "Show less" link
- **AND** maintain expanded state during editing session

### Requirement: Associated Conditions

The system SHALL allow linking surgeries to one or more conditions.

#### Scenario: Add condition association
- **WHEN** user taps "+ Add Condition" in surgery form
- **THEN** open condition selection list
- **AND** display existing conditions with checkbox selection
- **AND** create association between surgery and selected condition(s)

#### Scenario: Display condition associations
- **WHEN** viewing surgery record
- **THEN** show CONDITIONS section
- **AND** display condition name and type (e.g., "Appendicitis (Acute)")
- **AND** allow deletion of association via delete icon in edit mode

#### Scenario: Empty condition state
- **WHEN** no conditions are associated
- **THEN** show "No Conditions" placeholder
- **AND** show "+ Add Condition" button

### Requirement: Associated Documents

The system SHALL allow attaching documents to surgery records.

#### Scenario: Add document attachment
- **WHEN** user taps "+ Add Documents" in surgery form
- **THEN** open document selection interface
- **AND** allow selection from existing documents
- **AND** allow photo capture for new documents
- **AND** create association between surgery and selected documents

#### Scenario: Display document associations
- **WHEN** viewing surgery record
- **THEN** show DOCUMENTS section
- **AND** display document names
- **AND** allow deletion of association via delete icon in edit mode

#### Scenario: Empty documents state
- **WHEN** no documents are associated
- **THEN** show "No Documents" placeholder
- **AND** show "+ Add Documents" button

### Requirement: Surgery List View

The system SHALL display all surgeries in a simple scrollable list.

#### Scenario: Display surgery cards
- **WHEN** viewing surgeries list
- **THEN** show each surgery as card containing:
  - Name (bold, 20px)
- **AND** sort by most recent When date first
- **AND** show surgeries with no When date at bottom

#### Scenario: Tap surgery card
- **WHEN** user taps surgery card
- **THEN** open View Surgery screen (collapsed by default)
- **AND** show all fields in read-only mode
- **AND** show Edit button in header

### Requirement: Surgery Editing

The system SHALL allow editing all surgery fields while preserving data integrity.

#### Scenario: Edit existing surgery
- **WHEN** user taps "Edit" in View screen
- **THEN** convert all fields to editable inputs
- **AND** preserve current values
- **AND** show "Save" button in header
- **AND** validate required fields (Name, When) on save

#### Scenario: Save surgery changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields (Name, When)
- **AND** update record with changed values
- **AND** update `updated_at` timestamp
- **AND** return to View screen

#### Scenario: Edit When field mode switching
- **WHEN** user changes When field mode during edit
- **THEN** preserve both date and age values in database
- **AND** show converted value in new mode
- **AND** maintain data consistency for future mode switches

### Requirement: Surgery Deletion

The system SHALL allow permanent deletion of surgery records with confirmation.

#### Scenario: Delete surgery
- **WHEN** user taps "Delete" button in View/Edit screen
- **THEN** show confirmation dialog "Delete this surgery?"
- **AND** if confirmed, soft delete record (set deleted_at)
- **AND** delete all associations (conditions, documents)
- **AND** return to list view

#### Scenario: Soft delete for audit trail
- **WHEN** surgery is deleted
- **THEN** mark record as `deleted_at = NOW()`
- **AND** hide from patient view
- **AND** retain in database for audit/compliance

### Requirement: Share Health Record Integration

The system SHALL include surgeries in health record sharing feature.

#### Scenario: Export surgeries in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all surgeries in export
- **AND** format as FHIR Procedure resources (at export time)
- **AND** include surgery name, date, details, complications
- **AND** map When field to procedure.performedDateTime
- **AND** omit ArkPass-specific fields (e.g., `created_via`)

## Data Model

### Database Schema

```sql
CREATE TABLE surgeries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL,

  -- When field (dual-mode JSONB) - REQUIRED
  when_raw JSONB NOT NULL, -- Full DualModeDate structure
  when_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN (when_raw->>'inputMode') = 'date'
        THEN (when_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN (when_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (when_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END
  ) STORED,

  -- Display columns (three-view pattern)
  when_display_pt TEXT, -- "March 2010" or "Age 25"
  when_display_pr TEXT, -- "2010-03-15" or "Age 25 (est. 1985)"
  when_display_active BOOLEAN DEFAULT TRUE,

  -- Additional fields
  details TEXT, -- Free-form surgical notes
  complications TEXT, -- Free-form complications description
  attending_surgeon TEXT, -- Free-form surgeon name

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete

  -- Constraints
  CONSTRAINT surgeries_when_not_future CHECK (
    when_computed_date IS NULL OR when_computed_date <= NOW()
  )
);

-- Indexes
CREATE INDEX idx_surgeries_patient ON surgeries(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_surgeries_name ON surgeries(patient_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_surgeries_computed_date ON surgeries(when_computed_date DESC);

-- Junction table for condition associations
CREATE TABLE surgery_conditions (
  surgery_id UUID REFERENCES surgeries(id) ON DELETE CASCADE,
  condition_id UUID REFERENCES conditions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (surgery_id, condition_id)
);

-- Junction table for document associations
CREATE TABLE surgery_documents (
  surgery_id UUID REFERENCES surgeries(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (surgery_id, document_id)
);

-- Updated trigger
CREATE TRIGGER surgeries_updated_at
  BEFORE UPDATE ON surgeries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for ArkPass-specific fields
COMMENT ON COLUMN surgeries.when_raw IS 'Dual-mode date input: stores both Date mode (calendar selection) and Age mode (age at surgery) with bidirectional conversion';
COMMENT ON COLUMN surgeries.when_display_pt IS 'Patient view: "March 2010" or "Age 25"';
COMMENT ON COLUMN surgeries.when_display_pr IS 'Provider view: "2010-03-15" or "Age 25 (est. 1985)"';
```

## UI Patterns

### NO Quick Add Pattern
- **CRITICAL**: Surgeries do NOT support Quick Add
- **Reason**: When field is required (date is critical for surgical history)
- **Pattern**: User MUST use "+ Add Previous Surgery" button to open full form
- **Contrast**: Unlike Medications (has Quick Add), Surgeries require temporal context

### Dual-Mode Date Input
- See [DUAL_MODE_DATE_INPUT_COMPONENT.md](/DUAL_MODE_DATE_INPUT_COMPONENT.md)
- When field: Date OR Age mode
- Mode selector (106px width) + Input field (flexible width)
- Date mode: Calendar picker with progressive disclosure
- Age mode: Numeric input, converts to approximate date
- Bidirectional mode switching preserves both values

### Progressive Disclosure
- Collapsed: Show Name only + "Show more"
- Expanded: Reveal When, Details, Complications, Attending Surgeon + "Show less"
- Reduces cognitive load, prioritizes essential field

### Simple List View
- No category sections (unlike Allergies)
- Simple card layout with surgery name only
- Sorted by When date (most recent first)

## FHIR Mapping (Export Only)

ArkPass schema is PRIMARY. FHIR R4 mapping happens at export time ONLY.

### Procedure Resource

```json
{
  "resourceType": "Procedure",
  "id": "{uuid}",
  "status": "completed",
  "code": {
    "text": "{name}"
  },
  "subject": {
    "reference": "Patient/{patient_id}"
  },
  "performedDateTime": "{when_computed_date}",
  "note": [
    {
      "text": "{details}"
    },
    {
      "text": "Complications: {complications}"
    }
  ],
  "performer": [
    {
      "actor": {
        "display": "{attending_surgeon}"
      }
    }
  ]
}
```

**ArkPass-specific fields NOT exported to FHIR**:
- `when_raw` (internal dual-mode structure)
- `when_display_pt`, `when_display_pr` (view-specific formatting)
- Junction table associations (exported as separate FHIR references)

**FHIR Mapping Notes**:
- `when_computed_date` → procedure.performedDateTime
- `details` → procedure.note (type: text)
- `complications` → procedure.note (type: text, prefixed "Complications:")
- `attending_surgeon` → procedure.performer.actor.display (free-text)
- Status always "completed" (past surgical procedures)

## Screen Wireframes

### Surgeries List
```
┌────────────────────────────────────┐
│ [Share Your Health Record]  (58px)│
│                                    │
│      Previous Surgeries            │
│                                    │
│ [+ Add Previous Surgery]           │
│                                    │
│ ─────────────────────────────      │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Appendectomy                 │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Gallbladder Removal          │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Nav Bar]                          │
└────────────────────────────────────┘
```

### View Surgery (Expanded)
```
┌────────────────────────────────────┐
│ ← Appendectomy          [Edit]     │
│                                    │
│ Name                               │
│ Appendectomy                       │
│                                    │
│ When                               │
│ March 2010                         │
│                                    │
│ Details                            │
│ Emergency appendectomy due to...   │
│                                    │
│ Complications                      │
│ None                               │
│                                    │
│ Attending Surgeon                  │
│ Dr. Sarah Johnson                  │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ Appendicitis (Acute)               │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ Surgical_Report.pdf                │
│                                    │
│ ────────────────────────────       │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

### Edit Surgery (Expanded with Date Mode)
```
┌────────────────────────────────────┐
│ ← Appendectomy          [Save]     │
│                                    │
│ Name (Required)                    │
│ [Appendectomy________________]     │
│                                    │
│ When                               │
│ ┌─────┐┌─────────────────────────┐│
│ │Date▾││ 📅 Select Date          ││
│ └─────┘└─────────────────────────┘│
│                                    │
│ Details                            │
│ ┌──────────────────────────────┐  │
│ │ Emergency appendectomy...    │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ Complications                      │
│ ┌──────────────────────────────┐  │
│ │                              │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ Attending Surgeon                  │
│ [Dr. Sarah Johnson__________]      │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ Appendicitis (Acute)        [×]    │
│ [+ Add Condition]                  │
│                                    │
│ DOCUMENTS                          │
│ Surgical_Report.pdf         [×]    │
│ [+ Add Documents]                  │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

### Edit Surgery (Expanded with Age Mode)
```
┌────────────────────────────────────┐
│ ← Appendectomy          [Save]     │
│                                    │
│ Name (Required)                    │
│ [Appendectomy________________]     │
│                                    │
│ When                               │
│ ┌─────┐┌─────────────────────────┐│
│ │Age▾ ││ Enter Age               ││
│ └─────┘└─────────────────────────┘│
│                                    │
│ [... rest of fields same ...]      │
└────────────────────────────────────┘
```

## Figma References

**Total Screens**: 9

| Node ID | Screen | Purpose |
|---------|--------|---------|
| 1483:8451 | Surgeries List | Simple list view with Add button |
| 1483:8452 | View Surgery (collapsed) | Name field only |
| 1483:8453 | View Surgery (expanded) | All fields visible |
| 1483:8454 | Edit Surgery (collapsed) | Edit name only |
| 1483:8455 | Edit Surgery (expanded, Date mode) | Edit all fields, Date selector |
| 1755:42615 | Edit Surgery (expanded, Age mode) | Edit all fields, Age selector |
| 1483:8456 | Add Surgery (collapsed) | Create with name only |
| 1483:8457 | Add Surgery (expanded, Date mode) | Create with all fields, Date selector |
| 1776:52953 | Add Surgery (expanded, Age mode) | Create with all fields, Age selector |

## Dependencies

- **Dual-Mode Date Input Component**: When field (REQUIRED)
- **Conditions Feature**: Association support
- **Documents Feature**: Attachment support
- **Patient Profile**: Birth date for age-to-date conversion
- **Share Health Record**: FHIR export integration

## Compliance

- **HIPAA**: Audit trails via `created_at`, `updated_at`, soft delete
- **RLS (Row-Level Security)**: Patient can only access own surgeries
- **Data Integrity**: Foreign key constraints, CHECK constraints on dates
- **Required Fields**: Name and When (date is critical for surgical history)

## Key Differences from Other Features

| Aspect | Surgeries | Medications | Allergies |
|--------|-----------|-------------|-----------|
| **Quick Add** | ❌ NO (date required) | ✅ Yes | ✅ Yes |
| **Required Date** | ✅ When (critical) | ❌ Optional | ❌ Optional |
| **Date Input** | Dual-mode (Date/Age) | Dual-mode (Date/Age) | Dual-mode (Date/Age) |
| **Categories** | ❌ No sections | ❌ No sections | ✅ Medication/Environmental |
| **Complexity** | Medium | High | Medium-High |
| **Additional Fields** | Complications, Attending Surgeon | Dosage, Frequency, Route, Status | Category, Type, Severity, EpiPen, Symptoms |
| **FHIR Resource** | Procedure | MedicationStatement | AllergyIntolerance |

## Architecture Notes

### Why No Quick Add?

The When field is **REQUIRED** for surgeries because:
1. Surgical procedures are one-time events with specific dates
2. Temporal context is critical for medical decision-making
3. Surgery date affects treatment planning and risk assessment
4. Unlike medications (can start "now") or allergies (onset may be unknown), surgeries always have a known occurrence date

This architectural decision enforces data quality and ensures complete surgical history.

### Dual-Mode When Field Design

The When field uses the system-wide dual-mode date input pattern:

**Date Mode** (default for recent/known dates):
- Simple calendar picker (not framework-based like Conditions)
- Progressive disclosure: year → month → day
- Example: "March 15, 2010"

**Age Mode** (for older/approximate dates):
- User enters age at time of surgery: "I was 25 years old"
- System calculates approximate surgery date from age + birthdate
- Example: "Age 25" → Estimated date 1985 (if born 1960)

**Bidirectional Conversion**:
- Switching modes preserves both date and age values
- Database stores both for future mode switches
- Display adapts to selected mode

### Three-View Display Pattern

Display columns support three views:

1. **Patient View** (`when_display_pt`): "March 2010" or "Age 25"
2. **Provider View** (`when_display_pr`): "2010-03-15" or "Age 25 (est. 1985)"
3. **Active Flag** (`when_display_active`): Toggle between views

This pattern is consistent across all dual-mode date fields system-wide.
