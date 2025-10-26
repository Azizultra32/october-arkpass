# Field-Level Editing Pattern

## Purpose

Provide dedicated edit screens for individual fields or field groups, optimizing mobile UX with focused single-task interfaces. This pattern replaces large multi-field forms with granular per-field edit flows.

## Requirements

### Requirement: Main View Display

The system SHALL display all fields with inline edit buttons in the main view.

#### Scenario: Field row display
- **WHEN** user views main screen with editable fields
- **THEN** display field label at top left
- **AND** display current value below label
- **AND** show [Edit] button at top right (77px × 42px)
- **AND** show optional status indicators (red dot for warnings)
- **AND** display optional status text below value (e.g., "Confirm your email")
- **AND** separate field sections with visual dividers

#### Scenario: Field status indicators
- **WHEN** field requires user attention
- **THEN** show red dot (•) next to [Edit] button
- **AND** display warning text in red below value
- **AND** maintain indicator until issue resolved

### Requirement: Edit Screen Navigation

The system SHALL navigate to dedicated edit screens when user taps Edit button.

#### Scenario: Navigate to edit screen
- **WHEN** user taps [Edit] button for any field
- **THEN** navigate to dedicated edit screen for that field/group
- **AND** show field name in header (centered or left after back arrow)
- **AND** show back arrow (←) on left
- **AND** show [Save] button on right (77px width)
- **AND** display field input with full screen space
- **AND** pre-populate input with current value

#### Scenario: Edit screen header
- **WHEN** edit screen is displayed
- **THEN** render header at 58px height
- **AND** position back arrow at 24px icon size, left-aligned
- **AND** display field name (e.g., "Gender", "Email")
- **AND** position [Save] button right-aligned

### Requirement: Saving Changes

The system SHALL validate and save field changes on Save button tap.

#### Scenario: Successful save
- **WHEN** user taps [Save] button with valid data
- **THEN** validate field value
- **AND** send PATCH request with single field update
- **AND** update field in database
- **AND** create audit trail entry (if enabled)
- **AND** navigate back to main view
- **AND** display updated value in main view
- **AND** announce change to screen reader

#### Scenario: Validation error
- **WHEN** user taps [Save] with invalid data
- **THEN** show validation error message below input
- **AND** highlight input with red border
- **AND** keep edit screen open
- **AND** focus input field
- **AND** announce error to screen reader

### Requirement: Discarding Changes

The system SHALL handle unsaved changes when user taps back arrow.

#### Scenario: Auto-discard for single fields (recommended)
- **WHEN** user taps back arrow (←) in single-field edit screen
- **THEN** discard changes without confirmation
- **AND** navigate back to main view
- **AND** display original value (unchanged)

#### Scenario: Confirmation for multi-field groups
- **WHEN** user taps back arrow in multi-field edit screen with changes
- **THEN** show confirmation dialog
- **AND** title: "Discard Changes?"
- **AND** message: "You have unsaved changes. Discard them and go back?"
- **AND** provide Cancel and Discard options
- **AND** return to main view if Discard selected

### Requirement: Field Grouping

The system SHALL group related fields on single edit screens where appropriate.

#### Scenario: Grouped fields
- **WHEN** fields are semantically related or edited together
- **THEN** combine on single edit screen (e.g., First/Middle/Last Name)
- **AND** limit groups to 2-3 fields maximum
- **AND** show all fields vertically stacked
- **AND** validate all fields before saving

#### Scenario: Separate fields
- **WHEN** fields are independent or have complex flows
- **THEN** keep on separate edit screens (e.g., Email, Phone)
- **AND** allow field-specific validation
- **AND** support field-specific confirmation flows (e.g., SMS verification)

### Requirement: Audit Trail (Optional)

The system SHALL track field-level changes for compliance and transparency.

#### Scenario: Audit entry creation
- **WHEN** user saves field change
- **THEN** create audit record with:
  - field_name (e.g., 'gender', 'email')
  - old_value (previous value as text)
  - new_value (new value as text)
  - changed_by (user ID)
  - changed_at (timestamp)
  - change_source (e.g., 'patient_app', 'provider_portal')

#### Scenario: Audit trail query
- **WHEN** system needs field history
- **THEN** query audit table by patient_id and field_name
- **AND** order by changed_at descending
- **AND** display in UI if enabled (e.g., "Last updated: Oct 25, 2025")

## Implementation Details

### Component Structure

**FieldRow Component:**
```typescript
interface FieldRowProps {
  label: string;
  value: string | ReactNode;
  onEdit: () => void;
  statusIndicator?: 'warning' | 'error' | 'info';
  statusText?: string;
  showSeparator?: boolean;
}
```

**EditScreen Component:**
```typescript
interface EditScreenProps {
  title: string;                    // Field name for header
  fields: FieldConfig[];            // Field(s) being edited
  initialValues: Record<string, any>;
  onSave: (values: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  validationRules?: ValidationRule[];
  confirmOnBack?: boolean;          // Default: false for single field
}
```

### API Pattern

**PATCH Request for Single Field:**
```http
PATCH /api/patients/{id}/personal-information
Content-Type: application/json

{
  "gender": "male"  // Single field update
}
```

**Response:**
```json
{
  "id": "123",
  "firstName": "John",
  "gender": "male",        // ← Updated
  "updatedAt": "2025-10-25T10:30:00Z"
}
```

### Database Schema (Audit Trail)

```sql
CREATE TABLE personal_information_audit (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  field_name VARCHAR(100),  -- 'gender', 'email', 'mobilePhone'
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,          -- User who made the change
  changed_at TIMESTAMP DEFAULT NOW(),

  change_source VARCHAR(50) -- 'patient_app', 'provider_portal', 'admin_panel'
);

-- Index for field history queries
CREATE INDEX idx_pi_audit_patient_field
  ON personal_information_audit(patient_id, field_name, changed_at DESC);
```

### Visual Specifications

**Main View Field Row:**
```
┌─────────────────────────────────────────┐
│  Field Label              •      [Edit] │  ← Label + indicator + button
│  Current Value                          │  ← Value below
│  Optional status text (red if warning)  │  ← Status below value
└─────────────────────────────────────────┘
```

**Edit Screen:**
```
┌─────────────────────────────────────────┐
│  ←  Field Name                  [Save]  │  ← Header (58px)
├─────────────────────────────────────────┤
│                                         │
│  Field Label (Required/Optional)        │  ← Input area
│  [Input component___________________]  │
│  [Helper text if needed_____________]  │
│                                         │
└─────────────────────────────────────────┘
```

### Field Grouping Guidelines

**Group together:**
- First/Middle/Last Name (related, edited together)
- Height/Weight (related, edited together)
- Street/City/State/Zip (composite address)

**Keep separate:**
- Email (separate confirmation flow)
- Mobile Phone (separate verification flow)
- Gender (independent, simple dropdown)
- Date of Birth (independent, may be locked)

## Where Used

- **Personal Information**: 15 edit screens (Photo Upload, Name, Gender, DOB, Height & Weight, Mobile Phone, Email, Blood Type, Sex Assigned at Birth, Preferred Pronouns, Emergency Contact, Primary Care Provider, Insurance, Address, Delete Account)
- **Social History**: 8 edit screens (Smoking, Alcohol, Recreational Drugs, Caffeine, Exercise, Diet, Sleep, Stress)

## Dependencies

- Navigation framework (screen transitions)
- Form validation framework
- Confirmation dialog component
- Audit trail database (optional)

## Compliance

### Accessibility
- Screen reader: "First Name, John, Edit button"
- Keyboard: Tab to [Edit] → Enter activates → Tab in edit screen → Enter saves
- Focus management: Auto-focus input in edit screen
- Voice control: "Tap edit", "Edit gender", "Save changes"

### Validation
- Per-field validation rules
- Real-time or on-submit validation
- Clear error messages with positioning
- Prevent save until validation passes

### Performance
- Optimistic UI updates (instant navigation back)
- PATCH requests (single field only)
- Concurrent edit handling (optimistic locking)
- Audit trail indexing for fast queries
