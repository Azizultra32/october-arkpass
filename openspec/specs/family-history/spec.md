# Family History Management

## Purpose

Track medical conditions of patient's relatives to identify genetic predispositions and hereditary health risks. Support adding multiple family members with their health status and medical conditions.

## Requirements

### Requirement: Family Member Record Creation

The system SHALL allow adding family member records with relative type, status, and medical conditions.

#### Scenario: Add new family member
- **WHEN** user taps "+ Add Family History" button
- **THEN** open Add Family Member form
- **AND** require Relative and Status fields
- **AND** allow optional medical conditions field

#### Scenario: No Quick Add pattern
- **WHEN** viewing family history list
- **THEN** show "+ Add Family History" button only
- **AND** require full form entry for all family members
- **REASON** Relative type and status are essential for genetic screening

### Requirement: Family Member Data Fields

The system SHALL capture relative type, health status, and medical conditions.

#### Scenario: Required relative selection
- **WHEN** user selects relative type
- **THEN** provide dropdown options:
  - Mother
  - Father
  - Sister
  - Brother
  - Maternal Grandmother
  - Maternal Grandfather
  - Paternal Grandmother
  - Paternal Grandfather
  - Aunt
  - Uncle
  - Cousin
  - Son
  - Daughter
  - Grandchild
  - Other
- **AND** require selection before save

#### Scenario: Multiple same relatives allowed
- **WHEN** user adds relative type
- **THEN** allow multiple entries for same type (e.g., Sister, Sister)
- **AND** display both as "Sister" in list
- **AND** differentiate by individual record IDs
- **NOTE** No automatic numbering ("Sister 1", "Sister 2") in current design

#### Scenario: Required status selection
- **WHEN** user selects health status
- **THEN** provide dropdown options:
  - Alive
  - Deceased
  - Unknown
- **AND** require selection before save

#### Scenario: Optional medical conditions field
- **WHEN** user enters medical conditions
- **THEN** accept multi-line text input (textarea, 90px height)
- **AND** allow free-form text (e.g., "High Blood Pressure", "Breast cancer")
- **AND** allow save with empty conditions
- **NOTE** Field label: "Known medical conditions / cause of death"

#### Scenario: Conditions serve dual purpose
- **WHEN** status is "Alive"
- **THEN** interpret conditions as current medical conditions
- **WHEN** status is "Deceased"
- **THEN** interpret conditions as cause of death and/or known conditions

### Requirement: Visual Validation Indicators

The system SHALL show red dot indicators for incomplete family member entries.

#### Scenario: Red dot for missing conditions
- **WHEN** family member has status "Deceased" but no medical conditions
- **THEN** show red dot (•) next to relative name in list
- **AND** encourage adding condition/cause of death information

#### Scenario: No red dot for complete entries
- **WHEN** family member has medical conditions filled
- **THEN** do NOT show red dot
- **AND** display as complete entry

#### Scenario: Red dot removal
- **WHEN** user adds conditions to incomplete entry
- **THEN** remove red dot indicator
- **AND** update list display

### Requirement: Family History List View

The system SHALL display all family members as cards with relative name and status/conditions summary.

#### Scenario: Display family member cards
- **WHEN** viewing family history list
- **THEN** show each family member as card:
  - Line 1: Relative name (gray text, 16px) - e.g., "Mother", "Paternal Grandfather"
  - Line 2: Status + Conditions (black text, 16px) - e.g., "Alive, High Blood Pressure"
- **AND** show "Edit" button on right side of each card
- **AND** show red dot if incomplete

#### Scenario: Tap family member card
- **WHEN** user taps family member card or "Edit" button
- **THEN** open View/Edit Family Member screen
- **AND** show all fields as editable inputs
- **AND** show "Save" button in header

#### Scenario: Empty family history state
- **WHEN** no family members added yet
- **THEN** show "+ Add Family History" button
- **AND** show empty state message

### Requirement: Family Member Editing

The system SHALL allow editing relative type, status, and conditions.

#### Scenario: Edit existing family member
- **WHEN** user taps "Edit" on family member card
- **THEN** open Edit Family Member screen
- **AND** show relative dropdown (preserving current value)
- **AND** show status dropdown (preserving current value)
- **AND** show medical conditions textarea (preserving current value)
- **AND** show "Save" button in header

#### Scenario: Save family member changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields (Relative, Status)
- **AND** update family member record
- **AND** update updated_at timestamp
- **AND** return to family history list

#### Scenario: No cancel button shown
- **WHEN** user is editing family member
- **THEN** show "Save" button only (no explicit "Cancel" in extracted screens)
- **AND** back navigation serves as implicit cancel

### Requirement: Family Member Deletion

The system SHALL allow deletion of family member records.

#### Scenario: Delete family member
- **WHEN** user deletes family member (deletion UI not extracted but likely exists)
- **THEN** soft delete record (set deleted_at)
- **AND** hide from family history list
- **AND** retain in database for audit
- **AND** return to list view

#### Scenario: Soft delete for audit trail
- **WHEN** family member is deleted
- **THEN** mark as deleted_at = NOW()
- **AND** hide from patient view
- **AND** preserve genetic risk screening history

### Requirement: Share Health Record Integration

The system SHALL include family history in health record exports.

#### Scenario: Export family history in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all family members in export
- **AND** format as FHIR FamilyMemberHistory resources
- **AND** include relative type, status, conditions
- **AND** support genetic risk assessment

## Data Model

### Database Schema

```sql
CREATE TABLE family_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Relative info (required)
  relative TEXT NOT NULL, -- Dropdown value (e.g., 'mother', 'father', 'sister')
  status TEXT NOT NULL, -- 'alive', 'deceased', 'unknown'

  -- Medical info (optional)
  medical_conditions TEXT, -- Free-form text OR JSON array of condition IDs

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_family_history_patient ON family_history(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_family_history_relative ON family_history(relative) WHERE deleted_at IS NULL;
CREATE INDEX idx_family_history_status ON family_history(status) WHERE deleted_at IS NULL;
```

### Alternative: Structured Conditions

If medical conditions are linked to Conditions database:

```sql
-- Family history conditions (structured approach)
CREATE TABLE family_history_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_history_id UUID REFERENCES family_history(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL, -- e.g., "High Blood Pressure"
  condition_icd_code TEXT, -- e.g., "I10" (optional)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_family_conditions_history ON family_history_conditions(family_history_id);
```

### TypeScript Interfaces

```typescript
interface FamilyHistory {
  id: string;
  patientId: string;

  // Relative info (required)
  relative: FamilyRelative; // Dropdown value
  status: 'alive' | 'deceased' | 'unknown';

  // Medical info (optional)
  medicalConditions?: string; // Free-form text
  // Alternative: conditions?: FamilyCondition[]; // Structured conditions

  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

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
  | 'son'
  | 'daughter'
  | 'grandchild'
  | 'other';

// Structured conditions (alternative approach)
interface FamilyCondition {
  id: string;
  familyHistoryId: string;
  conditionName: string;
  conditionICDCode?: string;
  createdAt: Date;
}
```

## UI Patterns

### List Pattern
- Simple list of relatives (no grouping by generation)
- Add button at top (full-width)
- Each entry: Relative name + Status/Conditions + Edit button
- Red dot for incomplete entries

### Field-Level Layout
- Two-column layout for Relative + Status dropdowns
- Full-width textarea for conditions (90px height)
- Save button in header

### Visual Hierarchy
- Relative label: Gray text (secondary)
- Status + Conditions: Black text (primary)
- Red dot: Warning indicator (incomplete)

### No Explicit Delete Button
- Delete functionality exists but not shown in extracted screens
- Likely accessed via swipe gesture or menu

## FHIR Mapping

ArkPass is PRIMARY. FHIR export is SECONDARY for interoperability.

### Export to FHIR (Share Health Record)

```typescript
// Map FamilyHistory to FHIR FamilyMemberHistory resource
function toFHIRFamilyMemberHistory(history: FamilyHistory): FHIRFamilyMemberHistory {
  return {
    resourceType: 'FamilyMemberHistory',
    id: history.id,
    status: 'completed',
    patient: {
      reference: `Patient/${history.patientId}`
    },
    relationship: {
      text: history.relative // Map to FHIR relationship codes
    },
    deceasedBoolean: history.status === 'deceased',
    condition: history.medicalConditions ? [{
      code: {
        text: history.medicalConditions
      }
    }] : undefined
  };
}

// Map relative types to FHIR relationship codes
function mapRelativeToFHIR(relative: FamilyRelative): string {
  const mapping = {
    'mother': 'MTH',
    'father': 'FTH',
    'sister': 'SISTER',
    'brother': 'BRO',
    'maternal_grandmother': 'MGRMTH',
    'maternal_grandfather': 'MGRFTH',
    'paternal_grandmother': 'PGRMTH',
    'paternal_grandfather': 'PGRFTH',
    // ... additional mappings
  };
  return mapping[relative] || relative;
}
```

**Key Mappings**:
- `FamilyHistory.relative` → `FamilyMemberHistory.relationship`
- `FamilyHistory.status` → `FamilyMemberHistory.deceasedBoolean`
- `FamilyHistory.medicalConditions` → `FamilyMemberHistory.condition[].code`

**Import Limitation**:
- ArkPass does NOT import FHIR family history data
- Export-only for provider sharing

## Figma References

**Source**: Figma file `october-arkpass`

| Screen | Node ID | Purpose |
|--------|---------|---------|
| Family History List | 1483:8465 | All relatives with status/conditions |
| Edit Family Member | 1483:8466 | Edit relative + status + conditions |
| Add Family Member | 1483:8467 | Add new relative entry |

**Critical Observations**:
- List shows red dots for Maternal Grandfather and Paternal Grandfather (deceased, no conditions)
- Mother, Father, Grandmothers show conditions filled (no red dots)
- Edit screen shows two-column layout for Relative + Status dropdowns

## Dependencies

### Required Components
- ✅ Dropdown selectors (for Relative and Status)
- ✅ Textarea input (for medical conditions)
- ✅ Red dot indicator component

### Database Dependencies
- `user_profiles` table (patient_id foreign key)

### Feature Dependencies
- Share Health Record feature (exports as FHIR FamilyMemberHistory)
- Conditions feature (optional: link family conditions to patient conditions database)

## Compliance

### HIPAA
- Family medical history is PHI
- Soft delete preserves audit trail
- Genetic risk information is sensitive

### Genetic Information
- Family history data supports genetic screening
- Privacy considerations for relatives
- Data should not identify relatives directly (only relationship type)

### Clinical Use
- Supports genetic risk assessment
- Informs screening recommendations
- Tracks hereditary conditions (breast cancer, diabetes, heart disease, etc.)

## Open Questions

1. **Relative Dropdown Complete List**: TBD full list
   - Confirmed: Mother, Father, Grandparents (4), Sister, Brother
   - Likely: Aunt, Uncle, Cousin, Son, Daughter, Grandchild
   - Need: Half-siblings? Step-relatives? Adopted relatives?

2. **Status Dropdown Complete List**: Confirmed
   - Alive, Deceased, Unknown

3. **Medical Conditions: Free Text vs Structured**: Design decision needed
   - **Current (MVP)**: Free-form text (shown in Figma)
   - **Alternative**: Autocomplete from Conditions database
   - **Hybrid**: Text input with suggestions
   - **Pros/Cons**:
     - Free text: Easier for user, harder to analyze
     - Structured: Harder for user, enables genetic risk scoring
   - **Recommendation**: Start with free text, add autocomplete in future

4. **Cause of Death vs Medical Conditions**: Separate fields?
   - Current: Single field "Known medical conditions / cause of death"
   - Alternative: Two separate fields (conditions always visible, cause of death only if deceased)
   - **Recommendation**: Keep single field (simpler UX)

5. **Multiple Same Relatives**: How to differentiate?
   - Current: No automatic numbering visible
   - Issue: Multiple "Sister" entries look identical in list
   - **Options**:
     - A) Add numbering automatically ("Sister 1", "Sister 2")
     - B) Show age or birth year ("Sister (b. 1985)")
     - C) Allow custom labels ("Older Sister", "Younger Sister")
   - **Recommendation**: Add optional custom label field

6. **Genetic Risk Scoring**: Future enhancement?
   - Not in MVP scope
   - Requires structured condition data
   - Example: "Your mother and grandmother both had breast cancer - consider genetic testing"

7. **Age at Diagnosis**: Track when relative was diagnosed?
   - Not in current design
   - Would help predict patient's risk timeline
   - Future enhancement: "Mother diagnosed with diabetes at age 50"

8. **Family Tree Visualization**: Alternative to flat list?
   - Current: Flat list
   - Alternative: Visual family tree with generations
   - Future enhancement for better genetic pattern visualization

9. **Delete Functionality**: How is deletion accessed?
   - Not shown in extracted screens
   - Likely: Swipe gesture, menu, or button in edit screen
   - Need to verify deletion UI pattern

10. **Red Dot Logic Clarification**: When exactly does it appear?
    - **Observed**: Shows when status = "Deceased" and conditions empty
    - **Question**: Does it show for Alive relatives with no conditions?
    - **Assumption**: Red dot only for deceased without cause of death
    - **Recommendation**: Confirm exact logic rules
