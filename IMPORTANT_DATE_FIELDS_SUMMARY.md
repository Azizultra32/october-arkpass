# 🚨 CRITICAL: Date/Time Period Fields Summary

## ⚠️ UPDATED FRAMEWORK

**This is NOT a simple date picker!** The app uses an **intelligent, progressive disclosure system** with:
- ✅ Dropdown time period selection
- ✅ Voice input with LLM interpretation
- ✅ Multi-step year → month → date drilldown
- ✅ Certainty levels (optional)
- ✅ Age-based input ("I was 25 years old")

**See [DATE_TIME_SELECTION_FRAMEWORK.md](DATE_TIME_SELECTION_FRAMEWORK.md) for complete specification.**

---

## Framework Assignment Summary

| Condition Type | Subtype | Field Name | Framework Used | Dropdown Options |
|---|---|---|---|---|
| **Chronic** | - | Diagnosis Date | Framework 1 | Within 1 year, Within 5 years, Over 5 years, I was...years old |
| **Transient** | Recurrent | Last Occurrence | Framework 1 | Within 1 year, Within 5 years, Over 5 years, I was...years old |
| **Transient** | Resolved | Start Date | Framework 1 | Within 1 year, Within 5 years, Over 5 years, I was...years old |
| **Transient** | Resolved | End Date | Framework 2 | Within 1 month, Within 6 months, Within 2 years, More than 2 years |

**Framework 1**: Possible recent or many years ago (chronic/long-term/recurrent conditions)
**Framework 2**: More likely recent (resolved end dates only)

---

## Quick Reference

When the user expands the "Show more" section, **different date/time fields appear based on the condition type:**

### 1. Chronic Conditions
```
Fields when expanded:
✓ Details (text area, 90px)
✓ Diagnosis Date
  → Uses Framework 1: Possible recent or many years ago
  → Dropdown: Within 1 year, Within 5 years, Over 5 years, I was...years old
  → Voice input: [🎤 Tell us]
  → Certainty toggle (optional)
```

### 2. Transient - Recurrent Conditions
```
Fields when expanded:
✓ "When was the last time you had this?"
  → Uses Framework 1: Possible recent or many years ago
  → Dropdown: Within 1 year, Within 5 years, Over 5 years, I was...years old
  → Voice input: [🎤 Tell us]
  → Certainty toggle (optional)
✓ Details (text area, 90px)
```

### 3. Transient - Resolved Conditions
```
Fields when expanded (in this order):
✓ End Date
  → Uses Framework 2: More likely recent
  → Dropdown: Within 1 month, Within 6 months, Within 2 years, More than 2 years
  → Dropdown + voice input + certainty
✓ Details (text area, 90px)
✓ Start Date
  → Uses Framework 1: Possible recent or many years ago
  → Dropdown: Within 1 year, Within 5 years, Over 5 years, I was...years old
  → Dropdown + voice input + certainty

Validation: End Date must be >= Start Date
```

---

## Visual Layout Examples

### Chronic (Expanded)
```
┌────────────────────────────────┐
│ Name: Asthma                   │
│ ● Chronic  ○ Transient         │
│                                │
│ Details                        │
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │ (text area 90px height)    │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│ Diagnosis Date          [📅]  │
│                                │
│ Show less ↑                    │
└────────────────────────────────┘
```

### Transient-Recurrent (Expanded)
```
┌────────────────────────────────┐
│ Name: Migraine                 │
│ ○ Chronic  ● Transient         │
│ ● Recurrent  ○ Resolved        │
│                                │
│ When was the last time you had │
│ this?                     [⏱]  │
│ 1 week ago                     │
│                                │
│ Details                        │
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │ (text area 90px height)    │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│ Show less ↑                    │
└────────────────────────────────┘
```

### Transient-Resolved (Expanded)
```
┌────────────────────────────────┐
│ Name: Flu                      │
│ ○ Chronic  ● Transient         │
│ ○ Recurrent  ● Resolved        │
│                                │
│ End Date                [📅]  │
│                                │
│ Details                        │
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │ (text area 90px height)    │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│ Start Date              [📅]  │
│                                │
│ Show less ↑                    │
└────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Core Framework
- [ ] Create dropdown time period selector (Framework 1 & 2)
- [ ] Build multi-step year → month → date drilldown
- [ ] Implement "stop at any level" logic (year only, year+month, or full date)
- [ ] Create certainty toggle component (3-state + null)
- [ ] Add voice input button UI
- [ ] Conditional rendering logic:
  ```javascript
  if (type === 'Chronic' && expanded) {
    show: details, diagnosisDate
  }
  if (type === 'Transient' && subtype === 'Recurrent' && expanded) {
    show: lastOccurrence, details
  }
  if (type === 'Transient' && subtype === 'Resolved' && expanded) {
    show: endDate, details, startDate (in that order!)
  }
  ```
- [ ] Validation rules:
  - [ ] Diagnosis date cannot be in future
  - [ ] Last occurrence must be in past
  - [ ] Start date <= End date
  - [ ] All date fields are optional
### Phase 2: Voice + LLM
- [ ] Integrate speech-to-text API
- [ ] Create LLM prompt template for date interpretation
- [ ] Parse LLM JSON responses
- [ ] Pre-populate selections from voice input
- [ ] Allow manual correction after voice input

### Phase 3: Data Model
- [ ] Update data model to include:
  - [ ] `year?: number`
  - [ ] `month?: number` (1-12)
  - [ ] `day?: number` (1-31)
  - [ ] `relativeTime?: string` (e.g., "2 weeks ago")
  - [ ] `ageAtEvent?: number` (e.g., 25)
  - [ ] `precision: 'year' | 'month' | 'day' | 'relative' | 'age'`
  - [ ] `certainty: null | 'certain' | 'somewhat_certain' | 'uncertain'`
  - [ ] `computedDate?: Date` (backend calculates best estimate)
  - [ ] `displayText: string` (UI display)
  - [ ] `voiceTranscript?: string`
  - [ ] `llmInterpretation?: string`

---

## Related Documentation

- **Full specs**: [CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md](CONDITIONS_DATE_TIME_FIELDS_ADDENDUM.md)
- **Flow diagrams**: [CONDITIONS_FLOW_DIAGRAM.md](CONDITIONS_FLOW_DIAGRAM.md) (Flow 10)
- **Original screens**: [CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md)
- **OpenSpec**: [openspec/changes/add-conditions-management/](openspec/changes/add-conditions-management/)

---

**⚠️ DO NOT FORGET:** These date/time fields are **context-sensitive** and **critical** for the Conditions feature to work correctly!
