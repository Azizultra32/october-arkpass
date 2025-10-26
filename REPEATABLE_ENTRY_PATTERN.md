# Repeatable Entry Pattern - UI Pattern for Array Data

**Status**: 🚨 NEW UI PATTERN DISCOVERED
**Discovered in**: Immunizations "Add more" doses (Node 1483:8462)
**Use case**: Multiple doses per vaccine (1st dose, 2nd dose, booster)
**Potential reuse**: Any feature with array/list data within a single record

---

## Overview

The Repeatable Entry Pattern is a UI pattern for entering multiple related items within a single parent record. Instead of creating separate records, users can add multiple entries (doses, occurrences, etc.) that belong to the same parent entity.

### Example Use Case: Immunizations

**Parent Record**: Moderna Spikevax (Covid-19 vaccine)
**Child Entries**:
- Dose 1: Mar 30, 2021, Arm/gluteal
- Dose 2: Apr 27, 2021, Arm/gluteal
- Booster: Nov 15, 2021, Arm/gluteal

All doses share the same vaccine name and purpose, but have different administration dates and locations.

---

## Visual Specification

### Layout (Edit Immunization Expanded)

```
┌─────────────────────────────────────────────────┐
│  ← Immunizations                                │
│                                                 │
│  [Cancel]                      [Save]          │
│                                                 │
│  Name*                                         │
│  [Moderna Spikevax___________]                 │  ← Parent field
│                                                 │
│  Description/Purpose                            │
│  [Covid-19___________________]                 │  ← Parent field
│  [___________________________]                 │
│                                                 │
│  ────────────────────────────────────────────  │  ← Visual separator
│                                                 │
│  When                                          │  ← Dose 1 fields
│  [Date_____▼] [Mar 30, 2021_____] 📅          │
│                                                 │
│  Date Administered                             │
│  [Mar 30, 2021_______________] 📅              │
│                                                 │
│  Location Administered                         │
│  [Arm/gluteal________________] ▼               │
│                                                 │
│  + Add more                                     │  ← Repeatable trigger
│                                                 │
│  ────────────────────────────────────────────  │  ← Visual separator
│                                                 │
│  When                                          │  ← Dose 2 fields (if added)
│  [Date_____▼] [Apr 27, 2021_____] 📅          │
│                                                 │
│  Date Administered                             │
│  [Apr 27, 2021_______________] 📅              │
│                                                 │
│  Location Administered                         │
│  [Arm/gluteal________________] ▼               │
│                                                 │
│  ✕ Remove this dose                            │  ← Delete action
│                                                 │
│  + Add more                                     │  ← Repeatable trigger (moves down)
│                                                 │
│  Documents                                      │  ← Parent section
│  + Add Documents                               │
│                                                 │
│  Show less ▲                                    │
│                                                 │
│  [Delete Immunization]                         │  ← Delete entire parent
└─────────────────────────────────────────────────┘
```

---

## UI Components

### 1. Parent Fields (Non-Repeating)
- **Position**: Top of form
- **Examples**: Name, Description/Purpose
- **Behavior**: Single value, applies to all child entries

---

### 2. Child Fields (Repeating)
- **Position**: Below parent fields, grouped by entry
- **Examples**: When, Date Administered, Location Administered
- **Behavior**: Each child entry has its own set of these fields
- **Visual grouping**: Subtle background or border around each entry

---

### 3. "+ Add more" Link
- **Style**: Blue text, "+" icon prefix
- **Position**: After last child entry
- **Behavior**: On tap, inserts new blank child entry fields
- **Label**: "+ Add more" (configurable: "+ Add more doses", "+ Add another", etc.)

---

### 4. "✕ Remove this [entry]" Action
- **Style**: Red text, "✕" icon prefix (or trash icon)
- **Position**: Bottom of each child entry (except first one)
- **Behavior**: Removes that child entry, shows confirmation if data exists
- **Label**: "✕ Remove this dose" (configurable per feature)
- **First entry rule**: First entry cannot be removed (must have at least one)

---

### 5. Visual Separators
- **Style**: Horizontal line or subtle background color change
- **Position**: Between child entries
- **Purpose**: Clearly delineate where one entry ends and next begins

---

## Data Model

### TypeScript Interface

```typescript
// Parent record
interface Immunization {
  id: string;
  patientId: string;

  // Parent fields (single values)
  name: string;                    // Required
  descriptionPurpose?: string;

  // Child entries (array)
  doses: ImmunizationDose[];       // Minimum 1 entry

  // Other parent fields
  documents?: ImmunizationDocument[];

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Child entry
interface ImmunizationDose {
  id: string;
  immunizationId: string;          // Foreign key to parent

  // Repeatable fields
  when?: DualModeDate;
  dateAdministered?: Date;
  locationAdministered?: string;

  // Metadata
  doseNumber?: number;             // Auto-incremented: 1, 2, 3, ...
  doseType?: 'initial' | 'booster' | 'other';
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Database Schema

```sql
-- Parent table
CREATE TABLE immunizations (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  -- Parent fields
  name VARCHAR(255) NOT NULL,
  description_purpose TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Child table
CREATE TABLE immunization_doses (
  id UUID PRIMARY KEY,
  immunization_id UUID REFERENCES immunizations(id) ON DELETE CASCADE,

  -- Repeatable fields
  when_raw JSONB,                  -- Dual-mode date input
  date_administered TIMESTAMP,
  location_administered VARCHAR(100),

  -- Metadata
  dose_number INTEGER NOT NULL,    -- 1, 2, 3, ...
  dose_type VARCHAR(50),           -- 'initial', 'booster', etc.

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure dose_number is unique per immunization
CREATE UNIQUE INDEX idx_immunization_doses_number
  ON immunization_doses(immunization_id, dose_number);

-- Index for chronological queries
CREATE INDEX idx_immunization_doses_date
  ON immunization_doses(date_administered);

-- Documents table (parent-level)
CREATE TABLE immunization_documents (
  id UUID PRIMARY KEY,
  immunization_id UUID REFERENCES immunizations(id) ON DELETE CASCADE,
  file_name VARCHAR(255),
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## User Flow

### Adding First Dose (Required)

**Step 1**: User taps "+ Add Immunization"

**Step 2**: Form opens in collapsed state
- Name* (required)
- Description/Purpose

**Step 3**: User taps "Show more"

**Step 4**: First dose fields appear (required, cannot remove)
- When (dual-mode)
- Date Administered
- Location Administered
- "+ Add more" link visible

**Step 5**: User fills first dose fields

---

### Adding Second Dose

**Step 1**: User taps "+ Add more"

**Step 2**: Second set of dose fields appears below first
- Visual separator between doses
- Same fields: When, Date Administered, Location Administered
- "✕ Remove this dose" link visible (only on 2nd+ doses)
- "+ Add more" link moves to bottom of new dose

**Step 3**: User fills second dose fields

**Step 4**: Can continue adding more doses (no limit)

---

### Removing a Dose

**Step 1**: User taps "✕ Remove this dose" on Dose 2

**Step 2**: If dose has data, show confirmation dialog:
```
┌─────────────────────────────────────────┐
│  Remove this dose?                      │
│                                         │
│  This will delete:                      │
│  • Date Administered: Apr 27, 2021      │
│  • Location: Arm/gluteal                │
│                                         │
│  This cannot be undone.                 │
│                                         │
│  [Cancel]              [Remove Dose]   │
└─────────────────────────────────────────┘
```

**Step 3**: If confirmed, dose entry removed, subsequent doses re-numbered

---

### Saving Record

**Step 1**: User taps "Save" button

**Step 2**: Validation runs:
- Parent required fields (Name)
- At least one dose entry
- Each dose: Optional fields (can be empty)

**Step 3**: If valid:
- Create parent record
- Create all child dose records
- Auto-assign dose_number (1, 2, 3, ...)
- Return to list view

**Step 4**: If invalid:
- Show error messages on fields
- Keep form open, scroll to first error

---

## Display Logic

### List View

**Shows parent fields only**:
```
┌───────────────────────────────────────┐
│  Moderna Spikevax                    │  ← Name (bold)
│  Covid-19                            │  ← Description (regular)
│  • 3 doses                            │  ← Dose count badge (optional)
└───────────────────────────────────────┘
```

**Alternative with last dose date**:
```
┌───────────────────────────────────────┐
│  Moderna Spikevax                    │
│  Covid-19 • Last dose: Nov 15, 2021  │
└───────────────────────────────────────┘
```

---

### View Screen (Collapsed)

**Shows parent fields + first dose summary**:
```
┌─────────────────────────────────────────┐
│  Moderna Spikevax                      │
│                                         │
│  Description/Purpose                    │
│  Covid-19                              │
│                                         │
│  First Dose                            │  ← Only first dose shown
│  Mar 30, 2021 • Arm/gluteal            │
│                                         │
│  Show more ▼                            │
└─────────────────────────────────────────┘
```

---

### View Screen (Expanded)

**Shows all doses chronologically**:
```
┌─────────────────────────────────────────┐
│  Moderna Spikevax                      │
│                                         │
│  Description/Purpose                    │
│  Covid-19                              │
│                                         │
│  Dose 1                                │  ← Dose number label
│  When: March 2021                      │
│  Date Administered: Mar 30, 2021       │
│  Location Administered: Arm/gluteal    │
│                                         │
│  Dose 2                                │
│  When: April 2021                      │
│  Date Administered: Apr 27, 2021       │
│  Location Administered: Arm/gluteal    │
│                                         │
│  Booster                               │  ← Type label (if set)
│  When: November 2021                   │
│  Date Administered: Nov 15, 2021       │
│  Location Administered: Arm/gluteal    │
│                                         │
│  Documents                             │
│  [Empty state]                         │
│                                         │
│  Show less ▲                            │
└─────────────────────────────────────────┘
```

---

## Validation Rules

### Parent-Level Validation

**1. Required parent fields must be filled**
```
Error: "Name is required"
```

**2. At least one child entry required**
```
Error: "At least one dose must be entered"
```

---

### Child-Level Validation

**1. All fields optional (but dose must exist)**
```
Valid: Empty dose entry (will be ignored on save)
Valid: Partial dose entry (date only, no location)
```

**2. Date validation (if entered)**
```
Error: "Date Administered cannot be in the future"
Error: "Date Administered cannot be before birth date"
```

**3. Chronological order recommended (warning, not error)**
```
Warning: "Dose 2 date is before Dose 1 date. Is this correct?"
```

---

### Delete Validation

**1. Cannot remove first dose**
```
Info: "At least one dose is required. To remove all doses, delete the immunization."
```

**2. Confirm removal of dose with data**
```
Confirmation: "Remove this dose? This cannot be undone."
```

---

## Auto-Numbering Logic

### Dose Number Assignment

**On Save**:
```typescript
function assignDoseNumbers(doses: ImmunizationDose[]): void {
  // Sort by date administered (if available)
  const sortedDoses = doses
    .filter(d => d.dateAdministered) // Doses with dates first
    .sort((a, b) => a.dateAdministered - b.dateAdministered)
    .concat(doses.filter(d => !d.dateAdministered)); // Doses without dates last

  // Assign sequential numbers
  sortedDoses.forEach((dose, index) => {
    dose.doseNumber = index + 1;
  });
}
```

**Result**:
- Doses sorted by date (earliest = 1)
- Doses without dates assigned numbers at end
- Numbers are 1-indexed: 1, 2, 3, ...

---

### Dose Type Assignment (Optional)

**Heuristic**:
```typescript
function inferDoseType(doseNumber: number, totalDoses: number): string {
  if (doseNumber === 1) return 'initial';
  if (doseNumber === 2 && totalDoses === 2) return 'initial'; // 2-dose series
  if (doseNumber > 2) return 'booster';
  return 'other';
}
```

**Manual Override**: User can change dose type if needed

---

## Armada Logic Language (ALL) Rules

### Rule 1: Add More Dose Entry

```
RULE: RepeatableEntry.AddMore

ON @UI.addMoreLink.tap

WHEN @ImmunizationEdit.isExpanded = true

THEN:
  CREATE new_dose_entry
    WITH empty fields: when, dateAdministered, locationAdministered
    SET doseNumber = @Immunization.doses.count + 1

  INSERT new_dose_entry AFTER last_dose_entry

  SHOW visual_separator BEFORE new_dose_entry
  SHOW remove_link IN new_dose_entry

  MOVE @UI.addMoreLink TO bottom_of(new_dose_entry)
  SCROLL_TO new_dose_entry
```

---

### Rule 2: Remove Dose Entry

```
RULE: RepeatableEntry.RemoveDose

ON @UI.removeDoseLink.tap

WHEN @DoseEntry.doseNumber > 1
  AND @Immunization.doses.count > 1

THEN:
  IF @DoseEntry has_data:
    SHOW confirmation_dialog
      TITLE: "Remove this dose?"
      MESSAGE: "This will delete: [list fields]. This cannot be undone."
      ACTIONS: ["Cancel", "Remove Dose"]

    IF user_confirms:
      DELETE @DoseEntry
      RENUMBER remaining_doses
      REMOVE visual_separator
  ELSE:
    DELETE @DoseEntry
    REMOVE visual_separator

  SCROLL_TO previous_dose_entry
```

---

### Rule 3: Auto-Number Doses on Save

```
RULE: RepeatableEntry.AutoNumberDoses

ON @ImmunizationEdit.save

WHEN @Immunization.doses.count > 0

THEN:
  SORT @Immunization.doses BY dateAdministered ASC (nulls last)

  FOR EACH dose IN @Immunization.doses:
    SET dose.doseNumber = index + 1
    SET dose.doseType = inferDoseType(dose.doseNumber, total_count)

  SAVE @Immunization
  SAVE ALL @Immunization.doses
```

---

### Rule 4: Validate Minimum One Dose

```
RULE: RepeatableEntry.ValidateMinimumDose

ON @ImmunizationEdit.save

WHEN @Immunization.doses.count = 0
  OR @Immunization.doses.every(d => d.isEmpty)

THEN:
  SHOW error_message
    MESSAGE: "At least one dose must be entered"
    POSITION: below_addMoreLink

  PREVENT save
  FOCUS first_dose_field
```

---

### Rule 5: Chronological Order Warning

```
RULE: RepeatableEntry.ChronologicalWarning

ON @ImmunizationEdit.save

WHEN @Immunization.doses.count > 1
  AND doses_not_chronological

THEN:
  SHOW warning_dialog
    TITLE: "Check dose order"
    MESSAGE: "Dose 2 date is before Dose 1 date. Is this correct?"
    ACTIONS: ["Go Back", "Save Anyway"]

  IF user_chooses("Go Back"):
    PREVENT save
    SCROLL_TO out_of_order_dose
  ELSE:
    CONTINUE save
```

---

## Reusability Analysis

### Where Else Could This Pattern Apply?

**1. Conditions - Recurrent Episodes**
- **Parent**: "Migraine Headaches" (condition)
- **Children**: Episode 1 (Jan 2020), Episode 2 (Mar 2020), Episode 3 (Jun 2020)
- **Fields**: Date occurred, Severity, Triggers, Duration

**2. Medications - Dose Changes**
- **Parent**: "Metformin" (medication)
- **Children**: Dose 1 (500mg, Jan 2020-Mar 2020), Dose 2 (1000mg, Mar 2020-present)
- **Fields**: Dosage amount, Start date, End date

**3. Allergies - Allergic Reactions**
- **Parent**: "Penicillin" (allergy)
- **Children**: Reaction 1 (Rash, 2015), Reaction 2 (Anaphylaxis, 2018)
- **Fields**: Date occurred, Reaction type, Severity, Treatment

**4. Surgeries - Complications/Follow-ups**
- **Parent**: "Appendectomy" (surgery)
- **Children**: Initial surgery (Jan 2020), Complication (Feb 2020), Follow-up (Mar 2020)
- **Fields**: Date, Type (initial/complication/follow-up), Description

**5. Documents - Versions**
- **Parent**: "Lab Report - CBC" (document)
- **Children**: Version 1 (uploaded Jan 2020), Version 2 (updated Feb 2020)
- **Fields**: Upload date, File name, File size

---

### When NOT to Use This Pattern

**Use separate records when**:
1. **Each entry is conceptually independent** (e.g., different medications, different conditions)
2. **Entries have significantly different fields** (not just values, but structure)
3. **Entries need to be searched/filtered independently** (e.g., all surgeries across all patients)
4. **Relationship is many-to-many** (e.g., medications linked to multiple conditions)

**Use repeatable entry when**:
1. **Entries are tightly coupled to parent** (e.g., doses of same vaccine)
2. **Fields are identical across entries** (just different values)
3. **Entries are viewed/edited together** (rarely edited separately)
4. **Order/sequence matters** (e.g., dose 1, 2, 3)

---

## Implementation Checklist

### Frontend Components

- [ ] Create `RepeatableEntryContainer` component
  - [ ] Accepts parent fields config
  - [ ] Accepts child fields config
  - [ ] Manages array state for child entries
  - [ ] Handles add/remove actions

- [ ] Create `ChildEntryGroup` sub-component
  - [ ] Renders one set of child fields
  - [ ] Shows "✕ Remove" link (if not first entry)
  - [ ] Visual separator above entry
  - [ ] Auto-focus first field on add

- [ ] Create `AddMoreLink` component
  - [ ] Blue text with "+" icon
  - [ ] Configurable label
  - [ ] Smooth scroll to new entry
  - [ ] Haptic feedback on tap

- [ ] Create `RemoveEntryLink` component
  - [ ] Red text with "✕" icon
  - [ ] Configurable label
  - [ ] Confirmation dialog if data exists
  - [ ] Smooth removal animation

---

### Backend Logic

- [ ] Create parent-child relationship in database
  - [ ] Parent table with id
  - [ ] Child table with parent_id foreign key
  - [ ] ON DELETE CASCADE for child records

- [ ] Implement auto-numbering logic
  - [ ] Sort by date (if available)
  - [ ] Assign sequential numbers
  - [ ] Handle re-numbering on delete

- [ ] Implement dose type inference (optional)
  - [ ] Heuristic: first = initial, 3+ = booster
  - [ ] Allow manual override

---

### Validation & Error Handling

- [ ] Parent-level validation
  - [ ] Required fields
  - [ ] At least one child entry

- [ ] Child-level validation
  - [ ] Optional fields (but entry must exist)
  - [ ] Date validations
  - [ ] Chronological order warning

- [ ] Delete confirmation
  - [ ] Show data preview in dialog
  - [ ] Prevent deletion of last entry

---

### Testing

- [ ] Unit tests
  - [ ] Add entry
  - [ ] Remove entry (with confirmation)
  - [ ] Auto-numbering logic
  - [ ] Minimum one entry validation

- [ ] Integration tests
  - [ ] Save with multiple entries
  - [ ] Load and display multiple entries
  - [ ] Delete entry and re-number
  - [ ] Chronological order warning

- [ ] Edge cases
  - [ ] Add 10+ entries (scrolling, performance)
  - [ ] Remove all but one entry
  - [ ] Save with empty entry (should ignore)
  - [ ] Dates out of chronological order

---

## Open Questions

### 1. Maximum Number of Child Entries?
**Current**: No limit visible in Figma
**Question**: Should we cap at N entries (e.g., 10 doses max)?
**Recommendation**: No hard cap, but warn if >10 entries

---

### 2. Re-ordering Child Entries?
**Current**: No drag-to-reorder visible
**Question**: Allow user to manually reorder doses?
**Recommendation**: Auto-sort by date; if no date, order by creation

---

### 3. Bulk Actions (Delete All, Duplicate)?
**Current**: Only individual delete visible
**Question**: Add "Delete all doses" or "Duplicate this dose"?
**Recommendation**: Not in MVP; add if users request

---

### 4. Collapsible Child Entries?
**Current**: All doses expanded when form is expanded
**Question**: Allow collapsing individual doses (e.g., "Dose 1 ▼")?
**Recommendation**: Keep expanded for simplicity; add if forms get too long

---

### 5. Inline Editing in View Mode?
**Current**: Must enter Edit mode to modify doses
**Question**: Allow inline editing of individual doses in View mode?
**Recommendation**: No; keep edit mode separate for consistency

---

## Related Documentation

- [IMMUNIZATIONS_SCREENS_SPECS.md](IMMUNIZATIONS_SCREENS_SPECS.md) - Where pattern was discovered
- [DUAL_MODE_DATE_INPUT_COMPONENT.md](DUAL_MODE_DATE_INPUT_COMPONENT.md) - Date input used in child entries
- [DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md](DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md) - Parent-child data model

---

**Status**: ✅ Pattern documented, ready for implementation
**Next**: Evaluate reuse in other features (Conditions episodes, Medication dose changes, etc.)
