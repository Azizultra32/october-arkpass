# Display Rules: Patient vs Provider vs Database

## Three-View System

### UI/Vis[Pt] - Patient View
**Purpose**: Simple, human-readable, non-clinical language
**Audience**: Patients accessing their own health records
**Goal**: Clarity without overwhelming medical terminology

### UI/Vis[Pr] - Provider View
**Purpose**: Clinical precision with ICD codes and medical terminology
**Audience**: Healthcare providers accessing patient records
**Goal**: Complete clinical information for decision-making

### Database
**Purpose**: Normalized, relational storage
**Audience**: System/backend
**Goal**: Data integrity, relationships, efficient querying

---

## Medication Multi-Condition Display Rules

### Scenario: Medication Linked to Multiple Conditions

**Example**:
- Medication: Spironolactone
- Primary condition: CHF (Congestive Heart Failure) - ICD-10: I50.9
- Secondary condition: Hypokalemia - ICD-10: E87.6

---

## Patient View (UI/Vis[Pt])

### When viewing CHF condition:

```
CONDITIONS > CHF

MEDICATIONS

Spironolactone
100mg, 1 time a day
(+ 1 other condition)
```

**Details**:
- Medication name: "Spironolactone"
- Dosage/frequency visible
- **"(+ 1 other condition)"** is clickable/tappable
- When clicked → hyperlinks to Hypokalemia condition
- **NO ICD codes shown**
- **NO uncertainty markers (?) shown**

### When viewing Hypokalemia condition:

```
CONDITIONS > Hypokalemia

MEDICATIONS

Spironolactone
100mg, 1 time a day
(+ 1 other condition)
```

**Details**:
- Same medication listed
- **"(+ 1 other condition)"** hyperlinks back to CHF
- Symmetrical navigation

### If linked to 3+ conditions:

```
Spironolactone
100mg, 1 time a day
(+ 2 other conditions)
```

**When clicked**:
```
┌────────────────────────────────────┐
│  Also prescribed for:              │
│                                    │
│  • CHF                            │
│  • Hypokalemia                    │
│                                    │
│  [Close]                           │
└────────────────────────────────────┘
```

Each condition name is clickable/hyperlinked.

---

## Provider View (UI/Vis[Pr])

### When viewing CHF condition:

```
CONDITIONS > CHF (I50.9)

MEDICATIONS

Spironolactone [I50.9 + E87.6]
100mg, 1 time a day
Prescribed for: CHF, Hypokalemia
```

**Details**:
- Medication name includes ICD codes: "Spironolactone [I50.9 + E87.6]"
- Full list of conditions spelled out
- ICD codes visible for clinical precision
- No hyperlinks needed (provider can see all info at once)

### If uncertainty exists:

```
Spironolactone [I50.9 + (?)E87.6]
100mg, 1 time a day
Prescribed for: CHF, Hypokalemia (uncertain)
```

**Details**:
- Uncertainty marker `(?)` shown in ICD code notation
- Text annotation "(uncertain)" added to condition name

---

## Database Schema

```typescript
interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  prescribedStartDate?: DateSelection;
  status?: string;

  // Relational links to conditions
  medicationConditions: MedicationCondition[];
}

interface MedicationCondition {
  id: string;
  medicationId: string;
  conditionId: string;

  // Clinical codes
  icd10Code?: string;
  icd9Code?: string;

  // Certainty flag
  certainty: 'certain' | 'uncertain';

  // Primary/secondary designation
  isPrimary: boolean; // First linked = primary

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
}

interface Condition {
  id: string;
  name: string; // "CHF", "Hypokalemia"
  icd10Code: string; // "I50.9", "E87.6"
  icd9Code?: string;
  // ... other fields
}
```

**Key Database Features**:
- **Relational**: Many-to-many through `MedicationCondition` join table
- **Primary flag**: First condition linked is marked `isPrimary: true`
- **Certainty tracking**: Each link has its own certainty level
- **ICD codes**: Stored in `Condition` table, joined when needed

---

## Display Logic Functions

### Patient View (UI/Vis[Pt])

```typescript
function getPatientMedicationDisplay(
  medication: Medication,
  currentConditionId: string
): PatientMedicationDisplay {
  const otherConditions = medication.medicationConditions
    .filter(mc => mc.conditionId !== currentConditionId)
    .map(mc => mc.condition);

  let suffix = '';
  if (otherConditions.length === 1) {
    suffix = '(+ 1 other condition)';
  } else if (otherConditions.length > 1) {
    suffix = `(+ ${otherConditions.length} other conditions)`;
  }

  return {
    name: medication.name,
    dosage: medication.dosage,
    frequency: medication.frequency,
    suffix: suffix,
    otherConditionsLink: {
      clickable: otherConditions.length > 0,
      conditions: otherConditions.map(c => ({
        id: c.id,
        name: c.name, // Human-readable name only
        href: `/conditions/${c.id}`
      }))
    }
  };
}
```

**Example Output**:
```json
{
  "name": "Spironolactone",
  "dosage": "100mg",
  "frequency": "1 time a day",
  "suffix": "(+ 1 other condition)",
  "otherConditionsLink": {
    "clickable": true,
    "conditions": [
      {
        "id": "hypokalemia_123",
        "name": "Hypokalemia",
        "href": "/conditions/hypokalemia_123"
      }
    ]
  }
}
```

### Provider View (UI/Vis[Pr])

```typescript
function getProviderMedicationDisplay(
  medication: Medication
): ProviderMedicationDisplay {
  const icdCodes = medication.medicationConditions.map(mc => {
    const code = mc.icd10Code || mc.icd9Code;
    return mc.certainty === 'uncertain' ? `(?)${code}` : code;
  }).join(' + ');

  const conditionNames = medication.medicationConditions.map(mc => {
    const name = mc.condition.name;
    return mc.certainty === 'uncertain' ? `${name} (uncertain)` : name;
  }).join(', ');

  return {
    displayName: `${medication.name} [${icdCodes}]`,
    dosage: medication.dosage,
    frequency: medication.frequency,
    prescribedFor: conditionNames
  };
}
```

**Example Output**:
```json
{
  "displayName": "Spironolactone [I50.9 + E87.6]",
  "dosage": "100mg",
  "frequency": "1 time a day",
  "prescribedFor": "CHF, Hypokalemia"
}
```

---

## UI Component Examples

### Patient View Component (React/React Native)

```tsx
function PatientMedicationCard({ medication, currentConditionId }) {
  const display = getPatientMedicationDisplay(medication, currentConditionId);
  const [showOtherConditions, setShowOtherConditions] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{display.name}</Text>
      <Text style={styles.dosage}>
        {display.dosage}, {display.frequency}
      </Text>

      {display.suffix && (
        <TouchableOpacity
          onPress={() => {
            if (display.otherConditionsLink.conditions.length === 1) {
              // Navigate directly
              navigate(display.otherConditionsLink.conditions[0].href);
            } else {
              // Show modal
              setShowOtherConditions(true);
            }
          }}
        >
          <Text style={styles.link}>{display.suffix}</Text>
        </TouchableOpacity>
      )}

      {showOtherConditions && (
        <Modal>
          <Text style={styles.modalTitle}>Also prescribed for:</Text>
          {display.otherConditionsLink.conditions.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => navigate(c.href)}
            >
              <Text style={styles.conditionName}>• {c.name}</Text>
            </TouchableOpacity>
          ))}
        </Modal>
      )}
    </View>
  );
}
```

### Provider View Component

```tsx
function ProviderMedicationCard({ medication }) {
  const display = getProviderMedicationDisplay(medication);

  return (
    <View style={styles.card}>
      <Text style={styles.clinicalName}>{display.displayName}</Text>
      <Text style={styles.dosage}>
        {display.dosage}, {display.frequency}
      </Text>
      <Text style={styles.conditions}>
        Prescribed for: {display.prescribedFor}
      </Text>
    </View>
  );
}
```

---

## Navigation Flow Examples

### Patient View Navigation

**Starting at CHF condition**:
```
CONDITIONS > CHF
  MEDICATIONS
    Spironolactone
    (+ 1 other condition) ← [TAP]
              ↓
  [Navigate to Hypokalemia condition]
              ↓
CONDITIONS > Hypokalemia
  MEDICATIONS
    Spironolactone
    (+ 1 other condition) ← [TAP]
              ↓
  [Navigate back to CHF condition]
```

**If 2+ other conditions**:
```
CONDITIONS > CHF
  MEDICATIONS
    Spironolactone
    (+ 2 other conditions) ← [TAP]
              ↓
  [Show modal]
  ┌────────────────────────┐
  │ Also prescribed for:   │
  │                        │
  │ • Hypokalemia    ← [TAP]
  │ • Edema          ← [TAP]
  └────────────────────────┘
              ↓
  [Navigate to selected condition]
```

---

## Display Rule Summary Table

| Aspect | Patient View | Provider View | Database |
|---|---|---|---|
| **ICD Codes** | ❌ Hidden | ✅ Shown [I50.9 + E87.6] | ✅ Stored in join table |
| **Uncertainty** | ❌ Hidden | ✅ Shown (?) + "(uncertain)" | ✅ Stored as flag |
| **Condition Names** | ✅ Human-readable only | ✅ Human + ICD codes | ✅ Stored in Condition table |
| **Multi-condition** | "(+ N other conditions)" | Full list with codes | Relational many-to-many |
| **Navigation** | Hyperlinks to conditions | No hyperlinks (info shown) | Foreign keys |
| **Language** | Simple, friendly | Clinical, precise | Normalized, relational |

---

## Implementation Checklist

### Backend/API
- [ ] Create `getPatientMedicationDisplay()` function
- [ ] Create `getProviderMedicationDisplay()` function
- [ ] API endpoint: `/api/medications/:id/patient-view`
- [ ] API endpoint: `/api/medications/:id/provider-view`
- [ ] Include condition hyperlink data in patient view response

### Frontend - Patient View
- [ ] Medication card component with "(+ N other conditions)" suffix
- [ ] Clickable suffix that navigates to other condition
- [ ] Modal for 2+ other conditions
- [ ] Hyperlinked condition names in modal
- [ ] NO ICD codes displayed anywhere
- [ ] NO uncertainty markers displayed

### Frontend - Provider View
- [ ] Medication card component with ICD codes in name
- [ ] Full condition list with codes
- [ ] Uncertainty markers visible: (?) in codes, "(uncertain)" in text
- [ ] Clinical terminology throughout

### Database
- [ ] `MedicationCondition` join table
- [ ] `isPrimary` flag for primary condition
- [ ] `certainty` field for each link
- [ ] Indexes on foreign keys

---

## Testing Scenarios

### Test 1: Patient View - Single Other Condition
```
Given: Medication linked to CHF (primary) and Hypokalemia (secondary)
When: Patient views CHF condition
Then:
  - Display shows "Spironolactone"
  - Display shows "(+ 1 other condition)"
  - NO ICD codes visible
  - Clicking suffix navigates to Hypokalemia
```

### Test 2: Patient View - Multiple Other Conditions
```
Given: Medication linked to CHF, Hypokalemia, and Edema
When: Patient views CHF condition
Then:
  - Display shows "(+ 2 other conditions)"
  - Clicking suffix opens modal
  - Modal lists "Hypokalemia" and "Edema"
  - Each is clickable/navigable
```

### Test 3: Provider View - With Uncertainty
```
Given: Medication linked to CHF (certain) and Hypokalemia (uncertain)
When: Provider views medication
Then:
  - Display shows "Spironolactone [I50.9 + (?)E87.6]"
  - Display shows "Prescribed for: CHF, Hypokalemia (uncertain)"
  - ICD codes visible
  - Uncertainty markers visible
```

---

**Status**: ✅ Complete three-view system specification
**Purpose**: Clear separation of patient-facing, provider-facing, and database storage rules
