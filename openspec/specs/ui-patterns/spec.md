# UI Patterns

## Purpose

Define reusable UI patterns that provide consistent interaction models across all features in the Arkpass health records system. These patterns standardize common user interactions, reduce development duplication, and ensure a cohesive user experience.

## Requirements

### Requirement: Quick Add Pattern

The system SHALL provide a Quick Add pattern for rapid single-field entry directly in list views, enabling fast capture of name-only records.

#### Scenario: Inline quick add input
- **WHEN** user views list with Quick Add enabled
- **THEN** display permanent input field at top of list
- **AND** show placeholder text "[Type] name..."
- **AND** display submit arrow button on right
- **AND** keep input visible at all times

#### Scenario: Quick add submission
- **WHEN** user enters name in Quick Add input and submits
- **THEN** validate name is not empty and minimum 2 characters
- **AND** create minimal record with name only
- **AND** insert new record at top of list with animation
- **AND** show "Added!" success message briefly
- **AND** clear input and refocus for next entry

#### Scenario: Quick add duplicate detection
- **WHEN** user submits name that already exists
- **THEN** show error message "This [type] already exists"
- **AND** highlight input with red border
- **AND** keep entered text and keyboard open

#### Scenario: Quick add with autocomplete
- **WHEN** user types 2+ characters in Quick Add input
- **THEN** fetch autocomplete suggestions
- **AND** display dropdown with up to 5 suggestions
- **AND** allow tap to select and submit
- **AND** hide dropdown if no suggestions

#### Scenario: Features using quick add
- **WHEN** system determines if feature should use Quick Add
- **THEN** enable for: Medications, Allergies, Supplements
- **AND** disable for: Conditions (type selection required), Surgeries (date critical), Immunizations (complex doses)
- **AND** apply when name/title sufficient to create meaningful record

### Requirement: Dual-Mode Date Input Pattern

The system SHALL provide a dual-mode date input component allowing users to enter dates via calendar picker OR age-based input.

#### Scenario: Mode selector display
- **WHEN** user views dual-mode date field
- **THEN** display mode selector dropdown (107px width)
- **AND** show options: "Date" or "Age"
- **AND** display dynamic input component to right (flexible width)
- **AND** maintain 16px gap between components

#### Scenario: Date mode input
- **WHEN** user selects "Date" mode
- **THEN** display calendar picker icon
- **AND** show placeholder "Select Date"
- **AND** open calendar picker on tap
- **AND** support progressive disclosure: Year → Month → Day
- **AND** validate date not in future for past events
- **AND** validate date not before patient birth

#### Scenario: Age mode input
- **WHEN** user selects "Age" mode
- **THEN** display numeric text input
- **AND** show placeholder "Enter Age"
- **AND** accept integer only (0-120 range)
- **AND** validate age not negative
- **AND** validate age not exceeds current patient age

#### Scenario: Age to date conversion
- **WHEN** user submits age value
- **THEN** compute event date as: birth year + age value
- **AND** use patient birth month/day for event date
- **AND** store computed date with "Age [value]" display
- **AND** show estimation indicator in provider view

#### Scenario: Mode switching confirmation
- **WHEN** user switches mode with existing data
- **THEN** show confirmation dialog
- **AND** warn "Switching modes will clear your current entry"
- **AND** provide Cancel and Switch options
- **AND** clear previous mode data if confirmed

#### Scenario: Features using dual-mode date
- **WHEN** system determines which fields use dual-mode
- **THEN** apply to: Surgery "When", Immunization "When", Condition diagnosis dates, Medication start dates
- **AND** store full dual-mode structure in JSONB column
- **AND** maintain computed date column for queries

### Requirement: Repeatable Entry Pattern

The system SHALL provide a repeatable entry pattern for entering multiple related sub-items within a single parent record.

#### Scenario: Initial child entry required
- **WHEN** user creates parent record with repeatable entries
- **THEN** display first child entry fields (required, cannot remove)
- **AND** show "+ Add more" link below first entry
- **AND** allow saving with one complete child entry

#### Scenario: Adding additional entries
- **WHEN** user taps "+ Add more" link
- **THEN** insert new blank child entry fields below last entry
- **AND** show visual separator between entries
- **AND** display "✕ Remove this [entry]" link on new entry
- **AND** move "+ Add more" link to bottom of new entry
- **AND** auto-focus first field of new entry

#### Scenario: Removing child entry
- **WHEN** user taps "✕ Remove this [entry]" on non-first entry
- **THEN** show confirmation dialog if entry has data
- **AND** list data being deleted in confirmation
- **AND** remove entry and re-number remaining entries if confirmed
- **AND** prevent removal of first/last entry

#### Scenario: Auto-numbering entries
- **WHEN** user saves parent record with multiple entries
- **THEN** sort entries by date field (if present)
- **AND** assign sequential numbers starting at 1
- **AND** store as separate child records with parent foreign key
- **AND** handle ON DELETE CASCADE for child records

#### Scenario: Features using repeatable entry
- **WHEN** system determines if feature uses repeatable entry
- **THEN** apply to: Immunization doses, Condition recurrent episodes
- **AND** require at least one child entry
- **AND** display only parent fields in list view with entry count

### Requirement: Field-Level Editing Pattern

The system SHALL provide field-level editing with dedicated edit screens per field or field group.

#### Scenario: Main view field display
- **WHEN** user views main screen with editable fields
- **THEN** display each field with label, value, and [Edit] button
- **AND** show field status indicators (red dot for warnings)
- **AND** display optional status text below value
- **AND** separate field sections with visual dividers

#### Scenario: Navigate to field edit screen
- **WHEN** user taps [Edit] button for field
- **THEN** navigate to dedicated edit screen for that field
- **AND** show field name in header with back arrow and [Save] button
- **AND** display field input with full screen space
- **AND** pre-populate with current value

#### Scenario: Save field changes
- **WHEN** user taps [Save] button in edit screen
- **THEN** validate field value
- **AND** send PATCH request with single field update
- **AND** return to main view with updated value displayed
- **AND** create audit trail entry if enabled

#### Scenario: Discard field changes
- **WHEN** user taps back arrow without saving
- **THEN** discard changes without confirmation (auto-discard for single fields)
- **AND** return to main view with original value
- **AND** show confirmation only for multi-field groups

#### Scenario: Field grouping
- **WHEN** system determines field grouping
- **THEN** group related fields: First/Middle/Last Name, Height/Weight, Address components
- **AND** keep separate: Email (verification flow), Phone (verification flow), independent fields
- **AND** limit groups to 2-3 fields maximum

#### Scenario: Features using field-level editing
- **WHEN** system applies field-level editing
- **THEN** use for: Personal Information (15 screens), Social History (8 screens)
- **AND** provide granular audit trail per field
- **AND** support field-specific validation and confirmation flows

### Requirement: Conditional UI Pattern

The system SHALL provide conditional field visibility based on user selections to reduce cognitive load.

#### Scenario: Binary conditional fields
- **WHEN** user selects Yes/No radio option
- **THEN** show detail fields only if "Yes" selected
- **AND** hide and clear detail fields if "No" selected
- **AND** animate field appearance with fade-in slide-down (150ms)
- **AND** animate field disappearance with fade-out slide-up (150ms)

#### Scenario: Multi-state conditional fields
- **WHEN** user selects from 3+ options
- **THEN** show different field sets based on selection
- **AND** hide previous conditional fields
- **AND** clear data from hidden fields (recommended)
- **AND** transition between field sets with animation

#### Scenario: Nested conditional fields
- **WHEN** user triggers multiple conditional levels
- **THEN** evaluate Level 1 condition first
- **AND** show Level 1 conditional fields
- **AND** evaluate Level 2 condition if Level 1 met
- **AND** show Level 2 fields only if both conditions met

#### Scenario: Conditional validation
- **WHEN** user saves form with conditional fields
- **THEN** validate only visible fields
- **AND** skip validation for hidden fields
- **AND** mark conditional fields as required when visible and trigger met
- **AND** allow submission without conditional data if trigger not met

#### Scenario: Features using conditional UI
- **WHEN** system determines conditional field usage
- **THEN** apply to: Social History (Smoking/Alcohol/Drugs/Caffeine), Allergies (severity-based EpiPen)
- **AND** clear hidden field data by default
- **AND** announce field visibility changes to screen readers

### Requirement: Multi-Select Pattern

The system SHALL provide multi-select checkbox lists with optional "Other" field for standardized vocabulary plus custom entries.

#### Scenario: Standard checkbox selection
- **WHEN** user views multi-select field
- **THEN** display checkbox list with predefined options
- **AND** allow multiple selections simultaneously
- **AND** show checkmark on selected items
- **AND** maintain selection state across interactions

#### Scenario: Other field behavior
- **WHEN** multi-select includes "Other" option
- **THEN** display "Other (specify):" checkbox with text input
- **AND** keep text input always visible (recommended)
- **AND** enable text input only when "Other" checked
- **AND** require text entry if "Other" checked
- **AND** show validation error if "Other" checked but text empty

#### Scenario: Category-specific options
- **WHEN** multi-select options depend on context
- **THEN** load appropriate option list based on category/severity
- **AND** clear previous selections when category changes
- **AND** maintain "Other" option across all contexts

#### Scenario: Multi-select display
- **WHEN** system displays selected values
- **THEN** show as comma-separated list in patient view
- **AND** show as bulleted list in detail view
- **AND** include "Other" text as separate item
- **AND** store standard selections as array, "Other" as separate text field

#### Scenario: Features using multi-select
- **WHEN** system determines multi-select usage
- **THEN** apply to: Allergy symptoms (10-11 per category), Recreational drug types (7 categories)
- **AND** provide no minimum selection requirement (optional)
- **AND** store as PostgreSQL TEXT[] array for standard selections

## Implementation Details

### Quick Add Pattern Implementation

**Component Structure:**
- QuickAddInput: Reusable component accepting type, placeholder, validation rules
- Height: 58px standard input height
- Submit button: Arrow icon (→) or "Add" text
- Auto-complete: Optional dropdown with 5-suggestion limit
- Success animation: "Added!" message with checkmark, 1-second duration

**Data Model:**
```typescript
interface QuickAddResult {
  id: string;
  patientId: string;
  name: string;  // ONLY FILLED FIELD
  createdVia: 'quick_add';
  createdAt: Date;
  updatedAt: Date;
}
```

**Database Integration:**
- Add created_via column: 'quick_add' | 'standard_form' | 'import'
- Track creation method for analytics
- Support post-creation editing to add full details

### Dual-Mode Date Input Implementation

**Component Structure:**
- DualModeDateInput: Container with mode selector + dynamic input
- Mode selector: 107px width dropdown
- Date input: Calendar picker with progressive disclosure
- Age input: Numeric text field with integer validation
- Confirmation dialog: Mode switch warning

**Data Model:**
```typescript
interface DualModeDate {
  inputMode: 'date' | 'age';
  dateSelection?: {
    year?: number;
    month?: number;
    day?: number;
    precision: 'year' | 'month' | 'day';
    selectedDate?: Date;
  };
  ageInput?: {
    ageValue: number;
    referenceDate: Date;
  };
  computedDate?: Date;
  displayText: string;
  enteredAt: Date;
}
```

**Database Schema:**
```sql
-- Store as JSONB
when_raw JSONB,

-- Computed column for queries
when_computed_date TIMESTAMP GENERATED ALWAYS AS
  (CASE
    WHEN (when_raw->>'inputMode') = 'date'
      THEN (when_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
    WHEN (when_raw->>'inputMode') = 'age'
      THEN compute_date_from_age(...)
    ELSE NULL
  END) STORED,

-- Display columns
when_display_pt VARCHAR(100),  -- "March 2021" or "Age 25"
when_display_pr VARCHAR(100)   -- "2021-03-30" or "Age 25 (est. 1996)"
```

### Repeatable Entry Implementation

**Component Structure:**
- RepeatableEntryContainer: Manages array state for child entries
- ChildEntryGroup: Renders one set of child fields
- AddMoreLink: Blue text with "+" icon, configurable label
- RemoveEntryLink: Red text with "✕" icon, confirmation on data

**Data Model:**
```typescript
interface ParentRecord {
  id: string;
  patientId: string;
  // Parent fields
  name: string;
  // Child entries array
  entries: ChildEntry[];
}

interface ChildEntry {
  id: string;
  parentId: string;
  // Child fields
  entryNumber: number;  // Auto-assigned: 1, 2, 3...
  // ... other fields
}
```

**Database Schema:**
```sql
-- Parent table
CREATE TABLE parent_records (
  id UUID PRIMARY KEY,
  patient_id UUID,
  name VARCHAR(255) NOT NULL
);

-- Child table
CREATE TABLE child_entries (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES parent_records(id) ON DELETE CASCADE,
  entry_number INTEGER NOT NULL,
  -- ... child fields
);

CREATE UNIQUE INDEX idx_child_entry_number
  ON child_entries(parent_id, entry_number);
```

### Field-Level Editing Implementation

**Component Structure:**
- FieldRow: Displays label, value, [Edit] button with status indicators
- EditScreen: Dedicated screen per field with back arrow and [Save] button
- Header: 58px height, back arrow + field name + save button

**API Pattern:**
```http
PATCH /api/patients/{id}/personal-information
Content-Type: application/json

{
  "gender": "male"  // Single field update
}
```

**Audit Trail (Optional):**
```sql
CREATE TABLE field_audit (
  id UUID PRIMARY KEY,
  patient_id UUID,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,
  changed_at TIMESTAMP DEFAULT NOW()
);
```

### Conditional UI Implementation

**Configuration Structure:**
```typescript
interface ConditionalFieldConfig {
  triggerField: string;
  triggerValue: any;
  showFields: string[];
  hideFields: string[];
  clearDataOnHide: boolean;  // Default: true
}
```

**Validation:**
```typescript
interface ValidationRule {
  field: string;
  required: boolean;
  requiredIf?: {
    triggerField: string;
    triggerValue: any;
  };
}
```

**Animations:**
- Show: Fade in + slide down (150ms)
- Hide: Fade out + slide up (150ms)
- Clear: Immediate (no animation)

### Multi-Select Implementation

**Component Structure:**
- MultiSelectField: Container for checkbox list
- Checkbox rows: 24px height per option
- Other field: Always visible text input (recommended)
- Validation: Required if "Other" checked

**Data Model:**
```typescript
interface MultiSelectField {
  standardSelections: string[];  // Array of IDs
  otherValue?: string;          // Free-text entry
}
```

**Database Schema:**
```sql
-- Option 1: Separate columns (recommended)
symptoms TEXT[],  -- ['anaphylaxis', 'difficulty_breathing']
other_symptom_description TEXT,  -- 'Severe headache'

-- Index for array queries
CREATE INDEX idx_symptoms ON table_name USING GIN (symptoms);

-- Query
SELECT * FROM table_name WHERE 'anaphylaxis' = ANY(symptoms);
```

## Where Used

### Quick Add Pattern
- **Medications**: Name-only entry for rapid medication capture
- **Allergies**: Allergen name quick entry
- **Supplements**: Supplement/vitamin name quick entry

### Dual-Mode Date Input
- **Surgeries**: "When" field (date or age at surgery)
- **Immunizations**: "When" field (date or age at vaccination)
- **Conditions**: Diagnosis date, last occurrence date, resolution dates
- **Medications**: Prescribed/Start day (at or after diagnosis)

### Repeatable Entry Pattern
- **Immunizations**: Multiple doses (1st dose, 2nd dose, booster)
- **Conditions**: Recurrent episodes (future expansion)

### Field-Level Editing Pattern
- **Personal Information**: 15 edit screens (Name, Gender, DOB, Height, Weight, Phone, Email, etc.)
- **Social History**: 8 edit screens (Smoking, Alcohol, Drugs, Caffeine, etc.)

### Conditional UI Pattern
- **Social History**: Smoking (Smoker/Quit/Never), Alcohol (frequency-based), Drugs (Yes/No), Caffeine (Yes/No)
- **Allergies**: EpiPen field (shown only if Severe + Medication/Food)

### Multi-Select Pattern
- **Allergies**: Symptoms (10-11 options per category + Other)
- **Social History**: Recreational drug types (7 categories + Other)

## Dependencies

- **Date/Time Selection Framework**: Dual-mode date input integrates with Framework 1 (past events) and Framework 2 (known future events) for progressive disclosure and quick options
- **Three-View Architecture**: All patterns follow display rules for UI[Pt], UI[Pr], and DB representations
- **Component Library**: All patterns implemented as reusable components in shared library
- **Validation Framework**: Conditional validation rules apply to all pattern implementations

## Compliance

### Accessibility Requirements
- **Keyboard Navigation**: All patterns fully keyboard accessible with tab order, arrow keys, enter/escape
- **Screen Readers**: ARIA attributes, live regions, focus management, clear announcements
- **Voice Control**: Support "Tap [element]", "Enter [value]", "Select [option]" commands

### Data Integrity
- **Quick Add**: Validate minimum length, trim whitespace, optional duplicate detection
- **Dual-Mode Date**: Validate ranges, prevent future dates for past events, age within patient lifetime
- **Repeatable Entry**: Require minimum one entry, chronological order warnings, confirmation on delete
- **Field-Level Editing**: Single-field PATCH updates, optimistic locking for concurrent edits
- **Conditional UI**: Clear hidden data by default, validate only visible fields
- **Multi-Select**: Require "Other" text if checkbox checked, array storage for standard selections

### Performance
- **Quick Add**: Debounce autocomplete queries (300ms), limit suggestions to 5 results
- **Dual-Mode Date**: Cache computed dates, index computed columns for queries
- **Repeatable Entry**: Limit UI warnings at 10+ entries, efficient array operations
- **Conditional UI**: 150ms animations, DOM updates batched
- **Multi-Select**: GIN indexes for array queries, efficient checkbox rendering

### Audit Trail
- **Field-Level Editing**: Optional audit table tracking field name, old/new values, changed by, timestamp
- **Quick Add**: Track created_via column for analytics
- **All Patterns**: Update updatedAt timestamps, maintain change history where required
