# Extraction Methodology Analysis - What Went Wrong & How to Fix

## What Happened: The Missing Date/Time Fields

### Initial Extraction (First Pass)
When I extracted the 7 condition screens initially, I documented:
- **Screen 2**: View Condition (Collapsed) - ✅ Correctly showed "Show more" link
- **Screen 3**: View Condition (Expanded) - ❌ **MISSED the date/time fields completely**
- **Screen 4-7**: Add/Edit screens - ❌ **Also missed the date/time fields**

### What the Documentation Said Initially
```
Show More Link:
- Text: "Show more" (Medium, 16px, #1A73E8, centered)
```

**That's all.** No mention of what happens AFTER clicking "Show more".

### What Was Actually There (Discovered Later)
After you pointed out the missing details, I re-extracted and found:
- **Chronic expanded**: Details field + **Diagnosis Date field with calendar icon**
- **Transient-Recurrent expanded**: **"When was the last time?" field with clock icon** + Details
- **Transient-Resolved expanded**: **End Date field** + Details + **Start Date field**

## Root Cause Analysis

### Problem 1: Single-Node Extraction
**What I did wrong:**
```
Used: mcp__figma-desktop__get_design_context with node ID 1534-33532
Result: Got the COLLAPSED state of "View Condition" screen
```

**Why this failed:**
- Figma screens with expandable sections have MULTIPLE states/variants
- The MCP tool extracts ONE node at a time
- I extracted the collapsed state and didn't realize there was an expanded state with different fields

**How you caught it:**
You said: "there important details when editing the conditions on expanded view, and then selecting the vaious items, the app wants you to pick a date or time period"

### Problem 2: No Interaction State Mapping
**What I should have done:**
1. Extract the collapsed state (node 1534-33532)
2. **Ask**: "What happens when user clicks 'Show more'?"
3. **Find**: The expanded state node (turned out to be 1534-33535, 1534-33544, etc.)
4. Extract BOTH states
5. Document the difference

**What I actually did:**
- Extracted one node per screen
- Assumed "Show more" was just a visual link
- Didn't map interactive transitions

### Problem 3: Incomplete Context Questions
**Questions I should have asked BEFORE extraction:**
- ✅ "How many screens are there?" (I asked this)
- ❌ "Are there expandable sections with hidden fields?"
- ❌ "Are there multiple states/variants per screen?"
- ❌ "What interactions trigger different views?"
- ❌ "Are all the screens in dev mode, or do I need to toggle them?"

### Problem 4: Framework Understanding vs. Visual Design
**Two-phase mistake:**

**Phase 1: Visual Extraction**
- I extracted the visual design (placeholder calendar/clock icons)
- Documented them as generic "date picker" fields
- Missed that they were placeholders for a complex framework

**Phase 2: Framework Details**
- You had to provide the ENTIRE framework specification manually
- The dropdown options (Within 1 year, Within 5 years, etc.)
- The progressive disclosure (year → month → date)
- The voice input + LLM
- The certainty toggle
- The age-based input

**Why this happened:**
- The Figma screens likely show **placeholder/collapsed state** of the date picker
- The actual interaction details (dropdowns, progressive steps) may not be visible in static Figma frames
- These details might be in:
  - Figma prototyping flows (not extractable via MCP)
  - Separate interaction specs
  - Design documentation
  - Your memory/requirements

## What I'll Do Differently for Medications, Allergies, etc.

### New Extraction Protocol

#### Step 1: Discovery Questions (BEFORE extraction)
Ask you:
1. How many total screens/views for this feature?
2. Are there expandable sections or hidden fields?
3. Are there multiple states per screen (collapsed/expanded, empty/filled, etc.)?
4. Are all screens in dev mode, or do I need specific nodes?
5. Are there interaction details (dropdowns, multi-step flows) not visible in static frames?
6. Do any fields have special frameworks or complex input methods?

#### Step 2: Node Mapping
Before extracting:
1. List all node IDs for the feature
2. Map each node to its purpose (Screen X - State Y)
3. Identify relationships (Screen A collapsed → Screen A expanded)

#### Step 3: Comprehensive Extraction
For each screen:
1. Extract the primary node
2. Check for related nodes (expanded states, variants, overlays)
3. Document ALL states, not just one
4. Note any placeholders vs. actual interaction specs

#### Step 4: Interaction Validation
After extraction:
1. Review with you what I found
2. Ask: "What happens when user clicks/taps X?"
3. Ask: "Are there hidden frameworks or complex interactions?"
4. **Don't assume placeholders are the full spec**

#### Step 5: Framework Discovery
For any complex input fields (dates, selections, multi-step):
1. Ask: "Is this a simple field or is there a framework?"
2. Ask: "What are the exact options/steps?"
3. Ask: "Are there voice input, LLM, or special features?"
4. **Don't write "etc." - get the complete list**

## Specific Questions for Next Feature (Medications)

Before I extract medications screens, I need to ask:

1. **Screen inventory**: How many medication screens are there? (list, view, add, edit, etc.)
2. **Dev mode status**: Are all medication screens toggled to dev mode in Figma?
3. **Expandable sections**: Do medication screens have "Show more" or expandable sections?
4. **Date/time fields**: Do medications have date fields (start date, end date, prescription date)?
5. **Date frameworks**: If yes, do they use the same 2-framework system as conditions, or different?
6. **Dosage/schedule**: Is there a complex dosage/schedule input framework?
7. **Refill tracking**: Is there refill tracking with dates/reminders?
8. **Special input methods**: Any voice input, LLM, or unique interaction patterns?
9. **Associated entities**: Can medications link to conditions, documents, pharmacies?
10. **Node IDs**: Can you provide the Figma node IDs for all medication screens?

## Validation Checklist

After extracting any feature, I'll validate:
- [ ] All screen states documented (collapsed, expanded, empty, filled, error)
- [ ] All interactive elements have "what happens when..." documented
- [ ] All input fields have their complete framework/options listed
- [ ] No placeholder text ("etc.", "...", "and so on")
- [ ] Complex interactions verified with you before assuming
- [ ] Related screens/nodes cross-referenced
- [ ] Edge cases and validation rules documented

## Lessons Learned

### Don't Assume
- ❌ "This is just a simple date picker"
- ✅ "Is this a simple date picker, or is there a framework?"

### Don't Skip States
- ❌ Extract one node, move on
- ✅ Extract all states, map transitions

### Don't Use Placeholders
- ❌ "Options include: Within 1 year, etc."
- ✅ "Options: Within 1 year, Within 5 years, Over 5 years, I was...years old"

### Don't Trust Static Frames
- ❌ "I see a calendar icon, that's the spec"
- ✅ "I see a calendar icon. What's the actual interaction flow?"

### Do Ask First
- Before extraction: Get complete context
- During extraction: Verify complex elements
- After extraction: Review with user for gaps

---

**Status**: ✅ Analysis complete, ready to apply to medications extraction
