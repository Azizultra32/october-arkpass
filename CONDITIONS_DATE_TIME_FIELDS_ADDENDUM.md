# Conditions Management - Date/Time Period Fields (Critical Addendum)

## Overview
When editing conditions with the **expanded view**, different condition types require different date/time period fields. These fields are crucial for tracking the timeline of medical conditions.

---

## Date Field Requirements by Condition Type

### 1. Chronic Conditions (Expanded View)

**Fields:**
- **Diagnosis Date** (calendar picker)
  - Label: "Diagnosis Date"
  - Icon: Calendar icon (24px) on the right
  - Input Type: Date picker
  - Height: 58px
  - Border: 1px solid #CCCCCC
  - When clicked: Opens native date picker

**Example:**
```
┌────────────────────────────────────────┐
│ Diagnosis Date              [📅]      │
└────────────────────────────────────────┘
```

---

### 2. Transient - Recurrent Conditions (Expanded View)

**Fields:**
- **When was the last time you had this?** (relative time picker)
  - Label: "When was the last time you had this?"
  - Value: "1 week ago" (example)
  - Icon: Clock/time icon (24px) on the right
  - Input Type: Relative time period picker
  - Height: 58px
  - Border: 1px solid #CCCCCC
  - Displays both label (14px, #666666) and value (16px Bold, Black)

**Example:**
```
┌────────────────────────────────────────┐
│ When was the last time you had this?  │
│ 1 week ago                        [⏱] │
└────────────────────────────────────────┘
```

**Time Period Options (likely):**
- Today
- Yesterday
- 2 days ago
- 3 days ago
- 1 week ago
- 2 weeks ago
- 1 month ago
- 2 months ago
- 3 months ago
- 6 months ago
- 1 year ago
- Custom date

---

### 3. Transient - Resolved Conditions (Expanded View)

**Fields:**
- **End Date** (calendar picker)
  - Label: "End Date"
  - Icon: Calendar icon (24px) on the right
  - Input Type: Date picker
  - Height: 58px
  - Border: 1px solid #CCCCCC

- **Start Date** (calendar picker)
  - Label: "Start Date"
  - Icon: Calendar icon (24px) on the right
  - Input Type: Date picker
  - Height: 58px
  - Border: 1px solid #CCCCCC

**Example:**
```
┌────────────────────────────────────────┐
│ End Date                        [📅]  │
└────────────────────────────────────────┘

(Details field in between - 90px height)

┌────────────────────────────────────────┐
│ Start Date                      [📅]  │
└────────────────────────────────────────┘
```

**Field Order (top to bottom):**
1. Name / Diagnosis
2. Type Radio (Chronic / Transient)
3. Subtype Radio (Recurrent / Resolved)
4. **End Date** ← First date field
5. Details (90px text area)
6. **Start Date** ← Second date field
7. Show less
8. Medications section
9. Documents section

---

## Complete Field Layouts by Type

### Chronic (Expanded)
```
Name / Diagnosis (Required)
[ Asthma                                    ]

● Chronic    ○ Transient

Details
[                                            ]
[                                            ]
[                                            ]

Diagnosis Date                         [📅]

Show less ↑
──────────────────────────────────────────
MEDICATIONS
...
```

### Transient - Recurrent (Expanded)
```
Name / Diagnosis (Required)
[ Common Cold                               ]

○ Chronic    ● Transient

● Recurrent  ○ Resolved

When was the last time you had this?  [⏱]
1 week ago

Details
[                                            ]
[                                            ]
[                                            ]

Show less ↑
──────────────────────────────────────────
MEDICATIONS
...
```

### Transient - Resolved (Expanded)
```
Name / Diagnosis (Required)
[ Flu                                       ]

○ Chronic    ● Transient

○ Recurrent  ● Resolved

End Date                               [📅]

Details
[                                            ]
[                                            ]
[                                            ]

Start Date                             [📅]

Show less ↑
──────────────────────────────────────────
MEDICATIONS
...
```

---

## Date Picker Interaction Flow

### Calendar Date Picker (Diagnosis Date, Start Date, End Date)

```
User clicks field with calendar icon
         ↓
┌─────────────────────────────────────┐
│   Native Date Picker Modal          │
│                                     │
│   ◀  October 2025  ▶                │
│                                     │
│  S  M  T  W  T  F  S                │
│        1  2  3  4  5                │
│  6  7  8  9 10 11 12                │
│ 13 14 15 16 17 18 19                │
│ 20 21 22 23 [24] 25 26             │
│ 27 28 29 30 31                      │
│                                     │
│      [Cancel]  [Done]               │
└─────────────────────────────────────┘
         ↓
   User selects date
         ↓
   Modal closes
         ↓
┌─────────────────────────────────────┐
│ Diagnosis Date              [📅]   │
│ Oct 24, 2025                        │
└─────────────────────────────────────┘
```

### Relative Time Period Picker (When was the last time)

```
User clicks field with clock icon
         ↓
┌─────────────────────────────────────┐
│   Time Period Picker                │
│                                     │
│   ○ Today                           │
│   ○ Yesterday                       │
│   ○ 2 days ago                      │
│   ○ 3 days ago                      │
│   ● 1 week ago                      │
│   ○ 2 weeks ago                     │
│   ○ 1 month ago                     │
│   ○ 2 months ago                    │
│   ○ 3 months ago                    │
│   ○ 6 months ago                    │
│   ○ 1 year ago                      │
│   ○ Custom date...                  │
│                                     │
│      [Cancel]  [Done]               │
└─────────────────────────────────────┘
         ↓
   User selects period
         ↓
   Modal closes
         ↓
┌─────────────────────────────────────┐
│ When was the last time you had this?│
│ 1 week ago                     [⏱] │
└─────────────────────────────────────┘
```

---

## Field Specifications

### Calendar Input Field
- **Height**: 58px
- **Padding**: 17px vertical, 16px horizontal
- **Border**: 1px solid #CCCCCC
- **Border Radius**: 4px
- **Background**: White (#FFFFFF)
- **Label**: Medium, 14px, #666666
- **Value** (when selected): Bold, 16px, Black, line-height 24px
- **Icon**: 24px calendar icon, right-aligned
- **Gap between label and icon**: 8px

### Relative Time Input Field
- **Height**: 58px
- **Padding**: 8px vertical, 16px horizontal
- **Border**: 1px solid #CCCCCC
- **Border Radius**: 4px
- **Background**: White (#FFFFFF)
- **Label**: Medium, 14px, #666666
- **Value**: Bold, 16px, Black, line-height 24px
- **Icon**: 24px clock icon, right-aligned, vertically centered
- **Layout**: Flexbox with space-between

### Details Text Area
- **Height**: 90px (multi-line)
- **Padding**: 20px vertical, 16px horizontal
- **Border**: 1px solid #CCCCCC
- **Border Radius**: 4px
- **Background**: White (#FFFFFF)
- **Placeholder**: "Details" (Medium, 16px, #666666)

---

## Validation Rules

### Chronic Conditions
- Diagnosis Date: Optional
- If provided, cannot be in the future

### Transient - Recurrent
- "When was the last time": Optional
- If provided, must be in the past
- Reasonable range: Today → 5 years ago

### Transient - Resolved
- Start Date: Optional
- End Date: Optional
- If both provided: End Date must be >= Start Date
- Both dates cannot be in the future
- Typical range: End Date - Start Date = 1 day to 6 months

---

## Data Model Impact

Update Condition entity to include:

```typescript
interface Condition {
  id: string;
  userId: string;
  name: string;
  type: 'Chronic' | 'Transient';
  subtype?: 'Recurrent' | 'Resolved';

  // Date fields (conditional based on type/subtype)
  diagnosisDate?: Date;        // For Chronic
  lastOccurrence?: string;      // For Transient-Recurrent (e.g., "1 week ago")
  lastOccurrenceDate?: Date;    // Computed from lastOccurrence
  startDate?: Date;            // For Transient-Resolved
  endDate?: Date;              // For Transient-Resolved

  details?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Updated Flow Diagram Snippet

```
Expanded View Selection
         ↓
    ┌────┴────┐
    ↓         ↓         ↓
CHRONIC   TRANSIENT  TRANSIENT
          Recurrent  Resolved
    ↓         ↓         ↓
┌────────┐ ┌────────┐ ┌────────┐
│Details │ │When was│ │End Date│
│        │ │last    │ │        │
│Diagnosis│ │time?  │ │Details │
│Date 📅│ │  ⏱    │ │        │
│        │ │Details │ │Start   │
│        │ │        │ │Date 📅│
└────────┘ └────────┘ └────────┘
```

---

## Implementation Notes

1. **Icon Assets Needed:**
   - Calendar icon (24px SVG)
   - Clock/timer icon (24px SVG)

2. **Date Pickers:**
   - Use native HTML5 `<input type="date">` for calendar pickers
   - Create custom relative time picker component for "last time"
   - Ensure mobile-friendly date selection (large touch targets)

3. **Field Visibility Logic:**
   ```javascript
   if (type === 'Chronic' && expanded) {
     show diagnosisDate field
   }

   if (type === 'Transient' && subtype === 'Recurrent' && expanded) {
     show lastOccurrence field (relative time)
   }

   if (type === 'Transient' && subtype === 'Resolved' && expanded) {
     show endDate field
     show details field
     show startDate field (in that order)
   }
   ```

4. **Date Format:**
   - Display: "Oct 24, 2025" or "10/24/2025" (locale-aware)
   - Storage: ISO 8601 (YYYY-MM-DD)
   - Relative time: Store both human-readable ("1 week ago") and computed date

---

## Testing Scenarios

1. **Chronic with diagnosis date:**
   - User enters "Asthma", selects Chronic, expands, sets diagnosis date to "Jan 15, 2020"
   - Verify date displays correctly on view screen

2. **Transient-Recurrent with last occurrence:**
   - User enters "Migraine", selects Transient-Recurrent, expands, sets "2 weeks ago"
   - Verify relative time displays correctly
   - Verify computed date is stored in database

3. **Transient-Resolved with date range:**
   - User enters "Flu", selects Transient-Resolved, expands
   - Sets End Date: "Oct 10, 2025"
   - Sets Start Date: "Oct 1, 2025"
   - Verify both dates display
   - Verify validation: End >= Start

4. **Date field validation:**
   - Try to set diagnosis date in the future → Error
   - Try to set End Date before Start Date → Error
   - Verify optional fields can be left empty

---

This addendum is **critical** for accurate implementation. The date/time period fields are context-sensitive based on condition type and subtype selection.
