# Conditional UI Pattern

## Purpose

Control field visibility dynamically based on user selections, showing only relevant inputs to reduce cognitive load and prevent invalid data entry. This pattern implements progressive disclosure for context-dependent form sections.

## Requirements

### Requirement: Binary Conditional Fields

The system SHALL show/hide fields based on Yes/No or binary radio selections.

#### Scenario: Yes selection shows fields
- **WHEN** user selects "Yes" option in trigger field
- **THEN** show related detail fields below trigger
- **AND** animate appearance with fade-in slide-down (150ms)
- **AND** auto-focus first new field
- **AND** announce field appearance to screen reader

#### Scenario: No selection hides fields
- **WHEN** user selects "No" option in trigger field
- **THEN** hide related detail fields
- **AND** animate disappearance with fade-out slide-up (150ms)
- **AND** clear data from hidden fields (recommended)
- **AND** announce field removal to screen reader

### Requirement: Multi-State Conditional Fields

The system SHALL show different field sets based on multi-option selections.

#### Scenario: Different fields per option
- **WHEN** user selects option from 3+ choices
- **THEN** hide fields from previous selection
- **AND** show fields specific to new selection
- **AND** clear data from hidden fields
- **AND** transition between field sets with animation
- **AND** maintain form scroll position

#### Scenario: Smoking status example
- **WHEN** user selects "Smoker"
- **THEN** show: quantity field, duration field
- **AND** hide: quit date, past quantity
- **WHEN** user selects "Quit smoking"
- **THEN** show: quit date, past quantity
- **AND** hide: current quantity, duration
- **WHEN** user selects "Never smoked"
- **THEN** hide all conditional fields

### Requirement: Nested Conditional Fields

The system SHALL support multiple conditional levels with AND logic.

#### Scenario: Two-level conditional
- **WHEN** user meets Level 1 condition
- **THEN** show Level 1 conditional fields
- **AND** evaluate Level 2 condition
- **WHEN** user meets both Level 1 AND Level 2 conditions
- **THEN** show Level 2 conditional fields
- **WHEN** Level 1 condition no longer met
- **THEN** hide both Level 1 and Level 2 fields

#### Scenario: CAGE questionnaire example
- **WHEN** drinking frequency = "More than once a week" (Level 1)
- **THEN** show drinks per day, alcohol type fields
- **WHEN** drinks per day >= "3-4 drinks" (Level 2)
- **THEN** show CAGE questionnaire (4 screening questions)
- **WHEN** drinks per day < "3-4 drinks"
- **THEN** hide CAGE questionnaire, keep Level 1 fields

### Requirement: Conditional Validation

The system SHALL validate only visible fields and mark conditional fields as required when visible.

#### Scenario: Visible field validation
- **WHEN** user saves form with conditional fields
- **THEN** validate all visible fields
- **AND** skip validation for hidden fields
- **AND** apply "required" rule to conditional field if trigger met
- **AND** allow submission without conditional data if trigger not met

#### Scenario: Conditional required field
- **WHEN** trigger condition met and conditional field marked required
- **THEN** show required indicator (*)
- **AND** validate field not empty on save
- **AND** show error if empty
- **WHEN** trigger condition not met
- **THEN** remove required indicator
- **AND** skip validation

### Requirement: Data Persistence

The system SHALL handle hidden field data according to clearDataOnHide setting.

#### Scenario: Clear on hide (recommended)
- **WHEN** fields hidden and clearDataOnHide = true
- **THEN** immediately clear field values
- **AND** set to null in form state
- **AND** prevent invalid data combinations
- **AND** simplify validation logic

#### Scenario: Preserve on hide (alternative)
- **WHEN** fields hidden and clearDataOnHide = false
- **THEN** keep field values in form state
- **AND** persist to database on save
- **AND** validate data consistency
- **AND** support undo/redo scenarios

## Implementation Details

### Configuration Structure

```typescript
interface ConditionalFieldConfig {
  triggerField: string;           // Field name controlling visibility
  triggerValue: any;              // Value that triggers visibility
  showFields: string[];           // Fields to show when triggered
  hideFields: string[];           // Fields to hide when triggered
  clearDataOnHide?: boolean;      // Default: true
}

// Example: Smoking status conditionals
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

### Validation Rules

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
  required: false,
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

  return true;  // Not required
}
```

### Animation Specifications

**CSS Transitions:**
```css
.conditional-field {
  transition: opacity 150ms ease-in-out,
              max-height 150ms ease-in-out,
              margin 150ms ease-in-out;
}

.conditional-field.hidden {
  opacity: 0;
  max-height: 0;
  margin: 0;
  overflow: hidden;
}

.conditional-field.visible {
  opacity: 1;
  max-height: 500px;  /* Adjust based on content */
  margin: 16px 0;
}
```

**Animation Timing:**
- Show: Fade in + slide down (150ms)
- Hide: Fade out + slide up (150ms)
- Clear data: Immediate (no animation)

### Database Considerations

**Option 1: Nullable Columns (Recommended)**
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

  -- CHECK constraint for data integrity
  CONSTRAINT valid_smoker_data CHECK (
    (smoking_status = 'smoker' AND smoking_quantity IS NOT NULL) OR
    (smoking_status = 'quit' AND smoking_quit_date IS NOT NULL) OR
    (smoking_status = 'never' AND smoking_quantity IS NULL AND smoking_quit_date IS NULL)
  )
);
```

**Option 2: JSONB Storage**
```sql
CREATE TABLE social_history (
  id UUID PRIMARY KEY,
  patient_id UUID,

  smoking_status VARCHAR(50),
  smoking_data JSONB  -- { quantity: '20', duration: { value: 20, unit: 'years' } }
);

CREATE INDEX idx_smoking_data ON social_history USING GIN (smoking_data);
```

## Where Used

- **Social History**: Smoking status (Smoker/Quit/Never), Alcohol frequency (Never/Occasionally/Weekly+), Recreational Drugs (Yes/No), Caffeine (Yes/No)
- **Allergies**: EpiPen field (shown only if Severity = Severe + Category = Medication/Food)
- **Conditions**: Episode-specific fields (shown only for Transient-Recurrent type)

## Dependencies

- Animation library or CSS transitions
- Form state management
- Validation framework
- Screen reader announcements (ARIA live regions)

## Compliance

### Accessibility
- Screen reader: "Additional fields now visible: Quantity, Duration"
- ARIA live regions: Announce field visibility changes
- Focus management: Move focus to first new field
- Keyboard: Tab order maintains logical flow through visible fields

### Validation
- Validate only visible fields
- Apply required rules conditionally
- Clear validation errors when fields hidden
- Prevent invalid data combinations

### Performance
- CSS animations: 150ms transitions
- Debounce rapid trigger changes
- Batch DOM updates
- Efficient conditional evaluation

### Data Integrity
- Clear hidden field data by default (clearDataOnHide: true)
- Database CHECK constraints for validity
- Prevent orphaned conditional data
- Maintain trigger-field relationships
