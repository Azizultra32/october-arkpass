# Dual-Mode Date Input Pattern

## Purpose

Provide a flexible date input component that accommodates two different memory patterns: calendar-based recall ("March 2020") and age-based recall ("I was 25 years old"). This pattern recognizes that users remember events differently and provides appropriate input methods for both.

## Requirements

### Requirement: Mode Selection Interface

The system SHALL display a mode selector dropdown alongside a dynamic input component.

#### Scenario: Component layout
- **WHEN** user views dual-mode date field
- **THEN** display mode selector dropdown on left (107px fixed width)
- **AND** show options: "Date" or "Age"
- **AND** display dynamic input component on right (flexible width)
- **AND** maintain 16px gap between components
- **AND** align both components at 58px height

### Requirement: Date Mode Input

The system SHALL provide calendar-based date selection when Date mode is selected.

#### Scenario: Date mode display
- **WHEN** user selects "Date" mode
- **THEN** show calendar picker icon (📅) on right
- **AND** display placeholder "Select Date" when empty
- **AND** show formatted date when populated (e.g., "Mar 30, 2021")
- **AND** open calendar picker on tap
- **AND** support progressive disclosure: Year → Month → Day
- **AND** allow stopping at any precision level

#### Scenario: Date mode validation
- **WHEN** user submits date in Date mode
- **THEN** validate date not in future (for past events)
- **AND** validate date not before patient birth date
- **AND** show error message if validation fails
- **AND** allow year-only, month-only, or full date precision

### Requirement: Age Mode Input

The system SHALL provide age-based input when Age mode is selected.

#### Scenario: Age mode display
- **WHEN** user selects "Age" mode
- **THEN** show numeric text input field
- **AND** display placeholder "Enter Age"
- **AND** show numeric keyboard on focus
- **AND** accept integer values only (0-120 range)

#### Scenario: Age mode validation
- **WHEN** user submits age value
- **THEN** validate age >= 0 (allow zero for "at birth")
- **AND** validate age <= patient current age
- **AND** validate patient birth date exists
- **AND** show appropriate error if validation fails

#### Scenario: Age to date conversion
- **WHEN** user submits valid age value
- **THEN** compute event year as: patient birth year + age value
- **AND** use patient birth month and day for event date
- **AND** store both age input and computed date
- **AND** display "Age [value]" in patient view
- **AND** display "Age [value] (est. [year])" in provider view

### Requirement: Mode Switching

The system SHALL handle mode switching with appropriate data preservation or clearing.

#### Scenario: Mode switch with data
- **WHEN** user switches mode with existing data in current mode
- **THEN** show confirmation dialog
- **AND** message: "Switching modes will clear your current entry"
- **AND** provide Cancel and Switch options
- **AND** clear previous mode data if user confirms Switch
- **AND** keep previous mode if user selects Cancel

#### Scenario: Age to date preservation attempt
- **WHEN** user switches from Age mode to Date mode
- **THEN** show confirmation with computed date
- **AND** message: "We've calculated this as approximately [date] based on your age"
- **AND** pre-populate calendar with computed date if user confirms
- **AND** allow user to refine date precision

### Requirement: Data Storage

The system SHALL store complete dual-mode date information for both input methods.

#### Scenario: Database storage structure
- **WHEN** user saves dual-mode date field
- **THEN** store full structure in JSONB column ([field]_raw)
- **AND** generate computed date in timestamp column ([field]_computed_date)
- **AND** generate patient display text ([field]_display_pt)
- **AND** generate provider display text ([field]_display_pr)
- **AND** index computed date column for queries

## Implementation Details

### Component Structure

**DualModeDateInput Component:**
```typescript
interface DualModeDateInputProps {
  value?: DualModeDate;
  onChange: (value: DualModeDate) => void;
  label: string;
  framework: 'framework-1' | 'framework-2';  // Integration with date frameworks
  allowFuture?: boolean;  // For future event dates
  showCertainty?: boolean;  // Show certainty toggle
}

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
    referenceDate: Date;  // When age was entered
  };
  computedDate?: Date;
  displayText: string;
  enteredAt: Date;
  updatedAt: Date;
}
```

### Database Schema

```sql
-- Dual-mode date storage
CREATE TABLE surgeries (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  name VARCHAR(255) NOT NULL,

  -- Dual-mode date stored as JSONB
  when_raw JSONB,

  -- Computed column for queries (indexed)
  when_computed_date TIMESTAMP GENERATED ALWAYS AS
    (CASE
      WHEN (when_raw->>'inputMode') = 'date'
        THEN (when_raw->'dateSelection'->>'selectedDate')::TIMESTAMP
      WHEN (when_raw->>'inputMode') = 'age'
        THEN compute_date_from_age(
          (when_raw->'ageInput'->>'ageValue')::INTEGER,
          patient_id
        )
      ELSE NULL
    END) STORED,

  -- Display columns
  when_display_pt VARCHAR(100),  -- "March 2021" or "Age 25"
  when_display_pr VARCHAR(100),  -- "2021-03-30" or "Age 25 (est. 1996)"

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for date queries
CREATE INDEX idx_surgeries_when_computed ON surgeries(when_computed_date);

-- Age to date conversion function
CREATE FUNCTION compute_date_from_age(age_value INTEGER, patient_id_param UUID)
RETURNS TIMESTAMP AS $$
DECLARE
  birth_date DATE;
  event_year INTEGER;
BEGIN
  SELECT date_of_birth INTO birth_date
  FROM patients WHERE id = patient_id_param;

  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;

  event_year := EXTRACT(YEAR FROM birth_date) + age_value;

  RETURN make_date(
    event_year,
    EXTRACT(MONTH FROM birth_date)::INTEGER,
    EXTRACT(DAY FROM birth_date)::INTEGER
  )::TIMESTAMP;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### Display Logic

**Patient View (UI[Pt]):**
- Date mode: "March 2021", "2020", "Mar 30, 2021"
- Age mode: "Age 25", "I was 25 years old"

**Provider View (UI[Pr]):**
- Date mode: "2021-03-30", "2020-03-XX", "2020-XX-XX"
- Age mode: "Age 25 (est. 1996-03-15)", "Age 25 (~1996)"

## Where Used

- **Surgeries**: "When" field (when surgery occurred)
- **Immunizations**: "When" field (when vaccination received)
- **Conditions**: Diagnosis dates, last occurrence dates, resolution dates
- **Medications**: Prescribed/Start day (when medication started)
- **Allergies**: Onset date (future expansion)
- **Supplements**: Start date (future expansion)

## Dependencies

- Date/Time Selection Framework (Framework 1 and 2)
- Patient birth date (required for age-to-date conversion)
- Calendar picker component with progressive disclosure
- Three-view architecture for display formatting

## Compliance

### Accessibility
- Screen reader: "Date input mode selector, currently set to Date"
- Keyboard: Tab to mode selector → Arrow keys to change → Tab to input
- Voice control: "Tap Date mode", "Tap Age mode", "Enter age 25"

### Validation
- Date mode: Not in future (past events), not before birth, allow partial dates
- Age mode: Integer only, 0-120 range, not exceed current age, require birth date
- Mode switching: Confirm data loss, preserve computed date when possible

### Data Integrity
- Store complete input structure (JSONB)
- Maintain computed date for queries (indexed column)
- Generate view-specific display formats (pt/pr columns)
- Track input mode and entry timestamp
