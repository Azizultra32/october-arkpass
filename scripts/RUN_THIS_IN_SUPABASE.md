# Run Migrations in Supabase - 5 Minutes

## Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Open your project (dev or production)
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

## Step 2: Run Functions (Copy/Paste This)

Copy the ENTIRE file `scripts/dual-mode-date-functions.sql` and paste into SQL editor.

Click **"Run"** (or press Cmd+Enter)

**Expected Result:** You'll see 4 test query results at the bottom:
- "May 2020"
- "When I was 25"
- 2015-05-15 00:00:00
- "May 2020 (uncertain)"

If you see those ✅ move to Step 3.
If you see errors ❌ copy error message and tell me.

## Step 3: Run Migration (Copy/Paste This)

**IMPORTANT:** Make sure you have `medications` and `conditions` tables first! If not, create them:

```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  medication TEXT,
  dosage TEXT,
  date DATE
);

CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  condition TEXT,
  date DATE
);
```

Then copy the ENTIRE file `scripts/enhanced-migration-with-dates.sql` and paste into SQL editor.

Click **"Run"**

**Expected Result:** You'll see schema validation output showing all the new columns added.

## Step 4: Verify It Worked

Run this query:

```sql
-- Check medications table
SELECT column_name, data_type, is_generated
FROM information_schema.columns
WHERE table_name = 'medications'
ORDER BY ordinal_position;
```

You should see these NEW columns:
- `name` (not `medication` anymore)
- `start_date_raw` (jsonb)
- `start_date_computed` (timestamp, generated = YES)
- `start_date_display_pt` (text, generated = YES)
- `start_date_display_pr` (text, generated = YES)
- `frequency`, `indication`, `status`, etc.

## Step 5: Test It

Insert a test medication:

```sql
INSERT INTO medications (patient_id, name, dosage, start_date_raw)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test Medication',
  '10mg',
  '{"mode": "date", "year": 2020, "month": 5, "day": 15, "precision": "day", "certainty": "certain"}'::JSONB
);

-- View it
SELECT
  name,
  start_date_raw,
  start_date_computed,
  start_date_display_pt
FROM medications
WHERE name = 'Test Medication';
```

**Expected:**
- `start_date_computed`: 2020-05-15 00:00:00
- `start_date_display_pt`: May 2020

## Done!

If all steps worked ✅ your database is ready for the app!

If anything failed ❌ copy the error and share it.

---

**Files you need:**
- `scripts/dual-mode-date-functions.sql` (paste first)
- `scripts/enhanced-migration-with-dates.sql` (paste second)

Both files are in your repo at `/Users/ali/october-arkpass/scripts/`
