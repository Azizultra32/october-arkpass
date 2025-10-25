# System Logic Framework - Core Principles

## Critical Distinctions

### What We're Documenting

**Scenario: Medication Used for Multiple Conditions**

```
One Medication → Multiple Conditions
Example: Spironolactone used for BOTH CHF AND Hypokalemia
```

**This requires special display rules.**

---

**Scenario: Condition with Multiple Medications**

```
One Condition → Multiple Medications
Example: CHF treated with:
  - Spironolactone (also used for Hypokalemia)
  - Lisinopril (used ONLY for CHF)
  - Furosemide (also used for Edema)
```

**This ALSO requires special display rules (to show which medications are shared).**

---

### What We're NOT Talking About

This logic does NOT apply to:
- Medications with NO multi-condition links (simple 1:1 relationship)
- Conditions with only single-purpose medications
- Direct attribute display (name, dosage, frequency)

---

## Core Insight #1: Three-View Architecture

### Universal Principle

**For EVERY piece of data in the system, we must consider THREE views:**

1. **UI/Vis[Pt]** - Patient-facing display
2. **UI/Vis[Pr]** - Provider-facing display
3. **Database** - Internal storage

### This Applies To:

| Data Type | Needs Three Views? | Reason |
|---|---|---|
| Medication multi-condition links | ✅ YES | Patients need simple language, providers need ICD codes |
| Condition diagnosis dates | ✅ YES | Patients see "March 2020", database stores precision + framework type |
| Medication start dates | ✅ YES | Patients see "(Since) right when diagnosed", database stores link reference |
| Medication dosage | ❌ NO (mostly) | "100mg" is same for all views (unless unit conversion needed) |
| Patient name | ❌ NO | "John Smith" is same everywhere |
| ICD codes | ⚠️ CONDITIONAL | Database stores, provider sees, patient NEVER sees |
| Date precision/framework | ⚠️ CONDITIONAL | Database stores technical details, UI shows human text |

### Rule:

```
IF (data has clinical complexity OR medical terminology OR technical precision)
THEN requires three-view mapping
ELSE single representation acceptable
```

---

## Core Insight #2: Logic Language System

### The Problem

We need a **shorthand notation system** to document complex business logic without writing full prose every time.

### Examples of Logic We're Creating:

1. **Multi-condition medication display logic**
2. **Date selection framework logic**
3. **Auto-update trigger logic**
4. **Validation rule logic**
5. **Display transformation logic**

### Current State: No Standardized Notation

We're currently writing logic in:
- ❌ Long prose descriptions
- ❌ Ad-hoc pseudocode
- ❌ Inconsistent formats
- ❌ TypeScript-like syntax (but not actual code)

### What We Need: Logic Notation Language

A **standardized shorthand** for documenting:
- Conditional logic
- Data transformations
- Display rules
- Validation rules
- Trigger events

---

## Proposed Logic Notation System

### Notation Elements

#### 1. Entity References
```
@Medication = reference to Medication entity
@Condition = reference to Condition entity
@MedicationCondition = reference to join table
```

#### 2. View Specifications
```
UI[Pt] = Patient view
UI[Pr] = Provider view
DB = Database storage
```

#### 3. Conditional Logic
```
IF condition THEN action ELSE alternative
WHEN event THEN action
WHERE filter
```

#### 4. Data Transformations
```
SHOW field AS display_format
HIDE field FROM view
COMPUTE field FROM source
LINK entity TO target
```

#### 5. Triggers
```
ON event → action
AFTER event → action
BEFORE event → action
```

---

## Logic Notation Examples

### Example 1: Multi-Condition Medication Display

**Shorthand Notation**:
```
RULE: MedicationDisplay.MultiCondition

WHEN @Medication.linkedConditions.count > 1

THEN:
  UI[Pt]: SHOW name + "(+ N other conditions)"
          WHERE N = linkedConditions.count - 1
          LINK TO @Condition.otherConditions

  UI[Pr]: SHOW name + "[" + JOIN(icdCodes, " + ") + "]"
          WHERE icdCodes = linkedConditions.map(c => c.icd10Code)

  DB:     STORE @MedicationCondition[]
          WITH fields: [medicationId, conditionId, certainty, isPrimary]
```

**Equivalent to**:
- Patient sees: "Spironolactone (+ 1 other condition)"
- Provider sees: "Spironolactone [I50.9 + E87.6]"
- Database stores: Multiple MedicationCondition records

---

### Example 2: Date Auto-Update Logic

**Shorthand Notation**:
```
RULE: MedicationDate.AutoUpdate

ON @Condition.diagnosisDate.UPDATE

THEN:
  FIND @Medication[]
    WHERE prescribedStartDate.linkedConditionId = @Condition.id
    AND prescribedStartDate.type = "at_diagnosis"

  FOR EACH @Medication:
    COMPUTE prescribedStartDate.computedDate = @Condition.diagnosisDate
    SET prescribedStartDate.lastComputedAt = NOW()
    SAVE @Medication
```

**Equivalent to**:
- When condition diagnosis date changes
- Find all medications linked "at diagnosis"
- Recalculate their start dates
- Update timestamps

---

### Example 3: Patient Display Transformation

**Shorthand Notation**:
```
RULE: MedicationDate.PatientDisplay

IF @Medication.prescribedStartDate.precision IN ["month", "day"]
  THEN UI[Pt]: SHOW formatDate(computedDate, precision) + " (" + referenceType + ")"
  ELSE UI[Pt]: SHOW contextText

WHERE:
  formatDate(date, "day") = "Mar 15, 2020"
  formatDate(date, "month") = "March 2020"
  referenceType = "at_dx" | "after_dx" | null
  contextText = LOOKUP[prescribedStartDate.type]:
    "at_diagnosis" → "(Since) Right when I was diagnosed"
    "after_diagnosis" → "(Later or added) After I was diagnosed"
```

**Equivalent to**:
- If date is precise enough, show formatted date with marker
- Otherwise show contextual text

---

## Logic Categories & Templates

### Category 1: Display Transformation Rules

**Template**:
```
RULE: Entity.Field.Display

FOR VIEW [Pt|Pr|DB]:
  IF condition
  THEN SHOW format
  ELSE SHOW alternative
```

**Example**:
```
RULE: Medication.Name.Display

FOR VIEW UI[Pt]:
  SHOW @Medication.name + suffix
  WHERE suffix = IF linkedConditions.count > 1
                 THEN "(+ " + (count - 1) + " other conditions)"
                 ELSE ""

FOR VIEW UI[Pr]:
  SHOW @Medication.name + "[" + icdCodeList + "]"
  WHERE icdCodeList = JOIN(linkedConditions.icdCodes, " + ")

FOR VIEW DB:
  STORE @Medication.name AS string
```

---

### Category 2: Auto-Update Trigger Rules

**Template**:
```
RULE: Entity.Field.AutoUpdate

ON source.event
THEN:
  FIND affected_entities WHERE condition
  FOR EACH entity:
    COMPUTE new_value FROM source
    UPDATE entity.field = new_value
```

---

### Category 3: Validation Rules

**Template**:
```
RULE: Entity.Field.Validation

VALIDATE @Entity.field
  MUST condition
  ERROR message IF violated
```

**Example**:
```
RULE: Medication.StartDate.Validation

VALIDATE @Medication.prescribedStartDate
  MUST computedDate > @Condition.diagnosisDate
  WHEN type = "after_diagnosis"
  ERROR "Medication cannot start before diagnosis"
```

---

### Category 4: Confirmation/User Interaction Rules

**Template**:
```
RULE: Entity.Action.Confirmation

WHEN user.action
IF condition
THEN:
  PROMPT user WITH message
  ON RESPONSE [option1, option2, option3]:
    option1 → action1
    option2 → action2
    option3 → action3
```

**Example**:
```
RULE: Medication.AddCondition.Confirmation

WHEN user.linksCondition TO @Medication
IF @Medication.linkedConditions.count >= 1
THEN:
  PROMPT "You are on this medication for {existing}. Are you sure you are also on it for {new}?"
  ON RESPONSE:
    "Not sure" → ADD link WITH certainty="uncertain"
    "Yes, I'm certain" → ADD link WITH certainty="certain"
    "Actually, I don't think I am" → CANCEL action
```

---

## Logic Documentation Structure

### Every Logic Rule Must Have:

1. **Rule ID**: Unique identifier
   ```
   RULE: Entity.Field.LogicType
   ```

2. **Trigger/Context**: When does this apply?
   ```
   WHEN condition
   ON event
   IF state
   ```

3. **Actions**: What happens?
   ```
   THEN action
   FOR VIEW: display_rule
   COMPUTE: calculation
   ```

4. **Views Affected**: Which views are impacted?
   ```
   UI[Pt], UI[Pr], DB
   ```

5. **Examples**: Concrete scenarios
   ```
   EXAMPLE:
     Given: ...
     When: ...
     Then: ...
   ```

---

## System-Wide Logic Registry

### Proposed Structure:

```
/logic
  /display-transformations
    medication-multi-condition.logic
    medication-date-display.logic
    condition-date-display.logic

  /auto-updates
    medication-date-on-condition-change.logic
    computed-fields.logic

  /validations
    medication-date-validation.logic
    multi-condition-validation.logic

  /confirmations
    medication-multi-condition-confirmation.logic

  /navigation
    patient-view-hyperlinks.logic
    condition-medication-cross-reference.logic

  notation.md  ← Defines the logic notation language
  index.md     ← Registry of all logic rules
```

---

## Logic Notation Language Specification

### Grammar

```
RULE ::= "RULE:" identifier
         (trigger | condition)
         action+

trigger ::= "WHEN" event
          | "ON" event
          | "AFTER" event
          | "BEFORE" event

condition ::= "IF" expression
            | "WHERE" filter

action ::= "THEN" statement
         | "FOR VIEW" view ":" display_rule
         | "COMPUTE" field "FROM" source
         | "UPDATE" field "=" value
         | "PROMPT" message
         | "SHOW" format
         | "HIDE" field
         | "LINK" entity "TO" target

view ::= "UI[Pt]" | "UI[Pr]" | "DB"

expression ::= field operator value
             | field "IN" list
             | function(args)

operator ::= "=" | ">" | "<" | ">=" | "<=" | "!="
```

---

## Implementation Requirements

### 1. Logic Notation Parser (Future)

Eventually, we could build a parser that:
- Reads `.logic` files
- Validates syntax
- Generates actual code (TypeScript/SQL)
- Produces documentation

**For now**: Use notation as **documentation standard**, implement manually.

---

### 2. Logic Documentation Standards

**Every complex business rule MUST be documented using:**

1. Logic notation (shorthand)
2. Plain English explanation
3. Concrete examples
4. View mapping (UI[Pt], UI[Pr], DB)

**Example**:
```markdown
## Multi-Condition Medication Display

### Logic Notation
[... shorthand here ...]

### Plain English
When a medication is linked to multiple conditions, patients see a
simplified "(+ N other conditions)" text that links to the other
conditions, while providers see the full ICD code list in brackets.

### Examples
[... concrete scenarios ...]

### View Mapping
- UI[Pt]: Simple text with hyperlinks
- UI[Pr]: ICD codes in brackets
- DB: MedicationCondition join table
```

---

## Application to Current System

### Rules We've Documented So Far:

1. **Medication.MultiCondition.Display** ✅
   - Patient view: "(+ N other conditions)"
   - Provider view: "[ICD + ICD]"
   - Database: MedicationCondition table

2. **Medication.StartDate.Display** ✅
   - Patient view: Context text OR formatted date
   - Provider view: Same as patient (medical precision not needed)
   - Database: Type + linked reference + computed cache

3. **Medication.StartDate.AutoUpdate** ✅
   - Trigger: ON Condition.diagnosisDate.UPDATE
   - Action: Recalculate linked medication dates

4. **Medication.MultiCondition.Confirmation** ✅
   - Trigger: WHEN user adds 2nd+ condition
   - Action: Show confirmation dialog with 3 options

5. **Condition.DateSelection.Framework** ✅
   - Patient view: Progressive disclosure questions
   - Provider view: (Not specified yet)
   - Database: Framework type + precision + computed date

---

## Next Steps

### Immediate (Documentation)
- [x] Document three-view architecture principle
- [x] Define logic notation language
- [ ] Convert existing logic to notation format
- [ ] Create logic registry/index

### Future (Implementation)
- [ ] Build logic notation parser
- [ ] Generate code from logic files
- [ ] Automated validation of logic consistency
- [ ] Visual logic flow diagrams from notation

---

## Summary

### Three Core Principles Established:

1. **Three-View Architecture**
   - Every complex data element needs UI[Pt], UI[Pr], and DB views
   - Not all data needs this (simple fields can be uniform)
   - Decision rule: Clinical complexity → three views needed

2. **Logic Notation Language**
   - Standardized shorthand for business logic
   - Replaces ad-hoc pseudocode
   - Parseable, consistent, maintainable

3. **Logic Documentation Standard**
   - Every rule has: notation + explanation + examples + views
   - Organized by category (display, validation, triggers, etc.)
   - Central registry for discoverability

---

**Status**: ✅ System-level logic framework established
**Purpose**: Foundation for consistent, maintainable business logic documentation across entire system
