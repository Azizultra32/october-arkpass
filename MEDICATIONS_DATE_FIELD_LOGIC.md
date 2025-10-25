# Medication Date Field - Complete Logic Specification

## Three-Layer System

This document defines the **presentation**, **storage**, and **display** logic for the "Prescribed / Start day" field.

---

## Layer 1: Presentation (User-Facing Question)

### What the user sees when they tap the field:

```
┌────────────────────────────────────────┐
│  Prescribed / Start day                │
│                                        │
│  ○ Year-Month-Date                     │
│  ○ I've been on this medication        │
└────────────────────────────────────────┘
```

### If user selects "I've been on this medication":

```
┌────────────────────────────────────────┐
│  I've been on this medication...       │
│                                        │
│  ○ (Since) Right when I was diagnosed  │
│  ○ (Later or added) After I was        │
│     diagnosed                          │
└────────────────────────────────────────┘
```

### Display text must be EXACTLY:
- "(Since) Right when I was diagnosed"
- "(Later or added) After I was diagnosed"

**This text is for clarity and user understanding.**

---

## Layer 2: Storage (Database Schema)

### Data Structure

```typescript
interface MedicationPrescribedStartDate {
  // Core storage type
  type: 'direct_date' | 'at_diagnosis' | 'after_diagnosis';

  // For type = 'direct_date'
  year?: number;
  month?: number;
  day?: number;
  precision?: 'year' | 'month' | 'day';

  // For type = 'at_diagnosis' or 'after_diagnosis'
  linkedConditionId: string;

  // CRITICAL: Store the reference type
  referenceType: 'at_dx' | 'after_dx' | null;

  // For type = 'after_diagnosis' - store the offset/difference
  afterDiagnosisPeriod?: {
    year?: number;
    month?: number;
    day?: number;
    precision: 'year' | 'month' | 'day';
  };

  // Computed/cached value (recalculated when condition date updates)
  computedDate?: Date;

  // Timestamp for cache invalidation
  lastComputedAt?: Date;
}
```

### Storage Rules

#### Rule 1: "Right when I was diagnosed" → type = 'at_diagnosis'

**Database Record**:
```json
{
  "type": "at_diagnosis",
  "linkedConditionId": "condition_abc123",
  "referenceType": "at_dx",
  "computedDate": "2020-01-15T00:00:00Z",
  "lastComputedAt": "2025-10-24T10:30:00Z"
}
```

**Critical Behavior**:
- `computedDate` is a **cached reference** to the condition's diagnosis date
- When condition's diagnosis date changes → `computedDate` MUST be recalculated automatically
- System maintains a link/trigger: `conditionId:diagnosisDate → medicationId:computedDate`

#### Rule 2: "After I was diagnosed" → type = 'after_diagnosis'

**Example User Input**:
- Condition diagnosed: "About Q2 2020" (Within 5 years path)
- Medication started: User selects "6 months after" or "January 2021"

**Database Record** (Example A - Relative):
```json
{
  "type": "after_diagnosis",
  "linkedConditionId": "condition_abc123",
  "referenceType": "after_dx",
  "afterDiagnosisPeriod": {
    "month": 6,
    "precision": "month"
  },
  "computedDate": "2020-10-15T00:00:00Z",
  "lastComputedAt": "2025-10-24T10:30:00Z"
}
```

**Database Record** (Example B - Absolute Date):
```json
{
  "type": "after_diagnosis",
  "linkedConditionId": "condition_abc123",
  "referenceType": "after_dx",
  "year": 2021,
  "month": 1,
  "day": 15,
  "precision": "day",
  "computedDate": "2021-01-15T00:00:00Z",
  "lastComputedAt": "2025-10-24T10:30:00Z"
}
```

**Critical Behavior**:
- If user provides absolute date → store the date directly
- If user provides relative offset → store the offset AND recalculate when condition date changes
- Validation: `computedDate` MUST be > condition's diagnosis date

#### Rule 3: Direct Date (No condition reference)

**Database Record**:
```json
{
  "type": "direct_date",
  "year": 2022,
  "month": 3,
  "precision": "month",
  "computedDate": "2022-03-01T00:00:00Z",
  "referenceType": null
}
```

---

## Layer 3: Display (UI Rendering)

### Display Rules

The display changes based on:
1. Whether there's an exact date (year/month/day precision)
2. Whether it's linked to a condition

### Display Rule Matrix

| Storage Type | Has Exact Date? | Display Format |
|---|---|---|
| `at_diagnosis` | No (only year) | "(Since) Right when I was diagnosed" |
| `at_diagnosis` | Yes (year/month or year/month/day) | "March 2020 (@_dx)" or "Mar 15, 2020 (@_dx)" |
| `after_diagnosis` | No (only year) | "(Later or added) After I was diagnosed" |
| `after_diagnosis` | Yes (year/month or year/month/day) | "January 2021 (after_dx)" or "Jan 15, 2021 (after_dx)" |
| `direct_date` | Yes | "March 2022" or "Mar 15, 2022" |

### Granularity Levels Considered Acceptable

1. **Year only**: "2020"
2. **Year + Month**: "March 2020"
3. **Year + Month + Day**: "Mar 15, 2020"

**NOT acceptable**: Approximate/relative text like "About Q2 2020" when displaying the final value

### Display Examples

#### Scenario 1: At diagnosis, imprecise condition date

**Condition**:
- Name: "Asthma"
- Diagnosis Date: "2020" (year only precision)

**Medication**:
- Storage: `type: "at_diagnosis", linkedConditionId: "asthma_123"`
- **Display**: "(Since) Right when I was diagnosed"

#### Scenario 2: At diagnosis, precise condition date

**Condition**:
- Name: "Asthma"
- Diagnosis Date: "March 2020" (year + month precision)

**Medication**:
- Storage: `type: "at_diagnosis", linkedConditionId: "asthma_123", computedDate: "2020-03-01"`
- **Display**: "March 2020 (@_dx)"

#### Scenario 3: At diagnosis, exact condition date

**Condition**:
- Name: "Asthma"
- Diagnosis Date: "March 15, 2020" (year + month + day precision)

**Medication**:
- Storage: `type: "at_diagnosis", linkedConditionId: "asthma_123", computedDate: "2020-03-15"`
- **Display**: "Mar 15, 2020 (@_dx)"

#### Scenario 4: After diagnosis, imprecise offset

**Condition**:
- Diagnosis Date: "2020" (year only)

**Medication**:
- User selected: "After I was diagnosed" → then entered "2021"
- Storage: `type: "after_diagnosis", year: 2021, precision: "year"`
- **Display**: "(Later or added) After I was diagnosed"

#### Scenario 5: After diagnosis, precise date

**Condition**:
- Diagnosis Date: "March 2020"

**Medication**:
- User selected: "After I was diagnosed" → then entered "January 2021"
- Storage: `type: "after_diagnosis", year: 2021, month: 1, precision: "month", computedDate: "2021-01-01"`
- **Display**: "January 2021 (after_dx)"

#### Scenario 6: After diagnosis, exact date

**Condition**:
- Diagnosis Date: "March 15, 2020"

**Medication**:
- User selected: "After I was diagnosed" → then entered "January 20, 2021"
- Storage: `type: "after_diagnosis", year: 2021, month: 1, day: 20, precision: "day", computedDate: "2021-01-20"`
- **Display**: "Jan 20, 2021 (after_dx)"

#### Scenario 7: Direct date (no condition link)

**Medication**:
- User selected: "Year-Month-Date" → "March 2022"
- Storage: `type: "direct_date", year: 2022, month: 3, precision: "month", computedDate: "2022-03-01"`
- **Display**: "March 2022"

---

## Critical Auto-Update Logic

### Trigger: Condition Diagnosis Date Changes

When a condition's diagnosis date is updated:

```typescript
function onConditionDiagnosisDateUpdate(conditionId: string, newDate: Date, newPrecision: string) {
  // Find all medications linked to this condition
  const linkedMedications = await Medication.findWhere({
    'prescribedStartDate.linkedConditionId': conditionId,
    'prescribedStartDate.type': ['at_diagnosis', 'after_diagnosis']
  });

  for (const medication of linkedMedications) {
    if (medication.prescribedStartDate.type === 'at_diagnosis') {
      // Direct update - medication started at diagnosis
      medication.prescribedStartDate.computedDate = newDate;
      medication.prescribedStartDate.lastComputedAt = new Date();

    } else if (medication.prescribedStartDate.type === 'after_diagnosis') {
      // Offset update - medication started after diagnosis
      if (medication.prescribedStartDate.afterDiagnosisPeriod) {
        // Relative offset stored - recalculate
        const offset = medication.prescribedStartDate.afterDiagnosisPeriod;
        const computedDate = addPeriod(newDate, offset);
        medication.prescribedStartDate.computedDate = computedDate;
        medication.prescribedStartDate.lastComputedAt = new Date();
      } else {
        // Absolute date stored - validate against new diagnosis date
        const medicationDate = medication.prescribedStartDate.computedDate;
        if (medicationDate < newDate) {
          // CONFLICT: Medication date is now before diagnosis date
          // Flag for user review
          medication.prescribedStartDate.validationWarning =
            "Medication start date is before updated diagnosis date";
        }
      }
    }

    await medication.save();
  }
}
```

### Display Priority Logic

```typescript
function getDisplayText(prescribedStartDate: MedicationPrescribedStartDate): string {
  // Priority 1: Check if we have acceptable granularity (month or day level)
  const hasAcceptableGranularity =
    prescribedStartDate.precision === 'month' ||
    prescribedStartDate.precision === 'day';

  if (hasAcceptableGranularity && prescribedStartDate.computedDate) {
    // Format the date
    const formatted = formatDate(
      prescribedStartDate.computedDate,
      prescribedStartDate.precision
    );

    // Add reference marker if linked to condition
    if (prescribedStartDate.referenceType === 'at_dx') {
      return `${formatted} (@_dx)`;
    } else if (prescribedStartDate.referenceType === 'after_dx') {
      return `${formatted} (after_dx)`;
    } else {
      return formatted;
    }
  }

  // Priority 2: If no acceptable granularity, show context text
  if (prescribedStartDate.type === 'at_diagnosis') {
    return "(Since) Right when I was diagnosed";
  } else if (prescribedStartDate.type === 'after_diagnosis') {
    return "(Later or added) After I was diagnosed";
  } else {
    // Direct date with year-only precision
    return prescribedStartDate.year?.toString() || "Not specified";
  }
}

function formatDate(date: Date, precision: string): string {
  if (precision === 'day') {
    return format(date, 'MMM d, yyyy'); // "Mar 15, 2020"
  } else if (precision === 'month') {
    return format(date, 'MMMM yyyy'); // "March 2020"
  } else {
    return format(date, 'yyyy'); // "2020"
  }
}
```

---

## Display Examples Summary

| Database State | UI Display |
|---|---|
| `at_diagnosis`, year only | "(Since) Right when I was diagnosed" |
| `at_diagnosis`, month precision, "March 2020" | "March 2020 (@_dx)" |
| `at_diagnosis`, day precision, "Mar 15, 2020" | "Mar 15, 2020 (@_dx)" |
| `after_diagnosis`, year only | "(Later or added) After I was diagnosed" |
| `after_diagnosis`, month precision, "January 2021" | "January 2021 (after_dx)" |
| `after_diagnosis`, day precision, "Jan 20, 2021" | "Jan 20, 2021 (after_dx)" |
| `direct_date`, month precision, "March 2022" | "March 2022" |
| `direct_date`, day precision, "Mar 15, 2022" | "Mar 15, 2022" |

---

## Validation Rules

### Rule 1: At Diagnosis Link
```
IF type = 'at_diagnosis'
THEN linkedConditionId MUST exist
AND condition MUST have a diagnosis date
```

### Rule 2: After Diagnosis Link
```
IF type = 'after_diagnosis'
THEN linkedConditionId MUST exist
AND condition MUST have a diagnosis date
AND computedDate MUST be > condition.diagnosisDate
```

### Rule 3: Auto-Update Validation
```
WHEN condition.diagnosisDate changes
THEN recalculate all linked medication.computedDate values
AND validate after_diagnosis dates are still valid (> diagnosis date)
AND flag conflicts for user review
```

---

## Database Triggers/Hooks

### Trigger 1: On Condition Diagnosis Date Update
```sql
CREATE TRIGGER update_medication_dates_on_condition_change
AFTER UPDATE ON conditions
FOR EACH ROW
WHEN (OLD.diagnosis_date != NEW.diagnosis_date)
BEGIN
  -- Update at_diagnosis medications
  UPDATE medications
  SET
    prescribed_start_date.computedDate = NEW.diagnosis_date,
    prescribed_start_date.lastComputedAt = NOW()
  WHERE
    prescribed_start_date->>'linkedConditionId' = NEW.id
    AND prescribed_start_date->>'type' = 'at_diagnosis';

  -- Flag after_diagnosis medications for validation
  UPDATE medications
  SET
    prescribed_start_date.validationWarning = 'Review required: Condition diagnosis date changed'
  WHERE
    prescribed_start_date->>'linkedConditionId' = NEW.id
    AND prescribed_start_date->>'type' = 'after_diagnosis';
END;
```

---

## Testing Scenarios

### Test 1: At Diagnosis, Date Updates
```
Given:
  - Condition "Asthma" with diagnosis date "2020"
  - Medication "Fluticasone" with type "at_diagnosis" linked to Asthma

When: Condition diagnosis date is updated to "March 2020"

Then:
  - Medication computedDate updates to "2020-03-01"
  - Display changes from "(Since) Right when I was diagnosed" to "March 2020 (@_dx)"
```

### Test 2: After Diagnosis, Date Updates (Valid)
```
Given:
  - Condition "Asthma" with diagnosis date "March 2020"
  - Medication "Fluticasone" with type "after_diagnosis", date "January 2021"

When: Condition diagnosis date is updated to "February 2020"

Then:
  - Medication date remains "January 2021"
  - Validation passes (Jan 2021 > Feb 2020)
  - Display remains "January 2021 (after_dx)"
```

### Test 3: After Diagnosis, Date Updates (Conflict)
```
Given:
  - Condition "Asthma" with diagnosis date "March 2020"
  - Medication "Fluticasone" with type "after_diagnosis", date "January 2021"

When: Condition diagnosis date is updated to "February 2021"

Then:
  - Validation fails (Jan 2021 < Feb 2021)
  - System flags conflict
  - User must review and update medication date or change to "at_diagnosis"
```

---

## Implementation Checklist

- [ ] Database schema supports all three types (direct_date, at_diagnosis, after_diagnosis)
- [ ] Database stores referenceType (at_dx, after_dx, null)
- [ ] Computed date is cached and timestamped
- [ ] Trigger/hook updates medication dates when condition diagnosis date changes
- [ ] Display logic checks precision before showing formatted date
- [ ] Display logic adds (@_dx) or (after_dx) markers when applicable
- [ ] Validation prevents after_diagnosis dates from being before diagnosis date
- [ ] Conflict detection when condition date changes invalidate medication dates
- [ ] User can review and resolve conflicts

---

**Status**: ✅ Complete three-layer logic specification
**Purpose**: Clear documentation of presentation, storage, and display rules for medication start dates
