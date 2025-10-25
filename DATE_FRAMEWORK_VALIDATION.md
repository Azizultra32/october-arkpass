# Date/Time Framework Validation & Reference

## ✅ Correct Framework Assignments

### Framework 1: Possible Recent or Many Years Ago
**Used for chronic, recurrent, and resolved start dates**

| Condition Type | Subtype | Field | Dropdown Options |
|---|---|---|---|
| Chronic | - | Diagnosis Date | Within 1 year, Within 5 years, Over 5 years, I was...years old |
| Transient | Recurrent | Last Occurrence ("When was the last time?") | Within 1 year, Within 5 years, Over 5 years, I was...years old |
| Transient | Resolved | Start Date | Within 1 year, Within 5 years, Over 5 years, I was...years old |

**Progressive Drilldown Paths:**

1. **Within 1 year** → This month, Last month, 2-11 months ago, About 1 year ago, Exact date picker
2. **Within 5 years** → Year picker → Quarters (Q1-Q4) or Specific month → Exact date picker
3. **Over 5 years** → Year → [STOP or Go to month] → Month → [STOP or Go to date] → Date
4. **I was...years old** → Age input → Calculate year → [STOP or Go to month] → Month → Date

---

### Framework 2: More Likely Recent
**Used ONLY for resolved end dates**

| Condition Type | Subtype | Field | Dropdown Options |
|---|---|---|---|
| Transient | Resolved | End Date | Within 1 month, Within 6 months, Within 2 years, More than 2 years |

**Progressive Drilldown Paths:**

1. **Within 1 month** → This week, Last week, 2-3 weeks ago, About 1 month ago, Exact date picker
2. **Within 6 months** → This month, Last month, 2-5 months ago, About 6 months ago, Exact date picker
3. **Within 2 years** → Year picker → Quarters (Q1-Q4) or Specific month → Exact date picker
4. **More than 2 years** → Year → [STOP or Go to month] → Month → [STOP or Go to date] → Date

---

## Implementation Logic

```javascript
function getDateFramework(conditionType, subtype, fieldName) {
  // Framework 1: Chronic/recurrent/resolved start dates
  if (
    (conditionType === 'Chronic' && fieldName === 'diagnosisDate') ||
    (conditionType === 'Transient' && subtype === 'Recurrent' && fieldName === 'lastOccurrence') ||
    (conditionType === 'Transient' && subtype === 'Resolved' && fieldName === 'startDate')
  ) {
    return {
      framework: 'FRAMEWORK_1',
      dropdownOptions: [
        { value: 'within_1_year', label: 'Within 1 year' },
        { value: 'within_5_years', label: 'Within 5 years' },
        { value: 'over_5_years', label: 'Over 5 years' },
        { value: 'age_based', label: 'I was ... years old' }
      ]
    };
  }

  // Framework 2: Resolved end dates only
  if (conditionType === 'Transient' && subtype === 'Resolved' && fieldName === 'endDate') {
    return {
      framework: 'FRAMEWORK_2',
      dropdownOptions: [
        { value: 'within_1_month', label: 'Within 1 month' },
        { value: 'within_6_months', label: 'Within 6 months' },
        { value: 'within_2_years', label: 'Within 2 years' },
        { value: 'more_than_2_years', label: 'More than 2 years' }
      ]
    };
  }

  throw new Error(`No framework defined for: ${conditionType}/${subtype}/${fieldName}`);
}
```

---

## Screen-by-Screen Breakdown

### Chronic Condition (Expanded View)
```
┌────────────────────────────────┐
│ Name: Asthma                   │
│ ● Chronic  ○ Transient         │
│                                │
│ Details [text area 90px]       │
│                                │
│ Diagnosis Date          [📅]  │
│ → Framework 1                  │
│ → Within 1yr/5yr/Over 5yr/Age  │
│                                │
│ Show less ↑                    │
└────────────────────────────────┘
```

### Transient-Recurrent (Expanded View)
```
┌────────────────────────────────┐
│ Name: Migraine                 │
│ ○ Chronic  ● Transient         │
│ ● Recurrent  ○ Resolved        │
│                                │
│ When was the last time you had │
│ this?                     [⏱]  │
│ → Framework 1                  │
│ → Within 1yr/5yr/Over 5yr/Age  │
│                                │
│ Details [text area 90px]       │
│                                │
│ Show less ↑                    │
└────────────────────────────────┘
```

### Transient-Resolved (Expanded View)
```
┌────────────────────────────────┐
│ Name: Flu                      │
│ ○ Chronic  ● Transient         │
│ ○ Recurrent  ● Resolved        │
│                                │
│ End Date                [📅]  │
│ → Framework 2                  │
│ → Within 1mo/6mo/2yr/More 2yr  │
│                                │
│ Details [text area 90px]       │
│                                │
│ Start Date              [📅]  │
│ → Framework 1                  │
│ → Within 1yr/5yr/Over 5yr/Age  │
│                                │
│ Show less ↑                    │
└────────────────────────────────┘
```

---

## Universal Features (Both Frameworks)

### Voice Input (All date fields)
```
[🎤 Tell us] button
→ Speech-to-text
→ LLM interpretation
→ Auto-populate selections
→ User can edit/confirm
```

### Certainty Toggle (Optional)
```
How certain are you?
○ Certain
○ Somewhat certain
○ Uncertain

Default: null (user can skip)
```

### Progressive Disclosure
```
User can stop at any level:
✓ Year only → DONE
✓ Year + Month → DONE
✓ Year + Month + Day → DONE
✓ Relative time ("2 weeks ago") → DONE
✓ Age-based ("When I was 25") → DONE
```

---

## Data Model

```typescript
interface DateTimeSelection {
  // Core data
  year?: number;              // e.g., 2020
  month?: number;             // 1-12
  day?: number;               // 1-31

  // Alternative formats
  relativeTime?: string;      // "2 weeks ago", "About Jan 2020"
  ageAtEvent?: number;        // 25 (when using "I was ... years old")

  // Metadata
  precision: 'year' | 'month' | 'day' | 'relative' | 'age';
  certainty: null | 'certain' | 'somewhat_certain' | 'uncertain';

  // Computed
  computedDate?: Date;        // Backend calculates best estimate
  displayText: string;        // UI display: "About Jan 2020", "2 weeks ago"

  // Voice input (if used)
  voiceTranscript?: string;   // Original voice input
  llmInterpretation?: string; // How LLM parsed it
}
```

---

## Validation Rules

### All Date Fields
- Cannot be in the future
- Optional (not required to save condition)
- Certainty level is optional

### Transient-Resolved Specific
- `endDate` must be >= `startDate`
- Both dates optional, but if both provided, must validate order

---

## Testing Checklist

### Framework 1 (Chronic/Recurrent/Resolved Start)
- [ ] Within 1 year → This month
- [ ] Within 1 year → 6 months ago
- [ ] Within 1 year → Exact date picker
- [ ] Within 5 years → Year 2023 → Q2 2023
- [ ] Within 5 years → Year 2023 → Specific month → Apr 2023
- [ ] Within 5 years → Exact date picker
- [ ] Over 5 years → Year 2015 → STOP (year only)
- [ ] Over 5 years → Year 2015 → Month Jun → STOP (year+month)
- [ ] Over 5 years → Year 2015 → Month Jun → Date 15
- [ ] I was 25 years old → Calculate year → STOP
- [ ] I was 25 years old → Calculate year → Month → Date
- [ ] Voice input: "About 3 months ago"
- [ ] Voice input: "January 2020"
- [ ] Voice input: "When I was 30"
- [ ] Skip certainty → Verify null saved
- [ ] Select "Certain" → Verify saved
- [ ] Select "Uncertain" → Verify saved

### Framework 2 (Resolved End Only)
- [ ] Within 1 month → This week
- [ ] Within 1 month → 2 weeks ago
- [ ] Within 1 month → Exact date picker
- [ ] Within 6 months → 3 months ago
- [ ] Within 6 months → Exact date picker
- [ ] Within 2 years → Year 2024 → Q1 2024
- [ ] Within 2 years → Exact date picker
- [ ] More than 2 years → Year 2020 → STOP
- [ ] More than 2 years → Year 2020 → Month → Date
- [ ] Voice input: "Two days ago"
- [ ] Voice input: "Last month"

### Cross-Framework (Resolved Conditions)
- [ ] Set Start Date (Framework 1) = Jan 2020
- [ ] Set End Date (Framework 2) = Mar 2020
- [ ] Verify validation passes (End >= Start)
- [ ] Try to set End Date = Dec 2019
- [ ] Verify validation error (End < Start)

---

## Related Documentation

- **[DATE_TIME_SELECTION_FRAMEWORK.md](DATE_TIME_SELECTION_FRAMEWORK.md)** - Complete specification with all paths
- **[IMPORTANT_DATE_FIELDS_SUMMARY.md](IMPORTANT_DATE_FIELDS_SUMMARY.md)** - Quick reference and implementation checklist
- **[CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md](CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md)** - Technical addendum
- **[CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md)** - Figma design specifications
- **[CONDITIONS_FLOW_DIAGRAM.md](CONDITIONS_FLOW_DIAGRAM.md)** - Flow diagrams

---

**Last Updated**: 2025-10-24
**Status**: ✅ Framework assignments corrected and validated
