# Medication Start Date - Complete Examples Reference

**Related Logic Rule**: `Medication.PrescribedStartDate.Display`
**See Full Logic**: [MEDICATIONS_DATE_FIELD_LOGIC.md](MEDICATIONS_DATE_FIELD_LOGIC.md)
**See ALL Notation**: [ARMADA_LOGIC_LANGUAGE.md](ARMADA_LOGIC_LANGUAGE.md)
**Database Schema**: [DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md](DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md)

---

## Three Layers Explained

### Layer 1: Presentation (How Question is Asked)
**What user sees when selecting date**

### Layer 2: Storage (Database)
**How data is stored internally**

### Layer 3: Display (How Answer is Shown Back)
**What user sees after selection**

---

## Example 1: "Right when diagnosed" - Year Only Precision

### User Journey

**Step 1: User selects medication date option**
```
┌────────────────────────────────────────┐
│  Prescribed / Start day                │
│                                        │
│  ○ Year-Month-Date                     │
│  ● I've been on this medication        │  ← User selects
└────────────────────────────────────────┘
```

**Step 2: User selects timing**
```
┌────────────────────────────────────────┐
│  I've been on this medication...       │
│                                        │
│  ● (Since) Right when I was diagnosed  │  ← User selects
│  ○ (Later or added) After I was        │
│     diagnosed                          │
└────────────────────────────────────────┘
```

**Step 3: System links to condition**
- Medication: Fluticasone
- Linked condition: Asthma
- Asthma diagnosis date: "2020" (year only precision)

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "at_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "at_dx",
    "year": 2020,
    "month": null,
    "day": null,
    "precision": "year",
    "computedDate": "2020-01-01T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "(Since) Right when I was diagnosed",
  "prescribed_start_date_display_pr": "(Since) Right when I was diagnosed",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: (Since) Right when I was diagnosed
```

**Provider View**:
```
Prescribed / Start day: (Since) Right when I was diagnosed
```

**Why "same"**: Not enough precision to show formatted date, both views show context text.

---

## Example 2: "Right when diagnosed" - Month Precision

### User Journey

**Same selection as Example 1**, but:
- Linked condition: Asthma
- Asthma diagnosis date: "March 2020" (month precision)

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "at_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "at_dx",
    "year": 2020,
    "month": 3,
    "day": null,
    "precision": "month",
    "computedDate": "2020-03-01T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "March 2020 (@_dx)",
  "prescribed_start_date_display_pr": "March 2020 (@_dx)",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: March 2020 (@_dx)
```

**Provider View**:
```
Prescribed / Start day: March 2020 (@_dx)
```

**Key Point**: Now that we have month precision, we show the formatted date with `(@_dx)` marker instead of context text.

---

## Example 3: "Right when diagnosed" - Day Precision

### User Journey

**Same selection as Example 1**, but:
- Asthma diagnosis date: "March 15, 2020" (day precision)

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "at_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "at_dx",
    "year": 2020,
    "month": 3,
    "day": 15,
    "precision": "day",
    "computedDate": "2020-03-15T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "Mar 15, 2020 (@_dx)",
  "prescribed_start_date_display_pr": "Mar 15, 2020 (@_dx)",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: Mar 15, 2020 (@_dx)
```

**Provider View**:
```
Prescribed / Start day: Mar 15, 2020 (@_dx)
```

---

## Example 4: Auto-Update When Condition Date Changes

### Initial State

**Condition (Asthma)**:
- Diagnosis date: "2020" (year only)

**Medication (Fluticasone)**:
- Start date: "at_diagnosis"
- Display: "(Since) Right when I was diagnosed"

### User Updates Condition

User updates Asthma diagnosis date to "March 2020"

### Database Auto-Update Trigger

```sql
-- Trigger fires on Condition.diagnosis_date UPDATE
-- Finds all medications with type = 'at_diagnosis' linked to this condition
-- Updates medication computedDate and display columns
```

### After Auto-Update

**Medication Database**:
```json
{
  "prescribed_start_date_raw": {
    "type": "at_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "at_dx",
    "year": 2020,
    "month": 3,  // ← Auto-updated
    "day": null,
    "precision": "month",  // ← Auto-updated
    "computedDate": "2020-03-01T00:00:00Z"  // ← Auto-updated
  },
  "prescribed_start_date_display_pt": "March 2020 (@_dx)",  // ← Auto-updated
  "prescribed_start_date_display_pr": "March 2020 (@_dx)",  // ← Auto-updated
  "prescribed_start_date_display_active": "same"
}
```

**Display Changes From**:
```
(Since) Right when I was diagnosed
```

**To**:
```
March 2020 (@_dx)
```

---

## Example 5: "After diagnosed" - Year Only

### User Journey

**Step 1: User selects**
```
┌────────────────────────────────────────┐
│  I've been on this medication...       │
│                                        │
│  ○ (Since) Right when I was diagnosed  │
│  ● (Later or added) After I was        │  ← User selects
│     diagnosed                          │
└────────────────────────────────────────┘
```

**Step 2: User picks date using framework**
```
System shows: When did you start this medication?
User selects: "Over 5 years" → "2021"
```

**Context**:
- Linked condition: Asthma
- Asthma diagnosis: "2020" (year only)
- Medication started: "2021" (year only)

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "after_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "after_dx",
    "year": 2021,
    "month": null,
    "day": null,
    "precision": "year",
    "computedDate": "2021-01-01T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "(Later or added) After I was diagnosed",
  "prescribed_start_date_display_pr": "(Later or added) After I was diagnosed",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: (Later or added) After I was diagnosed
```

**Provider View**:
```
Prescribed / Start day: (Later or added) After I was diagnosed
```

**Why context text**: Year-only precision is not acceptable granularity, show context instead.

---

## Example 6: "After diagnosed" - Month Precision

### User Journey

**Same selection as Example 5**, but:
- User selects: "Within 1 year" → "6 months ago" → computes to "January 2021"

**Context**:
- Asthma diagnosis: "March 2020"
- Medication started: "January 2021"

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "after_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "after_dx",
    "year": 2021,
    "month": 1,
    "day": null,
    "precision": "month",
    "computedDate": "2021-01-01T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "January 2021 (after_dx)",
  "prescribed_start_date_display_pr": "January 2021 (after_dx)",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: January 2021 (after_dx)
```

**Provider View**:
```
Prescribed / Start day: January 2021 (after_dx)
```

**Key Point**: Month precision achieved, so formatted date shown with `(after_dx)` marker.

---

## Example 7: "After diagnosed" - Day Precision

### User Journey

User selects exact date: "January 20, 2021"

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "after_diagnosis",
    "linkedConditionId": "asthma_abc123",
    "referenceType": "after_dx",
    "year": 2021,
    "month": 1,
    "day": 20,
    "precision": "day",
    "computedDate": "2021-01-20T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "Jan 20, 2021 (after_dx)",
  "prescribed_start_date_display_pr": "Jan 20, 2021 (after_dx)",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: Jan 20, 2021 (after_dx)
```

**Provider View**:
```
Prescribed / Start day: Jan 20, 2021 (after_dx)
```

---

## Example 8: Direct Date (No Condition Link)

### User Journey

**Step 1: User selects**
```
┌────────────────────────────────────────┐
│  Prescribed / Start day                │
│                                        │
│  ● Year-Month-Date                     │  ← User selects
│  ○ I've been on this medication        │
│     (grayed out - no condition linked) │
└────────────────────────────────────────┘
```

**Step 2: User picks date**
```
User selects: "Within 1 year" → "3 months ago" → "March 2024"
```

### Database Storage

```json
{
  "prescribed_start_date_raw": {
    "type": "direct_date",
    "linkedConditionId": null,
    "referenceType": null,
    "year": 2024,
    "month": 3,
    "day": null,
    "precision": "month",
    "computedDate": "2024-03-01T00:00:00Z"
  },
  "prescribed_start_date_display_pt": "March 2024",
  "prescribed_start_date_display_pr": "March 2024",
  "prescribed_start_date_display_active": "same"
}
```

### Display to User

**Patient View**:
```
Prescribed / Start day: March 2024
```

**Provider View**:
```
Prescribed / Start day: March 2024
```

**Key Point**: No marker `(@_dx)` or `(after_dx)` because not linked to condition.

---

## Validation Examples

### Example 9: Validation Error - After Before

### User Journey

**Setup**:
- Asthma diagnosis: "March 2020"
- User tries to add medication with "After I was diagnosed" → "January 2020"

### System Response

```
❌ ERROR: Medication cannot start before diagnosis

Please check:
- Diagnosis date: March 2020
- Medication start: January 2020

January 2020 is BEFORE March 2020.
```

**Action**: User must either:
1. Change to "Right when diagnosed"
2. Pick a date after March 2020
3. Update condition diagnosis date

---

## Display Priority Examples

### Example 10: Precision Determines Display

| Precision | Raw Date | Display |
|---|---|---|
| year | 2020 | "(Since) Right when I was diagnosed" |
| month | March 2020 | "March 2020 (@_dx)" |
| day | Mar 15, 2020 | "Mar 15, 2020 (@_dx)" |

**Rule**: If precision is month or day, show formatted date. Otherwise, show context text.

---

## ALL Notation for This Logic

```
RULE: Medication.PrescribedStartDate.Display

FOR VIEW UI[Pt]:
  IF precision IN ["month", "day"]
    THEN SHOW FORMAT(computedDate, precision) + marker
    ELSE SHOW contextText

  WHERE:
    marker = LOOKUP[referenceType]:
      "at_dx" → " (@_dx)"
      "after_dx" → " (after_dx)"
      null → ""

    contextText = LOOKUP[type]:
      "at_diagnosis" → "(Since) Right when I was diagnosed"
      "after_diagnosis" → "(Later or added) After I was diagnosed"
      "direct_date" → FORMAT(computedDate, precision)

    FORMAT(date, "day") → "Mar 15, 2020"
    FORMAT(date, "month") → "March 2020"
    FORMAT(date, "year") → "2020"

FOR VIEW UI[Pr]:
  SAME AS UI[Pt]

FOR VIEW DB:
  STORE {
    type: ENUM("direct_date", "at_diagnosis", "after_diagnosis"),
    linkedConditionId: UUID | NULL,
    referenceType: ENUM("at_dx", "after_dx") | NULL,
    year: INT,
    month: INT | NULL,
    day: INT | NULL,
    precision: ENUM("year", "month", "day"),
    computedDate: TIMESTAMP
  }
```

---

## Auto-Update ALL Notation

```
RULE: Medication.PrescribedStartDate.AutoUpdate

ON @Condition.diagnosisDate.UPDATE
THEN:
  FIND @Medication[] WHERE
    prescribedStartDate_raw.linkedConditionId = @Condition.id
    AND prescribedStartDate_raw.type IN ["at_diagnosis", "after_diagnosis"]

  FOR EACH @Medication:
    IF prescribedStartDate_raw.type = "at_diagnosis"
      THEN:
        UPDATE prescribedStartDate_raw.year = @Condition.diagnosisDate.year
        UPDATE prescribedStartDate_raw.month = @Condition.diagnosisDate.month
        UPDATE prescribedStartDate_raw.day = @Condition.diagnosisDate.day
        UPDATE prescribedStartDate_raw.precision = @Condition.diagnosisDate.precision
        UPDATE prescribedStartDate_raw.computedDate = @Condition.diagnosisDate.computedDate
        UPDATE prescribedStartDate_display_pt = GENERATE_PATIENT_DISPLAY(prescribedStartDate_raw)
        UPDATE prescribedStartDate_display_pr = GENERATE_PROVIDER_DISPLAY(prescribedStartDate_raw)
        UPDATE prescribedStartDate_display_active = COMPUTE_ACTIVE_FLAG()
```

---

## Summary Table

| User Selection | Condition Precision | Display Result | Marker |
|---|---|---|---|
| Right when diagnosed | Year only | "(Since) Right when I was diagnosed" | None |
| Right when diagnosed | Month | "March 2020 (@_dx)" | @_dx |
| Right when diagnosed | Day | "Mar 15, 2020 (@_dx)" | @_dx |
| After diagnosed | Year only | "(Later or added) After I was diagnosed" | None |
| After diagnosed | Month | "January 2021 (after_dx)" | after_dx |
| After diagnosed | Day | "Jan 20, 2021 (after_dx)" | after_dx |
| Year-Month-Date | N/A | "March 2024" | None |

---

**Reference Documents**:
- Full Logic: [MEDICATIONS_DATE_FIELD_LOGIC.md](MEDICATIONS_DATE_FIELD_LOGIC.md)
- ALL Notation: [ARMADA_LOGIC_LANGUAGE.md](ARMADA_LOGIC_LANGUAGE.md)
- Database Schema: [DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md](DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md)
- Multi-Condition: [MEDICATIONS_MULTI_CONDITION_ASSIGNMENT.md](MEDICATIONS_MULTI_CONDITION_ASSIGNMENT.md)

---

**Status**: ✅ Complete examples with direct references to logic documentation
