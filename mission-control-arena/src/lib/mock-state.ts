export type AgentStatus = "active" | "idle" | "offline" | "blocked"

export interface PrimeNode {
  id: string
  codename: string
  context: number
  status: AgentStatus
}

export interface LibrarianNode {
  id: string
  codename: string
  context: number
  status: AgentStatus
  builders: string[]
}

export interface BuilderNode {
  id: string
  codename: string
  mission: string
  door: string
  context: number
  status: AgentStatus
  supervisor: string
}

export interface DoorNode {
  id: string
  label: string
  status: "queued" | "processing" | "merged" | "archived"
  assignedTo: string
}

export interface CommandLink {
  id: string
  from: string
  to: string
  signal: "assignment" | "completion" | "escalation" | "heartbeat"
}

export interface CommandState {
  prime: PrimeNode
  librarians: LibrarianNode[]
  builders: BuilderNode[]
  doors: DoorNode[]
  links: CommandLink[]
  generatedAt: string
}

export const mockState: CommandState = {
  prime: {
    id: "prime-alpha",
    codename: "Grandmaster Ali",
    context: 18,
    status: "active",
  },
  librarians: [
    {
      id: "lib-01",
      codename: "Archivist Vega",
      context: 22,
      status: "active",
      builders: ["node-omega", "node-zenith"],
    },
    {
      id: "lib-02",
      codename: "Skunkworks Nyx",
      context: 12,
      status: "idle",
      builders: ["node-photon"],
    },
  ],
  builders: [
    {
      id: "node-omega",
      codename: "Node Ω",
      mission: "Stabilize supabase migrations",
      door: "Door-01",
      context: 46,
      status: "active",
      supervisor: "lib-01",
    },
    {
      id: "node-zenith",
      codename: "Node Zenith",
      mission: "Command Arena prototype",
      door: "Door-Prime",
      context: 32,
      status: "active",
      supervisor: "lib-01",
    },
    {
      id: "node-photon",
      codename: "Node Photon",
      mission: "Catalogue Door-04 legacy artifacts",
      door: "Door-04",
      context: 12,
      status: "idle",
      supervisor: "lib-02",
    },
  ],
  doors: [
    {
      id: "Door-01",
      label: "Primary ArkPass Stack",
      status: "processing",
      assignedTo: "node-omega",
    },
    {
      id: "Door-04",
      label: "Legacy ArkPass 2016",
      status: "queued",
      assignedTo: "node-photon",
    },
    {
      id: "Door-Prime",
      label: "Command Arena Build",
      status: "processing",
      assignedTo: "node-zenith",
    },
  ],
  links: [
    {
      id: "link-prime-lib01",
      from: "prime-alpha",
      to: "lib-01",
      signal: "heartbeat",
    },
    {
      id: "link-prime-lib02",
      from: "prime-alpha",
      to: "lib-02",
      signal: "assignment",
    },
    {
      id: "link-lib01-node-omega",
      from: "lib-01",
      to: "node-omega",
      signal: "assignment",
    },
    {
      id: "link-lib01-node-zenith",
      from: "lib-01",
      to: "node-zenith",
      signal: "heartbeat",
    },
    {
      id: "link-lib02-node-photon",
      from: "lib-02",
      to: "node-photon",
      signal: "completion",
    },
  ],
  generatedAt: new Date().toISOString(),
}
