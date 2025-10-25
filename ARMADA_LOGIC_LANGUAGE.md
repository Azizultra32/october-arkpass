# Armada Logic Language (ALL)

## Purpose

**Armada Logic Language (ALL)** is a domain-specific notation system for documenting business logic, display rules, validation rules, and behavioral patterns in the Armada health records system.

Created during the Figma→Database design phase to establish a **consistent, parseable shorthand** for complex logic that would otherwise require lengthy prose or inconsistent pseudocode.

---

## Two Parallel Outputs from Figma Exercise

### 1. Database Schema
- Table structures
- Column definitions
- Relationships
- Indexes

### 2. Logic Rules (in ALL)
- Display transformations
- Validation rules
- Auto-update triggers
- User confirmations
- Navigation flows

**Both are being defined simultaneously as we extract Figma designs.**

---

## ALL Grammar

### Basic Structure

```
RULE: {EntityName}.{FieldName}.{LogicType}

WHEN {trigger_condition}
IF {conditional_expression}
THEN {action_block}

FOR VIEW {view_type}:
  {display_rule}

EXAMPLE:
  {concrete_scenario}
```

---

## Keywords

### Entity References
```
@Entity          - Reference to database entity
@Entity.field    - Reference to specific field
@Entity.id       - Reference to entity ID
```

### View Specifiers
```
UI[Pt]           - Patient UI view
UI[Pr]           - Provider UI view
DB               - Database storage
API              - API response
```

### Control Flow
```
WHEN             - Event trigger
ON               - Event handler
IF               - Conditional
THEN             - Consequent action
ELSE             - Alternative action
FOR EACH         - Iteration
WHERE            - Filter condition
```

### Actions
```
SHOW             - Display something
HIDE             - Conceal something
COMPUTE          - Calculate value
UPDATE           - Modify value
STORE            - Save to database
LINK             - Create association
VALIDATE         - Check constraint
PROMPT           - Ask user
NAVIGATE         - Change view/screen
```

### Operators
```
=                - Equals
!=               - Not equals
>                - Greater than
<                - Less than
>=               - Greater or equal
<=               - Less or equal
IN               - Member of set
NOT IN           - Not member of set
AND              - Logical AND
OR               - Logical OR
```

### Functions
```
COUNT(items)     - Count elements
JOIN(items, sep) - Concatenate with separator
FORMAT(val, fmt) - Format value
LOOKUP[key]      - Dictionary lookup
MAP(items, fn)   - Transform each item
FILTER(items, condition) - Select subset
```

---

## Rule Categories

### 1. Display Transformation Rules

**Pattern**:
```
RULE: Entity.Field.Display

FOR VIEW {view}:
  IF {condition}
    THEN SHOW {format}
    ELSE SHOW {alternative}
```

**Example**:
```
RULE: Medication.StartDate.Display

FOR VIEW UI[Pt]:
  IF precision IN ["month", "day"]
    THEN SHOW FORMAT(computedDate, precision) + " (" + referenceType + ")"
    ELSE SHOW LOOKUP[type]:
      "at_diagnosis" → "(Since) Right when I was diagnosed"
      "after_diagnosis" → "(Later or added) After I was diagnosed"

FOR VIEW UI[Pr]:
  SHOW FORMAT(computedDate, precision) + " (" + referenceType + ")"

FOR VIEW DB:
  STORE {
    type: string,
    linkedConditionId: uuid,
    referenceType: enum,
    year: int,
    month: int,
    day: int,
    precision: enum,
    computedDate: timestamp
  }
```

---

### 2. Auto-Update Trigger Rules

**Pattern**:
```
RULE: Entity.Field.AutoUpdate

ON {source_entity}.{source_field}.UPDATE
THEN:
  FIND {affected_entities} WHERE {condition}
  FOR EACH {entity}:
    COMPUTE {new_value}
    UPDATE {entity}.{field} = {new_value}
```

**Example**:
```
RULE: Medication.StartDate.AutoUpdate

ON @Condition.diagnosisDate.UPDATE
THEN:
  FIND @Medication[] WHERE
    prescribedStartDate.linkedConditionId = @Condition.id
    AND prescribedStartDate.type = "at_diagnosis"

  FOR EACH @Medication:
    COMPUTE prescribedStartDate.computedDate = @Condition.diagnosisDate
    UPDATE prescribedStartDate.lastComputedAt = NOW()
    UPDATE prescribedStartDate_display_pt = GENERATE_PATIENT_DISPLAY(prescribedStartDate)
    UPDATE prescribedStartDate_display_pr = GENERATE_PROVIDER_DISPLAY(prescribedStartDate)
```

---

### 3. Validation Rules

**Pattern**:
```
RULE: Entity.Field.Validation

VALIDATE @Entity.field
  MUST {condition}
  WHEN {context}
  ERROR {message} IF violated
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

### 4. User Confirmation Rules

**Pattern**:
```
RULE: Entity.Action.Confirmation

WHEN user.{action}
IF {condition}
THEN:
  PROMPT {message}
  ON RESPONSE:
    {option_1} → {action_1}
    {option_2} → {action_2}
    {option_3} → {action_3}
```

**Example**:
```
RULE: Medication.AddCondition.Confirmation

WHEN user.linksCondition TO @Medication
IF @Medication.linkedConditions.count >= 1
THEN:
  PROMPT "You are on this medication for {existingConditions}. Are you sure you are also on it for {newCondition}?"

  ON RESPONSE:
    "Not sure" →
      LINK @Medication TO @Condition WITH certainty="uncertain"
      UPDATE medication_display_cache

    "Yes, I'm certain" →
      LINK @Medication TO @Condition WITH certainty="certain"
      UPDATE medication_display_cache

    "Actually, I don't think I am" →
      CANCEL action
```

---

### 5. Computed Field Rules

**Pattern**:
```
RULE: Entity.Field.Compute

COMPUTE @Entity.field
  FROM {source_fields}
  USING {formula}
  UPDATE WHEN {trigger}
```

**Example**:
```
RULE: Medication.MultiConditionDisplay.Compute

COMPUTE @Medication.multiConditionSuffix_display_pt
  FROM @MedicationCondition[] WHERE medicationId = @Medication.id
  USING:
    LET otherConditions = FILTER(linkedConditions, c => c.id != currentConditionId)
    LET count = COUNT(otherConditions)
    RETURN IF count = 1
      THEN "(+ 1 other condition)"
      ELSE IF count > 1
        THEN "(+ " + count + " other conditions)"
        ELSE ""

  UPDATE WHEN:
    @MedicationCondition.INSERT
    @MedicationCondition.DELETE
```

---

### 6. Navigation Rules

**Pattern**:
```
RULE: Entity.Action.Navigation

WHEN user.{action}
THEN NAVIGATE TO {destination}
  WITH {params}
```

**Example**:
```
RULE: Medication.OtherConditionLink.Navigation

WHEN user.taps(multiConditionSuffix)
IF linkedConditions.count = 1
THEN:
  NAVIGATE TO /conditions/{otherCondition.id}

ELSE IF linkedConditions.count > 1
THEN:
  SHOW Modal WITH:
    title: "Also prescribed for:"
    items: MAP(otherConditions, c => {
      text: c.name,
      href: /conditions/{c.id}
    })
```

---

## Database Column Pattern Integration

### Display Column Rules

```
RULE: {Entity}.{Field}.DisplayColumns

DB COLUMNS:
  {field}_raw: {type}
  {field}_display_pt: VARCHAR(255)
  {field}_display_pr: VARCHAR(255)
  {field}_display_active: ENUM('pt_only', 'pr_only', 'both', 'same', 'none')

ON @{Entity}.{field}_raw.UPDATE
THEN:
  COMPUTE {field}_display_pt = GENERATE_PATIENT_DISPLAY({field}_raw)
  COMPUTE {field}_display_pr = GENERATE_PROVIDER_DISPLAY({field}_raw)
  COMPUTE {field}_display_active =
    IF {field}_display_pt = {field}_display_pr
      THEN 'same'
      ELSE 'both'
```

---

## File Organization

### Directory Structure
```
/logic
  /rules
    /display
      medication-start-date.all
      medication-multi-condition.all
      condition-diagnosis-date.all

    /validation
      medication-date-validation.all
      multi-condition-validation.all

    /triggers
      medication-date-auto-update.all
      display-column-sync.all

    /confirmation
      medication-multi-condition-confirm.all

    /navigation
      patient-view-hyperlinks.all

    /compute
      medication-display-cache.all

  /notation
    grammar.md         - ALL grammar specification
    keywords.md        - Keyword reference
    examples.md        - Usage examples

  index.md             - Registry of all rules
```

---

## Rule File Format

### Standard Template

```
# {Rule Name}

## Metadata
- **ID**: {Entity}.{Field}.{LogicType}
- **Category**: {Display|Validation|Trigger|etc.}
- **Entities**: {@Entity1, @Entity2}
- **Views**: {UI[Pt], UI[Pr], DB}
- **Created**: {date}
- **Updated**: {date}

## Logic Notation

{ALL notation here}

## Plain English

{Human-readable explanation}

## Examples

### Example 1: {scenario}
GIVEN: {initial state}
WHEN: {action/event}
THEN: {expected outcome}

### Example 2: {scenario}
...

## Database Impact

### Tables Affected
- {table_name}: {what changes}

### Columns
- {column_name}: {how it's used}

## Implementation Notes

{Technical considerations, edge cases, etc.}

## Related Rules

- {Rule.ID}: {relationship}
```

---

## Usage in Documentation

### From Figma to Logic

**Workflow**:
1. Extract Figma screen
2. Identify fields and interactions
3. Document in ALL notation
4. Generate database schema
5. Implement display functions
6. Create tests

**Example**:

**Figma shows**: "Prescribed / Start day" field with calendar icon

**ALL notation**:
```
RULE: Medication.PrescribedStartDate.Display

FOR VIEW UI[Pt]:
  IF precision IN ["month", "day"]
    THEN SHOW formatted_date + marker
    ELSE SHOW context_text
...
```

**Database schema**:
```sql
prescribed_start_date_raw JSONB,
prescribed_start_date_display_pt VARCHAR(255),
prescribed_start_date_display_pr VARCHAR(255),
prescribed_start_date_display_active VARCHAR(20),
```

**Display function**:
```typescript
function generatePatientDateDisplay(raw: DateRaw): string {
  // Implements ALL logic
}
```

---

## Benefits

### 1. Consistency
- All logic documented in same format
- Easy to compare rules
- Reduces ambiguity

### 2. Discoverability
- Central registry of all rules
- Searchable by entity, field, category
- Cross-references between rules

### 3. Maintainability
- Change logic notation → update implementation
- Clear separation of concerns
- Version control friendly

### 4. Parseability (Future)
- Could build parser to generate code
- Could validate rule consistency
- Could generate tests automatically

### 5. Communication
- Designers can read ALL
- Developers can implement ALL
- Stakeholders can understand ALL

---

## Integration with Development

### Current Phase: Documentation Only

ALL is currently used as **documentation standard**:
- Write rules in ALL notation
- Manually implement in code
- Use as specification reference

### Future Phase: Code Generation

Potential to build tooling:
- Parse `.all` files
- Generate TypeScript functions
- Generate SQL triggers
- Generate tests
- Generate API documentation

---

## Governance

### Rule Creation Process

1. **Identify logic need** (from Figma or requirements)
2. **Draft in ALL notation**
3. **Review for clarity**
4. **Add to registry**
5. **Implement in code**
6. **Link code to rule** (comments with Rule ID)

### Rule Updates

1. **Update ALL file**
2. **Update implementation**
3. **Update tests**
4. **Document in changelog**

### Rule Deprecation

1. **Mark as deprecated in registry**
2. **Document replacement rule**
3. **Schedule removal**
4. **Remove implementation**

---

## Summary

**Armada Logic Language (ALL)** is:
- A domain-specific notation for business logic
- Created during Figma→Database design phase
- Produces logic rules parallel to database schema
- Provides consistency, discoverability, maintainability
- Foundation for future code generation

**Together with the display column pattern, ALL establishes the system architecture for managing complex business logic.**

---

**Status**: ✅ ALL specification established
**Next**: Apply to all logic rules being discovered during Figma extraction
