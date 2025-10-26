# Multi-Select Pattern

## Purpose

Provide checkbox lists with optional "Other" field for selecting multiple items from standardized vocabularies while allowing custom entries. This balances data standardization for analytics with flexibility for edge cases.

## Requirements

### Requirement: Standard Checkbox Selection

The system SHALL display predefined options as checkboxes allowing multiple simultaneous selections.

#### Scenario: Checkbox list display
- **WHEN** user views multi-select field
- **THEN** display all predefined options as checkboxes
- **AND** show 24px height per checkbox row
- **AND** display label to right of checkbox
- **AND** allow selecting multiple checkboxes simultaneously
- **AND** show checkmark (✓) on selected items

#### Scenario: Checkbox interaction
- **WHEN** user taps checkbox or label
- **THEN** toggle checkbox state (checked/unchecked)
- **AND** update selection array immediately
- **AND** show visual feedback (checkmark appears/disappears)
- **AND** maintain all other selections

### Requirement: Other Field Support

The system SHALL provide an "Other" option with text input for custom entries.

#### Scenario: Other field display (recommended approach)
- **WHEN** multi-select includes "Other" option
- **THEN** display "Other (specify):" checkbox at end of list
- **AND** show text input field always visible to right
- **AND** disable text input when "Other" unchecked
- **AND** enable text input when "Other" checked
- **AND** show placeholder "Please specify..."

#### Scenario: Other field validation
- **WHEN** user checks "Other" checkbox
- **THEN** mark text input as required
- **AND** validate text not empty on save
- **AND** show error "Please describe the other [item]" if empty
- **AND** trim whitespace from input

#### Scenario: Other field clearing
- **WHEN** user unchecks "Other" checkbox
- **THEN** clear text input value
- **AND** disable text input
- **AND** remove from validation

### Requirement: Category-Specific Options

The system SHALL load appropriate option lists based on context or category.

#### Scenario: Dynamic option loading
- **WHEN** multi-select options depend on category/severity/type
- **THEN** load appropriate option list from vocabulary
- **AND** display options specific to context
- **AND** clear previous selections when category changes
- **AND** maintain "Other" option across all contexts

#### Scenario: Allergy symptoms by category
- **WHEN** allergy category = "Medication/Food" AND severity = "Severe"
- **THEN** load severe medication/food symptom vocabulary (10-11 options)
- **WHEN** allergy category = "Seasonal"
- **THEN** load seasonal symptom vocabulary (different options)
- **WHEN** allergy category changes
- **THEN** clear previous symptom selections, reload appropriate list

### Requirement: Display Formatting

The system SHALL format selected values appropriately for different view contexts.

#### Scenario: Patient view display
- **WHEN** displaying selected values in patient view (UI[Pt])
- **THEN** show as comma-separated list in sentences
- **OR** show as bulleted list in detail view
- **AND** include "Other" text as inline item

#### Scenario: Provider view display
- **WHEN** displaying selected values in provider view (UI[Pr])
- **THEN** show as bulleted list with codes (if applicable)
- **AND** label "Other" items distinctly (e.g., "Other: [text]")

### Requirement: Data Storage

The system SHALL store standard selections separately from "Other" text.

#### Scenario: Database storage structure
- **WHEN** saving multi-select field
- **THEN** store standard selections as PostgreSQL TEXT[] array
- **AND** store "Other" text in separate TEXT column
- **AND** create GIN index on array column for queries
- **AND** allow querying "contains any" on selections

## Implementation Details

### Component Structure

```typescript
interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  selectedValues: string[];       // IDs of selected standard options
  otherValue?: string;            // Free-text "Other" entry
  onChange: (selectedValues: string[], otherValue?: string) => void;
  showOther?: boolean;            // Default: true
  maxSelections?: number;         // Optional limit
  categoryContext?: string;       // For dynamic option loading
}

interface SelectOption {
  id: string;                     // Unique identifier
  label: string;                  // Display text
  description?: string;           // Optional tooltip/help text
  code?: string;                  // Optional medical code (ICD-10, SNOMED)
}
```

### Visual Specifications

**Checkbox Styling:**
```
Unchecked:
☐ Option Label
- Size: 18px × 18px
- Border: 1px solid #666666
- Background: #FFFFFF

Checked:
☑ Option Label
- Size: 18px × 18px
- Border: 1px solid #000000
- Background: #000000 (or accent color)
- Checkmark: White ✓

Hover (desktop):
- Border: 1px solid #000000
- Cursor: pointer
```

**Layout:**
```
┌─────────────────────────────────────────┐
│  Symptoms                               │  ← Section label
├─────────────────────────────────────────┤
│  ☐ Anaphylaxis                         │  ← Checkbox rows
│  ☐ Difficulty breathing                │     24px height each
│  ☐ Swelling of face/throat/tongue      │
│  ☐ Nausea or vomiting                  │
│                                         │
│  ☐ Other (specify):                    │  ← Other checkbox
│     [_________________________________] │  ← Text input
│                                         │
└─────────────────────────────────────────┘
```

### Data Model

**TypeScript Interface:**
```typescript
interface MultiSelectField {
  standardSelections: string[];  // ['anaphylaxis', 'difficulty_breathing']
  otherValue?: string;          // 'Severe headache within minutes'
}

// Full example: Allergy symptoms
interface AllergySymptoms {
  selectedSymptoms: string[];   // Standard symptom IDs
  otherSymptomDescription?: string;
}
```

### Database Schema

**Recommended Approach (Separate Columns):**
```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY,
  patient_id UUID,

  -- Standard selections as array
  symptoms TEXT[],  -- ['anaphylaxis', 'difficulty_breathing', 'swelling_face_throat_tongue']

  -- "Other" stored separately
  other_symptom_description TEXT,  -- 'Severe headache within minutes'

  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for array queries (GIN = Generalized Inverted Index)
CREATE INDEX idx_allergies_symptoms ON allergies USING GIN (symptoms);

-- Query example: Find all allergies with anaphylaxis
SELECT * FROM allergies WHERE 'anaphylaxis' = ANY(symptoms);

-- Query example: Find allergies with any of multiple symptoms
SELECT * FROM allergies
WHERE symptoms && ARRAY['anaphylaxis', 'difficulty_breathing'];
```

**Alternative (JSONB Storage):**
```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY,
  patient_id UUID,

  symptoms JSONB,  -- { "selectedSymptoms": ["anaphylaxis"], "otherSymptomDescription": "..." }

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_allergies_symptoms ON allergies USING GIN (symptoms);

-- Query
SELECT * FROM allergies
WHERE symptoms @> '{"selectedSymptoms": ["anaphylaxis"]}';
```

### Validation Logic

```typescript
function validateMultiSelect(
  selectedValues: string[],
  otherValue?: string,
  minSelections?: number
): { valid: boolean; error?: string } {
  // Check "Other" text if "Other" checked
  if (selectedValues.includes('other')) {
    if (!otherValue || otherValue.trim().length === 0) {
      return { valid: false, error: 'Please describe the other item' };
    }
  }

  // Check minimum selections (if required)
  if (minSelections) {
    const hasStandardSelection = selectedValues.some(v => v !== 'other');
    const hasValidOther = selectedValues.includes('other') && !!otherValue?.trim();

    if (!hasStandardSelection && !hasValidOther) {
      return { valid: false, error: `Please select at least ${minSelections} item(s)` };
    }
  }

  return { valid: true };
}
```

### Category-Specific Vocabularies

**Example: Allergy Symptoms by Category**
```typescript
const SYMPTOM_VOCABULARIES = {
  'medication-food-severe': [
    { id: 'anaphylaxis', label: 'Anaphylaxis', description: 'Life-threatening allergic reaction' },
    { id: 'difficulty_breathing', label: 'Difficulty breathing' },
    { id: 'swelling_face_throat_tongue', label: 'Swelling of face/throat/tongue' },
    { id: 'swelling_lips', label: 'Swelling of lips' },
    // ... 6 more options
  ],
  'seasonal': [
    { id: 'runny_nose', label: 'Runny nose' },
    { id: 'itchy_eyes', label: 'Itchy eyes' },
    { id: 'sneezing', label: 'Sneezing' },
    { id: 'congestion', label: 'Congestion' },
    // ... 7 more options
  ],
  'skin-contact': [
    { id: 'hives', label: 'Hives' },
    { id: 'itchiness', label: 'Itchiness' },
    { id: 'rash', label: 'Rash' },
    // ... etc
  ]
};

function getSymptomOptions(category: string, severity?: string): SelectOption[] {
  const key = `${category}-${severity}`;
  return SYMPTOM_VOCABULARIES[key] || [];
}
```

## Where Used

- **Allergies**: Symptoms (10-11 options per category + Other)
- **Social History**: Recreational drug types (7 categories + Other)
- **Medications**: Routes of administration (future: 8-10 routes + Other)
- **Conditions**: Symptoms (future expansion)

## Dependencies

- Checkbox component library
- Text input component
- Validation framework
- Vocabulary/terminology services (for standardized options)

## Compliance

### Accessibility
- Screen reader: "Anaphylaxis, checkbox, checked", "3 of 11 items selected"
- Keyboard: Tab to checkbox → Space toggles → Tab to next
- ARIA: role="group", aria-labelledby for fieldset
- Focus visible: Clear outline on keyboard focus
- Voice control: "Tap Anaphylaxis", "Check Other"

### Validation
- Optional minimum selections (typically none required)
- Required "Other" text if "Other" checked
- Trim whitespace from "Other" text
- Validate before save

### Performance
- GIN indexes for fast array queries
- Efficient checkbox rendering (virtualization for 20+ options)
- Debounce "Other" text input (300ms)
- Cache vocabulary loads

### Data Integrity
- Store standard selections as array (structured)
- Store "Other" text separately (unstructured)
- Maintain vocabulary consistency
- Support vocabulary versioning (future)
