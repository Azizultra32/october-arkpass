# Display Column Rollout Tracker

| Entity.Field | Pattern Added? | Notes |
|--------------|----------------|-------|
| medications.prescribed_start_date | ✅ Planned | Raw JSON + display pt/pr/active defined |
| medications.route | ⏳ Pending | Needs patient/provider label split (see MEDICATIONS_DROPDOWN_OPTIONS.md) |
| medications.status | ⏳ Pending | Follow same dropdown pattern |
| medication_display_cache.multi_condition | ✅ Specified | See logic/rules/display/medication-multi-condition.all |
| conditions.diagnosis_date | ⏳ Pending | Requires same framework columns (`*_raw`, `*_display_*`) |
| documents.uploaded_at | ❌ Not required | Same display for all roles |
| documents.category | ⏳ Pending | Might need patient-friendly labels |

> Update this table as display columns are implemented. Keep in sync with migrations.
