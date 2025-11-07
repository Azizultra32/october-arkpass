## ADDED Requirements

### Requirement: Figma Design Context Availability
The tooling SHALL expose the Figma design document to Model Context Operator clients via the registered MCP endpoint.

#### Scenario: Successful Handshake
- **WHEN** the developer runs the MCO health check while Figma Desktop is open on the ArkPass file with the MCP plugin enabled
- **THEN** the bridge responds within 2 seconds with provider metadata (name, version, capabilities)
- **AND** confirms the endpoint URL being used

#### Scenario: Node Retrieval
- **WHEN** the health check requests design context for the configured test node ID
- **THEN** the response includes the node tree, component metadata, and layout attributes required for extraction
- **AND** the tool logs the node name to confirm the correct document was accessed

#### Scenario: Asset Fetch
- **WHEN** the test node references an exported asset (e.g., `localhost:3845/assets/*.svg`) and the tool downloads it
- **THEN** the asset download succeeds and the binary length is reported back to the caller
- **AND** the file is stored in a temporary location that is cleaned up after the check

### Requirement: Figma Bridge Failure Handling
The tooling SHALL surface actionable diagnostics when the Figma MCP endpoint is unavailable.

#### Scenario: Figma Offline Warning
- **WHEN** the health-check tool runs while Figma Desktop or the MCP plugin is closed
- **THEN** the tool exits with a non-zero status and recommends opening Figma and re-authenticating
- **AND** no node or asset checks are attempted after the failure

#### Scenario: Authentication Expired
- **WHEN** the bridge receives an authentication error from the MCP endpoint
- **THEN** the CLI output instructs the developer to sign in again and retries are deferred until auth succeeds
- **AND** the exit code reflects an authentication failure distinct from connectivity errors

#### Scenario: Port Conflict
- **WHEN** another process is already using port 3845 and the bridge attempts to connect
- **THEN** the tool reports the conflicting process ID and documents how to free the port in the troubleshooting guide
- **AND** the tool suggests an override flag if the endpoint is exposed on an alternate port
