# Quick Add Pattern - Rapid Single-Field Entry

## Purpose

Provide an inline text input pattern in list views for rapid name-only entry, enabling users to quickly create records with minimal friction. Full details can be added later through standard edit flows.

## Requirements

### Requirement: Inline Input Display

The system SHALL display a persistent Quick Add input field at the top of list views where this pattern is enabled.

#### Scenario: Input field positioning
- **WHEN** user views list with Quick Add enabled
- **THEN** display input field at top of list, below header
- **AND** show placeholder text "[Type] name..." (e.g., "Enter medication name...")
- **AND** display submit arrow button (→) on right side
- **AND** maintain 58px height (standard input height)
- **AND** keep field visible at all times (non-collapsing)

### Requirement: Quick Add Submission

The system SHALL validate input and create minimal records on submission.

#### Scenario: Successful quick add
- **WHEN** user enters name (2+ characters) and taps submit or presses Enter
- **THEN** validate name not empty and minimum 2 characters
- **AND** trim whitespace from name
- **AND** create record with name only, all other fields null
- **AND** insert new record at top of list with slide-in animation
- **AND** show "Added!" success message briefly (1 second)
- **AND** clear input field
- **AND** refocus input for next entry
- **AND** keep keyboard open for rapid multiple entries

#### Scenario: Duplicate name detection
- **WHEN** user submits name that already exists (case-insensitive)
- **THEN** show error message "This [type] already exists"
- **AND** highlight input field with red border
- **AND** keep entered text in field
- **AND** keep keyboard open
- **AND** allow user to edit or cancel

#### Scenario: Empty submission attempt
- **WHEN** user attempts to submit empty or whitespace-only input
- **THEN** show error "Name is required"
- **AND** highlight input with red border
- **AND** focus input field

### Requirement: Autocomplete Support (Optional)

The system SHALL provide autocomplete suggestions as users type.

#### Scenario: Autocomplete display
- **WHEN** user types 2+ characters in Quick Add input
- **THEN** fetch autocomplete suggestions from API
- **AND** display dropdown below input with up to 5 suggestions
- **AND** debounce API calls (300ms delay)
- **AND** support keyboard navigation (arrow keys)
- **AND** hide dropdown if no suggestions found

#### Scenario: Autocomplete selection
- **WHEN** user taps or presses Enter on suggestion
- **THEN** fill input with selected name
- **AND** submit immediately (create record)
- **AND** close dropdown
- **AND** show success animation

### Requirement: Feature-Specific Enablement

The system SHALL enable Quick Add only for features where name-only entry is meaningful.

#### Scenario: Enabled features
- **WHEN** system determines if Quick Add should be available
- **THEN** enable for: Medications (drug name sufficient), Allergies (allergen name sufficient), Supplements (supplement name sufficient)
- **AND** disable for: Conditions (type selection required first), Surgeries (date critical), Immunizations (complex dose structure)

#### Scenario: Decision criteria
- **WHEN** evaluating new feature for Quick Add
- **THEN** enable if: name/title sufficient for meaningful record, other fields truly optional, users commonly know name first, rapid bulk entry common
- **AND** disable if: type/category required, critical fields needed, complex sub-structures required, few records typically added

## Implementation Details

### Component Specification

**QuickAddInput Component:**
```typescript
interface QuickAddInputProps {
  placeholder: string;        // "Enter medication name..."
  onSubmit: (name: string) => Promise<void>;
  onDuplicate?: (name: string) => void;
  autocompleteEnabled?: boolean;
  autocompleteSource?: (query: string) => Promise<string[]>;
  minLength?: number;         // Default: 2
  maxLength?: number;         // Default: 255
}
```

**Visual Specifications:**
- Height: 58px
- Width: Full width minus 16px margins each side
- Background: White or light gray (#F5F5F5)
- Border: 1px solid #CCCCCC
- Submit button: 42px width, arrow icon (→)
- Font: 16px, #000000

### Data Model

**Minimal Record Created:**
```typescript
interface QuickAddResult {
  id: string;              // Generated UUID
  patientId: string;       // Current patient
  name: string;            // User-entered name (ONLY FILLED FIELD)

  // All other fields null/undefined
  createdVia: 'quick_add'; // Track creation method
  createdAt: Date;         // NOW()
  updatedAt: Date;         // NOW()
}
```

**Database Insert:**
```sql
INSERT INTO medications (
  id,
  patient_id,
  name,
  created_via,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  $1, -- patient_id
  $2, -- name from input
  'quick_add',
  NOW(),
  NOW()
);
```

### States

**1. Empty/Default:**
- Placeholder visible: "Enter medication name..."
- Submit button inactive/dimmed

**2. Focused (typing):**
- Cursor visible in input
- Placeholder disappears
- Submit button becomes active

**3. Submitting (loading):**
- Spinner replaces submit arrow
- Input disabled during submit

**4. Success:**
- "Added!" text replaces input content
- Checkmark (✓) replaces submit arrow
- 1-second duration, then clear and refocus

**5. Error:**
- Error message below input
- Red border on input
- Submit arrow remains
- Text preserved for editing

## Where Used

- **Medications Management**: Quick capture of medication names
- **Allergies Management**: Quick capture of allergen names
- **Supplements Management**: Quick capture of supplement/vitamin names

## Dependencies

- Standard input validation framework
- List view component architecture
- Animation library (slide-in, fade transitions)
- Optional: Autocomplete API endpoints

## Compliance

### Accessibility
- Screen reader: "Quick add [type] input field. Enter [type] name."
- Keyboard: Enter/Return submits, Escape clears
- Tab order: Standard Add button → Quick Add input → Submit button → First list item
- Voice control: "Tap quick add", "Add [name]"

### Validation
- Required: Name not empty
- Minimum length: 2 characters
- Maximum length: 255 characters
- Trim whitespace automatically
- Optional: Duplicate detection (warning)

### Performance
- Autocomplete debounce: 300ms
- Suggestion limit: 5 results
- Cache frequent suggestions
- Smooth animations: 150-300ms durations
