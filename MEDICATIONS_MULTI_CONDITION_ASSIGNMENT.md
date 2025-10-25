# Medication Multi-Condition Assignment Rules

## Overview

**Key Business Rules**:
- Multiple medications CAN be assigned to ONE diagnosis
- One medication is typically assigned to ONE diagnosis (almost always)
- **BUT**: If user tries to link the same medication to MULTIPLE conditions → confirmation process required

---

## Confirmation Process

### Trigger Event
User attempts to link a medication that is ALREADY linked to another condition.

### Example Scenario
```
Existing state:
- Medication: "Fluticasone"
- Currently linked to: "Asthma" (ICD-10: J45.9)

User action:
- Tries to link "Fluticasone" to "Allergic rhinitis" (ICD-10: J30.9)

System response:
→ Show confirmation dialog
```

---

## Confirmation Dialog

```
┌────────────────────────────────────────────────┐
│  Are you sure?                                 │
│                                                │
│  You are on this medication for:              │
│  • Asthma (J45.9)                              │
│                                                │
│  Are you sure you are also on it for:         │
│  • Allergic rhinitis (J30.9)                   │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ ○ Not sure                                │ │
│  │ ○ Yes, I'm certain                        │ │
│  │ ○ Actually, I don't think I am            │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  [Cancel]                      [Confirm]       │
└────────────────────────────────────────────────┘
```

---

## User Responses & Outcomes

### Response 1: "Not sure"

**Action**: Link medication to both conditions with uncertainty marker

**Medication Display Name**:
```
Fluticasone [J45.9 + (?)J30.9]
```

**Breakdown**:
- `J45.9` = First/primary condition (Asthma)
- `(?)J30.9` = Second condition with uncertainty marker
- The `(?)` indicates user is not sure about this association

**Data Model**:
```typescript
{
  medicationName: "Fluticasone",
  conditions: [
    {
      conditionId: "condition_1",
      icd10Code: "J45.9",
      certainty: "certain"
    },
    {
      conditionId: "condition_2",
      icd10Code: "J30.9",
      certainty: "uncertain" // User selected "Not sure"
    }
  ],
  displayName: "Fluticasone [J45.9 + (?)J30.9]"
}
```

---

### Response 2: "Yes, I'm certain"

**Action**: Link medication to both conditions with certainty

**Medication Display Name**:
```
Fluticasone [J45.9 + J30.9]
```

**Breakdown**:
- `J45.9` = First condition (Asthma)
- `J30.9` = Second condition (Allergic rhinitis)
- No uncertainty marker - user is certain about both

**Data Model**:
```typescript
{
  medicationName: "Fluticasone",
  conditions: [
    {
      conditionId: "condition_1",
      icd10Code: "J45.9",
      certainty: "certain"
    },
    {
      conditionId: "condition_2",
      icd10Code: "J30.9",
      certainty: "certain" // User selected "Yes, I'm certain"
    }
  ],
  displayName: "Fluticasone [J45.9 + J30.9]"
}
```

---

### Response 3: "Actually, I don't think I am"

**Action**: Do NOT link medication to the second condition

**Medication Display Name**:
```
Fluticasone [J45.9]
```

**Result**: Medication remains linked ONLY to the original condition (Asthma)

**Data Model**:
```typescript
{
  medicationName: "Fluticasone",
  conditions: [
    {
      conditionId: "condition_1",
      icd10Code: "J45.9",
      certainty: "certain"
    }
    // No second condition - user rejected the association
  ],
  displayName: "Fluticasone [J45.9]"
}
```

---

## Display in Conditions View

When viewing a **condition** and looking at its medications, the display shows the **other** conditions the medication is also linked to.

### Example: Viewing "Asthma" Condition

**Medications Section**:
```
MEDICATIONS

Fluticasone *[+J30.9]
232mcg, 2 times a day
```

**Breakdown**:
- `Fluticasone` = Medication name
- `*[+J30.9]` = Indicator that this medication is ALSO used for another condition (Allergic rhinitis)
- The `*` and `+` prefix indicates "also used for"

### Example: Viewing "Allergic rhinitis" Condition

**Medications Section**:
```
MEDICATIONS

Fluticasone *[+J45.9]
232mcg, 2 times a day
```

**Breakdown**:
- Shows the medication is ALSO used for Asthma (J45.9)

---

## Multi-Condition Display Format

### Single Condition (Normal)
```
Medication Name
Dosage, Frequency
for [Condition Name]
```

Example:
```
Fluticasone
232mcg, 2 times a day
for Asthma
```

### Multiple Conditions (In Medication View)
```
Medication Name [ICD1 + ICD2 + ICD3]
Dosage, Frequency
for [Condition 1], [Condition 2], [Condition 3]
```

Example:
```
Fluticasone [J45.9 + J30.9]
232mcg, 2 times a day
for Asthma, Allergic rhinitis
```

### Multiple Conditions with Uncertainty
```
Medication Name [ICD1 + (?)ICD2]
Dosage, Frequency
for [Condition 1], [Condition 2 (?)]
```

Example:
```
Fluticasone [J45.9 + (?)J30.9]
232mcg, 2 times a day
for Asthma, Allergic rhinitis (?)
```

### In Condition View (Shows Other Conditions)
```
Medication Name *[+ICD2]
Dosage, Frequency
```

Example (when viewing Asthma):
```
Fluticasone *[+J30.9]
232mcg, 2 times a day
```

Example (when viewing Allergic rhinitis):
```
Fluticasone *[+J45.9]
232mcg, 2 times a day
```

---

## Validation & Business Rules

### Rule 1: First Assignment (No Confirmation Needed)
```
IF medication.conditions.length === 0
THEN add condition without confirmation
```

### Rule 2: Second+ Assignment (Confirmation Required)
```
IF medication.conditions.length >= 1
AND user tries to add new condition
THEN show confirmation dialog
```

### Rule 3: Uncertainty Propagation
```
IF user selects "Not sure"
THEN certainty = "uncertain" for new condition
AND display with (?) marker
```

### Rule 4: Rejection Handling
```
IF user selects "Actually, I don't think I am"
THEN do NOT create association
AND do NOT modify existing medication record
```

---

## Data Model

```typescript
interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  prescribedStartDate?: DateSelection;
  status?: string;

  // Multi-condition support
  conditions: MedicationConditionLink[];

  // Computed display name with ICD codes
  displayName: string; // e.g., "Fluticasone [J45.9 + (?)J30.9]"
}

interface MedicationConditionLink {
  conditionId: string;
  icd10Code: string;
  icd9Code?: string;
  certainty: 'certain' | 'uncertain';
  createdAt: Date;
}

// Helper function to generate display name
function generateMedicationDisplayName(medication: Medication): string {
  if (medication.conditions.length === 0) {
    return medication.name;
  }

  const icdCodes = medication.conditions.map(c => {
    const code = c.icd10Code || c.icd9Code;
    return c.certainty === 'uncertain' ? `(?)${code}` : code;
  }).join(' + ');

  return `${medication.name} [${icdCodes}]`;
}

// Helper function to generate condition view display
function generateConditionMedicationDisplay(
  medication: Medication,
  currentConditionId: string
): string {
  const otherConditions = medication.conditions.filter(
    c => c.conditionId !== currentConditionId
  );

  if (otherConditions.length === 0) {
    return medication.name;
  }

  const otherCodes = otherConditions.map(c =>
    c.icd10Code || c.icd9Code
  ).join(' + ');

  return `${medication.name} *[+${otherCodes}]`;
}
```

---

## UI Flow Diagram

```
User tries to link medication to condition
         ↓
┌─────────────────────────┐
│ Is medication already   │
│ linked to another       │
│ condition?              │
└──────────┬──────────────┘
           │
    ┌──────┴──────┐
    │             │
   No            Yes
    │             │
    ↓             ↓
Link it    Show confirmation
           dialog
           │
    ┌──────┴──────┬──────────┐
    │             │          │
Not sure      Certain    Don't think
    │             │          │
    ↓             ↓          ↓
Link with    Link with   Cancel
uncertainty   certainty   (no link)
    │             │          │
    ↓             ↓          ↓
Display:     Display:    Display:
[ICD + (?)ICD] [ICD + ICD] [ICD only]
```

---

## Test Scenarios

### Scenario 1: Single Condition Assignment
```
Given: Medication "Aspirin" with no conditions
When: User links to "Headache" (G44.1)
Then: No confirmation needed
And: Display = "Aspirin [G44.1]"
```

### Scenario 2: Second Condition - Certain
```
Given: Medication "Aspirin" linked to "Headache" (G44.1)
When: User links to "Arthritis" (M19.9)
And: User selects "Yes, I'm certain"
Then: Display = "Aspirin [G44.1 + M19.9]"
```

### Scenario 3: Second Condition - Uncertain
```
Given: Medication "Aspirin" linked to "Headache" (G44.1)
When: User links to "Arthritis" (M19.9)
And: User selects "Not sure"
Then: Display = "Aspirin [G44.1 + (?)M19.9]"
```

### Scenario 4: Second Condition - Rejected
```
Given: Medication "Aspirin" linked to "Headache" (G44.1)
When: User tries to link to "Arthritis" (M19.9)
And: User selects "Actually, I don't think I am"
Then: Display = "Aspirin [G44.1]"
And: No link to Arthritis created
```

### Scenario 5: Viewing From Condition
```
Given: Medication "Aspirin" linked to:
  - "Headache" (G44.1) - certain
  - "Arthritis" (M19.9) - certain

When: Viewing "Headache" condition
Then: Medication displays as "Aspirin *[+M19.9]"

When: Viewing "Arthritis" condition
Then: Medication displays as "Aspirin *[+G44.1]"
```

---

**Status**: ✅ Complete specification for multi-condition medication assignment

**Note**: This is for LATER REFERENCE - not for current medication screens extraction, but important for implementation.
