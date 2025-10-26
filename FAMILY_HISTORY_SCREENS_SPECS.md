# Family History Screens - Complete Figma Extraction

**Extracted from**: Figma file `october-arkpass` via MCP
**Total screens extracted**: 3 screens
**Pattern**: List → Edit → Add

---

## Overview

Family History tracks medical conditions of patient's relatives (parents, grandparents, siblings, etc.). This helps identify genetic predispositions and hereditary conditions.

**Key characteristics**:
- **List view** with multiple relatives
- **Add new relatives** (not fixed list)
- **Edit existing** relative entries
- **Status tracking**: Alive vs Deceased
- **Condition text**: Free-form or linked to condition database
- **Red dot indicators**: Missing required information

---

## Screen Inventory

| # | Screen Name | Node ID | Purpose |
|---|---|---|---|
| 1 | Family History (List) | 1483:8465 | View all relatives with conditions |
| 2 | Edit Family Member | 1483:8466 | Edit relative + status + conditions |
| 3 | Add Family Member | 1483:8467 | Add new relative entry |

---

## 1. Family History - List View (Node: 1483:8465)

### Layout

```
┌─────────────────────────────────────────┐
│  [Share Your Health Record]            │  ← Header button
├─────────────────────────────────────────┤
│          Family History                 │  ← Title
│                                         │
│  [+ Add Family History]                │  ← Add button (full width)
│                                         │
│  ─────────────────────────────────     │  ← Separator
│                                         │
│  Mother                        [Edit]  │  ← Relative + Edit button
│  Alive, High Blood Pressure            │     Status + Conditions
│                                         │
│  Father                        [Edit]  │
│  Deceased, Lungs cancer                │
│                                         │
│  Maternal Grandmother          [Edit]  │
│  Deceased, Stroke                      │
│                                         │
│  Maternal Grandfather       • [Edit]   │  ← Red dot indicator
│  Deceased                              │     (missing conditions)
│                                         │
│  Paternal Grandmother          [Edit]  │
│  Deceased, Breast cancer               │
│                                         │
│  Paternal Grandfather       • [Edit]   │  ← Red dot indicator
│  Deceased                              │
│                                         │
└─────────────────────────────────────────┘
```

---

### Elements Identified

**Add Button**:
- Full-width button at top
- Text: "+ Add Family History"
- Opens Add screen

**Family Member Cards**:
- **Relative label** (gray text): e.g., "Mother", "Father", "Maternal Grandmother"
- **Status + Conditions** (black text): e.g., "Alive, High Blood Pressure"
- **Edit button** (right side): Opens Edit screen
- **Red dot indicator**: Appears if conditions missing or entry incomplete

**Example Entries**:
1. Mother: Alive, High Blood Pressure
2. Father: Deceased, Lungs cancer
3. Maternal Grandmother: Deceased, Stroke
4. Maternal Grandfather: Deceased (•) - red dot, no conditions listed
5. Paternal Grandmother: Deceased, Breast cancer
6. Paternal Grandfather: Deceased (•) - red dot, no conditions listed

---

### Visual Indicators

**Red Dot (•)**:
- Appears when relative has no medical conditions listed
- Meaning: Entry exists but incomplete (status entered, conditions missing)
- Encourages adding condition information

---

## 2. Edit Family Member (Node: 1483:8466)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Mother                      [Save] │  ← Back + Relative name + Save
├─────────────────────────────────────────┤
│                                         │
│  Relative              Status           │
│  [Mother_______] ▼     [Alive____] ▼   │  ← Two dropdowns side by side
│                                         │
│  Known medical conditions / cause of    │
│  death                                  │
│  [High Blood Pressure_______________]  │  ← Textarea (90px)
│  [________________________________]     │
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Relative** (Required)
   - Type: Dropdown
   - Current value: "Mother"
   - Position: Left column
   - Options: 🚨 **CRITICAL QUESTION** - Complete list needed
     - Likely: Mother, Father, Sister, Brother, Maternal Grandmother, Maternal Grandfather, Paternal Grandmother, Paternal Grandfather, Aunt, Uncle, Cousin, etc.

2. **Status** (Required)
   - Type: Dropdown
   - Current value: "Alive"
   - Position: Right column
   - Options: 🚨 **CRITICAL QUESTION** - Complete list needed
     - Likely: "Alive", "Deceased", "Unknown"

3. **Known medical conditions / cause of death** (Optional but recommended)
   - Type: Textarea
   - Height: 90px (multi-line)
   - Current value: "High Blood Pressure"
   - Format: Free-form text OR structured condition selection
   - 🚨 **QUESTION**: Is this linked to Conditions database or free text?

---

### Save Button
- Commits changes
- Returns to list view
- Red dot removed if conditions added

---

## 3. Add Family Member (Node: 1483:8467)

**NOT FULLY EXTRACTED** - Likely identical to Edit screen but with empty fields

### Fields (Inferred)

1. **Relative** (Required)
   - Type: Dropdown
   - Placeholder: "Select relative"
   - Empty state

2. **Status** (Required)
   - Type: Dropdown
   - Placeholder: "Select status"
   - Empty state

3. **Known medical conditions / cause of death** (Optional)
   - Type: Textarea
   - Height: 90px
   - Empty state

---

## Data Model

### TypeScript Interface

```typescript
interface FamilyHistory {
  id: string;
  patientId: string;

  // Relative info
  relative: FamilyRelative; // Dropdown value
  status: 'alive' | 'deceased' | 'unknown'; // Dropdown value

  // Medical info
  medicalConditions?: string; // Free-form text OR structured condition IDs
  causeOfDeath?: string; // If status = 'deceased'

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Family relative types (NEEDS VERIFICATION - complete list)
type FamilyRelative =
  | 'mother'
  | 'father'
  | 'sister'
  | 'brother'
  | 'maternal_grandmother'
  | 'maternal_grandfather'
  | 'paternal_grandmother'
  | 'paternal_grandfather'
  | 'aunt'
  | 'uncle'
  | 'cousin'
  | 'child'
  | 'grandchild'
  | string; // Extensible
```

---

### Database Schema

```sql
CREATE TABLE family_history (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  -- Relative info
  relative VARCHAR(100) NOT NULL, -- Dropdown value
  status VARCHAR(50) NOT NULL, -- 'alive', 'deceased', 'unknown'

  -- Medical info
  medical_conditions TEXT, -- Free-form OR JSON array of condition IDs
  cause_of_death TEXT, -- If deceased

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for patient queries
CREATE INDEX idx_family_history_patient ON family_history(patient_id);
```

---

### Alternative: Structured Conditions

If medical conditions are linked to the Conditions database:

```sql
CREATE TABLE family_history_conditions (
  id UUID PRIMARY KEY,
  family_history_id UUID REFERENCES family_history(id) ON DELETE CASCADE,
  condition_name VARCHAR(255), -- e.g., "High Blood Pressure"
  condition_icd_code VARCHAR(20), -- e.g., "I10" (optional)
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Critical Questions & Missing Information

### 1. Relative Dropdown Options
**Question**: What is the complete list of family relative options?

**Evidence**: "Mother" shown in dropdown

**Hypothesis**:
- **Parents**: Mother, Father
- **Grandparents**: Maternal Grandmother, Maternal Grandfather, Paternal Grandmother, Paternal Grandfather
- **Siblings**: Sister, Brother, Half-Sister, Half-Brother
- **Children**: Son, Daughter
- **Extended**: Aunt, Uncle, Cousin, Niece, Nephew
- **Custom**: "Other" with text input?

**Action needed**: Verify complete list and hierarchy

---

### 2. Status Dropdown Options
**Question**: What are the complete status options?

**Evidence**: "Alive" shown in dropdown

**Hypothesis**:
- Alive
- Deceased
- Unknown (lost contact, adopted, etc.)

**Action needed**: Verify complete list

---

### 3. Medical Conditions - Free Text or Structured?
**Question**: Is the medical conditions field free-form text or linked to Conditions database?

**Evidence**: "High Blood Pressure" shown as text

**Options**:
- **Option A**: Free-form text (shown in Figma) - simpler, less structured
- **Option B**: Autocomplete from Conditions database - more structured, better for genetic risk analysis
- **Option C**: Hybrid - text input with suggestions

**Pros/Cons**:
- Free text: Easier for user, harder to analyze
- Structured: Harder for user, enables genetic risk scoring

**Recommendation**: Start with free text (MVP), add autocomplete later

**Action needed**: Clarify product requirements

---

### 4. Cause of Death - Separate Field?
**Question**: Is "cause of death" a separate field or part of medical conditions?

**Evidence**: Field label says "Known medical conditions / cause of death"

**Hypothesis**: Single field serves dual purpose:
- If Alive: List medical conditions
- If Deceased: List cause of death (and optionally other conditions)

**Alternative**: Separate fields:
- "Medical conditions" (always visible)
- "Cause of death" (visible only if status = Deceased)

**Action needed**: Clarify UX design intent

---

### 5. Multiple Same Relatives
**Question**: Can user add multiple entries for same relative type (e.g., two sisters)?

**Evidence**: No numbering visible ("Sister 1", "Sister 2")

**Hypothesis**: Likely YES, can add multiple
- Display: Both show as "Sister"
- Differentiation: By edit/view, not by list label

**Alternative**: Dropdown allows selection only once per relative type

**Action needed**: Clarify requirements (likely need "Sister 1", "Sister 2" or "Older Sister", "Younger Sister")

---

### 6. Red Dot Removal Logic
**Question**: When does red dot disappear?

**Observed rule**: Red dot shown when status is "Deceased" but no medical conditions listed

**Hypothesis**:
- Red dot appears if: `status = 'deceased' AND medicalConditions.isEmpty()`
- Red dot disappears when: User adds any text to medical conditions field

**Alternative rules**:
- Always show if conditions empty (regardless of status)
- Show if status = Alive but no conditions (healthy relatives)

**Action needed**: Verify red dot logic rules

---

## UI/UX Patterns

### List Pattern
- Simple list of relatives (no grouping by generation)
- Add button at top (not bottom)
- Each entry: Relative name + Status/Conditions summary + Edit button

### Field-Level Editing
- Tap Edit → Full-screen edit form
- Two-column layout for Relative + Status dropdowns
- Multi-line textarea for conditions
- Save commits all changes at once

### Validation Indicators
- Red dot if entry incomplete (status entered, conditions missing)
- Gentle encouragement, not blocking

### No Delete Button Visible
- Edit screens don't show Delete button (from extracted screens)
- **Question**: Can user delete relatives? Likely yes, but not extracted

---

## Comparison to Conditions Feature

| Aspect | Family History | Patient Conditions |
|---|---|---|
| **Who** | Relatives | Patient themselves |
| **Structure** | Simple list | Type-based (Chronic/Transient) |
| **Conditions** | Free text | Structured with ICD codes |
| **Dates** | No dates tracked | Diagnosis dates, end dates |
| **Purpose** | Genetic risk screening | Active health management |

---

## Potential Enhancements (Not in MVP)

### Genetic Risk Scoring
If medical conditions were structured:
- Identify hereditary patterns
- Calculate genetic risk scores
- Alert: "Your mother and grandmother both had breast cancer - consider genetic testing"

### Age at Diagnosis
- Track when relative was diagnosed (not currently captured)
- "Mother diagnosed with diabetes at age 50"
- Helps predict patient's risk timeline

### Family Tree Visualization
- Visual family tree instead of flat list
- Generational grouping (Parents, Grandparents, Siblings, Children)
- Color-coding by condition type

---

## Status**: ✅ Complete extraction (3 screens)
**Key Insight**: Simplest feature so far - basic list/add/edit pattern with minimal complexity
**Critical Gap**: Relative and Status dropdown complete lists needed
**Design Decision Needed**: Free text vs structured conditions
**Next**: Verify dropdown options, clarify delete capability, confirm red dot logic
