# Conditional UI Pattern - Dynamic Field Visibility

**Status**: ✅ Reusable pattern documented
**Discovered in**: Social History screens (Smoking, Alcohol, Recreational Drugs, Caffeine)
**Also used in**: Allergies (EpiPen conditional on Severity), Medications (future expansions)
**Pattern Type**: Progressive disclosure based on user selections

---

## Overview

The Conditional UI Pattern controls field visibility based on user selections, typically radio buttons or dropdowns. Fields appear or disappear dynamically to show only relevant inputs, reducing cognitive load and form complexity.

### Why This Pattern?

**Benefits**:
- Reduces visual clutter (show only what's relevant)
- Guides user through context-specific questions
- Prevents invalid data entry (can't enter quantity if "Never" selected)
- Improves mobile UX (limited screen space)

**Use Cases**:
- Binary triggers: "Yes/No" → show/hide detail fields
- Multi-option triggers: "Smoker/Quit/Never" → different field sets
- Severity-based: "Severe allergy" → show EpiPen field
- Threshold-based: "Drinks ≥3-4 per day" → trigger CAGE questionnaire

---

## Pattern Examples

### Example 1: Smoking Status (Social History)

**Trigger Field**: Smoking Status (radio buttons)
- Smoker
- Quit smoking
- Never smoked

**Conditional Logic**:

```typescript
if (smokingStatus === 'smoker') {
  show: [
    'quantity',           // "How many cigarettes per day?"
    'duration'            // "How long have you smoked?"
  ]
  hide: [
    'quitDate',
    'pastQuantity'
  ]
}

if (smokingStatus === 'quit') {
  show: [
    'quitDate',           // "When did you quit?"
    'pastQuantity'        // "How many did you smoke before quitting?"
  ]
  hide: [
    'quantity',
    'duration'
  ]
}

if (smokingStatus === 'never') {
  hide: [
    'quantity',
    'duration',
    'quitDate',
    'pastQuantity'
  ]
}
```

**UI Flow**:
1. User selects "Smoker" → Quantity and Duration fields appear
2. User selects "Quit smoking" → Quit Date and Past Quantity appear, current quantity/duration disappear
3. User selects "Never smoked" → All sub-fields disappear, form is complete

---

### Example 2: Drinking Alcohol (Social History)

**Trigger Field**: Drinking Frequency (radio buttons)
- Never
- Occasionally
- More than once a week

**Conditional Logic**:

```typescript
if (drinkingFrequency === 'never') {
  hide: [
    'drinksPerDay',       // "How many drinks per day?"
    'alcoholType',        // "What type of alcohol?"
    'cageQuestionnaire'   // CAGE screening questions
  ]
}

if (drinkingFrequency === 'occasionally') {
  show: [
    'drinksPerDay',
    'alcoholType'
  ]
  hide: [
    'cageQuestionnaire'   // Don't trigger CAGE for occasional drinkers
  ]
}

if (drinkingFrequency === 'more_than_once_a_week') {
  show: [
    'drinksPerDay',
    'alcoholType'
  ]

  // Secondary conditional: CAGE questionnaire
  if (drinksPerDay >= '3-4 drinks') {
    show: 'cageQuestionnaire'  // Trigger alcohol screening
  }
}
```

**UI Flow**:
1. User selects "Never" → Form is complete, no additional questions
2. User selects "Occasionally" → Drinks per day and alcohol type appear
3. User selects "More than once a week" + "3-4 drinks" → CAGE questionnaire appears (nested conditional)

---

### Example 3: Recreational Drugs (Social History)

**Trigger Field**: Uses Recreational Drugs (radio buttons)
- Yes
- No

**Conditional Logic**:

```typescript
if (usesRecreationalDrugs === false) {
  hide: [
    'drugTypes',          // Multi-select checkboxes
    'drugFrequencies',    // Frequency dropdowns per drug
    'addMoreLink'         // "+ Add more" link
  ]
}

if (usesRecreationalDrugs === true) {
  show: [
    'drugTypes',          // Multi-select: Cannabis, Opioids, etc.
    'drugFrequencies',    // Individual frequency per selected drug
    'addMoreLink'
  ]
}
```

**UI Flow**:
1. User selects "No" → Form is complete
2. User selects "Yes" → Drug type checkboxes and frequency dropdowns appear

---

### Example 4: Allergy Severity (Allergies)

**Trigger Field**: Severity (radio buttons)
- Severe
- Not Severe

**Conditional Logic**:

```typescript
if (severity === 'severe' && (category === 'medication' || category === 'food')) {
  show: [
    'epiPenPrescribed',   // "EpiPen Prescribed? Yes/No"
    'severeSymptoms'      // Symptom list: Anaphylaxis, difficulty breathing, etc.
  ]
  hide: [
    'mildSymptoms'
  ]
}

if (severity === 'not_severe') {
  hide: [
    'epiPenPrescribed'
  ]
  show: [
    'mildSymptoms'        // Symptom list: Hives, itchiness, rash
  ]
  hide: [
    'severeSymptoms'
  ]
}
```

**UI Flow**:
1. User selects "Severe" → EpiPen field appears, severe symptom list shows
2. User selects "Not Severe" → EpiPen field disappears, mild symptom list shows

---

### Example 5: Caffeine Usage (Social History)

**Trigger Field**: Uses Caffeine (radio buttons)
- Yes
- No

**Conditional Logic**:

```typescript
if (usesCaffeine === false) {
  hide: [
    'caffeineQuantityPerDay'  // "How many cups/cans per day?"
  ]
}

if (usesCaffeine === true) {
  show: [
    'caffeineQuantityPerDay'
  ]
}
```

**UI Flow**:
1. User selects "No" → Form is complete
2. User selects "Yes" → Quantity input appears

---

## Visual Specification

### Before Selection (Initial State)

```
┌─────────────────────────────────────────┐
│  ←  Smoking                     [Save] │
├─────────────────────────────────────────┤
│                                         │
│  ○ Smoker                              │
│  ○ Quit smoking                        │
│  ○ Never smoked                        │  ← User must choose
│                                         │
└─────────────────────────────────────────┘
```

### After Selection: "Smoker"

```
┌─────────────────────────────────────────┐
│  ←  Smoking                     [Save] │
├─────────────────────────────────────────┤
│                                         │
│  ● Smoker                              │  ← Selected
│  ○ Quit smoking                        │
│  ○ Never smoked                        │
│                                         │
│  How many cigarettes, cigars, or       │  ← NEW FIELD
│  vapes per day?                        │
│  [20_______________________________]   │
│                                         │
│  For how long?                         │  ← NEW FIELD
│  [20_______________] [Years___] ▼     │
│                                         │
└─────────────────────────────────────────┘
```

### After Selection: "Quit smoking"

```
┌─────────────────────────────────────────┐
│  ←  Smoking                     [Save] │
├─────────────────────────────────────────┤
│                                         │
│  ○ Smoker                              │
│  ● Quit smoking                        │  ← Selected
│  ○ Never smoked                        │
│                                         │
│  When did you quit smoking?            │  ← DIFFERENT FIELDS
│  [_________________________________] 📅│
│                                         │
│  Before quitting, how many...          │  ← DIFFERENT FIELDS
│  [10_______________________________]   │
│                                         │
└─────────────────────────────────────────┘
```

### After Selection: "Never smoked"

```
┌─────────────────────────────────────────┐
│  ←  Smoking                     [Save] │
├─────────────────────────────────────────┤
│                                         │
│  ○ Smoker                              │
│  ○ Quit smoking                        │
│  ● Never smoked                        │  ← Selected
│                                         │
│                                         │
│  [No additional fields shown]          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Implementation Guidelines

### 1. Field Visibility Management

**State-Driven Approach**:

```typescript
interface ConditionalFieldConfig {
  triggerField: string;           // Field name that controls visibility
  triggerValue: any;              // Value that triggers visibility
  showFields: string[];           // Fields to show when triggered
  hideFields: string[];           // Fields to hide when triggered
  clearDataOnHide?: boolean;      // Clear hidden field data? (default: true)
}

// Example configuration
const smokingConditionals: ConditionalFieldConfig[] = [
  {
    triggerField: 'smokingStatus',
    triggerValue: 'smoker',
    showFields: ['quantity', 'duration'],
    hideFields: ['quitDate', 'pastQuantity'],
    clearDataOnHide: true
  },
  {
    triggerField: 'smokingStatus',
    triggerValue: 'quit',
    showFields: ['quitDate', 'pastQuantity'],
    hideFields: ['quantity', 'duration'],
    clearDataOnHide: true
  },
  {
    triggerField: 'smokingStatus',
    triggerValue: 'never',
    showFields: [],
    hideFields: ['quantity', 'duration', 'quitDate', 'pastQuantity'],
    clearDataOnHide: true
  }
];
```

### 2. Animation & Transitions

**Recommended Transitions**:
- Show field: Fade in + slide down (150ms)
- Hide field: Fade out + slide up (150ms)
- Clear field value: Immediate (no animation)

**CSS Example**:
```css
.conditional-field {
  transition: opacity 150ms ease-in-out, max-height 150ms ease-in-out;
}

.conditional-field.hidden {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.conditional-field.visible {
  opacity: 1;
  max-height: 500px; /* Adjust based on content */
}
```

### 3. Data Persistence

**Critical Decision**: What happens to hidden field data?

**Option A - Clear on Hide (RECOMMENDED)**:
```typescript
function onTriggerChange(newValue: any) {
  const config = getConditionalConfig(newValue);

  // Hide fields and clear their data
  config.hideFields.forEach(fieldName => {
    hideField(fieldName);
    if (config.clearDataOnHide) {
      clearFieldValue(fieldName);  // Reset to null/empty
    }
  });

  // Show fields (preserve existing data if any)
  config.showFields.forEach(fieldName => {
    showField(fieldName);
  });
}
```

**Option B - Preserve on Hide**:
- Hidden field data remains in database
- Useful for undo/redo scenarios
- Risk: Invalid data combinations

**Recommendation**: **Option A (Clear on Hide)** for data integrity
- Prevents invalid states (e.g., smokingStatus='never' but quantity='20')
- Simpler validation logic
- Clearer user mental model

### 4. Validation Rules

**Conditional Required Fields**:

```typescript
interface ValidationRule {
  field: string;
  required: boolean;
  requiredIf?: {
    triggerField: string;
    triggerValue: any;
  };
}

// Example: Quantity required if status = 'smoker'
const quantityValidation: ValidationRule = {
  field: 'quantity',
  required: false,  // Not globally required
  requiredIf: {
    triggerField: 'smokingStatus',
    triggerValue: 'smoker'
  }
};

// Validation function
function validateField(fieldName: string, formData: any): boolean {
  const rule = getValidationRule(fieldName);

  if (rule.required) return !!formData[fieldName];

  if (rule.requiredIf) {
    const triggerMet = formData[rule.requiredIf.triggerField] === rule.requiredIf.triggerValue;
    if (triggerMet) {
      return !!formData[fieldName];  // Required when trigger met
    }
  }

  return true;  // Not required, passes validation
}
```

---

## Nested Conditionals

### CAGE Questionnaire Example

**Two-Level Conditional**:
1. **Level 1**: Drinking frequency must be "More than once a week"
2. **Level 2**: Drinks per day must be ≥ "3-4 drinks"

```typescript
// Level 1: Show drinks/alcohol type fields
if (drinkingFrequency === 'occasionally' || drinkingFrequency === 'more_than_once_a_week') {
  show: ['drinksPerDay', 'alcoholType']
}

// Level 2: Show CAGE questionnaire (nested conditional)
if (drinkingFrequency === 'more_than_once_a_week' && drinksPerDay >= '3-4 drinks') {
  show: 'cageQuestionnaire'
}
```

**UI Flow**:
```
Step 1: Select "More than once a week"
        → Drinks per day appears

Step 2: Select "3-4 drinks"
        → CAGE questionnaire appears (4 Yes/No questions)

Step 3: Change to "1-2 drinks"
        → CAGE questionnaire disappears
```

---

## Database Schema Considerations

### Option 1: Nullable Columns (Simple)

```sql
CREATE TABLE social_history (
  id UUID PRIMARY KEY,
  patient_id UUID,

  -- Trigger field
  smoking_status VARCHAR(50), -- 'smoker', 'quit', 'never'

  -- Conditional fields (nullable)
  smoking_quantity TEXT,           -- NULL if status != 'smoker'
  smoking_duration_value INTEGER,  -- NULL if status != 'smoker'
  smoking_quit_date DATE,          -- NULL if status != 'quit'
  smoking_past_quantity TEXT,      -- NULL if status != 'quit'

  -- CHECK constraint to enforce data integrity
  CONSTRAINT valid_smoker_data CHECK (
    (smoking_status = 'smoker' AND smoking_quantity IS NOT NULL) OR
    (smoking_status = 'quit' AND smoking_quit_date IS NOT NULL) OR
    (smoking_status = 'never' AND smoking_quantity IS NULL AND smoking_quit_date IS NULL)
  )
);
```

### Option 2: JSONB Storage (Flexible)

```sql
CREATE TABLE social_history (
  id UUID PRIMARY KEY,
  patient_id UUID,

  -- Trigger field
  smoking_status VARCHAR(50),

  -- All conditional data in JSONB
  smoking_data JSONB -- { quantity: '20', duration: { value: 20, unit: 'years' } }
);

-- Index for JSONB queries
CREATE INDEX idx_smoking_data ON social_history USING GIN (smoking_data);
```

**Recommendation**: **Option 1 (Nullable Columns)** for:
- Better SQL query performance
- Clearer schema documentation
- Type safety at database level

---

## Accessibility Considerations

### Screen Reader Announcements

**Announce field visibility changes**:

```html
<div role="alert" aria-live="polite" aria-atomic="true">
  <!-- Dynamically updated announcement -->
  <span id="conditional-announcement"></span>
</div>

<script>
function onTriggerChange(newValue) {
  // Show/hide fields...

  // Announce change
  const announcement = document.getElementById('conditional-announcement');
  if (newFieldsShown.length > 0) {
    announcement.textContent = `Additional fields are now visible: ${newFieldsShown.join(', ')}`;
  }
}
</script>
```

### Focus Management

**Move focus to first new field**:

```typescript
function onTriggerChange(newValue: any) {
  const config = getConditionalConfig(newValue);

  // Show fields
  config.showFields.forEach(fieldName => showField(fieldName));

  // Focus first new field
  if (config.showFields.length > 0) {
    const firstField = document.getElementById(config.showFields[0]);
    firstField?.focus();
  }
}
```

---

## Common Patterns Summary

| Pattern Name | Trigger Type | Conditional Fields | Clear on Hide? |
|---|---|---|---|
| **Binary Conditional** | Yes/No radio | Show detail fields if "Yes" | ✅ Yes |
| **Multi-State Conditional** | Radio/Dropdown (3+ options) | Different fields per option | ✅ Yes |
| **Threshold Conditional** | Numeric/Dropdown value | Show if value ≥ threshold | ✅ Yes |
| **Nested Conditional** | Multiple triggers (AND logic) | Show if all conditions met | ✅ Yes |
| **Category-Based** | Category selection | Show category-specific fields | ✅ Yes |

---

## Related Patterns

- **[REPEATABLE_ENTRY_PATTERN.md](REPEATABLE_ENTRY_PATTERN.md)**: Often used with conditional fields (e.g., "+ Add more" drugs shown only if "Yes")
- **[DUAL_MODE_DATE_INPUT_COMPONENT.md](DUAL_MODE_DATE_INPUT_COMPONENT.md)**: Quit date field uses this component
- **Multi-Select Pattern** (TBD): Symptoms, drug types shown conditionally based on severity/usage

---

## Testing Checklist

**Functional Tests**:
- [ ] Fields appear when trigger condition met
- [ ] Fields disappear when trigger condition not met
- [ ] Hidden field data is cleared (if clearDataOnHide=true)
- [ ] Validation only applies to visible fields
- [ ] Nested conditionals work correctly (all levels)
- [ ] Changing trigger value updates fields immediately

**Edge Cases**:
- [ ] Rapid trigger value changes (debouncing)
- [ ] Form submission with partially filled conditional fields
- [ ] Browser back/forward with conditional state
- [ ] Autosave with conditional fields
- [ ] Required field validation on hidden fields (should skip)

**Accessibility Tests**:
- [ ] Screen reader announces field visibility changes
- [ ] Focus moves to first new field when shown
- [ ] Keyboard navigation works with dynamic fields
- [ ] ARIA live regions update correctly

---

## Status

✅ **Pattern Documented**: Conditional UI pattern is formalized and ready for implementation
📍 **Usage Locations**: Social History (5 screens), Allergies (severity-based), future features
🎯 **Next Steps**: Implement reusable ConditionalField component, add to component library
