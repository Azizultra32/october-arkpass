# API Display Selection Contract

This spec describes how API controllers choose which display column (`*_display_pt`, `*_display_pr`) to return.

---

## Headers / Claims

| Mechanism | Description |
|-----------|-------------|
| `X-Armada-Viewer: patient` | Force patient view |
| `X-Armada-Viewer: provider` | Force provider view |
| JWT claim `role` | Default selection when header missing (`patient`, `provider`, `system`) |

If neither header nor claim is present, fall back to `*_raw`.

---

## Selection Algorithm

```
function selectDisplayValue(field, row, viewer) {
  const active = row[field + '_display_active'];
  switch (viewer) {
    case 'patient':
      if (['pt_only', 'both', 'same'].includes(active)) {
        return row[field + '_display_pt'];
      }
      break;
    case 'provider':
      if (['pr_only', 'both', 'same'].includes(active)) {
        return row[field + '_display_pr'];
      }
      break;
    default:
      // system / integration callers
      return row[field + '_raw'];
  }

  // Fallbacks
  if (active === 'same') {
    return row[field + '_display_pt'] ?? row[field + '_display_pr'];
  }
  return row[field + '_raw'];
}
```

---

## Payload Examples

### Patient request
```
GET /api/patients/{id}/medications
Headers: X-Armada-Viewer: patient

Response snippet:
{
  "name": "Spironolactone",
  "start_date": "(Since) Right when I was diagnosed",
  "multi_condition": "(+ 1 other condition)"
}
```

### Provider request
```
GET /api/patients/{id}/medications
Headers: X-Armada-Viewer: provider

Response snippet:
{
  "name": "Spironolactone",
  "start_date": "May 12, 2022 (@_dx)",
  "multi_condition": "[I50.9 + (?)E87.6]"
}
```

---

## Todo
- [ ] Update API middleware to parse `X-Armada-Viewer`.
- [ ] Add unit tests verifying selection logic.
- [ ] Document new header in public API docs.
