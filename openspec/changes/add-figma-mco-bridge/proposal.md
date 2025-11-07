# Add Figma MCO Bridge

## Why
ArkPass relies on Figma as the primary design source, but there is no reliable way for the Model Context Operator (MCO) to reach the local Figma MCP server today. Design context (node trees, tokens, assets) must be available to automation tools so that database specifications and UI work stay aligned with the latest Figma document. We need a hardened bridge that documents how the MCO discovers the Figma endpoint, validates health, and surfaces actionable errors when the design tool is offline.

## What Changes
- Document and codify a repeatable workflow for connecting MCO to the Figma Desktop MCP server at `http://127.0.0.1:3845/mcp`
- Ship a CLI health-check that verifies handshake, node fetch, and asset availability for a representative Figma node
- Define monitoring and troubleshooting steps so failures surface clear remediation guidance inside the CLI output
- Capture these expectations in a new `figma-integration` capability spec with scenarios for success, degraded service, and recovery

## Impact

### Affected specs
- **NEW**: `figma-integration` – describes how tooling accesses Figma design context through MCO

### Affected code
- `scripts/mco-figma-healthcheck.ts` (or equivalent) for automated validation
- `.cascade/mcp.json` updates or documentation to register required MCO endpoints
- Developer documentation detailing startup workflow and troubleshooting steps

### User-facing changes
- Developers running ArkPass automation scripts will receive immediate feedback if the Figma bridge is unavailable, including remediation steps
- Successful health checks confirm design context access before running extraction or generation tooling

### Dependencies
- Figma Desktop with the MCP plugin enabled and signed in to the ArkPass file
- Model Context Operator runtime with network access to localhost
- Existing design extraction docs (`README-OPENSPEC.md`, `EXTRACTION_METHODOLOGY_ANALYSIS.md`) for reference node IDs
