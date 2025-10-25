# Medication Start Date – Examples (Linked to ALL Rules)

This sheet cross-references the **Armada Logic Language (ALL)** rule  
`Medication.PrescribedStartDate.Display` with concrete examples so the logic is unambiguous.

---

## Example 1 – “Right when I was diagnosed” (Year precision only)

**Condition:** Asthma  
**Condition diagnosis raw:**  
`{"type":"framework1","selection":"within_5_years","year":2020,"precision":"year"}`  
**Medication start raw:**  
`{"type":"at_diagnosis","linkedConditionId":"asthma_123","referenceType":"at_dx","precision":"year"}`  

**Display (UI[Pt]):** `(Since) Right when I was diagnosed`  
**Display (UI[Pr]):** `(Since) Right when I was diagnosed`  
**DB Columns:**  
- `prescribed_start_date_display_pt="(Since) Right when I was diagnosed"`  
- `prescribed_start_date_display_pr="(Since) Right when I was diagnosed"`  
- `prescribed_start_date_display_active='same'`

---

## Example 2 – “Right when I was diagnosed” (Month precision available)

**Condition diagnosis raw:**  
`{"type":"framework1","selection":"within_1_year","year":2020,"month":3,"precision":"month"}`  
**Medication start raw:**  
`{"type":"at_diagnosis","linkedConditionId":"asthma_123","referenceType":"at_dx","year":2020,"month":3,"precision":"month","computedDate":"2020-03-01T00:00:00Z"}`  

**Display (UI[Pt]):** `March 2020 (@_dx)`  
**Display (UI[Pr]):** `March 2020 (@_dx)`  
**DB Columns:**  
- `prescribed_start_date_display_pt="March 2020 (@_dx)"`  
- `prescribed_start_date_display_pr="March 2020 (@_dx)"`  
- `prescribed_start_date_display_active='same'`

---

## Example 3 – “After I was diagnosed” (Only relative info)

**Condition diagnosis raw:**  
`{"type":"framework1","selection":"within_5_years","year":2020,"precision":"year"}`  
**Medication start raw:**  
`{"type":"after_diagnosis","linkedConditionId":"asthma_123","referenceType":"after_dx","afterDiagnosisPeriod":{"year":1,"precision":"year"}}`

**Display (UI[Pt]):** `(Later or added) After I was diagnosed`  
**Display (UI[Pr]):** `(Later or added) After I was diagnosed`  
**DB Columns:**  
- `prescribed_start_date_display_pt="(Later or added) After I was diagnosed"`  
- `prescribed_start_date_display_pr="(Later or added) After I was diagnosed"`  
- `prescribed_start_date_display_active='same'`

---

## Example 4 – “After I was diagnosed” (Exact month captured)

**Condition diagnosis raw:**  
`{"type":"framework1","selection":"within_1_year","year":2020,"month":3,"precision":"month","computedDate":"2020-03-01T00:00:00Z"}`  
**Medication start raw:**  
`{"type":"after_diagnosis","linkedConditionId":"asthma_123","referenceType":"after_dx","year":2021,"month":1,"precision":"month","computedDate":"2021-01-01T00:00:00Z"}`  

**Display (UI[Pt]):** `January 2021 (after_dx)`  
**Display (UI[Pr]):** `January 2021 (after_dx)`  
**DB Columns:**  
- `prescribed_start_date_display_pt="January 2021 (after_dx)"`  
- `prescribed_start_date_display_pr="January 2021 (after_dx)"`  
- `prescribed_start_date_display_active='same'`

---

## Example 5 – Conflict Detection After Condition Update

**Original state:** Condition diagnosed March 2020, medication “After diagnosed” January 2021.  
**Updated condition diagnosis:** February 2021 (now later than medication start).  

**Auto-update rule triggered:** `Medication.PrescribedStartDate.AutoUpdate`  
**System result:**  
- `validationWarning = "Medication start date precedes updated diagnosis date"`  
- UI prompts provider/patient to review.  

---

## Example 6 – Patient vs Provider Divergence (pr_only)

**Field:** Prescribed / Start day  
**Context:** Provider recorded exact date for audit; patients should only see context text.

**Medication start raw:**  
`{"type":"direct_date","year":2022,"month":5,"day":12,"precision":"day","computedDate":"2022-05-12T00:00:00Z","internalNote":"Back-dated for reconciliation"}`  

**Display (UI[Pt]):** `(Since) Right when I was diagnosed` *(configured to hide exact date for patients in this scenario)*  
**Display (UI[Pr]):** `May 12, 2022`  
**DB Columns:**  
- `prescribed_start_date_display_pt="(Since) Right when I was diagnosed"`  
- `prescribed_start_date_display_pr="May 12, 2022"`  
- `prescribed_start_date_display_active='pr_only'`

---

## References to ALL Rules

- `Medication.PrescribedStartDate.Display` — presentation layer logic  
- `Medication.PrescribedStartDate.AutoUpdate` — keeps display in sync when condition dates change  
- `Medication.PrescribedStartDate.Validation` — enforces after-diagnosis constraint  

Use this sheet as a quick reference to confirm the logic behaves as intended.
