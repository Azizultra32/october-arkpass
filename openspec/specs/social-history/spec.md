# Social History Management

## Purpose

Track lifestyle factors and habits that affect health including smoking, alcohol consumption, recreational drug use, caffeine intake, living situation, and occupation. Single-record system with conditional field logic and privacy controls.

## Requirements

### Requirement: Social History Record Creation

The system SHALL create a single social history record for each patient with optional lifestyle data.

#### Scenario: Initialize social history record
- **WHEN** user accesses social history for first time
- **THEN** create social_history record for patient
- **AND** initialize all fields as null/default
- **AND** link to user account (one-to-one)

#### Scenario: Single record constraint
- **WHEN** accessing social history
- **THEN** retrieve existing record for patient
- **AND** never create duplicate records
- **AND** use field-level editing for updates

### Requirement: Smoking Status and Details

The system SHALL capture smoking status with conditional detail fields.

#### Scenario: Select smoker status
- **WHEN** user selects smoking status
- **THEN** provide radio button options:
  - Smoker
  - Quit
  - Never
- **AND** show conditional fields based on selection

#### Scenario: Smoker - show quantity and duration
- **WHEN** user selects "Smoker"
- **THEN** show quantity field: "Estimate how many cigarettes or packs per day?"
- **AND** accept free-text input (e.g., "20 cigarettes", "1 pack")
- **AND** show duration fields: Value (numeric) + Unit dropdown
- **AND** provide unit options: Years, Months
- **AND** hide quit date field

#### Scenario: Quit - show quit date and past quantity
- **WHEN** user selects "Quit"
- **THEN** show quit date field: "When did you quit?"
- **AND** provide date picker (possibly dual-mode Date OR Age)
- **AND** show past quantity field: "Approximately how many cigarettes/packs did you smoke per day?"
- **AND** accept free-text input for past quantity
- **AND** hide current quantity and duration fields

#### Scenario: Never - hide all sub-fields
- **WHEN** user selects "Never"
- **THEN** hide all smoking-related sub-fields
- **AND** save smoking_status = 'never' only

### Requirement: Alcohol Consumption and CAGE Assessment

The system SHALL track drinking frequency with optional CAGE questionnaire for screening.

#### Scenario: Select drinking frequency
- **WHEN** user selects drinking frequency
- **THEN** provide radio button options:
  - Never
  - Occasionally
  - More than once a week
- **AND** show conditional fields based on selection

#### Scenario: Never drinking - hide all fields
- **WHEN** user selects "Never"
- **THEN** hide drinks per day and alcohol type fields
- **AND** save drinking_frequency = 'never' only

#### Scenario: Occasional/regular drinking - show details
- **WHEN** user selects "Occasionally" OR "More than once a week"
- **THEN** show drinks per day dropdown
- **AND** provide options: "1-2 drinks", "3-4 drinks", "5-6 drinks", "7+ drinks"
- **AND** show alcohol type dropdown
- **AND** provide options: Beer, Wine, Spirits, Mixed drinks, Other

#### Scenario: Trigger CAGE questionnaire for heavy drinking
- **WHEN** user selects "More than once a week" AND "3-4 drinks" or more
- **THEN** show CAGE assessment questions:
  1. Cut down - "Have you ever felt you should cut down on your drinking?"
  2. Annoyed - "Have people annoyed you by criticizing your drinking?"
  3. Guilty - "Have you ever felt guilty about your drinking?"
  4. Eye-opener - "Have you ever had a drink first thing in the morning?"
- **AND** provide Yes/No options for each question
- **AND** compute CAGE score (0-4, 1 point per Yes)
- **AND** flag score ≥2 as suggesting alcohol dependence

#### Scenario: Store CAGE assessment results
- **WHEN** user completes CAGE questionnaire
- **THEN** save cage_assessment as JSONB:
  - cutDown: boolean
  - annoyed: boolean
  - guilty: boolean
  - eyeOpener: boolean
  - score: number (0-4)
  - assessmentDate: timestamp
- **AND** display score and interpretation to patient

### Requirement: Recreational Drug Use Tracking

The system SHALL track recreational drug use with multi-select types and repeatable entry pattern.

#### Scenario: Indicate drug use status
- **WHEN** user indicates recreational drug use
- **THEN** provide radio button options: Yes, No
- **AND** show conditional fields if "Yes" selected

#### Scenario: Select drug types (multi-select)
- **WHEN** user selects "Yes" to recreational drugs
- **THEN** show drug type selection as multi-select checkboxes:
  1. Cannabis
  2. Psychoactive medications (prescription drugs used recreationally)
  3. Stimulants/MDMA
  4. Opioids
  5. Hallucinogens
  6. Cocaine
  7. Other (with free-text input)
- **AND** allow selecting multiple drug types

#### Scenario: Add frequency per drug type
- **WHEN** user checks drug type(s)
- **THEN** show frequency dropdown for each selected drug
- **AND** provide options: "Not at all in past month", "Once a month", "Weekly", "Daily"
- **AND** create separate drug entry for each type + frequency combination

#### Scenario: Add more drug entries (repeatable pattern)
- **WHEN** user taps "+ Add more" link
- **THEN** create new drug entry section
- **AND** repeat drug type + frequency fields
- **AND** allow tracking different drugs with different frequencies

#### Scenario: No drug use - hide all fields
- **WHEN** user selects "No" to recreational drugs
- **THEN** hide drug type and frequency fields
- **AND** hide "+ Add more" link
- **AND** save uses_recreational_drugs = false

### Requirement: Caffeine Intake Tracking

The system SHALL track caffeine consumption with daily quantity.

#### Scenario: Indicate caffeine use
- **WHEN** user indicates caffeine use
- **THEN** provide radio button options: Yes, No
- **AND** show conditional field if "Yes" selected

#### Scenario: Enter daily caffeine quantity
- **WHEN** user selects "Yes" to caffeine
- **THEN** show quantity field: "Approximately how many cups and/or cans did you drink per day?"
- **AND** accept free-text or numeric input (e.g., "2", "3 cups")
- **AND** allow save with quantity value

#### Scenario: No caffeine use - hide quantity field
- **WHEN** user selects "No" to caffeine
- **THEN** hide daily quantity field
- **AND** save uses_caffeine = false

### Requirement: Living Situation and Occupation

The system SHALL capture living situation and occupation as free-text fields.

#### Scenario: Enter living situation
- **WHEN** user enters living situation
- **THEN** accept text input or dropdown selection
- **AND** allow values like: "Living with family", "Living alone", "Assisted living", etc.
- **AND** save as free-text

#### Scenario: Enter occupation
- **WHEN** user enters occupation
- **THEN** accept free-text input
- **AND** allow job title/description (e.g., "Self employed", "Teacher", "Retired")
- **AND** save as text field

### Requirement: Field-Level Editing

The system SHALL edit individual categories with dedicated screens.

#### Scenario: Edit smoking
- **WHEN** user taps "Edit" on Smoking field
- **THEN** open Edit Smoking screen
- **AND** show radio buttons for status
- **AND** show conditional fields based on current selection
- **AND** validate and save on "Save" tap

#### Scenario: Edit drinking
- **WHEN** user taps "Edit" on Drinking Alcohol field
- **THEN** open Edit Drinking screen
- **AND** show frequency radio buttons
- **AND** show conditional quantity/type dropdowns
- **AND** trigger CAGE if criteria met

#### Scenario: Edit recreational drugs
- **WHEN** user taps "Edit" on Recreational Drugs field
- **THEN** open Edit Recreational Drugs screen
- **AND** show Yes/No radio buttons
- **AND** show multi-select drug types if Yes
- **AND** show "+ Add more" for multiple entries

### Requirement: Optional Fields - No Validation Required

The system SHALL allow saving social history with all fields empty or partially filled.

#### Scenario: Save with empty fields
- **WHEN** user saves social history
- **THEN** allow save with any/all fields empty
- **AND** store null for unselected options
- **AND** do NOT block save for incomplete lifestyle data
- **REASON** Lifestyle data is sensitive, users may skip

#### Scenario: Update individual category
- **WHEN** user edits single category (e.g., smoking only)
- **THEN** save changes to that category only
- **AND** preserve other categories unchanged
- **AND** update updated_at timestamp

### Requirement: Share Health Record Integration

The system SHALL include social history in health record exports.

#### Scenario: Export social history in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include social history data in export
- **AND** format as FHIR Observation resources
- **AND** include smoking status, drinking frequency, drug use
- **AND** exclude sensitive details if user opts out

## Data Model

### Database Schema

```sql
CREATE TABLE social_history (
  id UUID PRIMARY KEY REFERENCES user_profiles(user_id), -- One-to-one
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Smoking
  smoking_status TEXT, -- 'smoker', 'quit', 'never'
  smoking_quantity TEXT, -- Free-form (e.g., "20 cigarettes", "1 pack")
  smoking_duration_value INTEGER,
  smoking_duration_unit TEXT, -- 'years', 'months'
  smoking_quit_date DATE, -- If status = 'quit'
  smoking_past_quantity TEXT, -- If status = 'quit'

  -- Drinking Alcohol
  drinking_frequency TEXT, -- 'never', 'occasionally', 'more_than_once_a_week'
  drinks_per_day TEXT, -- Dropdown value (e.g., "1-2 drinks")
  alcohol_type TEXT, -- Dropdown value (e.g., "Beer", "Wine")

  -- CAGE Questionnaire (stored as JSONB)
  cage_assessment JSONB, -- { cutDown: true, annoyed: false, guilty: true, eyeOpener: false, score: 2, assessmentDate: '...' }

  -- Recreational Drugs (boolean flag)
  uses_recreational_drugs BOOLEAN DEFAULT FALSE,

  -- Caffeine
  uses_caffeine BOOLEAN DEFAULT FALSE,
  caffeine_quantity_per_day TEXT, -- Free-form (e.g., "2", "3 cups")

  -- Living & Occupation
  living_situation TEXT,
  occupation TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recreational drugs table (repeatable entries with standardized types)
CREATE TABLE recreational_drugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_history_id UUID REFERENCES social_history(id) ON DELETE CASCADE NOT NULL,
  drug_type TEXT NOT NULL, -- 'cannabis', 'psychoactive_medications', 'stimulants_mdma', 'opioids', 'hallucinogens', 'cocaine', 'other'
  custom_drug_name TEXT, -- If drug_type = 'other'
  frequency TEXT NOT NULL, -- Dropdown value (e.g., "weekly", "daily")
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_social_history_patient ON social_history(patient_id);
CREATE INDEX idx_recreational_drugs_history ON recreational_drugs(social_history_id);
CREATE INDEX idx_recreational_drugs_type ON recreational_drugs(drug_type);
```

### TypeScript Interfaces

```typescript
interface SocialHistory {
  id: string; // Patient ID (one-to-one)
  patientId: string;

  // Smoking
  smokingStatus?: 'smoker' | 'quit' | 'never';
  smokingQuantity?: string; // Free-form text
  smokingDuration?: {
    value: number;
    unit: 'years' | 'months';
  };
  smokingQuitDate?: Date; // If status = 'quit'
  smokingPastQuantity?: string; // If status = 'quit'

  // Drinking Alcohol
  drinkingFrequency?: 'never' | 'occasionally' | 'more_than_once_a_week';
  drinksPerDay?: string; // Dropdown value
  alcoholType?: string; // Dropdown value

  // CAGE Questionnaire (if triggered)
  cageAssessment?: {
    cutDown: boolean;
    annoyed: boolean;
    guilty: boolean;
    eyeOpener: boolean;
    score: number; // 0-4
    assessmentDate: Date;
  };

  // Recreational Drugs
  usesRecreationalDrugs: boolean;
  recreationalDrugs?: RecreationalDrugEntry[];

  // Caffeine
  usesCaffeine: boolean;
  caffeineQuantityPerDay?: string;

  // Living & Occupation
  livingSituation?: string;
  occupation?: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

interface RecreationalDrugEntry {
  id: string;
  socialHistoryId: string;
  drugType: DrugType;
  customDrugName?: string; // If drugType = 'other'
  frequency: DrugFrequency;
  createdAt: Date;
}

type DrugType =
  | 'cannabis'
  | 'psychoactive_medications'
  | 'stimulants_mdma'
  | 'opioids'
  | 'hallucinogens'
  | 'cocaine'
  | 'other';

type DrugFrequency =
  | 'not_at_all_past_month'
  | 'once_a_month'
  | 'weekly'
  | 'daily';
```

## UI Patterns

### Conditional Field Display
- Radio button selection determines visible fields
- Progressive disclosure: Show/hide based on user selections
- Examples:
  - Smoker → Quantity + Duration
  - Quit → Quit date + Past quantity
  - Never → No sub-fields

### Binary Yes/No Triggers
- Recreational Drugs: Yes → Drug types + Frequency + "Add more"
- Caffeine: Yes → Daily quantity
- No → Hide all sub-fields

### Repeatable Entry Pattern
- Recreational Drugs uses "+ Add more" link
- Similar to Immunizations doses pattern
- Multiple drug entries with type + frequency per entry

### Free-Form Text Inputs
- Smoking quantity, caffeine quantity: Flexible input
- Living situation, occupation: Text or dropdown
- Reduces friction, allows natural language

### Field-Level Editing
- Each category has dedicated edit screen
- Main view shows summary (e.g., "Yes, on a regular basis" + "1 glass wine per day")
- Edit screens show full controls (radio buttons, dropdowns)

## FHIR Mapping

ArkPass is PRIMARY. FHIR export is SECONDARY for interoperability.

### Export to FHIR (Share Health Record)

```typescript
// Map SocialHistory to FHIR Observation resources
function toFHIRObservations(history: SocialHistory): FHIRObservation[] {
  const observations: FHIRObservation[] = [];

  // Smoking status
  if (history.smokingStatus) {
    observations.push({
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '72166-2',
          display: 'Tobacco smoking status'
        }]
      },
      valueCodeableConcept: {
        text: history.smokingStatus
      },
      note: history.smokingQuantity ? [{ text: history.smokingQuantity }] : undefined
    });
  }

  // Alcohol use
  if (history.drinkingFrequency) {
    observations.push({
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '74013-4',
          display: 'Alcohol use'
        }]
      },
      valueString: `${history.drinkingFrequency}, ${history.drinksPerDay || ''}, ${history.alcoholType || ''}`
    });
  }

  // Drug use (aggregate)
  if (history.usesRecreationalDrugs && history.recreationalDrugs) {
    observations.push({
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{
          system: 'http://loinc.org',
          code: '82810-3',
          display: 'Substance use'
        }]
      },
      component: history.recreationalDrugs.map(drug => ({
        code: { text: drug.drugType },
        valueString: drug.frequency
      }))
    });
  }

  return observations;
}
```

**Key Mappings**:
- `SocialHistory.smokingStatus` → FHIR Observation (LOINC 72166-2)
- `SocialHistory.drinkingFrequency` → FHIR Observation (LOINC 74013-4)
- `SocialHistory.recreationalDrugs` → FHIR Observation (LOINC 82810-3)
- CAGE assessment → Clinical note (not standardized FHIR mapping)

**Import Limitation**:
- ArkPass does NOT import FHIR social history data
- Export-only for provider sharing

## Figma References

**Source**: Figma file `october-arkpass`

| Screen | Node ID | Purpose |
|--------|---------|---------|
| Main View | 1483:8468 | All categories with edit buttons |
| Edit Smoking (Smoker) | 1483:8469 | Smoker state + quantity + duration |
| Edit Smoking (Quit) | 1483:8470 | Quit date + past quantity |
| Edit Drinking | 1483:8471 | Frequency + quantity + type |
| Edit Recreational Drugs | 1483:8472 | Yes/No + drug types + "Add more" |
| Edit Caffeine | 1483:8473 | Yes/No + daily quantity |
| Edit Living Situation | 1483:8474 | Text input |
| Edit Occupation | 1483:8475 | Text input |

**Critical Screens**:
- Edit Drinking (1483:8471): Shows conditional dropdowns pattern
- Edit Recreational Drugs (1483:8472): Demonstrates "Add more" repeatable entry
- Edit Smoking Quit (1483:8470): Shows quit date picker (possibly dual-mode)

## Dependencies

### Required Components
- ✅ Radio button groups (for status selections)
- ✅ Conditional field display logic
- ✅ Multi-select checkboxes (for drug types)
- ✅ Repeatable entry pattern (for multiple drugs)
- ✅ Date picker (for quit date, possibly dual-mode)

### Database Dependencies
- `user_profiles` table (patient_id foreign key)
- JSONB support for CAGE assessment storage

### Feature Dependencies
- Share Health Record feature (exports as FHIR Observations)
- Personal Information (date_of_birth if dual-mode date used for quit date)

## Compliance

### HIPAA
- All social history data is PHI
- Recreational drug use particularly sensitive
- Audit trail via updated_at timestamp

### Clinical Screening
- CAGE questionnaire is standardized clinical tool
- Score ≥2 suggests alcohol dependence
- Results should prompt clinical follow-up

### Privacy Considerations
- All fields optional (sensitive lifestyle data)
- No required validation (user control)
- Export can be filtered to exclude sensitive items

## Open Questions

1. **Smoking Duration Units**: Confirmed Years and Months
   - May also include Days (less likely)
   - Need Figma dropdown verification

2. **Drinks Per Day Options**: TBD complete list
   - Shown: "1-2 drinks"
   - Likely: "3-4 drinks", "5-6 drinks", "7+ drinks"

3. **Alcohol Type Options**: TBD complete list
   - Shown: "Beer"
   - Likely: Wine, Spirits, Mixed drinks, Other

4. **Drug Frequency Options**: TBD complete list
   - Shown: "Not at all in past month"
   - Based on substance use screening tools (ASSIST, DAST)

5. **Quit Date Dual-Mode**: Does smoking quit date use dual-mode (Date OR Age)?
   - Figma shows calendar icon
   - User might recall "I quit at age 30" rather than exact date
   - Recommendation: Yes, use dual-mode pattern

6. **Living Situation**: Text or dropdown?
   - Current: Free-text inferred
   - Alternative: Dropdown with standard options
   - Need edit screen extraction to confirm

7. **CAGE Integration**: Automatic trigger or manual?
   - Recommendation: Automatic trigger when criteria met
   - Alternative: Always ask for regular drinkers
   - Clinical guideline: Screen all patients with frequency ≥ weekly
