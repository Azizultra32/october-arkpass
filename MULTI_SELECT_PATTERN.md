# Multi-Select Pattern - Checkbox Lists with Optional "Other"

**Status**: ✅ Reusable pattern documented
**Discovered in**: Allergies (symptoms), Social History (recreational drug types)
**Pattern Type**: Data collection with standardized vocabulary + custom entries
**UI Component**: Checkbox list with optional free-text "Other" field

---

## Overview

The Multi-Select Pattern allows users to select multiple items from a predefined list, with an optional "Other" field for custom entries. This balances standardization (for analytics/reporting) with flexibility (capturing edge cases).

### Why This Pattern?

**Benefits**:
- **Standardized data**: Common choices are consistent across users
- **Flexibility**: "Other" option prevents user frustration
- **Analytics-friendly**: Can analyze common selections, identify patterns
- **Fast input**: Checkboxes faster than typing
- **Clear options**: Users see all possibilities upfront

**Use Cases**:
- Symptoms (allergies, conditions)
- Drug types (recreational drugs)
- Medication routes (oral, injection, topical, etc.)
- Allergy types/categories
- Any fixed vocabulary with potential outliers

---

## Pattern Examples

### Example 1: Allergy Symptoms (Medication/Food - Severe)

**Context**: User has severe medication allergy
**Trigger**: Severity = "Severe" + Category = "Medication" OR "Food"

**Symptom List**:
```
Symptoms

☐ Anaphylaxis
☐ Difficulty breathing
☐ Swelling of face/throat/tongue
☐ Swelling of lips
☐ Tightness in chest
☐ Rapid heartbeat
☐ Dizziness or fainting
☐ Severe drop in blood pressure
☐ Nausea or vomiting
☐ Abdominal pain/cramping
☐ Other (specify): [_______________________]
```

**Selected State** (example):
```
Symptoms

☑ Anaphylaxis
☑ Difficulty breathing
☑ Swelling of face/throat/tongue
☐ Swelling of lips
☐ Tightness in chest
☐ Rapid heartbeat
☐ Dizziness or fainting
☐ Severe drop in blood pressure
☐ Nausea or vomiting
☐ Abdominal pain/cramping
☑ Other (specify): [Severe headache within minutes]
```

---

### Example 2: Allergy Symptoms (Seasonal)

**Context**: User has seasonal allergy
**Trigger**: Category = "Seasonal"

**Symptom List**:
```
Symptoms

☐ Runny nose
☐ Itchy eyes
☐ Itchy nose
☐ Cough
☐ Sneezing
☐ Congestion
☐ Watery eyes
☐ Post-nasal drip
☐ Sinus pressure
☐ Fatigue
☐ Other (specify): [_______________________]
```

**Note**: Different symptom list based on allergy category (see ALLERGIES_EXPANSION_SPEC.md)

---

### Example 3: Recreational Drug Types (Social History)

**Context**: User indicated "Yes" to recreational drug use
**Trigger**: usesRecreationalDrugs = true

**Drug Type List**:
```
What type of recreational drug?

☐ Cannabis
☐ Psychoactive medications
☐ Stimulants/MDMA
☐ Opioids
☐ Hallucinogens
☐ Cocaine
☐ Other (specify): [_______________________]
```

**Selected State** (example):
```
What type of recreational drug?

☑ Cannabis
☐ Psychoactive medications
☐ Stimulants/MDMA
☐ Opioids
☐ Hallucinogens
☐ Cocaine
☑ Other (specify): [Kratom]
```

**Follow-up**: For each selected drug, frequency dropdown appears (see Repeatable Entry Pattern)

---

## Visual Specification

### Checkbox Layout

```
┌─────────────────────────────────────────┐
│  Symptoms                               │  ← Section header
├─────────────────────────────────────────┤
│  ☐ Anaphylaxis                         │  ← Checkbox + label
│  ☐ Difficulty breathing                │     24px height per row
│  ☐ Swelling of face/throat/tongue      │     16px font size
│  ☐ Swelling of lips                    │     #000000 text color
│  ☐ Tightness in chest                  │
│  ☐ Rapid heartbeat                     │
│  ☐ Dizziness or fainting               │
│  ☐ Severe drop in blood pressure       │
│  ☐ Nausea or vomiting                  │
│  ☐ Abdominal pain/cramping             │
│                                         │
│  ☐ Other (specify):                    │
│     [_________________________________] │  ← Text input (conditional)
│                                         │
└─────────────────────────────────────────┘
```

### Checkbox States

**Unchecked**:
```
☐ Anaphylaxis
```
- Border: 1px solid #666666
- Background: #FFFFFF
- Size: 18px × 18px

**Checked**:
```
☑ Anaphylaxis
```
- Border: 1px solid #000000
- Background: #000000 (or accent color)
- Checkmark: White ✓
- Size: 18px × 18px

**Hover** (desktop):
- Border: 1px solid #000000
- Cursor: pointer

**Disabled**:
- Border: 1px solid #CCCCCC
- Background: #F5F5F5
- Text: #999999
- Cursor: not-allowed

---

## "Other" Field Behavior

### Conditional Visibility

**Option A - Always Visible** (RECOMMENDED):
```
☐ Other (specify): [Text input always present]
```

**Option B - Conditional Visibility**:
```
When unchecked:
☐ Other

When checked:
☑ Other (specify): [Text input appears]
```

**Recommendation**: **Option A (Always Visible)** for:
- Simpler UX (no click to reveal input)
- Clearer affordance (users see they can specify custom entries)
- Fewer clicks required

### Validation

**Required if "Other" checked**:

```typescript
function validateOtherField(isOtherChecked: boolean, otherText: string): boolean {
  if (isOtherChecked) {
    return otherText.trim().length > 0;  // Must specify what "Other" is
  }
  return true;  // Not checked, no validation needed
}
```

**Error State**:
```
☑ Other (specify): [_________________________________]
                    ⚠️ Please describe the other symptom
```

---

## Data Model

### TypeScript Interface

```typescript
interface MultiSelectField {
  standardSelections: string[];  // Array of selected standard option IDs
  otherValue?: string;           // Free-text "Other" entry (if selected)
}

// Example: Allergy symptoms
interface AllergySymptoms {
  selectedSymptoms: string[];    // ['anaphylaxis', 'difficulty_breathing', 'swelling_face_throat_tongue']
  otherSymptomDescription?: string; // 'Severe headache within minutes'
}

// Example: Recreational drugs
interface RecreationalDrugTypes {
  selectedDrugTypes: DrugType[]; // ['cannabis', 'other']
  otherDrugName?: string;        // 'Kratom'
}

type DrugType =
  | 'cannabis'
  | 'psychoactive_medications'
  | 'stimulants_mdma'
  | 'opioids'
  | 'hallucinogens'
  | 'cocaine'
  | 'other';
```

### Database Storage

**Option 1 - Separate Columns**:

```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY,
  patient_id UUID,

  -- Standard selections stored as PostgreSQL array
  symptoms TEXT[], -- ['anaphylaxis', 'difficulty_breathing', 'swelling_face_throat_tongue']

  -- "Other" stored separately
  other_symptom_description TEXT, -- 'Severe headache within minutes'

  -- Index for array queries
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for symptom searches
CREATE INDEX idx_allergies_symptoms ON allergies USING GIN (symptoms);

-- Query: Find all allergies with anaphylaxis symptom
SELECT * FROM allergies WHERE 'anaphylaxis' = ANY(symptoms);
```

**Option 2 - JSONB Storage**:

```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY,
  patient_id UUID,

  -- All symptoms stored as JSONB
  symptoms JSONB, -- { "selectedSymptoms": ["anaphylaxis", "difficulty_breathing"], "otherSymptomDescription": "Severe headache" }

  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for JSONB queries
CREATE INDEX idx_allergies_symptoms ON allergies USING GIN (symptoms);

-- Query: Find all allergies with anaphylaxis symptom
SELECT * FROM allergies WHERE symptoms @> '{"selectedSymptoms": ["anaphylaxis"]}';
```

**Recommendation**: **Option 1 (Separate Columns)** for:
- Simpler queries for standard selections
- Better performance for array searches
- Clear separation of structured vs. free-text data

---

## Implementation Guidelines

### React Component Example

```typescript
interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  selectedValues: string[];
  otherValue?: string;
  onChange: (selectedValues: string[], otherValue?: string) => void;
  showOther?: boolean; // Default: true
  maxSelections?: number; // Optional limit (e.g., max 5)
}

interface SelectOption {
  id: string;
  label: string;
  description?: string; // Optional tooltip/help text
}

function MultiSelectField({ label, options, selectedValues, otherValue, onChange, showOther = true }: MultiSelectProps) {
  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionId], otherValue);
    } else {
      onChange(selectedValues.filter(id => id !== optionId), otherValue);
    }
  };

  const handleOtherChange = (checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, 'other'], otherValue);
    } else {
      onChange(selectedValues.filter(id => id !== 'other'), undefined); // Clear "other" text
    }
  };

  const handleOtherTextChange = (text: string) => {
    onChange(selectedValues, text);
  };

  return (
    <div className="multi-select-field">
      <label>{label}</label>

      {options.map(option => (
        <div key={option.id} className="checkbox-row">
          <input
            type="checkbox"
            id={option.id}
            checked={selectedValues.includes(option.id)}
            onChange={e => handleCheckboxChange(option.id, e.target.checked)}
          />
          <label htmlFor={option.id}>{option.label}</label>
          {option.description && <Tooltip text={option.description} />}
        </div>
      ))}

      {showOther && (
        <div className="checkbox-row other-field">
          <input
            type="checkbox"
            id="other"
            checked={selectedValues.includes('other')}
            onChange={e => handleOtherChange(e.target.checked)}
          />
          <label htmlFor="other">Other (specify):</label>
          <input
            type="text"
            value={otherValue || ''}
            onChange={e => handleOtherTextChange(e.target.value)}
            disabled={!selectedValues.includes('other')}
            placeholder="Please specify..."
            className={selectedValues.includes('other') && !otherValue ? 'error' : ''}
          />
        </div>
      )}
    </div>
  );
}
```

---

## Category-Specific Lists

### Dynamic Option Lists Based on Context

**Allergies Example** (from ALLERGIES_EXPANSION_SPEC.md):

```typescript
function getSymptomOptions(category: AllergyCategory, severity: AllergySeverity): SelectOption[] {
  if ((category === 'medication' || category === 'food') && severity === 'severe') {
    return SEVERE_MEDICATION_FOOD_SYMPTOMS;
  }

  if ((category === 'medication' || category === 'food') && severity === 'not_severe') {
    return NOT_SEVERE_MEDICATION_FOOD_SYMPTOMS;
  }

  if (category === 'seasonal') {
    return SEASONAL_SYMPTOMS;
  }

  if (category === 'skin_contact') {
    return SKIN_CONTACT_SYMPTOMS;
  }

  if (category === 'environmental') {
    return ENVIRONMENTAL_SYMPTOMS;
  }

  return []; // No symptoms list
}

// Symptom vocabularies
const SEVERE_MEDICATION_FOOD_SYMPTOMS: SelectOption[] = [
  { id: 'anaphylaxis', label: 'Anaphylaxis', description: 'Life-threatening allergic reaction' },
  { id: 'difficulty_breathing', label: 'Difficulty breathing' },
  { id: 'swelling_face_throat_tongue', label: 'Swelling of face/throat/tongue' },
  // ... etc
];

const SEASONAL_SYMPTOMS: SelectOption[] = [
  { id: 'runny_nose', label: 'Runny nose' },
  { id: 'itchy_eyes', label: 'Itchy eyes' },
  { id: 'cough', label: 'Cough' },
  // ... etc
];
```

---

## Display Rules (Three-View Architecture)

### Patient View (UI[Pt])

**List Display** (comma-separated):
```
Symptoms: Anaphylaxis, Difficulty breathing, Swelling of face/throat/tongue, Severe headache within minutes
```

**Detail View** (bulleted list):
```
Symptoms:
• Anaphylaxis
• Difficulty breathing
• Swelling of face/throat/tongue
• Severe headache within minutes
```

### Provider View (UI[Pr])

**With Codes** (if applicable):
```
Symptoms:
• Anaphylaxis [T78.2]
• Difficulty breathing [R06.00]
• Swelling of face/throat/tongue [R22.0]
• Other: Severe headache within minutes
```

### Database (DB)

**Storage**:
```json
{
  "selectedSymptoms": [
    "anaphylaxis",
    "difficulty_breathing",
    "swelling_face_throat_tongue"
  ],
  "otherSymptomDescription": "Severe headache within minutes"
}
```

---

## Validation Rules

### Minimum Selection (Optional)

**Require at least one selection**:

```typescript
function validateMultiSelect(selectedValues: string[], otherValue?: string): boolean {
  // At least one standard option OR "other" with text
  const hasStandardSelection = selectedValues.some(v => v !== 'other');
  const hasValidOther = selectedValues.includes('other') && !!otherValue?.trim();

  return hasStandardSelection || hasValidOther;
}
```

### Maximum Selection (Optional)

**Limit number of selections** (uncommon for this pattern):

```typescript
function validateMaxSelections(selectedValues: string[], maxSelections: number = 10): boolean {
  return selectedValues.length <= maxSelections;
}
```

---

## Accessibility

### Keyboard Navigation

**Tab Order**:
1. Tab through each checkbox sequentially
2. Space bar toggles checkbox
3. Tab to "Other" text input (if "Other" checked)
4. Type in text input

### ARIA Attributes

```html
<fieldset role="group" aria-labelledby="symptoms-label">
  <legend id="symptoms-label">Symptoms</legend>

  <div class="checkbox-row">
    <input
      type="checkbox"
      id="anaphylaxis"
      name="symptoms[]"
      value="anaphylaxis"
      aria-describedby="anaphylaxis-desc"
    />
    <label for="anaphylaxis">Anaphylaxis</label>
    <span id="anaphylaxis-desc" class="sr-only">Life-threatening allergic reaction</span>
  </div>

  <!-- ... more checkboxes ... -->

  <div class="checkbox-row">
    <input
      type="checkbox"
      id="other-symptom"
      name="symptoms[]"
      value="other"
      aria-controls="other-symptom-text"
    />
    <label for="other-symptom">Other (specify):</label>
    <input
      type="text"
      id="other-symptom-text"
      name="other_symptom_description"
      aria-labelledby="other-symptom"
      aria-required="true"
      disabled
    />
  </div>
</fieldset>
```

### Screen Reader Announcements

**On Selection**:
```
"Anaphylaxis, checked"
"3 of 11 items selected"
```

**On "Other" Text Entry**:
```
"Other symptom description, edit text, required"
```

---

## Common Patterns Summary

| Use Case | Standard Options | "Other" Field | Validation |
|---|---|---|---|
| **Allergy Symptoms** | 10-11 symptoms per category | Yes (free-text) | Optional (no minimum) |
| **Drug Types** | 7 drug categories | Yes (drug name) | Optional (no minimum) |
| **Medication Routes** | 8-10 routes | Yes (custom route) | Optional (no minimum) |
| **Medical Conditions** | ICD-10 codes | Yes (rare conditions) | Minimum 1 selection |

---

## Related Patterns

- **[CONDITIONAL_UI_PATTERN.md](CONDITIONAL_UI_PATTERN.md)**: Symptom lists shown conditionally based on severity/category
- **[REPEATABLE_ENTRY_PATTERN.md](REPEATABLE_ENTRY_PATTERN.md)**: Drug types trigger repeatable frequency entries
- **[ALLERGIES_EXPANSION_SPEC.md](ALLERGIES_EXPANSION_SPEC.md)**: Complete symptom vocabularies by category

---

## Testing Checklist

**Functional Tests**:
- [ ] Can select multiple checkboxes
- [ ] Can deselect checkboxes
- [ ] "Other" checkbox enables text input
- [ ] "Other" text cleared when checkbox unchecked
- [ ] Validation requires "Other" text if checked
- [ ] Form submission includes all selections + "Other" text

**Edge Cases**:
- [ ] Select all options
- [ ] Deselect all options (if allowed)
- [ ] Check "Other" with empty text (should fail validation)
- [ ] Check "Other" with whitespace-only text (should fail validation)
- [ ] Max selections limit (if applicable)
- [ ] Category change clears previous selections

**Accessibility Tests**:
- [ ] Keyboard navigation works (Tab, Space)
- [ ] Screen reader announces selections
- [ ] ARIA attributes present and correct
- [ ] Focus visible on checkboxes
- [ ] "Other" text input has aria-required when checkbox checked

---

## Status

✅ **Pattern Documented**: Multi-select pattern is formalized and ready for implementation
📍 **Usage Locations**: Allergies (symptoms), Social History (drug types), future features
🎯 **Next Steps**: Implement reusable MultiSelectField component, add to component library
