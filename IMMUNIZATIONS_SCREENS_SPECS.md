# Immunizations Screens - Complete Figma Extraction

**Extracted from**: Figma file `october-arkpass` via MCP
**Total screens extracted**: 7
**Pattern**: List → View (collapsed/expanded) → Edit (collapsed/expanded) → Add (collapsed/expanded)

---

## Screen Inventory

| # | Screen Name | Node ID | State | Key Elements |
|---|---|---|---|---|
| 1 | Immunizations List | 1483:8458 | Default | Cards with Name + Purpose |
| 2 | View Immunization (Collapsed) | 1483:8459 | Collapsed | Name, Description/Purpose |
| 3 | View Immunization (Expanded) | 1483:8460 | Expanded | + When, Date, Location, Documents |
| 4 | Edit Immunization (Collapsed) | 1483:8461 | Collapsed | Editable Name, Description |
| 5 | Edit Immunization (Expanded) | 1483:8462 | Expanded | All fields + "Add more" doses |
| 6 | Add Immunization (Collapsed) | 1483:8463 | Collapsed | Empty fields, Required marker |
| 7 | Add Immunization (Expanded) | 1483:8464 | Expanded | All fields visible |

---

## 1. Immunizations List (Node: 1483:8458)

### Layout
```
┌─────────────────────────────────────┐
│  Immunizations              [+]     │  ← Header with Add button
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ Moderna Spikevax           │   │  ← Vaccine name (bold, 20px)
│  │ Covid-19                   │   │  ← Purpose (regular, 16px)
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Elements Identified

**Card Structure** (UNIQUE - Different from other features):
- Primary text: Vaccine name (bold, 20px) - e.g., "Moderna Spikevax"
- Secondary text: Purpose/description (regular, 16px) - e.g., "Covid-19"
- Two-line card format (vs single line in Medications/Supplements)

**Example Data Shown**:
- Vaccine: "Moderna Spikevax"
- Purpose: "Covid-19"

**No Quick Add Feature**:
- Unlike Allergies and Supplements, no inline quick add visible
- Must use [+] button to add new immunization

---

## 2. View Immunization - Collapsed (Node: 1483:8459)

### Layout
```
┌─────────────────────────────────────┐
│  ← Immunizations                    │  ← Back navigation
│                                     │
│  Moderna Spikevax              [×]  │  ← Name + Close button
│                                     │
│  Description/Purpose                │
│  Covid-19                          │
│                                     │
│  Show more ▼                        │  ← Expand toggle
│                                     │
│  [Edit]                            │  ← Edit button
└─────────────────────────────────────┘
```

### Fields Visible (Collapsed State)

1. **Name** (Display only)
   - Value: "Moderna Spikevax"
   - Style: Bold, large (vaccine/product name)

2. **Description/Purpose** (Display only)
   - Label: "Description/Purpose"
   - Value: "Covid-19"
   - Purpose: What disease/condition the vaccine protects against

---

## 3. View Immunization - Expanded (Node: 1483:8460)

### Layout
```
┌─────────────────────────────────────┐
│  ← Immunizations                    │
│                                     │
│  Moderna Spikevax              [×]  │
│                                     │
│  Description/Purpose                │
│  Covid-19                          │
│                                     │
│  When                              │  ← Additional field
│  N/a                               │
│                                     │
│  Date Administered                 │  ← Additional field
│  Mar 30, 2021                      │
│                                     │
│  Location Administered             │  ← Additional field
│  Arm/gluteal                       │
│                                     │
│  Documents                         │  ← Additional section
│  [Empty state]                     │
│                                     │
│  Show less ▲                        │  ← Collapse toggle
│                                     │
│  [Edit]                            │
└─────────────────────────────────────┘
```

### Additional Fields Visible (Expanded State)

3. **When** (Display only)
   - Label: "When"
   - Value: "N/a" (null state shown)
   - 🚨 **HYPOTHESIS**: Dual-mode date input (Date OR Age) like Surgeries
   - Purpose: When patient received the vaccine

4. **Date Administered** (Display only)
   - Label: "Date Administered"
   - Value: "Mar 30, 2021"
   - Format: Month Day, Year (formatted date)

5. **Location Administered** (Display only)
   - Label: "Location Administered"
   - Value: "Arm/gluteal"
   - Format: Body location where vaccine was injected
   - 🚨 **CRITICAL QUESTION**: What are dropdown options?

6. **Documents** (Display only)
   - Label: "Documents"
   - Empty state shown
   - Pattern: Document attachment section (same as other features)

---

## 4. Edit Immunization - Collapsed (Node: 1483:8461)

### Layout
```
┌─────────────────────────────────────┐
│  ← Immunizations                    │
│                                     │
│  [Cancel]               [Save]     │  ← Action buttons
│                                     │
│  Name*                             │
│  [Moderna Spikevax_____]           │  ← Text input with value
│                                     │
│  Description/Purpose                │
│  [Covid-19_____________]           │  ← Textarea (90px)
│  [______________________]          │
│                                     │
│  Show more ▼                        │
│                                     │
│  [Delete Immunization]             │  ← Destructive action
└─────────────────────────────────────┘
```

### Editable Fields (Collapsed State)

1. **Name*** (Required)
   - Type: Text input
   - Validation: Required field (asterisk marker)
   - Value: "Moderna Spikevax"
   - Height: 58px (standard single-line input)
   - Purpose: Vaccine product/brand name

2. **Description/Purpose** (Optional)
   - Type: Textarea
   - Value: "Covid-19"
   - Height: 90px (multi-line text area)
   - Purpose: Disease/condition vaccine protects against

---

## 5. Edit Immunization - Expanded (Node: 1483:8462) 🚨 CRITICAL SCREEN

### Layout
```
┌─────────────────────────────────────┐
│  ← Immunizations                    │
│                                     │
│  [Cancel]               [Save]     │
│                                     │
│  Name*                             │
│  [Moderna Spikevax_____]           │
│                                     │
│  Description/Purpose                │
│  [Covid-19_____________]           │
│  [______________________]          │
│                                     │
│  When                              │  ← DUAL-MODE field
│  [Date_______▼] [Mar 30, 2021_] 📅 │  ← 107px selector + picker
│                                     │
│  Date Administered                 │
│  [Mar 30, 2021_________] 📅        │  ← Calendar picker
│                                     │
│  Location Administered             │
│  [Select_______________] ▼         │  ← Dropdown
│                                     │
│  + Add more                        │  ← Multiple doses support!
│                                     │
│  Documents                         │
│  + Add Documents                   │
│                                     │
│  Show less ▲                        │
│                                     │
│  [Delete Immunization]             │
└─────────────────────────────────────┘
```

### 🚨 CRITICAL DISCOVERIES

#### Discovery 1: Dual-Mode "When" Field (CONFIRMED)
**Evidence**: Node 1483:8462 shows same pattern as Surgeries

**Components**:
- Left component (107px width): Mode selector showing "Date" with dropdown chevron
- Right component (flexible): Calendar picker showing "Mar 30, 2021" with 📅 icon
- Gap: 16px between components

**Modes**:
- **Date mode**: Calendar picker (shown in this screen)
- **Age mode**: Text input "Enter Age" (alternate screen likely exists)

**This confirms dual-mode date input is a system-wide pattern.**

---

#### Discovery 2: Multiple Doses Support ("Add more")
**Evidence**: "+ Add more" link shown after Location Administered field

**Purpose**: Allows entering multiple doses/boosters for same vaccine

**Pattern**:
```typescript
interface Immunization {
  name: string; // Vaccine name
  descriptionPurpose: string; // What it's for
  doses: ImmunizationDose[]; // Array of doses
}

interface ImmunizationDose {
  when?: DualModeDate; // When they got it (dual-mode)
  dateAdministered: Date; // Actual date
  locationAdministered: string; // Body location
}
```

**Use case**:
- Dose 1: Mar 30, 2021, Arm/gluteal
- Dose 2: Apr 27, 2021, Arm/gluteal
- Booster: Nov 15, 2021, Arm/gluteal

---

### Additional Editable Fields (Expanded State)

3. **When** (Optional) - DUAL-MODE
   - Type: Dual-mode date input
   - Mode selector: "Date" or "Age" (107px dropdown)
   - Date mode: Calendar picker with formatted date
   - Age mode: Text input for age value
   - Current value: "Mar 30, 2021"
   - Height: 58px

4. **Date Administered** (Optional)
   - Type: Date picker
   - Visual indicator: Calendar icon 📅
   - Value: "Mar 30, 2021"
   - Height: 58px
   - Purpose: Specific date of vaccination

5. **Location Administered** (Optional)
   - Type: Dropdown
   - Visual indicator: Chevron ▼
   - Placeholder: "Select"
   - Height: 58px
   - 🚨 **CRITICAL QUESTION**: What are dropdown options?
     - Example value: "Arm/gluteal"
     - Likely options: Arm, Gluteal, Thigh, etc.

6. **Documents** (Optional)
   - Type: Document attachment section
   - Action: "+ Add Documents" button
   - Pattern: Same as other features

---

## 6. Add Immunization - Collapsed (Node: 1483:8463)

### Layout
```
┌─────────────────────────────────────┐
│  ← Immunizations                    │
│                                     │
│  [Cancel]               [Save]     │
│                                     │
│  Name*                             │
│  [Enter name___________]           │  ← Empty with placeholder
│                                     │
│  Description/Purpose                │
│  [______________________]          │  ← Empty textarea
│  [______________________]          │
│                                     │
│  Show more ▼                        │
└─────────────────────────────────────┘
```

### Empty State Fields (Collapsed)

1. **Name*** (Required)
   - Placeholder: "Enter name"
   - Required field marker (asterisk)

2. **Description/Purpose** (Optional)
   - Textarea (90px height)
   - Empty state

---

## 7. Add Immunization - Expanded (Node: 1483:8464)

### Layout
```
┌─────────────────────────────────────┐
│  ← Immunizations                    │
│                                     │
│  [Cancel]               [Save]     │
│                                     │
│  Name*                             │
│  [Enter name___________]           │
│                                     │
│  Description/Purpose                │
│  [______________________]          │
│  [______________________]          │
│                                     │
│  When                              │
│  [Date_______▼] [____________] 📅  │  ← Dual-mode (empty)
│                                     │
│  Date Administered                 │
│  [Date Administered____] 📅        │  ← Empty calendar picker
│                                     │
│  Location Administered             │
│  [Select_______________] ▼         │  ← Empty dropdown
│                                     │
│  + Add more                        │  ← Multiple doses support
│                                     │
│  Documents                         │
│  + Add Documents                   │
│                                     │
│  Show less ▲                        │
└─────────────────────────────────────┘
```

### Additional Empty State Fields (Expanded)

3. **When** (Optional)
   - Dual-mode selector showing "Date"
   - Empty calendar picker

4. **Date Administered** (Optional)
   - Placeholder: "Date Administered"
   - Empty calendar picker

5. **Location Administered** (Optional)
   - Placeholder: "Select"
   - Dropdown closed state

6. **Documents** (Optional)
   - "+ Add Documents" button
   - Empty state

---

## Field Summary & Data Model

### TypeScript Interface (Proposed)

```typescript
interface Immunization {
  id: string;
  patientId: string;

  // Required fields
  name: string; // Required - vaccine name/brand

  // Optional fields (collapsed state)
  descriptionPurpose?: string; // What disease it protects against

  // Optional fields (expanded state) - ARRAY OF DOSES
  doses: ImmunizationDose[];

  // Document associations
  documents?: ImmunizationDocument[];

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
}

// 🚨 CRITICAL: Multiple doses support
interface ImmunizationDose {
  id: string;
  immunizationId: string;

  // Dual-mode date input
  when?: DualModeDate;

  // Actual administration date
  dateAdministered?: Date;

  // Body location
  locationAdministered?: ImmunizationLocation;

  // Dose metadata
  doseNumber?: number; // 1st dose, 2nd dose, booster, etc.
  createdAt: Date;
}

// Dual-mode date structure (same as Surgeries)
interface DualModeDate {
  inputMode: 'date' | 'age';

  // For date mode
  dateSelection?: {
    year?: number;
    month?: number;
    day?: number;
    precision?: 'year' | 'month' | 'day';
    selectedDate?: Date;
  };

  // For age mode
  ageValue?: number; // e.g., 25

  // Computed date
  computedDate?: Date;
}

// Location dropdown options (NEEDS VERIFICATION)
type ImmunizationLocation =
  | 'arm'
  | 'gluteal'
  | 'thigh'
  | 'arm_gluteal' // Example shows combined value
  | string; // Unknown - need complete list

interface ImmunizationDocument {
  id: string;
  immunizationId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}
```

---

## Multiple Doses Pattern

### User Flow for Adding Multiple Doses

**Step 1: Add initial dose**
```
Name: Moderna Spikevax
Description/Purpose: Covid-19
When: Date → Mar 30, 2021
Date Administered: Mar 30, 2021
Location Administered: Arm/gluteal
```

**Step 2: Click "+ Add more"**
- Creates new dose entry form
- Fields repeat: When, Date Administered, Location Administered
- Same immunization record, new dose

**Step 3: Add second dose**
```
When: Date → Apr 27, 2021
Date Administered: Apr 27, 2021
Location Administered: Arm/gluteal
```

**Step 4: View result**
- Single immunization: "Moderna Spikevax (Covid-19)"
- Multiple doses listed chronologically
- Each dose shows: Date, Location

---

### Database Schema for Multiple Doses

```sql
CREATE TABLE immunizations (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  -- Required
  name VARCHAR(255) NOT NULL,

  -- Optional
  description_purpose TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE immunization_doses (
  id UUID PRIMARY KEY,
  immunization_id UUID REFERENCES immunizations(id),

  -- Dual-mode "When" field
  when_raw JSONB, -- Stores dual-mode structure

  -- Administration details
  date_administered TIMESTAMP,
  location_administered VARCHAR(100),

  -- Dose metadata
  dose_number INTEGER, -- 1, 2, 3, etc.
  dose_type VARCHAR(50), -- 'initial', 'booster', etc.

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE immunization_documents (
  id UUID PRIMARY KEY,
  immunization_id UUID REFERENCES immunizations(id),
  file_name VARCHAR(255),
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## Comparison to Other Features

### Unique Characteristics of Immunizations

| Aspect | Immunizations | Other Features |
|---|---|---|
| **Multiple entries** | ✅ Multiple doses per vaccine | ❌ Single entry per item |
| **Dual-mode date** | ✅ When field | ✅ Surgeries, likely all dates |
| **List display** | Name + Purpose (2 lines) | Name + details (1-2 lines) |
| **Quick Add** | ❌ Not present | ✅ Allergies, Supplements |
| **Repeatable data** | ✅ "Add more" doses | ❌ Not seen elsewhere |
| **Purpose field** | ✅ Description/Purpose | ❌ Not in other features |

### Pattern Analysis

**Why multiple doses**:
- Vaccines often require series (2-3 doses)
- Boosters given periodically
- Need to track full vaccination history

**Why no Quick Add**:
- Immunizations require more detail upfront
- Dose information critical (not optional)
- Less frequent entry than supplements/allergies

---

## Critical Questions & Missing Information

### 1. Location Administered Dropdown Options
**Question**: What are the complete dropdown options for Location Administered?

**Evidence**:
- Example value: "Arm/gluteal"
- Dropdown chevron shown in Edit screens
- Node 1483:8462 shows populated value

**Hypothesis**: Body injection sites:
- Arm
- Gluteal (buttocks)
- Thigh
- Deltoid (shoulder muscle)
- Arm/gluteal (combined - why?)
- Other (custom input?)

**Action needed**: Check Figma dropdown component for full list

---

### 2. Dose Number/Type Tracking
**Question**: How are dose numbers tracked (1st, 2nd, booster)?

**Evidence**:
- "Add more" link suggests multiple doses
- No explicit "Dose Number" field visible
- No "Dose Type" field visible

**Hypothesis**:
- **Option A**: Auto-incremented based on order added (1st, 2nd, 3rd)
- **Option B**: User manually enters dose type
- **Option C**: Inferred from date order

**Action needed**: Clarify dose numbering/typing requirements

---

### 3. When vs Date Administered - Why Both?
**Question**: Why have both "When" and "Date Administered" fields?

**Evidence**:
- When: Dual-mode (Date OR Age)
- Date Administered: Calendar picker only
- Both shown in same screen

**Hypotheses**:
- **When**: User's recollection (might be approximate, age-based)
- **Date Administered**: Official vaccine record date (precise)
- **Use case**: User remembers "I was 10 years old" (When = Age mode)
  - Official record shows: "April 15, 1995" (Date Administered)

**Action needed**: Clarify distinction and which takes precedence

---

### 4. Vaccine Name Standardization
**Question**: Is vaccine name free-form or standardized (CVX codes)?

**Evidence**:
- Text input shown (not dropdown)
- Example: "Moderna Spikevax" (brand name)
- No code field visible

**Hypothesis**:
- Free-form text for patient entry
- Could add CVX code field for provider view
- Autocomplete/typeahead would help standardize

**Action needed**: Decide on standardization level

---

### 5. Multiple Doses Display in List View
**Question**: How do multiple doses appear in the list view?

**Evidence**:
- List view shows: "Moderna Spikevax" / "Covid-19"
- No indication of dose count
- No date shown

**Hypothesis**:
- Single card per vaccine (regardless of doses)
- Card expands to show all doses
- Dose count badge? ("Moderna Spikevax (3 doses)")

**Action needed**: Check list view behavior with multiple doses

---

## UI/UX Patterns Observed

### Progressive Disclosure
- Collapsed state: Name, Description/Purpose (2 fields)
- Expanded state: + When, Date Administered, Location, Documents (6 total fields)
- "+ Add more" for additional doses

### Dual-Mode Date Input (CONFIRMED)
- Same pattern as Surgeries
- 107px mode selector + flexible date/age input
- System-wide component

### Repeatable Entry Pattern (NEW)
- "+ Add more" creates new dose entry
- Fields repeat within same form
- All doses associated with single immunization record

### Consistent Field Heights
- Single-line inputs: 58px
- Textarea (Description/Purpose): 90px
- Calendar picker: 58px
- Dual-mode selector: 107px (left component)

### Two-Line List Cards (UNIQUE)
- Primary: Vaccine name (bold)
- Secondary: Purpose/description (regular)
- Different from other features (single line or name + details)

---

## Display Rules (Three-View Architecture)

### Patient View (UI[Pt])

**List Card**:
```
Moderna Spikevax
Covid-19
```

**View Screen (Expanded)**:
```
Description/Purpose: Covid-19
When: March 2021 (if date entered)
Date Administered: Mar 30, 2021
Location Administered: Arm/gluteal

[If multiple doses]
Dose 2:
Date Administered: Apr 27, 2021
Location Administered: Arm/gluteal
```

### Provider View (UI[Pr])
**Likely enhanced with**:
- CVX code (vaccine code)
- Lot number
- Manufacturer
- Route (IM, SQ, etc.)
- Provider who administered

### Database (DB)

See schema above - relational structure with `immunizations` and `immunization_doses` tables.

---

## Armada Logic Language (ALL) Rules

### Rule 1: Multiple Doses Display

```
RULE: Immunization.MultipleDoses.Display

WHEN @Immunization.doses.count > 1

THEN:
  UI[Pt]: SHOW immunization card
          WITH doses listed chronologically
          EACH dose SHOWS: dateAdministered, locationAdministered

  UI[Pr]: SHOW enhanced dose table
          WITH: dateAdministered, location, lot, provider

  DB:     STORE @ImmunizationDose[]
          ORDER BY dateAdministered ASC
```

---

### Rule 2: When vs Date Administered Priority

```
RULE: Immunization.DatePriority

WHEN @ImmunizationDose has BOTH when AND dateAdministered

THEN:
  UI[Pt]: DISPLAY dateAdministered (official record)
          ANNOTATE with when IF different (e.g., "Age 10")

  DB:     STORE both values
          PRIMARY: dateAdministered
          SECONDARY: when (for context)
```

---

### Rule 3: Auto-Increment Dose Number

```
RULE: Immunization.DoseNumber.AutoIncrement

ON @ImmunizationDose.CREATE

THEN:
  COMPUTE doseNumber = @Immunization.doses.count + 1
  SET @ImmunizationDose.doseNumber = computed value
  SAVE @ImmunizationDose
```

---

## Next Steps for Immunizations

### Implementation Tasks
1. [ ] Verify Location Administered dropdown complete options
2. [ ] Clarify When vs Date Administered distinction
3. [ ] Implement multiple doses UI pattern ("Add more")
4. [ ] Auto-increment dose numbers
5. [ ] Determine vaccine name standardization (CVX codes?)
6. [ ] Design list view for multiple doses display
7. [ ] Create database migration scripts
8. [ ] Build repeatable dose entry component
9. [ ] Implement document attachment flow

### Documentation Tasks
1. [ ] Update DOCUMENTATION_INDEX.md with Immunizations
2. [ ] Create Armada Logic Language (ALL) rules for multiple doses
3. [ ] Document display column pattern for When field
4. [ ] Add to system-wide dual-mode date input component spec
5. [ ] Document repeatable entry pattern (reusable for other features?)

### Questions to Resolve
1. [ ] Location Administered dropdown options
2. [ ] Dose number/type tracking mechanism
3. [ ] When vs Date Administered - which takes precedence?
4. [ ] Vaccine name standardization approach
5. [ ] List view display with multiple doses
6. [ ] Provider view enhancements (CVX codes, lot numbers)

---

**Status**: ✅ Complete Figma extraction (7 screens)
**Critical Discovery**: Multiple doses support via "Add more" pattern
**Critical Confirmation**: Dual-mode date input is system-wide (also in Immunizations)
**Next**: Verify missing information, create implementation plan, document repeatable entry pattern
