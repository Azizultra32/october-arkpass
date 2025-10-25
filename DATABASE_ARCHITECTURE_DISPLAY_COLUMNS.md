# Database Architecture: Display Column Pattern

## Core Principle

**Every data field that could have different representations MUST have:**

1. `{field}_raw` - Database storage value
2. `{field}_display_pt` - Patient-facing display format
3. `{field}_display_pr` - Provider-facing display format
4. `{field}_display_active` - Which views are enabled

---

## Column Pattern Template

### For Any Field That Could Have Multiple Representations:

```sql
-- Example: medication start date
prescribed_start_date_raw JSONB,
prescribed_start_date_display_pt VARCHAR(255),
prescribed_start_date_display_pr VARCHAR(255),
prescribed_start_date_display_active VARCHAR(20),
```

**Column Definitions:**

1. **`{field}_raw`**
   - Type: JSONB (for complex data) or appropriate primitive type
   - Purpose: The authoritative source of truth
   - Never displayed directly to users
   - Used for calculations, queries, triggers

2. **`{field}_display_pt`**
   - Type: VARCHAR or TEXT
   - Purpose: Pre-computed patient-facing display string
   - Updated automatically when `{field}_raw` changes
   - Can be NULL if view not applicable

3. **`{field}_display_pr`**
   - Type: VARCHAR or TEXT
   - Purpose: Pre-computed provider-facing display string
   - Updated automatically when `{field}_raw` changes
   - Can be NULL if view not applicable

4. **`{field}_display_active`**
   - Type: VARCHAR (enum-like)
   - Values: 'pt_only', 'pr_only', 'both', 'none', 'same'
   - Purpose: Indicates which display columns are active/different
   - Controls UI rendering logic

---

## Display Active Flag Values

```
'pt_only'   - Only patient view differs from raw
'pr_only'   - Only provider view differs from raw
'both'      - Both views differ from raw AND from each other
'same'      - Both views identical (duplicate display value)
'none'      - No special display (use raw value directly)
```

---

## Decision Matrix: When to Use This Pattern

| Field Type | Example | Use Pattern? | Why |
|---|---|---|---|
| Simple text | Patient first name | ❌ No | Always displayed same way |
| Simple number | Age in years | ❌ No | Always displayed same way |
| Date with framework | Condition diagnosis date | ✅ Yes | Display changes based on precision |
| Medical codes | ICD-10 codes | ✅ Yes | Hidden from patient, shown to provider |
| Multi-entity reference | Medication for multiple conditions | ✅ Yes | Patient sees summary, provider sees codes |
| Clinical terminology | Medication route (ORAL/SL/INJ) | ⚠️ Maybe | Might need layman's terms for patient |
| Dosage | "100mg" | ❌ No | Same for all views (unless unit conversion) |
| Computed relationships | "Also used for 2 other conditions" | ✅ Yes | Computed differently per view |

**Rule**: If there's ANY possibility the display might differ by audience or context, use the pattern.

---

## Example 1: Medication Start Date

### Raw Storage
```json
{
  "type": "at_diagnosis",
  "linkedConditionId": "condition_123",
  "referenceType": "at_dx",
  "year": 2020,
  "month": 3,
  "precision": "month",
  "computedDate": "2020-03-01T00:00:00Z"
}
```

### Display Patient
```
"March 2020 (@_dx)"
```

### Display Provider
```
"March 2020 (@_dx)"
```

### Display Active
```
"same"
```

**Why "same"**: Both views show the same format. Medical precision not needed differently.

---

## Example 2: Medication Multi-Condition Link

### Raw Storage (in join table)
```json
{
  "medicationId": "med_123",
  "conditionIds": ["cond_1", "cond_2"],
  "icdCodes": ["I50.9", "E87.6"],
  "conditionNames": ["CHF", "Hypokalemia"],
  "certainty": {"cond_1": "certain", "cond_2": "uncertain"}
}
```

### Display Patient
```
"(+ 1 other condition)"
```

### Display Provider
```
"[I50.9 + (?)E87.6]"
```

### Display Active
```
"both"
```

**Why "both"**: Patient and provider views are completely different.

---

## Example 3: ICD-10 Code

### Raw Storage
```
"I50.9"
```

### Display Patient
```
NULL
```

### Display Provider
```
"I50.9 - Heart failure, unspecified"
```

### Display Active
```
"pr_only"
```

**Why "pr_only"**: Never shown to patient, only to provider.

---

## Database Schema Pattern

### Medications Table Example

```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY,

  -- Simple fields (no display pattern needed)
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),

  -- Complex field: Start date
  prescribed_start_date_raw JSONB,
  prescribed_start_date_display_pt VARCHAR(255),
  prescribed_start_date_display_pr VARCHAR(255),
  prescribed_start_date_display_active VARCHAR(20) DEFAULT 'same',

  -- Complex field: Route
  route_raw VARCHAR(50),  -- "ORAL", "SUBLINGUAL", "INJECTION"
  route_display_pt VARCHAR(100),  -- "By mouth", "Under tongue", "Injection"
  route_display_pr VARCHAR(100),  -- "ORAL", "SL", "INJ"
  route_display_active VARCHAR(20) DEFAULT 'both',

  -- Complex field: Status
  status_raw VARCHAR(50),  -- "ACTIVE", "DISCONTINUED", "AS_NEEDED"
  status_display_pt VARCHAR(100),  -- "Currently taking", "No longer taking", "As needed"
  status_display_pr VARCHAR(100),  -- "Active", "Discontinued", "PRN"
  status_display_active VARCHAR(20) DEFAULT 'both',

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Computed Display Fields (View)

For fields that are computed from relationships (like multi-condition links):

```sql
CREATE TABLE medication_display_cache (
  medication_id UUID PRIMARY KEY REFERENCES medications(id),
  condition_id UUID REFERENCES conditions(id),  -- Context for display

  -- Multi-condition display
  multi_condition_raw JSONB,  -- Array of linked conditions
  multi_condition_display_pt VARCHAR(255),  -- "(+ 2 other conditions)"
  multi_condition_display_pr VARCHAR(500),  -- "[I50.9 + E87.6 + M19.9]"
  multi_condition_display_active VARCHAR(20) DEFAULT 'both',

  -- Last computed
  computed_at TIMESTAMP DEFAULT NOW()
);
```

**Why separate cache table**: Computed values depend on context (which condition you're viewing from).

---

## Trigger Pattern: Auto-Update Display Columns

```sql
CREATE OR REPLACE FUNCTION update_medication_display_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- When raw value changes, recompute display values

  IF NEW.prescribed_start_date_raw IS DISTINCT FROM OLD.prescribed_start_date_raw THEN
    -- Call display generation function
    NEW.prescribed_start_date_display_pt := generate_patient_date_display(
      NEW.prescribed_start_date_raw
    );
    NEW.prescribed_start_date_display_pr := generate_provider_date_display(
      NEW.prescribed_start_date_raw
    );

    -- Set active flag based on whether displays differ
    IF NEW.prescribed_start_date_display_pt = NEW.prescribed_start_date_display_pr THEN
      NEW.prescribed_start_date_display_active := 'same';
    ELSE
      NEW.prescribed_start_date_display_active := 'both';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER medication_display_update
  BEFORE INSERT OR UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_medication_display_columns();
```

---

## Display Generation Functions

### Patient Display Generation

```typescript
function generate_patient_date_display(raw: MedicationDateRaw): string {
  const precision = raw.precision;
  const hasAcceptableGranularity = ['month', 'day'].includes(precision);

  if (hasAcceptableGranularity && raw.computedDate) {
    const formatted = formatDate(raw.computedDate, precision);
    const marker = raw.referenceType ? ` (${raw.referenceType})` : '';
    return `${formatted}${marker}`;
  }

  // Fall back to context text
  const contextMap = {
    'at_diagnosis': '(Since) Right when I was diagnosed',
    'after_diagnosis': '(Later or added) After I was diagnosed'
  };

  return contextMap[raw.type] || formatDate(raw.computedDate, precision);
}
```

### Provider Display Generation

```typescript
function generate_provider_date_display(raw: MedicationDateRaw): string {
  // For now, same as patient (no clinical distinction needed)
  // But function exists for future differentiation
  return generate_patient_date_display(raw);
}
```

---

## Query Patterns

### Fetching for Patient View

```sql
SELECT
  id,
  name,
  dosage,
  frequency,
  CASE
    WHEN prescribed_start_date_display_active IN ('pt_only', 'both', 'same')
      THEN prescribed_start_date_display_pt
    ELSE NULL
  END as start_date,
  CASE
    WHEN route_display_active IN ('pt_only', 'both', 'same')
      THEN route_display_pt
    ELSE NULL
  END as route
FROM medications
WHERE patient_id = $1;
```

### Fetching for Provider View

```sql
SELECT
  id,
  name,
  dosage,
  frequency,
  CASE
    WHEN prescribed_start_date_display_active IN ('pr_only', 'both', 'same')
      THEN prescribed_start_date_display_pr
    ELSE prescribed_start_date_raw::text
  END as start_date,
  CASE
    WHEN route_display_active IN ('pr_only', 'both', 'same')
      THEN route_display_pr
    ELSE route_raw
  END as route
FROM medications
WHERE patient_id = $1;
```

---

## Migration Strategy

### For Existing Fields

```sql
-- Add display columns
ALTER TABLE medications
  ADD COLUMN prescribed_start_date_display_pt VARCHAR(255),
  ADD COLUMN prescribed_start_date_display_pr VARCHAR(255),
  ADD COLUMN prescribed_start_date_display_active VARCHAR(20) DEFAULT 'same';

-- Backfill display values
UPDATE medications
SET
  prescribed_start_date_display_pt = generate_patient_date_display(prescribed_start_date_raw),
  prescribed_start_date_display_pr = generate_provider_date_display(prescribed_start_date_raw),
  prescribed_start_date_display_active =
    CASE
      WHEN prescribed_start_date_display_pt = prescribed_start_date_display_pr
        THEN 'same'
      ELSE 'both'
    END
WHERE prescribed_start_date_raw IS NOT NULL;
```

---

## Performance Considerations

### Pros of Pre-Computed Display Columns

✅ Fast reads - No computation at query time
✅ Consistent formatting - Single source of display logic
✅ Indexable - Can create indexes on display columns
✅ Auditable - Can track when display was last computed

### Cons

❌ Storage overhead - 2-3x more columns
❌ Write complexity - Must maintain display columns
❌ Sync risk - Display could get out of sync with raw

### Mitigation

- Use database triggers to keep display columns in sync
- Add `computed_at` timestamp to detect stale displays
- Periodic background job to validate display consistency

---

## Alternative: Computed Columns (PostgreSQL)

```sql
ALTER TABLE medications
  ADD COLUMN prescribed_start_date_display_pt VARCHAR(255)
  GENERATED ALWAYS AS (
    generate_patient_date_display(prescribed_start_date_raw)
  ) STORED;
```

**Pros**: Automatically stays in sync
**Cons**: Function must be SQL-only (can't call TypeScript)

---

## Recommended Approach

### Hybrid Strategy

1. **Simple transformations**: Use SQL generated columns
2. **Complex transformations**: Use triggers + stored procedures
3. **Context-dependent displays**: Use cached view tables
4. **Real-time computation**: Acceptable for low-traffic fields

### For Medications:

- Start date: Use triggers (complex logic)
- Multi-condition: Use cache table (context-dependent)
- Route: Use generated column (simple mapping)
- Status: Use generated column (simple mapping)

---

## Documentation Standard

### For Every Field Using This Pattern

Must document:

1. **Raw value structure**
   ```json
   {field}_raw: {...}
   ```

2. **Patient display rule**
   ```
   UI[Pt]: "formatted string"
   ```

3. **Provider display rule**
   ```
   UI[Pr]: "formatted string"
   ```

4. **When displays differ**
   ```
   Active: "both" | "same" | "pt_only" | "pr_only"
   ```

5. **Generation logic**
   ```
   COMPUTE display FROM raw USING function
   ```

---

## Summary

### Database Architecture Decision

**Every field with potential display variation gets:**
- `{field}_raw` - Source of truth
- `{field}_display_pt` - Patient view (pre-computed)
- `{field}_display_pr` - Provider view (pre-computed)
- `{field}_display_active` - Which views are active

**This is a system-wide pattern applied during Figma→Database design phase.**

### Next Steps

1. Apply this pattern to all complex fields in medications
2. Apply to condition date fields
3. Document in ALL (Armada Logic Language)
4. Create migration scripts
5. Build display generation functions
6. Implement triggers

---

**Status**: ✅ Database architecture pattern established
**Applies to**: All entities with display variation (medications, conditions, etc.)
