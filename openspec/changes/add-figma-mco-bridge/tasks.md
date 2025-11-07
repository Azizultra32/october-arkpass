# Implementation Tasks

## 1. Discovery & Environment Prep
- [ ] 1.1 Confirm Figma Desktop MCP plugin is installed and the ArkPass file is accessible
- [ ] 1.2 Capture the canonical MCP endpoint and authentication requirements
- [ ] 1.3 Identify a representative node ID and asset to use for automated checks

## 2. Bridge Tooling
- [ ] 2.1 Implement `scripts/mco-figma-healthcheck.ts` (or shell equivalent) that:
  - Performs MCP handshake against `http://127.0.0.1:3845/mcp`
  - Fetches the chosen node ID and validates response structure
  - Downloads one referenced asset and verifies content length
- [ ] 2.2 Add structured, actionable error messaging for common failure modes (Figma closed, auth expired, port busy)
- [ ] 2.3 Update `.cascade/mcp.json` or related config to reflect any new parameters discovered in discovery

## 3. Documentation & Validation
- [ ] 3.1 Document startup, health-check, and troubleshooting steps in `README-OPENSPEC.md` (or a new dedicated guide)
- [ ] 3.2 Run the health-check script twice (Figma online/offline) and record expected output in the docs
- [ ] 3.3 Validate the change with `openspec validate add-figma-mco-bridge --strict`
