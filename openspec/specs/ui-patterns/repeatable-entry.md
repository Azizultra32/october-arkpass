# Repeatable Entry Pattern

## Purpose

Provide a UI pattern for entering multiple related sub-items within a single parent record. Instead of creating separate records, users can add multiple entries (doses, occurrences, episodes) that belong to the same parent entity.

## Requirements

### Requirement: Parent-Child Structure

The system SHALL maintain a parent record with one or more child entry records.

#### Scenario: Parent field display
- **WHEN** user creates or views record with repeatable entries
- **THEN** display parent fields at top of form (e.g., Name, Description)
- **AND** show visual separator before child entries section
- **AND** require parent fields before allowing child entries

### Requirement: First Child Entry

The system SHALL require at least one child entry and prevent its removal.

#### Scenario: Initial child entry display
- **WHEN** user expands form or taps Show more
- **THEN** display first child entry fields (required set)
- **AND** hide "Remove" action on first entry
- **AND** show "+ Add more" link below first entry
- **AND** allow saving with one complete child entry

#### Scenario: First entry validation
- **WHEN** user attempts to save parent record
- **THEN** validate at least one child entry exists
- **AND** show error "At least one [entry type] must be entered" if none
- **AND** prevent save until minimum one entry provided

### Requirement: Adding Additional Entries

The system SHALL allow users to add unlimited additional child entries.

#### Scenario: Add more interaction
- **WHEN** user taps "+ Add more" link
- **THEN** insert new blank child entry fields below last entry
- **AND** show visual separator above new entry
- **AND** display all child fields (same as first entry)
- **AND** show "✕ Remove this [entry]" link on new entry
- **AND** move "+ Add more" link to bottom of new entry
- **AND** auto-focus first field of new entry
- **AND** animate entry appearance (slide-in, 150ms)

### Requirement: Removing Entries

The system SHALL allow removal of non-first entries with confirmation.

#### Scenario: Remove entry with data
- **WHEN** user taps "✕ Remove this [entry]" on entry with data
- **THEN** show confirmation dialog
- **AND** title: "Remove this [entry]?"
- **AND** list data being deleted in message
- **AND** message: "This cannot be undone"
- **AND** provide Cancel and Remove options

#### Scenario: Remove entry confirmed
- **WHEN** user confirms removal in dialog
- **THEN** delete child entry immediately
- **AND** re-number remaining entries sequentially
- **AND** animate entry removal (slide-out, 150ms)
- **AND** scroll to previous entry

#### Scenario: Remove empty entry
- **WHEN** user taps "✕ Remove this [entry]" on empty entry
- **THEN** remove immediately without confirmation
- **AND** re-number remaining entries
- **AND** animate removal

### Requirement: Entry Numbering

The system SHALL auto-number entries sequentially based on chronological order.

#### Scenario: Auto-numbering on save
- **WHEN** user saves parent record with multiple entries
- **THEN** sort entries by date field (if present, ascending)
- **AND** assign sequential numbers starting at 1
- **AND** place entries without dates at end
- **AND** store entry_number in database

#### Scenario: Re-numbering after deletion
- **WHEN** entry is deleted from middle of sequence
- **THEN** re-number remaining entries to close gap
- **AND** maintain chronological order
- **AND** update entry_number in database

### Requirement: Display in Views

The system SHALL show appropriate summaries in different view contexts.

#### Scenario: List view display
- **WHEN** user views list of parent records
- **THEN** show parent name as main text
- **AND** show entry count badge (e.g., "• 3 doses")
- **OR** show last entry date (e.g., "Last dose: Nov 15, 2021")
- **AND** hide child entry details

#### Scenario: Detail view collapsed
- **WHEN** user views parent record in collapsed state
- **THEN** show parent fields fully
- **AND** show first entry summary only
- **AND** hide subsequent entries
- **AND** show "Show more" to expand

#### Scenario: Detail view expanded
- **WHEN** user expands record with Show more
- **THEN** display all entries with labels (Dose 1, Dose 2, Booster)
- **AND** show all fields per entry
- **AND** separate entries with visual dividers
- **AND** show "Show less" to collapse

## Implementation Details

### Data Model

**TypeScript Interfaces:**
```typescript
interface ParentRecord {
  id: string;
  patientId: string;

  // Parent fields (single values)
  name: string;                    // Required
  description?: string;            // Optional

  // Child entries (array, minimum 1)
  entries: ChildEntry[];

  // Other parent fields
  documents?: Document[];

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

interface ChildEntry {
  id: string;
  parentId: string;          // Foreign key to parent

  // Entry fields
  when?: DualModeDate;
  dateField?: Date;
  locationField?: string;

  // Metadata
  entryNumber: number;       // Auto-incremented: 1, 2, 3...
  entryType?: 'initial' | 'booster' | 'follow-up' | 'other';

  createdAt: Date;
  updatedAt: Date;
}
```

### Database Schema

```sql
-- Parent table
CREATE TABLE parent_records (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  -- Parent fields
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Child table
CREATE TABLE child_entries (
  id UUID PRIMARY KEY,
  parent_id UUID REFERENCES parent_records(id) ON DELETE CASCADE,

  -- Entry fields
  when_raw JSONB,                  -- Dual-mode date input
  date_field TIMESTAMP,
  location_field VARCHAR(100),

  -- Metadata
  entry_number INTEGER NOT NULL,   -- 1, 2, 3...
  entry_type VARCHAR(50),          -- 'initial', 'booster', etc.

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure entry_number is unique per parent
CREATE UNIQUE INDEX idx_child_entries_number
  ON child_entries(parent_id, entry_number);

-- Index for chronological queries
CREATE INDEX idx_child_entries_date
  ON child_entries(date_field);
```

### Component Structure

**RepeatableEntryContainer:**
```typescript
interface RepeatableEntryContainerProps {
  parentFields: FieldConfig[];      // Parent field definitions
  childFields: FieldConfig[];       // Child field definitions
  entries: ChildEntry[];            // Current entries array
  onAddEntry: () => void;
  onRemoveEntry: (id: string) => void;
  addMoreLabel?: string;            // Default: "+ Add more"
  removeLabel?: string;             // Default: "✕ Remove this entry"
  minEntries?: number;              // Default: 1
  maxEntries?: number;              // Optional limit
}
```

**ChildEntryGroup:**
```typescript
interface ChildEntryGroupProps {
  entry: ChildEntry;
  entryNumber: number;
  fields: FieldConfig[];
  onRemove?: () => void;            // Undefined for first entry
  showSeparator: boolean;           // Visual separator above
}
```

### Visual Specifications

**Entry Layout:**
```
┌─────────────────────────────────────────┐
│  Parent Field 1                         │
│  [Value_____________________________]   │
│                                         │
│  Parent Field 2                         │
│  [Value_____________________________]   │
│                                         │
│  ────────────────────────────────       │  ← Visual separator
│                                         │
│  Child Field 1                          │  ← Entry 1 (no remove)
│  [Value_____________________________]   │
│                                         │
│  Child Field 2                          │
│  [Value_____________________________]   │
│                                         │
│  + Add more                             │
│                                         │
│  ────────────────────────────────       │  ← Visual separator
│                                         │
│  Child Field 1                          │  ← Entry 2 (with remove)
│  [Value_____________________________]   │
│                                         │
│  Child Field 2                          │
│  [Value_____________________________]   │
│                                         │
│  ✕ Remove this dose                     │
│                                         │
│  + Add more                             │  ← Moves to bottom
│                                         │
└─────────────────────────────────────────┘
```

**Visual Elements:**
- Separator: Horizontal line or subtle background change
- Add more link: Blue text, "+" icon prefix
- Remove link: Red text, "✕" icon prefix
- Entry background: Optional subtle shade for grouping

### Auto-Numbering Logic

```typescript
function assignEntryNumbers(entries: ChildEntry[]): ChildEntry[] {
  // Sort by date field (if available)
  const sortedEntries = entries
    .filter(e => e.dateField)                           // Entries with dates first
    .sort((a, b) => a.dateField.getTime() - b.dateField.getTime())
    .concat(entries.filter(e => !e.dateField));        // Entries without dates last

  // Assign sequential numbers
  return sortedEntries.map((entry, index) => ({
    ...entry,
    entryNumber: index + 1
  }));
}
```

## Where Used

- **Immunizations**: Multiple doses per vaccine (1st dose, 2nd dose, booster)
- **Conditions**: Recurrent episodes (future expansion)
- **Medications**: Dose changes over time (future expansion)
- **Allergies**: Multiple reactions (future expansion)

## Dependencies

- Confirmation dialog component
- Animation library (slide-in/slide-out transitions)
- Form validation framework
- Dual-mode date input (if date fields present)

## Compliance

### Accessibility
- Screen reader: "Dose 1 section, 3 fields", "Add more doses button"
- Keyboard: Tab through entry fields → Tab to Add more → Tab to Remove (if present)
- Focus management: Auto-focus first field of new entry
- Voice control: "Tap add more", "Remove dose 2"

### Validation
- Minimum one entry required (validate parent save)
- Entry fields optional unless specified (partial entries allowed)
- Chronological order warning (not error)
- Confirmation required for removing entry with data

### Performance
- Limit: Warn if 10+ entries (UI performance consideration)
- Efficient DOM updates: Virtualization for large entry lists
- Smooth animations: 150ms slide transitions
- Database: ON DELETE CASCADE for child records
