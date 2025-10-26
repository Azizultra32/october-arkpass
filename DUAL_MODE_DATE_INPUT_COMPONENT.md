# Dual-Mode Date Input Component - System-Wide Pattern

**Status**: 🚨 CRITICAL SYSTEM-WIDE COMPONENT
**Discovered in**: Surgeries "When" field (Node 1483:8455, 1755:42615)
**Confirmed in**: Immunizations "When" field (Node 1483:8462)
**Hypothesis**: Applies to ALL date input fields across the system

---

## Overview

The Dual-Mode Date Input is a reusable UI component that allows users to enter dates in two ways:
1. **Date Mode**: Traditional calendar picker with progressive disclosure
2. **Age Mode**: Age-based input ("I was 25 years old")

### Why Both Modes?

**User Memory Patterns**:
- Some users remember events by date: "March 2020"
- Others remember by life context: "I was 25 years old"
- System accommodates both mental models

**Use Cases**:
- **Date mode**: Recent events, documented records, precise recollection
- **Age mode**: Childhood events, distant past, approximate recollection

---

## Visual Specification

### Component Layout

```
┌──────────────────────────────────────────────────────┐
│  When                                                │  ← Field label
│  ┌─────────────┐  ┌──────────────────────────────┐ │
│  │ Date      ▼ │  │ Select Date              📅  │ │
│  └─────────────┘  └──────────────────────────────┘ │
│   107px width      Flexible width                   │
│   Mode selector    Date/Age input component         │
│                    (changes based on mode)          │
└──────────────────────────────────────────────────────┘
```

### Component Dimensions

**Left Component - Mode Selector**:
- Width: 107px (fixed)
- Height: 58px
- Type: Dropdown
- Options: "Date" | "Age"
- Visual: Chevron icon (▼) on right

**Right Component - Input Field**:
- Width: Flexible (fills remaining space)
- Height: 58px
- Type: Dynamic (changes based on mode)
- Gap from selector: 16px

---

## Mode States

### State 1: Date Mode Selected

**Mode selector shows**: "Date" with dropdown chevron

**Input component shows**:
- Calendar picker icon (📅) on right
- Placeholder: "Select Date" (empty state)
- Value: "Mar 30, 2021" (populated state)
- Behavior: Opens calendar picker on tap

**Calendar Picker Behavior**:
- Progressive disclosure: Year → Month → Date
- Can stop at any level (year-only, month-only, or full date)
- See [DATE_TIME_SELECTION_FRAMEWORK.md](DATE_TIME_SELECTION_FRAMEWORK.md) for framework assignment

---

### State 2: Age Mode Selected

**Mode selector shows**: "Age" with dropdown chevron

**Input component shows**:
- Text input field
- Placeholder: "Enter Age"
- Value: "25" (populated state)
- Behavior: Numeric keyboard, accepts whole numbers

**Age Input Constraints**:
- Type: Integer only
- Range: 0-120 (configurable)
- Validation: Must be positive integer
- Format: "25" (no decimal places)

---

## Data Model

### TypeScript Interface

```typescript
interface DualModeDate {
  // User-selected input mode
  inputMode: 'date' | 'age';

  // For Date mode
  dateSelection?: {
    year?: number;        // e.g., 2021
    month?: number;       // 1-12
    day?: number;         // 1-31
    precision: 'year' | 'month' | 'day'; // How specific user was
    selectedDate?: Date;  // ISO timestamp if full date
  };

  // For Age mode
  ageInput?: {
    ageValue: number;     // e.g., 25
    ageAtEvent: number;   // Same as ageValue (redundant but explicit)
    referenceDate?: Date; // Today's date when age was entered
  };

  // Computed/Displayed date (for both modes)
  computedDate?: Date;    // Best-effort date calculation
  displayText: string;    // Human-readable display (e.g., "March 2021", "Age 25")

  // Metadata
  certainty?: 'certain' | 'somewhat_certain' | 'uncertain' | null;
  enteredAt: Date;        // When user entered this data
  updatedAt: Date;        // Last modification timestamp
}
```

---

### Database Storage

#### Option A: Single JSONB Column (Recommended)

```sql
CREATE TABLE surgeries (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  name VARCHAR(255) NOT NULL,

  -- Dual-mode date stored as JSONB
  when_raw JSONB, -- Stores full DualModeDate structure

  -- Computed columns for queries (indexed)
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

  -- Display columns (for three-view pattern)
  when_display_pt VARCHAR(100),  -- "March 2021" or "Age 25"
  when_display_pr VARCHAR(100),  -- "2021-03-30" or "Age 25 (est. 1996)"
  when_display_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for date-based queries
CREATE INDEX idx_surgeries_when_computed ON surgeries(when_computed_date);
```

#### Option B: Separate Columns (Alternative)

```sql
CREATE TABLE surgeries (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  name VARCHAR(255) NOT NULL,

  -- Mode tracking
  when_input_mode VARCHAR(10) CHECK (when_input_mode IN ('date', 'age')),

  -- Date mode fields
  when_date_year INTEGER,
  when_date_month INTEGER,
  when_date_day INTEGER,
  when_date_precision VARCHAR(10),
  when_date_selected TIMESTAMP,

  -- Age mode fields
  when_age_value INTEGER,
  when_age_reference_date DATE,

  -- Computed date (indexed)
  when_computed_date TIMESTAMP,

  -- Display columns
  when_display_pt VARCHAR(100),
  when_display_pr VARCHAR(100),
  when_display_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Recommendation**: Use Option A (JSONB) for flexibility and easier future changes.

---

## Display Logic (Three-View Architecture)

### Patient View (UI[Pt])

**Date Mode Display**:
```
When: March 2021          (month precision)
When: 2020                (year precision)
When: Mar 30, 2021        (day precision)
```

**Age Mode Display**:
```
When: Age 25
When: I was 25 years old  (expanded prose)
```

---

### Provider View (UI[Pr])

**Date Mode Display**:
```
When: 2021-03-30          (ISO format, day precision)
When: 2020-03-XX          (ISO format, month precision)
When: 2020-XX-XX          (ISO format, year precision)
```

**Age Mode Display**:
```
When: Age 25 (est. 1996-03-15)  (with computed date)
When: Age 25 (~1996)            (year-only estimate)
```

---

### Database (DB)

**Stored JSONB Example (Date Mode)**:
```json
{
  "inputMode": "date",
  "dateSelection": {
    "year": 2021,
    "month": 3,
    "day": 30,
    "precision": "day",
    "selectedDate": "2021-03-30T00:00:00Z"
  },
  "computedDate": "2021-03-30T00:00:00Z",
  "displayText": "Mar 30, 2021",
  "enteredAt": "2024-10-25T10:30:00Z",
  "updatedAt": "2024-10-25T10:30:00Z"
}
```

**Stored JSONB Example (Age Mode)**:
```json
{
  "inputMode": "age",
  "ageInput": {
    "ageValue": 25,
    "ageAtEvent": 25,
    "referenceDate": "2024-10-25"
  },
  "computedDate": "1999-03-15T00:00:00Z",
  "displayText": "Age 25",
  "enteredAt": "2024-10-25T10:30:00Z",
  "updatedAt": "2024-10-25T10:30:00Z"
}
```

---

## Age-to-Date Conversion Logic

### Computing Date from Age

**Algorithm**:
```typescript
function computeDateFromAge(
  ageValue: number,
  patientBirthDate: Date,
  referenceDate: Date = new Date()
): Date {
  // Calculate patient's birth year
  const birthYear = patientBirthDate.getFullYear();

  // Calculate event year
  const eventYear = birthYear + ageValue;

  // Use patient's birth month/day for event date (approximation)
  const computedDate = new Date(
    eventYear,
    patientBirthDate.getMonth(),
    patientBirthDate.getDate()
  );

  return computedDate;
}
```

**Example**:
- Patient birth date: March 15, 1974
- User enters: "Age 25"
- Computed date: March 15, 1999 (1974 + 25)

**Precision Note**: Age-based dates are approximations. Display should indicate this: "Age 25 (est. 1999)" or "Age 25 (~1999)".

---

### Edge Cases

**1. Patient birth date unknown**:
- Cannot compute date from age
- Store age value only
- Display: "Age 25 (birth date needed for precise date)"

**2. Age exceeds patient's current age**:
- Validation error
- Show: "Age cannot be greater than your current age (49 years)"

**3. Age is 0**:
- Valid (at birth)
- Computed date = patient birth date

**4. Negative age**:
- Invalid
- Validation error: "Age must be 0 or greater"

---

## UI/UX Behavior

### Mode Switching

**Scenario 1: User switches from Date to Age (with data loss warning)**

```
User has entered: "March 2021" in Date mode
User taps mode selector, changes to "Age"

System shows confirmation dialog:
┌─────────────────────────────────────────────┐
│  Switch Input Mode?                         │
│                                             │
│  Switching to Age mode will clear your     │
│  current date selection.                    │
│                                             │
│  [Cancel]              [Switch to Age]     │
└─────────────────────────────────────────────┘
```

**If user confirms**: Date selection cleared, Age input shown empty

---

**Scenario 2: User switches from Age to Date (with data preservation attempt)**

```
User has entered: "25" in Age mode
User taps mode selector, changes to "Date"

System shows confirmation dialog:
┌─────────────────────────────────────────────┐
│  Switch Input Mode?                         │
│                                             │
│  We've calculated this as approximately    │
│  March 1999 based on your age.             │
│                                             │
│  Switch to date mode to refine?            │
│                                             │
│  [Cancel]              [Switch to Date]    │
└─────────────────────────────────────────────┘
```

**If user confirms**:
- Date picker pre-populated with computed date (March 1999)
- User can refine to specific month/day

---

### Accessibility

**Screen Reader Announcements**:
- Mode selector: "Date input mode selector, currently set to Date"
- Date mode: "Select date button, opens calendar picker"
- Age mode: "Enter age text field, numeric input"

**Keyboard Navigation**:
- Tab order: Mode selector → Input component
- Mode selector: Arrow keys to change mode
- Date picker: Standard calendar navigation
- Age input: Numeric keyboard with done button

**Voice Control**:
- "Tap Date mode" → Opens mode selector, selects Date
- "Tap Age mode" → Opens mode selector, selects Age
- "Enter age 25" → Fills age input with 25
- "Select date March 2021" → Opens picker, selects March 2021

---

## Integration with Date/Time Frameworks

### Framework Assignment by Feature

The dual-mode component is the **input mechanism**. The **framework** (Framework 1 or 2) determines:
- Calendar picker behavior (progressive disclosure paths)
- Quick options ("Within 1yr", "Within 5yr", etc.)
- Certainty toggle (if applicable)

**Framework mapping** (see [IMPORTANT_DATE_FIELDS_SUMMARY.md](IMPORTANT_DATE_FIELDS_SUMMARY.md)):

| Feature | Field | Framework | Dual-Mode? | Certainty? |
|---|---|---|---|---|
| Conditions | Chronic diagnosis date | Framework 1 | ✅ Yes | ✅ Yes |
| Conditions | Transient-Recurrent last occurrence | Framework 1 | ✅ Yes | ✅ Yes |
| Conditions | Transient-Resolved start date | Framework 1 | ✅ Yes | ✅ Yes |
| Conditions | Transient-Resolved end date | Framework 2 | ✅ Yes | ✅ Yes |
| Medications | Prescribed/Start day (at diagnosis) | Framework 1 | ✅ Yes | ❌ No |
| Medications | Prescribed/Start day (after diagnosis) | Framework 1 | ✅ Yes | ❌ No |
| Surgeries | When | Framework 1 (hypothesis) | ✅ Yes | ❓ TBD |
| Allergies | Onset | Framework 1 (hypothesis) | ✅ Yes | ❓ TBD |
| Supplements | Start | Framework 1 (hypothesis) | ✅ Yes | ❌ No |
| Immunizations | When | Framework 1 (hypothesis) | ✅ Yes | ❌ No |
| Immunizations | Date Administered | Simple picker (no dual-mode?) | ❓ TBD | ❌ No |

---

### Combining Dual-Mode with Progressive Disclosure

**Example: Surgery "When" field with Framework 1**

```
Step 1: Mode Selection
┌─────────────────────────────────────────┐
│  When did the surgery occur?           │
│  ┌─────────────┐  ┌──────────────────┐ │
│  │ Date      ▼ │  │ Within 1 year    │ │ ← Framework 1 quick option
│  └─────────────┘  │ Within 5 years   │ │
│                   │ Over 5 years     │ │
│                   │ Select date  📅  │ │
│                   └──────────────────┘ │
└─────────────────────────────────────────┘

Step 2a: User selects "Within 1 year"
→ Progressive disclosure: Select year → month → day

Step 2b: User switches to Age mode
┌─────────────────────────────────────────┐
│  When did the surgery occur?           │
│  ┌─────────────┐  ┌──────────────────┐ │
│  │ Age       ▼ │  │ Enter Age        │ │ ← Age input shown
│  └─────────────┘  └──────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Validation Rules

### Date Mode Validation

**1. Date cannot be in the future** (for past events)
```
Error: "Surgery date cannot be in the future"
```

**2. Date cannot be before patient birth**
```
Error: "Surgery date cannot be before your birth date (March 15, 1974)"
```

**3. Incomplete date warnings** (progressive disclosure)
```
Warning: "Year-only precision selected. Add month/day if known for better tracking."
```

---

### Age Mode Validation

**1. Age cannot be negative**
```
Error: "Age must be 0 or greater"
```

**2. Age cannot exceed current age**
```
Error: "Age cannot be greater than your current age (49 years)"
```

**3. Age must be integer**
```
Error: "Age must be a whole number"
```

**4. Patient birth date required**
```
Warning: "Birth date needed to calculate precise date from age. Please update your profile."
```

---

## Armada Logic Language (ALL) Rules

### Rule 1: Dual-Mode Toggle Confirmation

```
RULE: DualModeDate.ModeSwitch.ConfirmDataLoss

ON @DualModeDate.modeSelector.change

WHEN @DualModeDate.dateSelection IS NOT NULL
  OR @DualModeDate.ageInput IS NOT NULL

THEN:
  SHOW confirmation_dialog
    TITLE: "Switch Input Mode?"
    MESSAGE: "Switching modes will clear your current entry."
    ACTIONS: ["Cancel", "Switch"]

  IF user_confirms:
    CLEAR @DualModeDate[current_mode_data]
    SET @DualModeDate.inputMode = new_mode
    SHOW empty_input_field
  ELSE:
    REVERT @DualModeDate.inputMode = previous_mode
```

---

### Rule 2: Age to Date Conversion

```
RULE: DualModeDate.AgeMode.ComputeDate

ON @DualModeDate.ageInput.submit

WHEN @DualModeDate.inputMode = 'age'
  AND @Patient.birthDate IS NOT NULL

THEN:
  COMPUTE eventYear = @Patient.birthDate.year + @DualModeDate.ageInput.ageValue
  COMPUTE eventDate = new Date(
    eventYear,
    @Patient.birthDate.month,
    @Patient.birthDate.day
  )

  SET @DualModeDate.computedDate = eventDate
  SET @DualModeDate.displayText = "Age " + @DualModeDate.ageInput.ageValue

  UI[Pt]: DISPLAY "Age " + ageValue
  UI[Pr]: DISPLAY "Age " + ageValue + " (est. " + eventYear + ")"
  DB:     STORE @DualModeDate as JSONB
```

---

### Rule 3: Date Mode to Age Mode Suggestion

```
RULE: DualModeDate.DateMode.SuggestAgeMode

ON @DualModeDate.dateSelection.error

WHEN @DualModeDate.dateSelection IS NULL
  AND user_attempts >= 2
  AND @DualModeDate.inputMode = 'date'

THEN:
  SHOW tooltip
    POSITION: near_mode_selector
    MESSAGE: "Not sure of the exact date? Try Age mode instead."
    ACTION: "Switch to Age"

  IF user_taps_switch:
    SET @DualModeDate.inputMode = 'age'
    SHOW age_input_field
```

---

### Rule 4: Age Exceeds Current Age Validation

```
RULE: DualModeDate.AgeMode.ValidateRange

ON @DualModeDate.ageInput.submit

WHEN @DualModeDate.inputMode = 'age'
  AND @DualModeDate.ageInput.ageValue > @Patient.currentAge

THEN:
  SHOW error_message
    MESSAGE: "Age cannot be greater than your current age ("
             + @Patient.currentAge + " years)"
    POSITION: below_age_input

  CLEAR @DualModeDate.ageInput.ageValue
  FOCUS @DualModeDate.ageInput.field
```

---

## Implementation Checklist

### Frontend Components

- [ ] Create `DualModeDateInput` component
  - [ ] Mode selector dropdown (107px fixed width)
  - [ ] Dynamic input component (date picker OR age input)
  - [ ] 16px gap between components
  - [ ] Mode switch confirmation dialog
  - [ ] Data preservation on Age→Date switch

- [ ] Create `DatePickerInput` sub-component
  - [ ] Calendar icon (📅)
  - [ ] Opens calendar picker on tap
  - [ ] Integrates with Framework 1 or 2 progressive disclosure
  - [ ] Placeholder: "Select Date"

- [ ] Create `AgeInput` sub-component
  - [ ] Numeric keyboard
  - [ ] Placeholder: "Enter Age"
  - [ ] Integer validation (0-120)
  - [ ] Real-time validation feedback

- [ ] Integrate with Framework 1/2 logic
  - [ ] Pass framework parameter to component
  - [ ] Show appropriate quick options (if Date mode)
  - [ ] Show certainty toggle (if applicable)

---

### Backend Logic

- [ ] Create `compute_date_from_age()` database function
  - [ ] Accepts: ageValue, patientId
  - [ ] Returns: Computed date (TIMESTAMP)
  - [ ] Handles null birth dates gracefully

- [ ] Create JSONB storage column: `{field}_raw`
  - [ ] Stores full DualModeDate structure
  - [ ] JSONB type for flexibility

- [ ] Create computed column: `{field}_computed_date`
  - [ ] GENERATED ALWAYS AS stored column
  - [ ] Indexed for queries
  - [ ] Handles both date and age modes

- [ ] Create display columns: `{field}_display_pt`, `{field}_display_pr`
  - [ ] Format for patient view
  - [ ] Format for provider view
  - [ ] Update trigger on raw data change

---

### Validation & Error Handling

- [ ] Age mode validations
  - [ ] Age >= 0
  - [ ] Age <= current age
  - [ ] Age is integer
  - [ ] Patient birth date exists

- [ ] Date mode validations
  - [ ] Date not in future (for past events)
  - [ ] Date not before birth
  - [ ] Date completeness warnings

- [ ] Mode switching
  - [ ] Confirmation dialog for data loss
  - [ ] Data preservation attempt (Age→Date)
  - [ ] Clear previous mode data on switch

---

### Accessibility

- [ ] Screen reader support
  - [ ] Mode selector announcements
  - [ ] Input field announcements
  - [ ] Error message announcements

- [ ] Keyboard navigation
  - [ ] Tab order: selector → input
  - [ ] Arrow keys for mode selector
  - [ ] Enter key to submit

- [ ] Voice control
  - [ ] "Tap Date mode" command
  - [ ] "Tap Age mode" command
  - [ ] "Enter age [number]" command

---

### Testing

- [ ] Unit tests
  - [ ] Age to date conversion
  - [ ] Date to age conversion (reverse)
  - [ ] Mode switching with data loss
  - [ ] Mode switching with data preservation

- [ ] Integration tests
  - [ ] Framework 1 integration
  - [ ] Framework 2 integration
  - [ ] Database storage and retrieval
  - [ ] Display column generation

- [ ] Edge case tests
  - [ ] Age 0 (at birth)
  - [ ] Age > current age (error)
  - [ ] Negative age (error)
  - [ ] Null birth date (graceful degradation)
  - [ ] Future date for past event (error)
  - [ ] Date before birth (error)

- [ ] Accessibility tests
  - [ ] Screen reader navigation
  - [ ] Keyboard-only navigation
  - [ ] Voice control commands

---

## Open Questions

### 1. Should Age Mode Support Decimal Ages?
**Current**: Integer only (e.g., 25)
**Question**: Allow "25.5" for "25 and a half years old"?
**Recommendation**: Start with integer, add decimal support if users request it

---

### 2. Age Mode for Future Events?
**Current**: Age mode is for past events
**Question**: Support "I will be 50 years old" for future surgeries?
**Recommendation**: Keep age mode for past events only; use date mode for future

---

### 3. Display Age Range for Year-Only Dates?
**Current**: "2020" displayed as "2020"
**Question**: Display as "Age 45-46" if user entered "Age 45" and spans two years?
**Recommendation**: Show single age value, add tooltip with date range

---

### 4. Should All Features Use Dual-Mode?
**Current**: Confirmed in Surgeries, Immunizations
**Question**: Apply to Allergies Onset, Supplements Start, etc.?
**Recommendation**: Yes, use system-wide for consistency

---

### 5. What About "Date Administered" in Immunizations?
**Current**: Immunizations has both "When" (dual-mode) and "Date Administered" (calendar only)
**Question**: Why two separate date fields?
**Hypothesis**:
  - "When" = User's memory/recollection (dual-mode)
  - "Date Administered" = Official vaccine record date (precise calendar only)
**Action needed**: Clarify with design team

---

## Related Documentation

- [DATE_TIME_SELECTION_FRAMEWORK.md](DATE_TIME_SELECTION_FRAMEWORK.md) - Framework 1 & 2 specifications
- [IMPORTANT_DATE_FIELDS_SUMMARY.md](IMPORTANT_DATE_FIELDS_SUMMARY.md) - Framework assignment table
- [SURGERIES_SCREENS_SPECS.md](SURGERIES_SCREENS_SPECS.md) - First discovery of dual-mode pattern
- [IMMUNIZATIONS_SCREENS_SPECS.md](IMMUNIZATIONS_SCREENS_SPECS.md) - Confirmation of dual-mode pattern
- [DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md](DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md) - Display column pattern

---

**Status**: ✅ Pattern documented, ready for implementation
**Next**: Apply to all date fields across system, implement reusable component
