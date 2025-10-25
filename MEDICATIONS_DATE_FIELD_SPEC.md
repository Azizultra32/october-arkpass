# Medication Date Field Specification

## Field: Prescribed / Start Day

### Initial Display
```
Label: "Prescribed / Start day"
Icon: 📅 Calendar icon (24px)
```

### Expanded View (Two Options)

When user taps the field, they see TWO options:

```
┌────────────────────────────────────────┐
│  Prescribed / Start day                │
│                                        │
│  ○ Year-Month-Date                     │
│  ○ I've been on this medication        │
└────────────────────────────────────────┘
```

---

## Option 1: Year-Month-Date

**Selection Flow**: Same progressive disclosure as conditions, but WITHOUT certainty toggle

```
User selects "Year-Month-Date"
         ↓
┌──────────────────────────────────────────┐
│  When did you start this medication?     │
│                                          │
│  ▼ DROPDOWN: Time Period                │
│    ○ Within 1 year                       │
│    ○ Within 5 years                      │
│    ○ Over 5 years                        │
│    ○ I was ... years old                 │
└──────────────────────────────────────────┘
         ↓
   Progressive drilldown:
   Year → Month → Date
   (user can stop at any level)
         ↓
   NO certainty toggle
         ↓
       DONE
```

**Framework Used**: Same as conditions Framework 1 (Within 1yr/5yr/Over 5yr/Age)

**Key Differences from Conditions**:
- ✅ Same dropdown options
- ✅ Same progressive disclosure (year → month → date)
- ✅ Same "stop at any level" flexibility
- ❌ **NO certainty toggle** (certain/somewhat certain/uncertain)
- ✅ Voice input + LLM (assumed, following conditions pattern)

---

## Option 2: I've Been on This Medication

**Selection Flow**:

```
User selects "I've been on this medication"
         ↓
┌──────────────────────────────────────────┐
│  I've been on this medication...         │
│                                          │
│  ○ (Since) Right when I was diagnosed    │
│  ○ (Later or added) After I was diagnosed│
└──────────────────────────────────────────┘
```

### Sub-option A: Right when I was diagnosed

**Behavior**:
- Links medication start date to the **diagnosis date** of the associated condition
- No additional date input needed
- System automatically uses the condition's diagnosis date

**Data Model**:
```typescript
{
  prescribedStartDate: {
    type: 'linked_to_condition_diagnosis',
    conditionId: string,
    computedDate: Date, // From condition's diagnosis date
    displayText: 'Right when diagnosed with [Condition Name]'
  }
}
```

### Sub-option B: After I was diagnosed

**Behavior**:
- User acknowledges medication started AFTER diagnosis
- User then provides the actual date using the Year-Month-Date framework (Option 1)
- System knows: `medicationStartDate > conditionDiagnosisDate`

**Flow**:
```
User selects "After I was diagnosed"
         ↓
   [Returns to Year-Month-Date selection]
         ↓
   User picks date (same framework as Option 1)
         ↓
   System validates: startDate > diagnosisDate
         ↓
       DONE
```

**Data Model**:
```typescript
{
  prescribedStartDate: {
    type: 'after_diagnosis',
    conditionId: string,
    year?: number,
    month?: number,
    day?: number,
    precision: 'year' | 'month' | 'day',
    computedDate: Date,
    displayText: string,
    relationToDiagnosis: 'after' // validates > diagnosisDate
  }
}
```

---

## Complete Data Model

```typescript
interface MedicationDateSelection {
  // Option 1: Direct date
  type: 'direct_date' | 'linked_to_condition_diagnosis' | 'after_diagnosis';

  // For direct_date and after_diagnosis
  year?: number;
  month?: number;
  day?: number;
  relativeTime?: string;
  ageAtEvent?: number;
  precision?: 'year' | 'month' | 'day' | 'relative' | 'age';

  // For linked options
  conditionId?: string;
  relationToDiagnosis?: 'at_diagnosis' | 'after';

  // Computed
  computedDate?: Date;
  displayText: string;

  // Voice input (if used)
  voiceTranscript?: string;
  llmInterpretation?: string;

  // NO certainty field (removed for medications)
}
```

---

## Display Text Examples

**Option 1 - Direct Date**:
- "January 2023"
- "About Q2 2023"
- "2020"
- "When I was 25 years old"

**Option 2A - Right when diagnosed**:
- "Right when diagnosed with Asthma"
- "Right when diagnosed with Migraine"

**Option 2B - After diagnosed**:
- "After diagnosis (January 2023)"
- "After diagnosis (About 6 months ago)"

---

## Validation Rules

1. **If "Right when diagnosed" selected**:
   - Must have a condition linked to the medication
   - Condition must have a diagnosis date
   - If condition diagnosis date is missing → error: "Please add diagnosis date to [Condition Name] first"

2. **If "After I was diagnosed" selected**:
   - Must have a condition linked to the medication
   - Medication start date must be >= condition diagnosis date
   - If medicationStartDate < diagnosisDate → error: "Medication cannot start before diagnosis"

3. **If no condition linked**:
   - "I've been on this medication" option should be disabled/grayed out
   - Only "Year-Month-Date" option available

---

## UI Flow Diagram

```
[Prescribed / Start day] (tap)
         ↓
┌────────────────────────────────────────┐
│  ○ Year-Month-Date                     │
│  ○ I've been on this medication        │
│     (disabled if no condition linked)  │
└────────────────────────────────────────┘
         ↓
    [User selects option]
         ↓
    ┌────────────┴────────────┐
    │                         │
Year-Month-Date      I've been on this
    │                         │
    ↓                         ↓
Framework 1         ┌─────────────────┐
(no certainty)      │ ○ Right when... │
    │               │ ○ After...      │
    ↓               └─────────────────┘
Progressive                  │
disclosure                   │
    │                        │
    ↓                ┌───────┴────────┐
   DONE              │                │
                Right when       After
                     │                │
                     ↓                ↓
                Link to      Framework 1
                diagnosis   (no certainty)
                     │                │
                     ↓                ↓
                   DONE            DONE
```

---

## Summary Table

| Selection Path | Framework Used | Certainty Toggle | Condition Required | Date Validation |
|---|---|---|---|---|
| Year-Month-Date | Framework 1 (1yr/5yr/Over 5yr/Age) | ❌ No | ❌ No | Must be <= today |
| Right when diagnosed | N/A (uses condition's date) | ❌ No | ✅ Yes | Uses condition's diagnosis date |
| After diagnosed → Date | Framework 1 (1yr/5yr/Over 5yr/Age) | ❌ No | ✅ Yes | Must be > condition diagnosis date |

---

**Status**: ✅ Complete specification for Prescribed / Start day field
