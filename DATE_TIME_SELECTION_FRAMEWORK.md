# Date/Time Selection Framework - Complete Specification

## Overview

The app uses an **intelligent, context-aware date selection system** with two distinct frameworks based on likelihood of recent occurrence, plus voice input with LLM interpretation.

---

## Framework 1: Possible Recent or Many Years Ago (Chronic & Recurrent)

**Use for:**
- Chronic conditions ("Diagnosis Date")
- Transient-Recurrent ("When was the last time?")
- Transient-Resolved ("Start Date")

### Selection Flow

```
User taps date field
         ↓
┌──────────────────────────────────────────┐
│  When were you diagnosed?                │
│                                          │
│  [🎤 Tell us] ← Voice input + LLM       │
│                                          │
│  ▼ DROPDOWN: Time Period                │
│    ○ Within 1 year                       │
│    ○ Within 5 years                      │
│    ○ Over 5 years                        │
│    ○ I was ... years old                 │
└──────────────────────────────────────────┘
```

### Selection Paths

#### Path 1: Within 1 Year
```
User selects "Within 1 year"
         ↓
┌──────────────────────────────────────────┐
│  Pick week or exact date                 │
│                                          │
│  ○ This month                            │
│  ○ Last month                            │
│  ○ 2 months ago                          │
│  ...                                     │
│  ○ 11 months ago                         │
│  ○ About 1 year ago                      │
│  ─────────────────────                   │
│  📅 Exact date picker                    │
└──────────────────────────────────────────┘
         ↓
   User picks option
         ↓
   Certainty toggle
```

#### Path 2: Within 5 Years
```
User selects "Within 5 years"
         ↓
┌──────────────────────────────────────────┐
│  Pick approximate time or exact date     │
│                                          │
│  YEAR PICKER                             │
│  ◀ 2023 ▶                                │
│                                          │
│  ○ About Q1 2023 (Jan-Mar)               │
│  ○ About Q2 2023 (Apr-Jun)               │
│  ○ About Q3 2023 (Jul-Sep)               │
│  ○ About Q4 2023 (Oct-Dec)               │
│  ─────────────────────                   │
│  ○ Specific month...                     │
│  📅 Exact date picker                    │
└──────────────────────────────────────────┘
         ↓
   User picks option
         ↓
   Certainty toggle
```

#### Path 3: Over 5 Years
```
User selects "Over 5 years"
         ↓
┌──────────────────────────────────────────┐
│  Step 1: Pick year                       │
│                                          │
│  ◀ 2020 ▶                                │
│                                          │
│  [Done] or [Go to month ▼]              │
└──────────────────────────────────────────┘
         ↓ (if user clicks Done)
   Year only saved
   Certainty toggle
         ↓
       DONE

         ↓ (if user clicks "Go to month")
┌──────────────────────────────────────────┐
│  Step 2: Pick month (optional)           │
│                                          │
│  Year: 2020                              │
│                                          │
│  ○ About Jan 2020                        │
│  ○ About Feb 2020                        │
│  ...                                     │
│  ○ About Dec 2020                        │
│                                          │
│  [Done] or [Go to exact date ▼]         │
└──────────────────────────────────────────┘
         ↓ (if user clicks Done)
   Year + Month saved
   Certainty toggle
         ↓
       DONE

         ↓ (if user clicks "Go to exact date")
┌──────────────────────────────────────────┐
│  Step 3: Pick exact date (optional)      │
│                                          │
│  📅 Calendar: December 2020              │
│                                          │
│  [Done]                                  │
└──────────────────────────────────────────┘
         ↓
   Year + Month + Day saved
   Certainty toggle
         ↓
       DONE
```

### Certainty Toggle (All Paths)

```
After any selection:

┌──────────────────────────────────────────┐
│  Selected: About Jan 2020                │
│                                          │
│  How certain are you?                    │
│                                          │
│  ○ Certain                               │
│  ● Somewhat certain                      │
│  ○ Uncertain                             │
│                                          │
│  [Confirm]                               │
└──────────────────────────────────────────┘

States:
• null (default, no selection yet)
• Certain (high confidence)
• Somewhat certain (medium confidence)
• Uncertain (low confidence)

Note: Certainty is NOT required to be complete.
User can skip and go straight to [Confirm].
```

### Voice Input Flow

```
User taps [🎤 Tell us] button
         ↓
┌──────────────────────────────────────────┐
│  🎤 Recording...                         │
│                                          │
│  "I had a migraine about two weeks ago"  │
│                                          │
│  [Stop] [Cancel]                         │
└──────────────────────────────────────────┘
         ↓
   Send to LLM
         ↓
   LLM interprets:
   - Time period: "Within 1 month"
   - Specific: "2 weeks ago"
   - Certainty: "Somewhat certain" (inferred)
         ↓
┌──────────────────────────────────────────┐
│  Auto-selected:                          │
│  Within 1 month → 2 weeks ago            │
│                                          │
│  How certain are you?                    │
│  ● Somewhat certain                      │
│                                          │
│  [Confirm] [Edit]                        │
└──────────────────────────────────────────┘
```

---

## Framework 2: More Likely Recent (Resolved End Dates)

**Use for:** Transient-Resolved ("End Date")

### Selection Flow

```
User taps date field
         ↓
┌──────────────────────────────────────────┐
│  When was the last time you had this?    │
│                                          │
│  [🎤 Tell us] ← Voice input + LLM       │
│                                          │
│  ▼ DROPDOWN: Time Period                │
│    ○ Within 1 month                      │
│    ○ Within 6 months                     │
│    ○ Within 2 years                      │
│    ○ More than 2 years                   │
└──────────────────────────────────────────┘
```

### Selection Paths

#### Path 1: Within 1 Month
```
User selects "Within 1 month"
         ↓
┌──────────────────────────────────────────┐
│  Pick week or exact date                 │
│                                          │
│  ○ This week                             │
│  ○ Last week                             │
│  ○ 2 weeks ago                           │
│  ○ 3 weeks ago                           │
│  ○ About 1 month ago                     │
│  ─────────────────────                   │
│  📅 Exact date picker                    │
└──────────────────────────────────────────┘
         ↓
   User picks option
         ↓
   Certainty toggle
```

#### Path 2: Within 6 Months
```
User selects "Within 6 months"
         ↓
┌──────────────────────────────────────────┐
│  Pick month or exact date                │
│                                          │
│  ○ This month                            │
│  ○ Last month                            │
│  ○ 2 months ago                          │
│  ○ 3 months ago                          │
│  ○ 4 months ago                          │
│  ○ 5 months ago                          │
│  ○ About 6 months ago                    │
│  ─────────────────────                   │
│  📅 Exact date picker                    │
└──────────────────────────────────────────┘
         ↓
   User picks option
         ↓
   Certainty toggle
```

#### Path 3: Within 2 Years
```
User selects "Within 2 years"
         ↓
┌──────────────────────────────────────────┐
│  Pick approximate time or exact date     │
│                                          │
│  YEAR PICKER                             │
│  ◀ 2024 ▶                                │
│                                          │
│  ○ About Q1 2024 (Jan-Mar)               │
│  ○ About Q2 2024 (Apr-Jun)               │
│  ○ About Q3 2024 (Jul-Sep)               │
│  ○ About Q4 2024 (Oct-Dec)               │
│  ─────────────────────                   │
│  ○ Specific month...                     │
│  📅 Exact date picker                    │
└──────────────────────────────────────────┘
         ↓
   User picks option
         ↓
   Certainty toggle
```

#### Path 4: More Than 2 Years
```
User selects "More than 2 years"
         ↓
Same multi-step flow as Framework 1, Path 3:

Step 1: Pick year
         ↓ (optional)
Step 2: Pick month
         ↓ (optional)
Step 3: Pick exact date

User can stop at any step (year, month, or date)
         ↓
   Certainty toggle
```

#### Path 4: I Was ... Years Old
```
User selects "I was ... years old"
         ↓
┌──────────────────────────────────────────┐
│  How old were you?                       │
│                                          │
│  ┌────────────────────┐                  │
│  │ Age: [    ]        │                  │
│  └────────────────────┘                  │
│                                          │
│  (We'll calculate the approximate year)  │
│                                          │
│  [Continue]                              │
└──────────────────────────────────────────┘
         ↓
   User enters age (e.g., "25")
         ↓
   System calculates:
   - Current year: 2025
   - User's current age: 30 (from profile)
   - Age at diagnosis: 25
   - Years ago: 30 - 25 = 5
   - Approximate year: 2025 - 5 = 2020
         ↓
┌──────────────────────────────────────────┐
│  Calculated: About 2020                  │
│  (When you were 25 years old)            │
│                                          │
│  [Go to month ▼] or [Done]              │
└──────────────────────────────────────────┘
         ↓ (optional refinement)
   User can drill down to month/date
         ↓
   Certainty toggle
```

---

## Completion Rules

### What Counts as Complete?

✅ **COMPLETE:**
- Year only (e.g., "2020")
- Year + Month (e.g., "Jan 2020")
- Year + Month + Day (e.g., "Jan 15, 2020")
- Relative time (e.g., "2 weeks ago")
- Age-based (e.g., "When I was 25")
- Certainty level is OPTIONAL

❌ **INCOMPLETE:**
- No selection made
- Dropdown opened but nothing chosen

### Certainty is Optional

**Important:** Users do NOT need to select a certainty level for the entry to be complete. The certainty toggle has three states:
- null (default, user skipped)
- Certain
- Somewhat certain
- Uncertain

---

## Data Model

```typescript
interface DateTimeSelection {
  // Core data
  year?: number;              // e.g., 2020
  month?: number;             // 1-12
  day?: number;               // 1-31

  // Alternative formats
  relativeTime?: string;      // e.g., "2 weeks ago", "About Jan 2020"
  ageAtEvent?: number;        // e.g., 25 (when using "I was ... years old")

  // Metadata
  precision: 'year' | 'month' | 'day' | 'relative' | 'age';
  certainty: null | 'certain' | 'somewhat_certain' | 'uncertain';

  // Computed (for backend)
  computedDate?: Date;        // Best estimate
  displayText: string;        // What to show user: "About Jan 2020", "2 weeks ago"

  // Voice input (if used)
  voiceTranscript?: string;   // Original voice input
  llmInterpretation?: string; // How LLM parsed it
}
```

---

## UI Component Specifications

### Dropdown Component
```
Height: 58px (collapsed)
Expands to: Full screen modal
Font: Medium, 16px, #666666 (label), Bold 16px #000000 (selected)
Border: 1px solid #CCCCCC
Icon: Chevron down (24px)
```

### Voice Input Button
```
[🎤 Tell us]
Height: 58px
Background: #EEEEEE
Border: 1px solid #666666
Text: ExtraBold, 16px, #000000
Icon: Microphone (24px)
```

### Year Picker (Stepper)
```
◀ 2024 ▶
Font: Bold, 24px, #000000
Arrow buttons: 32px touch targets
Swipe gesture: Left/right to change year
```

### Certainty Toggle
```
Radio buttons (3 options)
○ Certain
○ Somewhat certain
○ Uncertain

Default: No selection (null)
User can skip this step
```

---

## Framework Selection Logic

```javascript
function getDateFramework(conditionType, subtype, fieldName) {
  // Framework 1: Possible recent or many years ago (chronic/long-term/recurrent)
  if (
    (conditionType === 'Chronic' && fieldName === 'diagnosisDate') ||
    (conditionType === 'Transient' && subtype === 'Recurrent' && fieldName === 'lastOccurrence') ||
    (conditionType === 'Transient' && subtype === 'Resolved' && fieldName === 'startDate')
  ) {
    return 'FRAMEWORK_1_LONG_TERM';
  }

  // Framework 2: More likely recent (resolved end dates)
  if (
    (conditionType === 'Transient' && subtype === 'Resolved' && fieldName === 'endDate')
  ) {
    return 'FRAMEWORK_2_RECENT';
  }
}
```

---

## Voice Input + LLM Integration

### Example Prompts & Interpretations

**Framework 1 (Recent):**
```
Input: "I had a migraine about two weeks ago"
LLM Output:
{
  "timeframe": "within_1_month",
  "selection": "2_weeks_ago",
  "certainty": "somewhat_certain",
  "relativeTime": "2 weeks ago"
}

Input: "Maybe three months ago, I'm not sure"
LLM Output:
{
  "timeframe": "within_6_months",
  "selection": "about_3_months_ago",
  "certainty": "uncertain",
  "relativeTime": "About 3 months ago"
}
```

**Framework 2 (Long-term):**
```
Input: "I was diagnosed in 2018, I think January"
LLM Output:
{
  "timeframe": "within_5_years",
  "year": 2018,
  "month": 1,
  "certainty": "somewhat_certain",
  "displayText": "About Jan 2018"
}

Input: "When I was 25 years old"
LLM Output:
{
  "timeframe": "age_based",
  "ageAtEvent": 25,
  "certainty": null,
  "displayText": "When you were 25"
}
```

### LLM Prompt Template

```
You are a medical date interpreter. Parse the user's voice input about when a medical event occurred.

User said: "{transcript}"

Context:
- Condition type: {conditionType}
- Field: {fieldName}
- User's current age: {currentAge}
- Today's date: {currentDate}

Extract:
1. timeframe (within_1_month, within_6_months, within_2_years, over_2_years, OR within_1_year, within_5_years, over_5_years, age_based)
2. Specific selection (e.g., "2_weeks_ago", "about_jan_2020", year/month/day numbers)
3. Certainty level (certain, somewhat_certain, uncertain, or null if not mentioned)
4. Display text (natural language: "2 weeks ago", "About Jan 2020")

Return JSON.
```

---

## Implementation Notes

### Phase 1: Framework Without Voice
1. Implement dropdown with time period options
2. Build multi-step year/month/date drilldown
3. Add certainty toggle
4. Test all selection paths
5. Store selections in database

### Phase 2: Voice + LLM Integration
1. Add microphone button
2. Integrate speech-to-text
3. Connect to LLM API
4. Parse LLM responses
5. Pre-populate selections from voice
6. Allow manual correction

### Phase 3: Polish
1. Smooth animations
2. Haptic feedback
3. Accessibility (VoiceOver)
4. Error handling
5. Offline mode considerations

---

## Testing Scenarios

### Framework 1 Tests
- [ ] Select "Within 1 month" → "2 weeks ago" → Certain
- [ ] Select "Within 6 months" → "About 3 months ago" → Somewhat certain
- [ ] Select "Within 2 years" → Pick year 2024 → Pick "About Mar 2024" → Uncertain
- [ ] Select "More than 2 years" → Pick year 2020 → STOP (year only)
- [ ] Select "More than 2 years" → Pick year 2020 → Month → STOP (year + month)
- [ ] Select "More than 2 years" → Pick year 2020 → Month → Exact date
- [ ] Voice input: "Two days ago" → Verify auto-selection
- [ ] Skip certainty toggle → Verify still complete

### Framework 2 Tests
- [ ] Select "Within 1 year" → "3 months ago" → No certainty
- [ ] Select "Within 5 years" → Pick year 2022 → "About Q2 2022"
- [ ] Select "Over 5 years" → Year 2015 → Month → Day
- [ ] Select "I was ... years old" → Enter 25 → Verify calculation
- [ ] Voice input: "When I was 30" → Verify age calculation
- [ ] Voice input: "January 2020 I think" → Verify year + month

---

**CRITICAL:** This framework is fundamental to the UX. Do not simplify to basic date pickers.
