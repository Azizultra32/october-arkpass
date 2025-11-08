# ArkPass Operational Status — 2025-11-08

> **Read this snapshot first.** It is Layer 1 of the context stack.  
> Layer 2 = daily logs in `logs/`. Layer 3 = the deep documentation referenced below.

---

## 🔑 High-Level State
- **Primary Repo**: `october-arkpass` (main branch)
- **Grandmaster**: Ali (ultimate authority)
- **Supervisor on Duty**: _Unassigned_ → assign before starting new work sessions
- **Context Historians (Librarians)**: _Unassigned_ → **at least 1 required** for builders to proceed
- **BP Demolition Man (Redundancy Control)**: _Unassigned_ (queue cleanup when historians flag duplicates)
- **Builder Sessions**: _ON HOLD_ (await librarian coverage + supervisor check)

---

## 🧭 Operational Focus
| Domain | Status | Highlights | Next Immediate Action |
|--------|--------|------------|------------------------|
| **Database / Supabase** | ✅ Stable in dev | Local Postgres 14 sandbox up (`tmp/pgdata`, port 5433). Ran `scripts/enhanced-migration-with-dates.sql` + `FHIR_SCHEMA_MIGRATIONS.sql`. Verified 33 public tables, dual-mode date functions, full RLS coverage, sample data seeded, OpenSpec tasks 1.4–1.7 & 2.x–3.x marked complete. | Plan production backup + migration dry-run checklist (Task 1.8). |
| **Frontend / App** | 🟡 Pending | Current app auto-routes to `/medications`; dashboard & navigation missing. Legacy downloads contain candidate components (see daily log 2025-11-08). | Await supervisor + librarian review of legacy repos before port/build decision. |
| **Documentation / Specs** | ✅ Extensive | 91 Figma screens extracted; Tenet Prime being refactored into constitution; new context framework in progress. | Finalize constitution + files, then assign librarians to maintain matrix. |
| **Repository Intake** | 🟡 Starting | Additional ArkPass repos/folders expected from Grandmaster. | Log each drop under “Intake Queue” with door IDs before analysis. |

---

## 📥 Intake Queue (“Doors”)
| Door ID | Source Path/Repo | Status | Assigned Librarian | Notes |
|---------|------------------|--------|--------------------|-------|
| — | _None yet_ | Waiting | — | Populate when Grandmaster provides additional material. |

---

## 🧑‍🤝‍🧑 Staffing Ledger
| Role | Call Sign | On Duty | Notes |
|------|-----------|---------|-------|
| **Supervisor** | “Prime” | _Unassigned_ | Must verify librarian ratio before builders start. |
| **Context Document Historian** | “Librarian” | _Unassigned_ | Maintain `CURRENT_STATUS.md`, logs, door matrix, context merges. |
| **Builder Agent** | “Node” | Paused | Resume once supervisor confirms context coverage. |
| **Bullshit Preventer Demolition Man** | “Demolition Man / B.P.D. Man” | _Unassigned_ | Invoked when redundant or conflicting context discovered. |

**Ratio Rule**: `#Builders ≤ 3 × #Librarians`. If violated → Supervisor pauses/denies new sessions.

---

## 📚 Mandatory References
- `ARKPASS_DEV_TENET_PRIME.md` — Constitution & deep appendices.
- `logs/2025-11-08.md` — Today’s detailed session log (Layer 2).
- `openspec/changes/fhir-database-harmonization/tasks.md` — Database work checklist (updated to reflect latest progress).
- `scripts/` directory — Migration + testing utilities (see README).

---

## 🚦 Readiness Checklist (Before Starting Work)
1. ✅ Supervisor assigned & confirms librarian coverage ratio.
2. ✅ Librarian updates this status snapshot if anything changed since last session.
3. ✅ Review today’s log tail (`logs/2025-11-08.md`).
4. ✅ Claim/confirm Door IDs for any new repos/folders you will inspect.
5. ✅ Follow clock-in procedure in Tenet Prime (includes tmux session + context budget).

If any item is missing → **do not start**; escalate to Grandmaster Ali.

---

## 📝 Observations / Notes
- Production migration remains gated by Tasks 1.8–1.10 (requires Supabase access and backups).
- Legacy repo audit pending a librarian sweep once sources are provided.
- Context framework (50% / 75% / 90% summaries) becomes mandatory once constitution is committed.

_Last maintained: 2025-11-08 by Agent Codex (implementation session)._ 
