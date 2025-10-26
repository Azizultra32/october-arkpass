# Immunizations Management

## Purpose

Enable patients to track vaccination history including multiple doses per vaccine. Support tracking vaccine products, administration dates and locations, and documentation for immunization records. NO Quick Add pattern due to dose-level detail requirements.

## Requirements

### Requirement: Immunization Record Creation

The system SHALL allow creating immunization records with vaccine details and multiple dose tracking.

#### Scenario: Add new immunization
- **WHEN** user taps "+ Add" button
- **THEN** open Add Immunization form with all fields
- **AND** require Name field before saving
- **AND** allow optional fields: Description/Purpose, Dose details (When, Date Administered, Location)

#### Scenario: No Quick Add pattern
- **WHEN** viewing immunizations list
- **THEN** show "+ Add" button only (no inline Quick Add input)
- **AND** require full form entry for all immunizations
- **REASON** Dose information (date, location) is critical for immunization records

### Requirement: Immunization Data Fields

The system SHALL capture vaccine-level and dose-level information separately.

#### Scenario: Required vaccine name field
- **WHEN** user attempts to save immunization
- **THEN** validate Name field is not empty
- **AND** show error "Name (Incomplete)" with red border if empty
- **AND** prevent save until Name is filled

#### Scenario: Optional description/purpose field
- **WHEN** user enters description/purpose
- **THEN** accept multi-line text input (e.g., "Covid-19", "Influenza prevention")
- **AND** display as secondary text in list cards (below vaccine name)
- **AND** allow save with empty description

#### Scenario: Dual-mode "When" field for dose timing
- **WHEN** user enters when dose was received
- **THEN** provide dual-mode date input (Date OR Age mode)
- **AND** support Date mode with calendar picker
- **AND** support Age mode with numeric input
- **AND** validate date not in future
- **AND** validate date not before patient birth date

#### Scenario: Date administered field
- **WHEN** user enters administration date
- **THEN** provide calendar date picker
- **AND** accept exact date of vaccination
- **AND** validate date not in future
- **NOTE** Separate from "When" field - "When" is user's recollection (may be age-based), "Date Administered" is official record date

#### Scenario: Location administered selection
- **WHEN** user selects body location for injection
- **THEN** provide dropdown options:
  - Arm
  - Deltoid (shoulder muscle)
  - Gluteal (buttocks)
  - Thigh
  - Other
- **AND** allow save with empty location

### Requirement: Multiple Doses Pattern

The system SHALL support multiple doses/boosters for each vaccine via repeatable entry pattern.

#### Scenario: Add first dose
- **WHEN** creating new immunization
- **THEN** show first dose fields: When, Date Administered, Location Administered
- **AND** show "+ Add more" link below dose fields
- **AND** allow saving with single dose

#### Scenario: Add subsequent doses
- **WHEN** user taps "+ Add more" in immunization form
- **THEN** create new dose entry section
- **AND** repeat dose fields: When, Date Administered, Location Administered
- **AND** auto-increment dose number (2nd dose, 3rd dose, etc.)
- **AND** maintain "+ Add more" link for additional doses

#### Scenario: Display multiple doses in view mode
- **WHEN** viewing immunization with multiple doses
- **THEN** show vaccine name and description once
- **AND** list all doses chronologically
- **AND** display for each dose: Dose number, Date Administered, Location
- **EXAMPLE**:
  - Moderna Spikevax (Covid-19)
  - Dose 1: Mar 30, 2021, Arm
  - Dose 2: Apr 27, 2021, Arm
  - Booster: Nov 15, 2021, Deltoid

#### Scenario: Auto-increment dose numbers
- **WHEN** new dose is created
- **THEN** compute dose_number = existing_doses.count + 1
- **AND** store dose_number in database
- **AND** display as "Dose 1", "Dose 2", "Booster", etc.

### Requirement: Progressive Disclosure

The system SHALL hide dose details by default and reveal via "Show more" interaction.

#### Scenario: Collapsed view shows vaccine basics
- **WHEN** viewing immunization in collapsed state
- **THEN** display: Name, Description/Purpose
- **AND** hide: Dose details (When, Date Administered, Location, Documents)
- **AND** show "Show more" link

#### Scenario: Expanded view shows all doses
- **WHEN** user taps "Show more" link
- **THEN** reveal: All dose details, Documents section
- **AND** replace "Show more" with "Show less" link
- **AND** maintain expanded state during editing session

### Requirement: Associated Documents

The system SHALL allow attaching documents to immunization records.

#### Scenario: Add document attachment
- **WHEN** user taps "+ Add Documents" in immunization form
- **THEN** open document selection interface
- **AND** allow selection from existing documents
- **AND** allow photo capture for vaccine cards/certificates
- **AND** create association between immunization and selected documents

#### Scenario: Display document associations
- **WHEN** viewing immunization record
- **THEN** show DOCUMENTS section
- **AND** display document names
- **AND** allow deletion of association via delete icon in edit mode

#### Scenario: Empty documents state
- **WHEN** no documents are associated
- **THEN** show empty state
- **AND** show "+ Add Documents" button

### Requirement: Immunizations List View

The system SHALL display all immunizations as two-line cards with vaccine name and purpose.

#### Scenario: Display immunization cards
- **WHEN** viewing immunizations list
- **THEN** show each immunization as two-line card:
  - Line 1: Vaccine name (bold, 20px) - e.g., "Moderna Spikevax"
  - Line 2: Purpose/description (regular, 16px) - e.g., "Covid-19"
- **AND** sort by most recent first OR alphabetically (configurable)
- **NOTE** Two-line format differs from other features (medications, supplements use single line)

#### Scenario: No dose count visible in list
- **WHEN** viewing immunizations list
- **THEN** show single card per vaccine (regardless of dose count)
- **AND** do NOT display dose count badge in list view
- **AND** reveal dose details only when viewing individual record

#### Scenario: Tap immunization card
- **WHEN** user taps immunization card
- **THEN** open View Immunization screen
- **AND** show all fields (collapsed by default)
- **AND** show Edit button in header

### Requirement: Immunization Editing

The system SHALL allow editing vaccine details and all dose information.

#### Scenario: Edit existing immunization
- **WHEN** user taps "Edit" in View screen
- **THEN** convert all fields to editable inputs
- **AND** preserve current values for vaccine and all doses
- **AND** show "Save" and "Cancel" buttons in header
- **AND** validate Name field on save

#### Scenario: Edit individual dose
- **WHEN** editing immunization with multiple doses
- **THEN** show all dose entries as editable sections
- **AND** allow editing each dose independently
- **AND** maintain dose number sequence

#### Scenario: Delete individual dose
- **WHEN** user taps delete icon on dose entry (in edit mode)
- **THEN** remove that dose from immunization
- **AND** recompute dose numbers for remaining doses
- **AND** require at least one dose to remain

#### Scenario: Save immunization changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields (Name)
- **AND** update immunization record with changed values
- **AND** update all dose records
- **AND** update `updated_at` timestamp
- **AND** return to View screen

### Requirement: Immunization Deletion

The system SHALL allow permanent deletion of immunization records with all doses.

#### Scenario: Delete immunization
- **WHEN** user taps "Delete Immunization" button in Edit screen
- **THEN** show confirmation dialog "Delete this immunization and all doses?"
- **AND** if confirmed, soft delete immunization record
- **AND** cascade soft delete to all dose records
- **AND** delete all document associations
- **AND** return to list view

#### Scenario: Soft delete for audit trail
- **WHEN** immunization is deleted
- **THEN** mark immunization as `deleted_at = NOW()`
- **AND** mark all associated doses as `deleted_at = NOW()`
- **AND** hide from patient view
- **AND** retain in database for audit/compliance

### Requirement: Share Health Record Integration

The system SHALL include immunizations in health record sharing feature.

#### Scenario: Export immunizations in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all immunizations with doses in export
- **AND** format as FHIR Immunization resources
- **AND** include vaccine name, description, all dose dates and locations
- **AND** map ArkPass fields to FHIR appropriately

## Data Model

### Database Schema

```sql
-- Immunizations table (vaccine-level)
CREATE TABLE immunizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core fields
  name TEXT NOT NULL, -- Vaccine product name (e.g., "Moderna Spikevax")
  description_purpose TEXT, -- What disease it protects against (e.g., "Covid-19")

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Immunization doses table (dose-level)
CREATE TABLE immunization_doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immunization_id UUID REFERENCES immunizations(id) ON DELETE CASCADE NOT NULL,

  -- Dual-mode "When" field (user's recollection)
  when_raw JSONB, -- Full DualModeDate structure
  when_computed_date TIMESTAMP GENERATED ALWAYS AS (
    CASE
      WHEN (when_raw->>'inputMode') = 'date' THEN
        (when_raw->'dateSelection'->>'selectedDate')::timestamp
      WHEN (when_raw->>'inputMode') = 'age' THEN
        make_date(
          EXTRACT(YEAR FROM (SELECT date_of_birth FROM user_profiles WHERE user_id = immunizations.patient_id))::int +
          (when_raw->>'ageValue')::int,
          EXTRACT(MONTH FROM (SELECT date_of_birth FROM user_profiles WHERE user_id = immunizations.patient_id))::int,
          EXTRACT(DAY FROM (SELECT date_of_birth FROM user_profiles WHERE user_id = immunizations.patient_id))::int
        )::timestamp
      ELSE NULL
    END
  ) STORED,

  -- Official administration details
  date_administered TIMESTAMP, -- Exact date from vaccine record
  location_administered TEXT, -- Body location (dropdown value)

  -- Dose metadata
  dose_number INTEGER NOT NULL, -- Auto-incremented (1, 2, 3, etc.)
  dose_type TEXT, -- 'initial', 'booster', etc. (optional)

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- Constraints
  CHECK (dose_number > 0)
);

-- Immunization documents association table
CREATE TABLE immunization_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  immunization_id UUID REFERENCES immunizations(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(immunization_id, document_id)
);

-- Indexes
CREATE INDEX idx_immunizations_patient ON immunizations(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_immunization_doses_immunization ON immunization_doses(immunization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_immunization_doses_date ON immunization_doses(date_administered) WHERE deleted_at IS NULL;
CREATE INDEX idx_immunization_documents_immunization ON immunization_documents(immunization_id);
CREATE INDEX idx_immunization_documents_document ON immunization_documents(document_id);
```

### TypeScript Interfaces

```typescript
interface Immunization {
  id: string;
  patientId: string;

  // Required fields
  name: string; // Vaccine product name

  // Optional fields
  descriptionPurpose?: string; // Disease protection purpose

  // Related data
  doses: ImmunizationDose[]; // Array of doses
  documents?: Document[]; // Associated documents

  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ImmunizationDose {
  id: string;
  immunizationId: string;

  // Dual-mode date (user's recollection)
  when?: DualModeDate;
  whenComputedDate?: Date; // Computed from DualModeDate

  // Official administration details
  dateAdministered?: Date; // Exact date from vaccine record
  locationAdministered?: ImmunizationLocation; // Body location

  // Dose metadata
  doseNumber: number; // 1, 2, 3, etc.
  doseType?: 'initial' | 'booster' | string; // Optional dose classification

  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Dual-mode date structure (shared pattern)
interface DualModeDate {
  inputMode: 'date' | 'age';

  // For date mode
  dateSelection?: {
    year?: number;
    month?: number;
    day?: number;
    precision?: 'year' | 'month' | 'day';
    selectedDate?: Date;
  };

  // For age mode
  ageValue?: number; // e.g., 25

  // Computed date (stored separately)
  computedDate?: Date;
}

// Location dropdown options
type ImmunizationLocation =
  | 'arm'
  | 'deltoid'
  | 'gluteal'
  | 'thigh'
  | 'other';

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}
```

## UI Patterns

### Two-Line List Cards (UNIQUE)
- **Line 1**: Vaccine name (bold, 20px) - e.g., "Moderna Spikevax"
- **Line 2**: Purpose/description (regular, 16px) - e.g., "Covid-19"
- **Differs from**: Medications/Supplements use single-line or name + dosage format

### Repeatable Entry Pattern (Multiple Doses)
- "+ Add more" link creates new dose entry
- Fields repeat within same form: When, Date Administered, Location
- All doses associated with single immunization record
- Similar to: Recreational Drugs pattern in Social History

### Dual-Mode Date Input
- Same component as Surgeries, Conditions
- 107px mode selector + flexible date/age input
- System-wide pattern for user-recalled dates

### Progressive Disclosure
- Collapsed: Name, Description/Purpose (vaccine-level only)
- Expanded: All dose details, Documents section
- Consistent with other PHR features

## FHIR Mapping

ArkPass is PRIMARY. FHIR export is SECONDARY for interoperability.

### Export to FHIR (Share Health Record)

```typescript
// Map Immunization to FHIR Immunization resource
function toFHIRImmunization(immunization: Immunization): FHIRImmunization {
  return {
    resourceType: 'Immunization',
    id: immunization.id,
    status: 'completed',
    vaccineCode: {
      text: immunization.name // Vaccine product name
    },
    patient: {
      reference: `Patient/${immunization.patientId}`
    },
    occurrence: immunization.doses[0]?.dateAdministered ||
                immunization.doses[0]?.whenComputedDate,
    protocolApplied: immunization.doses.map((dose, idx) => ({
      doseNumber: dose.doseNumber,
      seriesDoses: immunization.doses.length
    })),
    note: immunization.descriptionPurpose ? [{
      text: immunization.descriptionPurpose
    }] : undefined,
    site: immunization.doses[0]?.locationAdministered ? {
      text: immunization.doses[0].locationAdministered
    } : undefined
  };
}
```

**Key Mappings**:
- `Immunization.name` → `vaccineCode.text`
- `Immunization.descriptionPurpose` → `note[0].text`
- `ImmunizationDose.dateAdministered` → `occurrence`
- `ImmunizationDose.locationAdministered` → `site.text`
- `ImmunizationDose.doseNumber` → `protocolApplied[].doseNumber`

**Import Limitation**:
- ArkPass does NOT import from FHIR immunization data
- Export-only for sharing with providers/EHRs

## Figma References

**Source**: Figma file `october-arkpass`

| Screen | Node ID | Purpose |
|--------|---------|---------|
| Immunizations List | 1483:8458 | Main list with two-line cards |
| View (Collapsed) | 1483:8459 | Name + Description only |
| View (Expanded) | 1483:8460 | All dose details visible |
| Edit (Collapsed) | 1483:8461 | Edit name + description |
| Edit (Expanded) | 1483:8462 | Edit all fields + "Add more" doses |
| Add (Collapsed) | 1483:8463 | New immunization, basic fields |
| Add (Expanded) | 1483:8464 | New immunization, all fields |

**Critical Screen**: Edit Expanded (1483:8462)
- Shows "+ Add more" link for multiple doses
- Confirms dual-mode date pattern for "When" field
- Demonstrates repeatable entry pattern

## Dependencies

### Required Components
- ✅ Dual-Mode Date Input component (shared with Surgeries, Conditions)
- ✅ Document Association interface (shared with all PHR features)
- ✅ Progressive Disclosure pattern (Show more/Show less)

### Database Dependencies
- `user_profiles` table (patient_id foreign key)
- `documents` table (document associations)
- `user_profiles.date_of_birth` (for age mode date computation)

### Feature Dependencies
- Documents feature (for vaccine cards/certificates)
- Share Health Record feature (for FHIR export)

## Compliance

### HIPAA
- All immunization and dose data is PHI
- Soft delete preserves audit trail (deleted_at timestamp)
- Document associations maintain chain of evidence

### FHIR Compatibility
- Export as FHIR Immunization resources
- Includes vaccine code, dates, dose sequence
- Compatible with EHR immunization modules

### Clinical Standards
- Location terminology aligns with body site codes
- Dose numbering supports CDC immunization schedules
- Date tracking supports vaccination verification

## Open Questions

1. **Vaccine Name Standardization**: Should vaccine names use CVX codes or remain free-text?
   - Current: Free-text entry (e.g., "Moderna Spikevax")
   - Alternative: Autocomplete from CVX vaccine code database
   - Recommendation: Start with free-text, add autocomplete later

2. **Location Dropdown Complete List**: Verify all body location options
   - Confirmed: Arm, Deltoid, Gluteal, Thigh, Other
   - May need: Left/Right distinction for bilateral sites

3. **Dose Type Classification**: How to distinguish initial doses from boosters?
   - Option A: Auto-infer from dose number and date gaps
   - Option B: User manually selects dose type
   - Option C: Leave as auto-incremented numbers only

4. **When vs Date Administered Precedence**: Which date is authoritative?
   - Recommendation: Date Administered (official record) takes precedence
   - "When" provides user context (age-based recollection)
