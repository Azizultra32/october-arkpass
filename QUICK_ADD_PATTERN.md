# Quick Add Pattern - Rapid Single-Field Entry

**Status**: ✅ CONFIRMED SYSTEM-WIDE PATTERN
**Discovered in**: Medications, Allergies, Supplements
**Purpose**: Rapid name-only entry for quick data capture
**Not present in**: Conditions, Surgeries, Immunizations

---

## Overview

The Quick Add Pattern provides an inline text input in the list view that allows users to rapidly create new records with just a name. Full details can be added later by editing the record.

### Key Characteristics

**Inline in list view**: No navigation away from list
**Single field only**: Just name/title entry
**Minimal friction**: 2 taps (tap input, type, submit)
**Creates minimal record**: Saves with name only, other fields empty
**Expandable later**: User can tap to edit and add full details

---

## Visual Specification

### Location: Top of List View

```
┌─────────────────────────────────────────────────┐
│  Medications                          [+]       │  ← Header with standard Add button
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐ │
│  │  Enter medication name...            [→]  │ │  ← Quick Add input (always visible)
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐   │
│  │  Metformin                             │   │  ← Existing records below
│  │  500mg, 2 times a day                  │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │  Lisinopril                            │   │
│  │  10mg, 1 time a day                    │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

### Component Structure

**Quick Add Input**:
- **Type**: Text input field
- **Height**: 58px (standard input height)
- **Width**: Full width minus margins (16px each side)
- **Placeholder**: "[Type] name..." (e.g., "Enter medication name...", "Enter allergy name...")
- **Submit button**: Arrow icon (→) or "Add" text on right
- **Background**: Subtle white or light gray to distinguish from records
- **Border**: 1px solid border or shadow to indicate interactivity

---

### States

**1. Empty/Default State**:
```
┌───────────────────────────────────────────┐
│  Enter medication name...            [→]  │  ← Placeholder text visible
└───────────────────────────────────────────┘
```

**2. Focused State (typing)**:
```
┌───────────────────────────────────────────┐
│  Metfor|                             [→]  │  ← Text being entered, cursor visible
└───────────────────────────────────────────┘
```

**3. Filled State (ready to submit)**:
```
┌───────────────────────────────────────────┐
│  Metformin                           [→]  │  ← Text entered, submit button active
└───────────────────────────────────────────┘
```

**4. Submitting State (loading)**:
```
┌───────────────────────────────────────────┐
│  Metformin                          (⟳)   │  ← Spinner, submit disabled
└───────────────────────────────────────────┘
```

**5. Success State (briefly shown, then cleared)**:
```
┌───────────────────────────────────────────┐
│  Added!                              [✓]  │  ← Success message, 1 second, then clear
└───────────────────────────────────────────┘
```

**6. Error State**:
```
┌───────────────────────────────────────────┐
│  Metformin                           [→]  │
│  ⚠ This medication already exists         │  ← Error message below input
└───────────────────────────────────────────┘
```

---

## User Flow

### Happy Path: Add New Item

**Step 1**: User taps Quick Add input field
- Input gains focus
- Keyboard appears
- Placeholder text disappears

**Step 2**: User types name
- Text appears in input field
- Submit button becomes active/enabled

**Step 3**: User taps submit button (→) OR presses Enter
- Input shows loading spinner
- Keyboard remains visible (for rapid multiple entries)

**Step 4**: Record created successfully
- New card appears at top of list (or sorted position)
- Input shows "Added!" briefly (1 second)
- Input clears and refocuses
- User can immediately add another

---

### Error Path: Duplicate Name

**Step 1**: User types existing name "Metformin"

**Step 2**: User submits

**Step 3**: System detects duplicate

**Step 4**: Error message shown below input
- "This medication already exists"
- Input field highlighted in red
- User can edit name or cancel

---

### Alternative: Use Standard Add Button

**Quick Add is optional**. Users can always use the standard [+] button in header to open full Add form.

**Why both?**:
- **Quick Add**: For users who know name only, want to add quickly
- **Standard Add**: For users who want to enter full details immediately

---

## Behavioral Details

### Auto-Focus on Tap
- Tapping anywhere in Quick Add input field focuses it
- Keyboard appears immediately
- No second tap needed

---

### Submit Methods
1. **Tap arrow button**: Works on mobile/desktop
2. **Press Enter/Return key**: Works on desktop, external keyboards
3. **Swipe gesture**: (Optional) Swipe right on input to quick-add

---

### Post-Submit Behavior
**Option A: Clear and refocus (current implementation)**
- Input clears
- Input remains focused
- Keyboard stays open
- User can add another immediately

**Option B: Clear and blur (alternative)**
- Input clears
- Input loses focus
- Keyboard dismisses
- User must tap again to add another

**Recommendation**: Use Option A for rapid bulk entry

---

### Record Placement
**Option A: Top of list (most recent first)**
- New record appears at top
- Smooth animation sliding in

**Option B: Alphabetical sort**
- New record inserted in alphabetical position
- Smooth animation, scroll to new position

**Recommendation**: Depends on list sort order (date created vs alphabetical)

---

### Edit After Quick Add
**Scenario**: User quick-adds "Metformin", then wants to add dosage

**Step 1**: New card appears in list showing "Metformin"

**Step 2**: User taps card

**Step 3**: View screen opens, showing:
- Name: Metformin
- Dosage: N/a
- Frequency: N/a
- All other fields empty

**Step 4**: User taps "Edit" button

**Step 5**: Edit form opens with Name pre-filled, other fields empty

**Step 6**: User fills remaining fields and saves

---

## Data Model

### Minimal Record Created

```typescript
interface QuickAddResult {
  id: string;              // Generated UUID
  patientId: string;       // Current patient
  name: string;            // User-entered name (REQUIRED, ONLY FILLED FIELD)

  // All other fields are null/undefined/default
  dosage?: string;         // null (for medications)
  frequency?: string;      // null
  route?: string;          // null
  status?: string;         // null or 'active' (default)
  prescribedStartDay?: any; // null
  details?: string;        // null
  documents?: any[];       // empty array

  // Audit fields
  createdAt: Date;         // NOW()
  updatedAt: Date;         // NOW()
  createdVia: 'quick_add'; // Track creation method
}
```

---

### Database Insert

```sql
-- Example: Quick Add medication
INSERT INTO medications (
  id,
  patient_id,
  name,
  created_at,
  updated_at,
  created_via
) VALUES (
  gen_random_uuid(),
  $1, -- patient_id
  $2, -- name from input
  NOW(),
  NOW(),
  'quick_add'
);
```

---

## Validation Rules

### Name Validation

**1. Required (non-empty)**
```
Error: "Name is required"
```

**2. Minimum length (optional)**
```
Error: "Name must be at least 2 characters"
```

**3. Maximum length**
```
Error: "Name cannot exceed 255 characters"
```

**4. Duplicate detection (optional)**
```
Warning: "This medication already exists. Add anyway?"
OR
Error: "This medication already exists"
```

**5. Whitespace trimming**
```
Input: "  Metformin  "
Stored: "Metformin"
```

---

### Validation Timing

**Option A: On submit only**
- User types freely
- Validation runs when submit button tapped
- Errors shown after submit attempt

**Option B: Real-time validation**
- Validation runs as user types
- Errors shown immediately (e.g., duplicate detection)
- Submit button disabled until valid

**Recommendation**: Use Option A (on submit) for better UX

---

## Accessibility

### Screen Reader Support

**Focused state**:
```
"Quick add medication input field. Enter medication name."
```

**After typing**:
```
"Metformin. Add button."
```

**After submit success**:
```
"Added Metformin. Quick add input field."
```

**After submit error**:
```
"Error. This medication already exists."
```

---

### Keyboard Navigation

**Tab order**:
1. Standard [+] Add button
2. Quick Add input field
3. Submit arrow button
4. First record in list

**Keyboard shortcuts**:
- **Enter/Return**: Submit (while input focused)
- **Escape**: Clear input and blur
- **Tab**: Move to submit button
- **Shift+Tab**: Move to Add button

---

### Voice Control

**Commands**:
- "Tap quick add" → Focus input
- "Type Metformin" → Enter text
- "Submit" / "Add" → Tap submit button
- "Add Metformin" → Combined action (type + submit)

---

## Feature Comparison

### Where Quick Add IS Present

| Feature | Quick Add? | Placeholder Text | Rationale |
|---|---|---|---|
| **Medications** | ✅ Yes | "Enter medication name..." | Users often know drug name first, details later |
| **Allergies** | ✅ Yes | "Enter allergy name..." | Rapid capture of allergen (e.g., "Peanuts", "Penicillin") |
| **Supplements** | ✅ Yes | "Enter supplement name..." | Quick capture of vitamin/supplement name |

---

### Where Quick Add is NOT Present

| Feature | Quick Add? | Rationale |
|---|---|---|
| **Conditions** | ❌ No | Type selection required (Chronic/Transient-Recurrent/Transient-Resolved) - too complex for quick add |
| **Surgeries** | ❌ No | Date field is critical (when surgery occurred) - name alone insufficient |
| **Immunizations** | ❌ No | Multiple doses pattern - name alone insufficient, needs at least one dose entry |

---

### Decision Criteria for Quick Add

**Use Quick Add when**:
1. ✅ **Name/title is sufficient** to create meaningful record
2. ✅ **Other fields are truly optional** (not just technically, but practically)
3. ✅ **Users commonly know name first** (before other details)
4. ✅ **Rapid bulk entry is common** (e.g., listing all medications, allergies)

**Don't use Quick Add when**:
1. ❌ **Type/category selection required** before name
2. ❌ **Critical fields needed** for record to be useful (e.g., surgery date)
3. ❌ **Complex sub-structures required** (e.g., doses, episodes)
4. ❌ **Few records typically added** (not worth the UI space)

---

## Variations by Feature

### Medications Quick Add

**Placeholder**: "Enter medication name..."

**Auto-complete**: ✅ Recommended (drug names are standardized)
```
User types: "metf"
Suggestions appear:
- Metformin
- Metformin ER
- Methadone
```

**Duplicate detection**: ✅ Warn (same medication already listed)

---

### Allergies Quick Add

**Placeholder**: "Enter allergy name..."

**Auto-complete**: ✅ Recommended (common allergens)
```
User types: "pea"
Suggestions appear:
- Peanuts
- Peaches
- Peas
```

**Duplicate detection**: ✅ Warn (same allergy already listed)

**Category auto-assignment**: ✅ If "Penicillin" → Medication Allergies

---

### Supplements Quick Add

**Placeholder**: "Enter supplement name..."

**Auto-complete**: ✅ Recommended (common supplements)
```
User types: "vit"
Suggestions appear:
- Vitamin D
- Vitamin C
- Vitamin B12
```

**Duplicate detection**: ✅ Warn (same supplement already listed)

---

## Armada Logic Language (ALL) Rules

### Rule 1: Quick Add Submit

```
RULE: QuickAdd.Submit

ON @QuickAddInput.submit

WHEN @QuickAddInput.value IS NOT EMPTY
  AND @QuickAddInput.value.length >= 2

THEN:
  VALIDATE name_is_unique(@QuickAddInput.value)

  IF validation_passes:
    CREATE new_record
      SET name = @QuickAddInput.value
      SET createdVia = 'quick_add'
      SET all_other_fields = null

    INSERT new_record AT top_of_list
    ANIMATE slide_in_from_top

    SHOW success_message "Added!"
    CLEAR @QuickAddInput.value
    FOCUS @QuickAddInput
    KEEP keyboard_open

  ELSE:
    SHOW error_message below @QuickAddInput
    HIGHLIGHT @QuickAddInput with red_border
    KEEP @QuickAddInput.value
    KEEP keyboard_open
```

---

### Rule 2: Duplicate Detection Warning

```
RULE: QuickAdd.DuplicateWarning

ON @QuickAddInput.submit

WHEN name_already_exists(@QuickAddInput.value)

THEN:
  SHOW confirmation_dialog
    TITLE: "Already Exists"
    MESSAGE: "[Name] is already in your list. Add anyway?"
    ACTIONS: ["Cancel", "Add Anyway"]

  IF user_confirms:
    CREATE new_record (allow duplicate)
  ELSE:
    CLEAR @QuickAddInput.value
    FOCUS @QuickAddInput
```

---

### Rule 3: Auto-Complete Suggestion

```
RULE: QuickAdd.AutoComplete

ON @QuickAddInput.text_change

WHEN @QuickAddInput.value.length >= 2

THEN:
  FETCH suggestions = autocomplete_api(@QuickAddInput.value, limit=5)

  SHOW suggestions_dropdown below @QuickAddInput
    FOR EACH suggestion:
      RENDER suggestion_item
        ON tap: SET @QuickAddInput.value = suggestion.name
                SUBMIT @QuickAddInput

  IF no_suggestions:
    HIDE suggestions_dropdown
```

---

### Rule 4: Enter Key Submit

```
RULE: QuickAdd.EnterKeySubmit

ON @QuickAddInput.keypress

WHEN key = 'Enter' OR key = 'Return'
  AND @QuickAddInput.value IS NOT EMPTY

THEN:
  PREVENT default_behavior (newline)
  TRIGGER @QuickAddInput.submit
```

---

### Rule 5: Success Animation

```
RULE: QuickAdd.SuccessAnimation

ON @QuickAdd.create_success

THEN:
  SET @QuickAddInput.value = "Added!"
  SET @QuickAddInput.submit_icon = checkmark
  DISABLE @QuickAddInput for 1_second

  WAIT 1_second

  CLEAR @QuickAddInput.value
  SET @QuickAddInput.submit_icon = arrow
  ENABLE @QuickAddInput
  FOCUS @QuickAddInput
```

---

## Implementation Checklist

### Frontend Components

- [ ] Create `QuickAddInput` component
  - [ ] Text input field (58px height)
  - [ ] Placeholder text (configurable)
  - [ ] Submit button (arrow icon)
  - [ ] Loading spinner state
  - [ ] Success state ("Added!" + checkmark)
  - [ ] Error message display

- [ ] Implement auto-complete (optional)
  - [ ] Dropdown suggestions
  - [ ] Keyboard navigation (arrow keys)
  - [ ] Tap to select
  - [ ] API integration

- [ ] Implement submit behavior
  - [ ] Enter key handler
  - [ ] Arrow button tap handler
  - [ ] Validation before submit
  - [ ] Clear and refocus after success

- [ ] Implement animations
  - [ ] New record slide-in
  - [ ] Success message fade-in/out
  - [ ] Error shake animation

---

### Backend Logic

- [ ] Create quick add API endpoint
  - [ ] POST /api/medications/quick-add
  - [ ] Accepts: { name: string }
  - [ ] Returns: Created record with ID

- [ ] Implement duplicate detection (optional)
  - [ ] Case-insensitive name comparison
  - [ ] Returns: { isDuplicate: boolean, existingId?: string }

- [ ] Implement auto-complete API (optional)
  - [ ] GET /api/medications/autocomplete?q={query}
  - [ ] Returns: Array of suggestions

- [ ] Track creation method
  - [ ] Add `created_via` column
  - [ ] Values: 'quick_add', 'standard_form', 'import', etc.

---

### Validation & Error Handling

- [ ] Name validation
  - [ ] Required (non-empty)
  - [ ] Minimum 2 characters
  - [ ] Maximum 255 characters
  - [ ] Trim whitespace

- [ ] Duplicate detection
  - [ ] Warning dialog (optional)
  - [ ] Allow duplicate creation (with confirmation)

- [ ] Error display
  - [ ] Show below input
  - [ ] Red border on input
  - [ ] Clear on next input

---

### Accessibility

- [ ] Screen reader support
  - [ ] Input label announcement
  - [ ] Success message announcement
  - [ ] Error message announcement

- [ ] Keyboard navigation
  - [ ] Enter key submit
  - [ ] Escape key clear
  - [ ] Tab order

- [ ] Voice control
  - [ ] "Tap quick add" command
  - [ ] "Add [name]" command

---

### Testing

- [ ] Unit tests
  - [ ] Submit with valid name
  - [ ] Submit with empty name (error)
  - [ ] Submit with duplicate name (warning)
  - [ ] Enter key submits
  - [ ] Clear and refocus after success

- [ ] Integration tests
  - [ ] Creates minimal record
  - [ ] Record appears in list
  - [ ] Can edit record after creation
  - [ ] Auto-complete works (if enabled)

- [ ] Accessibility tests
  - [ ] Screen reader navigation
  - [ ] Keyboard-only usage
  - [ ] Voice control commands

---

## Open Questions

### 1. Auto-Complete Source?
**Question**: Where do auto-complete suggestions come from?

**Options**:
- **A**: Pre-defined list (drug database, common allergens)
- **B**: User's historical entries
- **C**: Both (smart suggestions)

**Recommendation**: Use Option C (both) - prioritize user's history, supplement with database

---

### 2. Allow Duplicates?
**Question**: Should users be able to add the same medication twice?

**Options**:
- **A**: Block duplicates entirely (error)
- **B**: Warn but allow (confirmation dialog)
- **C**: Allow freely (no check)

**Recommendation**: Use Option B (warn but allow) - user may have legitimate reason (different dosages, different time periods)

---

### 3. Quick Edit?
**Question**: Should we add inline editing in list view?

**Example**: Tap medication card → expand inline → edit dosage

**Recommendation**: No - keep edit in separate screen for consistency

---

### 4. Quick Delete?
**Question**: Should we add swipe-to-delete in list view?

**Recommendation**: Yes - standard mobile pattern, add confirmation dialog

---

### 5. Bulk Quick Add?
**Question**: Should we support multi-line input (paste list)?

**Example**: User pastes:
```
Metformin
Lisinopril
Atorvastatin
```

**Recommendation**: Yes - parse newlines, create multiple records

---

## Related Documentation

- [MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md) - Medications with Quick Add
- [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md) - Allergies with Quick Add
- [SUPPLEMENTS_SCREENS_SPECS.md](SUPPLEMENTS_SCREENS_SPECS.md) - Supplements with Quick Add

---

**Status**: ✅ Pattern documented across 3 features
**Recommendation**: Implement as reusable component for all applicable features
**Next**: Add to other features where appropriate (e.g., Social History habits)
