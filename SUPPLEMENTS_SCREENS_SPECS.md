# Supplements Screens - Complete Figma Extraction

**Extracted from**: Figma file `october-arkpass` via MCP
**Total screens extracted**: 7
**Pattern**: List → View (collapsed/expanded) → Edit (collapsed/expanded) → Add (collapsed/expanded)

---

## Screen Inventory

| # | Screen Name | Node ID | State | Key Elements |
|---|---|---|---|---|
| 1 | Supplements List | 1483:8444 | Default | Quick Add, Example Cards |
| 2 | View Supplement (Collapsed) | 1483:8445 | Collapsed | Name, Dosage, Frequency |
| 3 | View Supplement (Expanded) | 1483:8446 | Expanded | + Start, Details, Documents |
| 4 | Edit Supplement (Collapsed) | 1483:8447 | Collapsed | Editable Name, Dosage, Frequency |
| 5 | Edit Supplement (Expanded) | 1483:8448 | Expanded | + Start Date picker, Details textarea |
| 6 | Add Supplement (Collapsed) | 1483:8449 | Collapsed | Empty fields, Required marker |
| 7 | Add Supplement (Expanded) | 1483:8450 | Expanded | All fields visible |

---

## 1. Supplements List (Node: 1483:8444)

### Layout
```
┌─────────────────────────────────────┐
│  Supplements                    [+] │  ← Header with Add button
├─────────────────────────────────────┤
│  [Quick Add inline input]          │  ← Quick Add feature
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ • Vitamin D                 │   │  ← Example card with red dot
│  │   10mcg, per day           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Elements Identified

**Quick Add Feature**:
- Inline text input for rapid name-only entry
- Same pattern as Allergies and Medications
- Single field: Supplement name
- Creates minimal record, user can expand later

**Card Structure**:
- Title: Supplement name (bold, 20px)
- Subtitle: "{dosage}, {frequency}" format (regular, 16px)
- Visual indicator: Red dot next to name
- Tap to view/edit

**Example Data Shown**:
- Name: "Vitamin D"
- Dosage: "10mcg"
- Frequency: "per day"

---

## 2. View Supplement - Collapsed (Node: 1483:8445)

### Layout
```
┌─────────────────────────────────────┐
│  ← Supplements                      │  ← Back navigation
│                                     │
│  Vitamin D                     [×]  │  ← Name + Close button
│                                     │
│  Dosage                            │
│  10mcg                             │
│                                     │
│  Frequency                         │
│  Per day                           │
│                                     │
│  Show more ▼                        │  ← Expand toggle
│                                     │
│  [Edit]                            │  ← Edit button
└─────────────────────────────────────┘
```

### Fields Visible (Collapsed State)

1. **Name** (Display only)
   - Value: "Vitamin D"
   - Style: Bold, large

2. **Dosage** (Display only)
   - Label: "Dosage"
   - Value: "10mcg"

3. **Frequency** (Display only)
   - Label: "Frequency"
   - Value: "Per day"

---

## 3. View Supplement - Expanded (Node: 1483:8446)

### Layout
```
┌─────────────────────────────────────┐
│  ← Supplements                      │
│                                     │
│  Vitamin D                     [×]  │
│                                     │
│  Dosage                            │
│  10mcg                             │
│                                     │
│  Frequency                         │
│  Per day                           │
│                                     │
│  Start                             │  ← Additional field revealed
│  N/a                               │
│                                     │
│  Details                           │  ← Additional field revealed
│  N/a                               │
│                                     │
│  Documents                         │  ← Additional section revealed
│  [Empty state]                     │
│                                     │
│  Show less ▲                        │  ← Collapse toggle
│                                     │
│  [Edit]                            │
└─────────────────────────────────────┘
```

### Additional Fields Visible (Expanded State)

4. **Start** (Display only)
   - Label: "Start"
   - Value: "N/a" (shown as placeholder/null state)
   - 🚨 **CRITICAL QUESTION**: Does this use dual-mode date input (Date OR Age)?

5. **Details** (Display only)
   - Label: "Details"
   - Value: "N/a" (shown as placeholder/null state)
   - Expected: Free-form text area

6. **Documents** (Display only)
   - Label: "Documents"
   - Empty state shown
   - Pattern: Document attachment section (same as other features)

---

## 4. Edit Supplement - Collapsed (Node: 1483:8447)

### Layout
```
┌─────────────────────────────────────┐
│  ← Supplements                      │
│                                     │
│  [Cancel]               [Save]     │  ← Action buttons
│                                     │
│  Name*                             │
│  [Vitamin D_____________]          │  ← Text input with value
│                                     │
│  Dosage                            │
│  [10mcg________________]           │  ← Text input
│                                     │
│  Frequency                         │
│  [Per day______________] ▼         │  ← Dropdown field
│                                     │
│  Show more ▼                        │
│                                     │
│  [Delete Supplement]               │  ← Destructive action
└─────────────────────────────────────┘
```

### Editable Fields (Collapsed State)

1. **Name*** (Required)
   - Type: Text input
   - Validation: Required field (asterisk marker)
   - Value: "Vitamin D"
   - Height: 58px (standard single-line input)

2. **Dosage** (Optional)
   - Type: Text input
   - Value: "10mcg"
   - Height: 58px
   - Format: Free-form text (no validation shown)

3. **Frequency** (Optional)
   - Type: Dropdown
   - Visual indicator: Chevron icon ▼
   - Current value: "Per day"
   - Height: 58px
   - 🚨 **CRITICAL QUESTION**: What are all dropdown options?
     - Likely: "Per day", "Twice a day", "Weekly", "As needed", etc.
     - Need to verify complete list

---

## 5. Edit Supplement - Expanded (Node: 1483:8448)

### Layout
```
┌─────────────────────────────────────┐
│  ← Supplements                      │
│                                     │
│  [Cancel]               [Save]     │
│                                     │
│  Name*                             │
│  [Vitamin D_____________]          │
│                                     │
│  Dosage                            │
│  [10mcg________________]           │
│                                     │
│  Frequency                         │
│  [Per day______________] ▼         │
│                                     │
│  Start                             │  ← Additional field
│  [___________________] 📅          │  ← Calendar picker
│                                     │
│  Details                           │  ← Additional field
│  [______________________]          │  ← Textarea (90px)
│  [______________________]          │
│                                     │
│  Documents                         │  ← Additional section
│  + Add Documents                   │
│                                     │
│  Show less ▲                        │
│                                     │
│  [Delete Supplement]               │
└─────────────────────────────────────┘
```

### Additional Editable Fields (Expanded State)

4. **Start** (Optional)
   - Type: Date picker
   - Visual indicator: Calendar icon 📅
   - Placeholder: Empty (no value shown)
   - Height: 58px
   - 🚨 **HYPOTHESIS**: May support dual-mode (Date OR Age) like Surgeries
   - Need to verify if mode selector exists

5. **Details** (Optional)
   - Type: Textarea
   - Height: 90px (multi-line text area)
   - Placeholder: Empty
   - Purpose: Free-form notes about supplement

6. **Documents** (Optional)
   - Type: Document attachment section
   - Action: "+ Add Documents" button
   - Pattern: Same as Conditions, Medications, etc.

---

## 6. Add Supplement - Collapsed (Node: 1483:8449)

### Layout
```
┌─────────────────────────────────────┐
│  ← Supplements                      │
│                                     │
│  [Cancel]               [Save]     │
│                                     │
│  Name*                             │
│  [Enter name___________]           │  ← Empty with placeholder
│                                     │
│  Dosage                            │
│  [Enter dosage_________]           │  ← Empty with placeholder
│                                     │
│  Frequency                         │
│  [Select_______________] ▼         │  ← Dropdown with Select
│                                     │
│  Show more ▼                        │
└─────────────────────────────────────┘
```

### Empty State Fields (Collapsed)

1. **Name*** (Required)
   - Placeholder: "Enter name"
   - Required field marker (asterisk)

2. **Dosage** (Optional)
   - Placeholder: "Enter dosage"

3. **Frequency** (Optional)
   - Placeholder: "Select" (dropdown closed state)
   - Dropdown chevron visible

---

## 7. Add Supplement - Expanded (Node: 1483:8450)

### Layout
```
┌─────────────────────────────────────┐
│  ← Supplements                      │
│                                     │
│  [Cancel]               [Save]     │
│                                     │
│  Name*                             │
│  [Enter name___________]           │
│                                     │
│  Dosage                            │
│  [Enter dosage_________]           │
│                                     │
│  Frequency                         │
│  [Select_______________] ▼         │
│                                     │
│  Start                             │
│  [___________________] 📅          │  ← Calendar picker
│                                     │
│  Details                           │
│  [______________________]          │  ← Textarea
│  [______________________]          │
│                                     │
│  Documents                         │
│  + Add Documents                   │
│                                     │
│  Show less ▲                        │
└─────────────────────────────────────┘
```

### Additional Empty State Fields (Expanded)

4. **Start** (Optional)
   - Date picker with calendar icon
   - Empty state

5. **Details** (Optional)
   - Textarea (90px height)
   - Empty state

6. **Documents** (Optional)
   - Document attachment section
   - "+ Add Documents" button

---

## Field Summary & Data Model

### TypeScript Interface (Proposed)

```typescript
interface Supplement {
  id: string;
  patientId: string;

  // Required fields
  name: string; // Required - supplement name

  // Optional fields (collapsed state)
  dosage?: string; // Free-form text (e.g., "10mcg", "500mg")
  frequency?: SupplementFrequency; // Dropdown value

  // Optional fields (expanded state)
  start?: SupplementStartDate; // Date picker (dual-mode?)
  details?: string; // Free-form notes

  // Document associations
  documents?: SupplementDocument[];

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
}

// Frequency dropdown options (NEEDS VERIFICATION)
type SupplementFrequency =
  | 'per_day'
  | 'twice_day'
  | 'three_times_day'
  | 'weekly'
  | 'as_needed'
  | string; // Unknown - need complete list

// Start date structure (NEEDS VERIFICATION - dual-mode?)
interface SupplementStartDate {
  // If dual-mode like Surgeries:
  inputMode?: 'date' | 'age';

  // For date mode:
  dateSelection?: {
    year?: number;
    month?: number;
    day?: number;
    precision?: 'year' | 'month' | 'day';
  };

  // For age mode:
  ageValue?: number;

  // Computed date
  computedDate?: Date;
}

interface SupplementDocument {
  id: string;
  supplementId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}
```

---

## Comparison to Medications

### Similarities
- Quick Add feature in list view
- Progressive disclosure (Show more/less)
- Same field structure: Name (required), Dosage, Frequency, Start, Details, Documents
- Same Edit/Add pattern (collapsed/expanded states)

### Differences
- **No multi-condition linking**: Supplements are standalone, not linked to conditions
- **Simpler frequency model**: Likely fewer options than medication schedules
- **No route field**: Supplements assumed oral (vs medications with route options)
- **No status field**: No "Currently taking" vs "Discontinued" toggle visible
- **Red dot indicator**: Supplements list shows red dot (not seen in medications)

### Questions Raised
1. Why do supplement cards have red dot indicator? (Alert? Active status?)
2. Should supplements have status tracking like medications?
3. Should supplements link to conditions they're addressing?

---

## Critical Questions & Missing Information

### 1. Frequency Dropdown Options
**Question**: What are the complete dropdown options for Frequency?

**Evidence**:
- Example value: "Per day"
- Dropdown chevron shown in Edit screens
- Node 1483:8448 shows populated value

**Hypothesis**: Similar to medication frequency but simpler:
- Per day
- Twice a day
- Three times a day
- Weekly
- As needed
- Other (custom input?)

**Action needed**: Check Figma dropdown component for full list

---

### 2. Start Date Field - Dual-Mode?
**Question**: Does Start date support dual-mode input (Date OR Age) like Surgeries?

**Evidence**:
- Calendar icon shown (📅)
- No mode selector visible in current screens
- Height: 58px (standard input)

**Hypothesis**:
- **Option A**: Simple calendar picker only (no age mode)
- **Option B**: Dual-mode exists but not shown in these screens
- **Option C**: Will be added later for consistency

**Action needed**:
- Check if there are alternate screens showing age mode
- Verify system-wide date input pattern applies here

---

### 3. Red Dot Indicator
**Question**: What does the red dot on supplement cards indicate?

**Evidence**:
- Shown in List view (node 1483:8444)
- Not explained in any screen
- Not seen in other features (Conditions, Medications)

**Hypotheses**:
- Active/currently taking status?
- Alert/warning indicator?
- Required action needed?
- New/unreviewed entry?

**Action needed**: Check Figma design notes or ask designer

---

### 4. Status Tracking
**Question**: Do supplements have status tracking (Active/Discontinued)?

**Evidence**:
- NO status field visible in any screen
- Medications have status dropdown
- Supplements might be assumed active if listed

**Hypothesis**: Status not tracked for supplements, or handled differently

**Action needed**: Clarify if supplements need status lifecycle

---

### 5. Condition Linking
**Question**: Should supplements be linkable to conditions (like medications)?

**Evidence**:
- NO condition linking visible in any screen
- Medications have multi-condition support
- Supplements typically taken for specific health reasons

**Hypothesis**: Not implemented yet, but might be needed

**Example use case**:
- Vitamin D for "Vitamin D Deficiency" condition
- Iron supplement for "Anemia" condition

**Action needed**: Clarify product requirements

---

## UI/UX Patterns Observed

### Progressive Disclosure
- Collapsed state: Name, Dosage, Frequency (3 fields)
- Expanded state: + Start, Details, Documents (6 total fields)
- Reduces cognitive load for quick entries

### Quick Add Feature
- Inline name-only input in list view
- Creates minimal record quickly
- User can expand/edit later for full details

### Consistent Field Heights
- Single-line inputs: 58px
- Textarea (Details): 90px
- Calendar picker: 58px (same as text input)

### Empty State Indicators
- "N/a" shown for null values in view mode
- Placeholder text in add mode: "Enter name", "Enter dosage"
- Dropdown shows "Select" when empty

---

## Display Rules (Three-View Architecture)

### Patient View (UI[Pt])

**List Card**:
```
Vitamin D
10mcg, per day
```

**View Screen (Collapsed)**:
```
Dosage: 10mcg
Frequency: Per day
```

**View Screen (Expanded)**:
```
Dosage: 10mcg
Frequency: Per day
Start: March 2020 (if date entered)
Details: [Free-form text]
```

### Provider View (UI[Pr])
**Likely same as Patient view** - no clinical codes needed for supplements

### Database (DB)

```sql
CREATE TABLE supplements (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  -- Required
  name VARCHAR(255) NOT NULL,

  -- Optional fields
  dosage VARCHAR(100),
  frequency VARCHAR(50),
  start_date_raw JSONB,
  details TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE supplement_documents (
  id UUID PRIMARY KEY,
  supplement_id UUID REFERENCES supplements(id),
  file_name VARCHAR(255),
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## Next Steps for Supplements

### Implementation Tasks
1. [ ] Verify Frequency dropdown complete options
2. [ ] Confirm Start date dual-mode support (or simple picker)
3. [ ] Clarify red dot indicator meaning
4. [ ] Determine if status tracking needed
5. [ ] Decide on condition linking requirements
6. [ ] Create database migration scripts
7. [ ] Implement Quick Add feature
8. [ ] Build progressive disclosure UI components
9. [ ] Implement document attachment flow

### Documentation Tasks
1. [ ] Update DOCUMENTATION_INDEX.md with Supplements
2. [ ] Create Armada Logic Language (ALL) rules for supplements
3. [ ] Document display column pattern for Start date field
4. [ ] Add to system-wide date input component spec

---

**Status**: ✅ Complete Figma extraction (7 screens)
**Next**: Verify missing information, create implementation plan
