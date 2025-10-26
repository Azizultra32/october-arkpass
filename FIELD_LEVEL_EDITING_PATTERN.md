# Field-Level Editing Pattern - Individual Edit Screens per Field

**Status**: ✅ Reusable pattern documented
**Discovered in**: Personal Information (15 screens), Social History (8 screens)
**Pattern Type**: Granular editing with focused UI
**Alternative to**: Single large edit form with all fields

---

## Overview

The Field-Level Editing Pattern provides a dedicated edit screen for each field or related field group. Instead of one large "Edit Personal Information" form, each field (Name, Gender, DOB, etc.) has its own focused edit screen.

### Why This Pattern?

**Benefits**:
- **Mobile-friendly**: Full screen for single field = large tap targets, no scrolling
- **Focused UX**: User attention on one task at a time
- **Reduced cognitive load**: Simpler decision-making (edit one field vs. scanning entire form)
- **Faster saves**: Edit one field → Save → Done (no need to review entire form)
- **Clearer validation**: Errors scoped to single field
- **Better permissions**: Can lock individual fields (e.g., DOB locked after verification)

**Use Cases**:
- Profile information (name, email, phone, etc.)
- Account settings (password, notification preferences)
- Health records with regulatory requirements (audit trail per field)
- Any screen where fields are edited infrequently and independently

---

## Pattern Structure

### Main View Screen

**Purpose**: Display all fields with inline "Edit" buttons
**Layout**: Read-only values + Edit button per field

```
┌─────────────────────────────────────────┐
│  ← Personal Information                │
├─────────────────────────────────────────┤
│  Upload Photo               •    [Edit]│  ← Field 1 with indicator
│  [Profile photo placeholder]           │
│                                         │
│  ────────────────────────────────       │
│                                         │
│  First Name                      [Edit]│  ← Field 2
│  John                                   │
│                                         │
│  Middle Name (Optional)          [Edit]│  ← Field 3
│  Michael                                │
│                                         │
│  Last Name                       [Edit]│  ← Field 4
│  Doe                                    │
│                                         │
│  Gender                          [Edit]│  ← Field 5
│  Male                                   │
│                                         │
│  Date of Birth                   [Edit]│  ← Field 6
│  March 15, 1974 (Age 50)                │
│                                         │
│  Height & Weight                 [Edit]│  ← Field group 7
│  180cm (5'11")                          │
│  80kg (176lbs)                          │
│                                         │
│  ────────────────────────────────       │
│                                         │
│  Mobile Phone                    [Edit]│  ← Field 8
│  +1 (604) 123-4567                      │
│  SMS verification sent                  │
│                                         │
│  Email                     •     [Edit]│  ← Field 9 with warning
│  john.doe@domain.com                    │
│  Confirm your email                     │  ← Red warning text
│                                         │
│  ────────────────────────────────       │
│                                         │
│  [Delete Account]                       │  ← Account action
└─────────────────────────────────────────┘
```

### Individual Edit Screen

**Purpose**: Edit a single field or field group
**Layout**: Focused edit UI with Save/Cancel

```
┌─────────────────────────────────────────┐
│  ←  Gender                      [Save] │  ← Back + Field name + Save
├─────────────────────────────────────────┤
│                                         │
│  Gender (Required)                      │  ← Field label
│  [Male_________________________] ▼     │  ← Field input
│                                         │
└─────────────────────────────────────────┘
```

**Key Elements**:
1. **Back arrow**: Returns to main view (discards changes if not saved)
2. **Field name**: Title bar shows what's being edited
3. **Save button**: Top-right, saves changes and returns to main view
4. **Field input**: Full-screen space for input component
5. **No "Cancel" button**: Back arrow serves as cancel

---

## Pattern Examples

### Example 1: Simple Field (Gender)

**Main View**:
```
Gender                          [Edit]
Male
```

**Edit Screen**:
```
┌─────────────────────────────────────────┐
│  ←  Gender                      [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Gender (Required)                      │
│  [Male_________________________] ▼     │
│                                         │
└─────────────────────────────────────────┘
```

**Flow**:
1. User taps "[Edit]" button
2. Navigate to dedicated Gender edit screen
3. User selects from dropdown
4. User taps "[Save]"
5. Navigate back to main view with updated value

---

### Example 2: Composite Field (Name)

**Main View**:
```
First Name                      [Edit]
John

Middle Name (Optional)          [Edit]
Michael

Last Name                       [Edit]
Doe
```

**Edit Screen** (all three fields on one screen):
```
┌─────────────────────────────────────────┐
│  ←  Name                        [Save] │
├─────────────────────────────────────────┤
│                                         │
│  First Name (Required)                  │
│  [John_____________________________]   │
│                                         │
│  Middle Name (Optional)                 │
│  [Michael__________________________]   │
│                                         │
│  Last Name (Required)                   │
│  [Doe_______________________________]  │
│                                         │
└─────────────────────────────────────────┘
```

**Design Decision**: Name fields grouped on single edit screen (related fields)
**Alternative**: Separate edit screens per name field (more atomic, less common)

---

### Example 3: Field with Validation (Email)

**Main View** (unverified state):
```
Email                     •     [Edit]
john.doe@domain.com
Confirm your email                         ← Red warning text
```

**Edit Screen**:
```
┌─────────────────────────────────────────┐
│  ←  Email                       [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Email (Required)                       │
│  [john.doe@domain.com___________]      │
│                                         │
└─────────────────────────────────────────┘
```

**Post-Save Flow**:
1. User edits email
2. User taps "[Save]"
3. System sends confirmation email
4. Main view shows red dot + "Confirm your email" warning
5. User clicks email link → Warning disappears

---

### Example 4: Field Group (Height & Weight)

**Main View**:
```
Height & Weight                 [Edit]
180cm (5'11")
80kg (176lbs)
```

**Edit Screen**:
```
┌─────────────────────────────────────────┐
│  ←  Height & Weight             [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Height                                 │
│  [180____________] [cm__] ▼            │
│  5'11"                                  │  ← Auto-converted display
│                                         │
│  Weight                                 │
│  [80_____________] [kg__] ▼            │
│  176lbs                                 │  ← Auto-converted display
│                                         │
└─────────────────────────────────────────┘
```

**Design Decision**: Height + Weight grouped (often edited together, related semantically)

---

### Example 5: Field with Confirmation Flow (Mobile Phone)

**Main View**:
```
Mobile Phone                    [Edit]
+1 (604) 123-4567
SMS verification sent
```

**Edit Screen**:
```
┌─────────────────────────────────────────┐
│  ←  Mobile Phone                [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Mobile Phone (Required)                │
│  [+1 (604) 123-4567____________]       │
│                                         │
└─────────────────────────────────────────┘
```

**Post-Save Flow**:
1. User edits phone number
2. User taps "[Save]"
3. System sends SMS verification code
4. Navigate to verification screen (separate pattern)
5. User enters code → Phone verified
6. Main view shows verified status

---

## Visual Specification

### Main View Edit Button

**Button Style**:
```
[Edit]
```
- Type: Outlined button
- Width: 77px
- Height: 42px
- Border: 1px solid #666666
- Text: "Edit" (14px, #000000)
- Border-radius: 4px
- Position: Right-aligned

**Field Layout**:
```
┌─────────────────────────────────────────┐
│  Field Label                     [Edit]│  ← Label left, button right
│  Field Value                            │  ← Value below label
│  Optional: Status/Warning               │  ← Additional info (red if warning)
└─────────────────────────────────────────┘
```

### Edit Screen Header

**Header Bar**:
```
┌─────────────────────────────────────────┐
│  ←  Field Name                  [Save] │
└─────────────────────────────────────────┘
```
- Height: 58px (standard header)
- Back arrow: 24px icon, left-aligned
- Field name: Centered or left-aligned after arrow
- Save button: Right-aligned, 77px width

### Field Input Area

**Full-screen space for input**:
```
┌─────────────────────────────────────────┐
│                                         │
│  Field Label (Required/Optional)        │
│  [Input component__________________]   │
│  [Helper text if needed____________]   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Data Model

### No Special Schema

**Standard CRUD operations**:
- Main view: `GET /api/patients/{id}/personal-information`
- Edit screen: Load same data
- Save: `PATCH /api/patients/{id}/personal-information` with single field update

**Example PATCH Request** (update gender only):

```http
PATCH /api/patients/123/personal-information
Content-Type: application/json

{
  "gender": "male"
}
```

**Response**:

```json
{
  "id": "123",
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "gender": "male",        // ← Updated
  "dateOfBirth": "1974-03-15",
  "updatedAt": "2025-10-25T10:30:00Z"
}
```

---

## Audit Trail (Optional)

### Field-Level Change Tracking

**Why Track per Field?**:
- Regulatory compliance (HIPAA, etc.)
- Security (detect unauthorized changes)
- User transparency (show change history)

**Audit Schema**:

```sql
CREATE TABLE personal_information_audit (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  field_name VARCHAR(100),  -- 'gender', 'email', 'mobilePhone', etc.
  old_value TEXT,           -- Previous value
  new_value TEXT,           -- New value
  changed_by UUID,          -- User who made the change (patient or provider)
  changed_at TIMESTAMP DEFAULT NOW(),

  -- Optional: Change source
  change_source VARCHAR(50) -- 'patient_app', 'provider_portal', 'admin_panel'
);

-- Index for field history queries
CREATE INDEX idx_pi_audit_patient_field ON personal_information_audit(patient_id, field_name, changed_at DESC);
```

**Query Field History**:

```sql
-- Get gender change history
SELECT field_name, old_value, new_value, changed_at
FROM personal_information_audit
WHERE patient_id = '123' AND field_name = 'gender'
ORDER BY changed_at DESC;
```

**Display in UI** (optional):

```
Gender                          [Edit]
Male
Last updated: Oct 25, 2025
```

---

## Navigation Flow

### Happy Path

```
Main View
   ↓ Tap [Edit] on "Gender" field
Edit Gender Screen
   ↓ Select "Female"
   ↓ Tap [Save]
Main View (updated: "Female")
```

### Cancel Flow

```
Main View
   ↓ Tap [Edit] on "Gender" field
Edit Gender Screen
   ↓ Make changes
   ↓ Tap ← Back arrow (without saving)
   ↓ Discard changes dialog (optional)
Main View (unchanged)
```

### Validation Error Flow

```
Main View
   ↓ Tap [Edit] on "Email" field
Edit Email Screen
   ↓ Enter invalid email "notanemail"
   ↓ Tap [Save]
Edit Email Screen (shows validation error)
   ↓ Fix email "john@example.com"
   ↓ Tap [Save]
Main View (updated + confirmation email sent)
```

---

## Unsaved Changes Handling

### Option A: Auto-Discard (Simple)

**No confirmation dialog**:
- User taps ← Back arrow
- Changes discarded immediately
- Navigate back to main view

**Pros**:
- Simpler UX
- Fewer clicks
- Mobile-native pattern (iOS standard)

**Cons**:
- Accidental data loss

### Option B: Confirmation Dialog (Safe)

**Show dialog if changes detected**:

```
┌─────────────────────────────────────────┐
│  Discard Changes?                       │
│                                         │
│  You have unsaved changes. Discard     │
│  them and go back?                      │
│                                         │
│  [Cancel]              [Discard]       │
└─────────────────────────────────────────┘
```

**Pros**:
- Prevents accidental data loss
- User confirmation required

**Cons**:
- Extra click
- Friction in workflow

**Recommendation**: **Option A (Auto-Discard)** for single-field edits (low risk)
- If edit form is complex (multiple fields), use Option B

---

## When to Group Fields

### Single Edit Screen for Multiple Fields

**Group fields when**:
1. **Semantically related**: First/Middle/Last Name
2. **Edited together**: Height + Weight
3. **Dependent fields**: Street + City + State + Zip (Address)
4. **Small number**: 2-3 fields maximum

**Keep separate when**:
1. **Independent fields**: Email vs. Phone (separate concerns)
2. **Different validation**: Each field has complex validation
3. **Different permissions**: One field locked, other editable
4. **Different audit requirements**: Track changes separately

**Examples**:

| Field Group | Grouped? | Rationale |
|---|---|---|
| First/Middle/Last Name | ✅ Yes | Related, edited together |
| Height + Weight | ✅ Yes | Related, edited together |
| Street + City + Zip (Address) | ✅ Yes | Composite field |
| Email | ❌ No | Separate confirmation flow |
| Mobile Phone | ❌ No | Separate verification flow |
| Gender | ❌ No | Independent, simple dropdown |
| Date of Birth | ❌ No | Independent, locked after verification |

---

## Comparison: Field-Level vs. Single Form

### Field-Level Editing (This Pattern)

**Pros**:
- Mobile-friendly (full screen per field)
- Focused UX (one task at a time)
- Granular audit trail
- Easier validation per field

**Cons**:
- More screens (15 edit screens vs. 1 large form)
- More navigation clicks
- Not ideal for "edit everything at once" workflows

**Best for**:
- Mobile-first apps
- Infrequent edits (profile settings)
- Fields with separate validation/confirmation flows
- Regulatory environments (audit trail per field)

---

### Single Large Form (Alternative)

**Layout**:
```
┌─────────────────────────────────────────┐
│  ←  Edit Personal Information  [Save] │
├─────────────────────────────────────────┤
│  First Name (Required)                  │
│  [John_____________________________]   │
│                                         │
│  Middle Name (Optional)                 │
│  [Michael__________________________]   │
│                                         │
│  Last Name (Required)                   │
│  [Doe_______________________________]  │
│                                         │
│  Gender (Required)                      │
│  [Male_________________________] ▼     │
│                                         │
│  Date of Birth (Required)               │
│  [_________________________________] 📅│
│                                         │
│  [Continue scrolling...]                │
└─────────────────────────────────────────┘
```

**Pros**:
- Fewer screens
- Edit multiple fields in one session
- Standard web form pattern

**Cons**:
- Requires scrolling on mobile
- Cognitive overload (too many fields visible)
- Validation errors scattered across long form

**Best for**:
- Desktop-first apps
- Onboarding flows (fill out entire profile once)
- Bulk data entry

---

## Accessibility

### Keyboard Navigation (Desktop)

**Main View**:
- Tab through [Edit] buttons
- Enter key activates button → Navigate to edit screen

**Edit Screen**:
- Tab to field input
- Type/select value
- Tab to [Save] button
- Enter key saves

### Screen Reader Announcements

**Main View**:
```
"First Name, John, Edit button"
"Middle Name, Michael, optional, Edit button"
"Last Name, Doe, Edit button"
```

**Edit Screen**:
```
"Gender, required, dropdown, Male selected"
```

**After Save**:
```
"Gender updated to Female. Personal Information screen."
```

---

## Related Patterns

- **[CONDITIONAL_UI_PATTERN.md](CONDITIONAL_UI_PATTERN.md)**: Social History uses field-level editing with conditional fields (e.g., Smoking edit screen shows quantity only if "Smoker" selected)
- **[DUAL_MODE_DATE_INPUT_COMPONENT.md](DUAL_MODE_DATE_INPUT_COMPONENT.md)**: Date of Birth edit screen uses this component
- **Verification Flows**: Email/Phone edit screens trigger verification flows (separate pattern TBD)

---

## Implementation Guidelines

### React Native Example (Mobile)

```typescript
// Main View Component
function PersonalInformationView({ patient }: { patient: Patient }) {
  const navigation = useNavigation();

  return (
    <ScrollView>
      <FieldRow
        label="First Name"
        value={patient.firstName}
        onEdit={() => navigation.navigate('EditName', { patient })}
      />

      <FieldRow
        label="Gender"
        value={patient.gender}
        onEdit={() => navigation.navigate('EditGender', { patient })}
      />

      {/* ... more fields ... */}
    </ScrollView>
  );
}

// Field Row Component
function FieldRow({ label, value, onEdit, indicator }: FieldRowProps) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.fieldInfo}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {indicator && <IndicatorDot />}
      </View>
      <Button title="Edit" onPress={onEdit} style={styles.editButton} />
    </View>
  );
}

// Edit Screen Component
function EditGenderScreen({ route, navigation }: EditGenderScreenProps) {
  const { patient } = route.params;
  const [gender, setGender] = useState(patient.gender);

  const handleSave = async () => {
    await updatePatient(patient.id, { gender });
    navigation.goBack(); // Return to main view
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gender"
        leftButton={<BackButton onPress={() => navigation.goBack()} />}
        rightButton={<SaveButton onPress={handleSave} />}
      />

      <View style={styles.content}>
        <Text style={styles.label}>Gender (Required)</Text>
        <Dropdown
          value={gender}
          options={GENDER_OPTIONS}
          onChange={setGender}
        />
      </View>
    </View>
  );
}
```

---

## Testing Checklist

**Functional Tests**:
- [ ] Tap [Edit] navigates to edit screen
- [ ] Edit screen loads current value
- [ ] [Save] button updates value and navigates back
- [ ] Back arrow discards changes (or shows confirmation dialog)
- [ ] Validation errors prevent save
- [ ] Validation errors show on edit screen
- [ ] Main view displays updated value after save

**Navigation Tests**:
- [ ] Edit → Back → Main view (no changes)
- [ ] Edit → Save → Main view (with changes)
- [ ] Edit → Edit another field → Both updates persist
- [ ] Deep link to edit screen works

**Data Persistence**:
- [ ] Single field update (PATCH request)
- [ ] Concurrent edits handled (optimistic locking)
- [ ] Audit trail created (if enabled)
- [ ] Change timestamp updated

**Accessibility Tests**:
- [ ] Screen reader announces field labels
- [ ] Keyboard navigation works
- [ ] Focus management (edit screen → first field)

---

## Status

✅ **Pattern Documented**: Field-level editing pattern is formalized and ready for implementation
📍 **Usage Locations**: Personal Information (15 screens), Social History (8 screens)
🎯 **Next Steps**: Implement reusable FieldRow + EditScreen components, add to component library
