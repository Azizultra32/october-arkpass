import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CommandLink, CommandState, AgentStatus } from "@/lib/mock-state"
import { mockState } from "@/lib/mock-state"
import { cn } from "@/lib/utils"
import { Activity, Zap, ShieldCheck, AlertTriangle } from "lucide-react"

type LinkCoordinates = CommandLink & {
  x1: number
  y1: number
  x2: number
  y2: number
}

const statusPalette: Record<AgentStatus, { label: string; badge: string; glow: string }> = {
  active: {
    label: "Active",
    badge: "bg-success/20 text-success border-success/30",
    glow: "shadow-neon-primary",
  },
  idle: {
    label: "Idle",
    badge: "bg-muted/30 text-muted-foreground border-muted/40",
    glow: "shadow-neon-secondary",
  },
  offline: {
    label: "Offline",
    badge: "bg-border text-muted-foreground border-border",
    glow: "",
  },
  blocked: {
    label: "Blocked",
    badge: "bg-alert/30 text-alert border-alert/50",
    glow: "shadow-[0_0_18px_hsla(var(--alert),0.45)]",
  },
}

const signalPalette: Record<
  CommandLink["signal"],
  { stroke: string; glow: string; icon: React.ReactNode }
> = {
  assignment: {
    stroke: "stroke-sky-400",
    glow: "drop-shadow-[0_0_12px_rgba(56,189,248,0.55)]",
    icon: <Zap className="h-3.5 w-3.5 text-sky-400" />,
  },
  completion: {
    stroke: "stroke-emerald-400",
    glow: "drop-shadow-[0_0_12px_rgba(74,222,128,0.55)]",
    icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />,
  },
  escalation: {
    stroke: "stroke-alert",
    glow: "drop-shadow-[0_0_12px_rgba(248,113,113,0.55)]",
    icon: <AlertTriangle className="h-3.5 w-3.5 text-alert" />,
  },
  heartbeat: {
    stroke: "stroke-accent",
    glow: "drop-shadow-[0_0_10px_rgba(192,132,252,0.45)]",
    icon: <Activity className="h-3.5 w-3.5 text-accent" />,
  },
}

function useCommandLinks(state: CommandState) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map())
  const [links, setLinks] = useState<LinkCoordinates[]>([])

  const registerNode = (id: string) => (element: HTMLDivElement | null) => {
    nodeRefs.current.set(id, element)
  }

  useLayoutEffect(() => {
    function computeLinks() {
      const container = containerRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()

      const nextLinks: LinkCoordinates[] = []
      for (const link of state.links) {
        const from = nodeRefs.current.get(link.from)
        const to = nodeRefs.current.get(link.to)
        if (!from || !to) continue

        const fromRect = from.getBoundingClientRect()
        const toRect = to.getBoundingClientRect()

        const x1 = fromRect.left + fromRect.width / 2 - containerRect.left
        const y1 = fromRect.bottom - containerRect.top - 12
        const x2 = toRect.left + toRect.width / 2 - containerRect.left
        const y2 = toRect.top - containerRect.top

        nextLinks.push({
          ...link,
          x1,
          y1,
          x2,
          y2,
        })
      }

      setLinks(nextLinks)
    }

    computeLinks()
    window.addEventListener("resize", computeLinks)
    const observer = new MutationObserver(computeLinks)
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      window.removeEventListener("resize", computeLinks)
      observer.disconnect()
    }
  }, [state.links])

  return { containerRef, registerNode, links }
}

interface NodeCardProps {
  id: string
  codename: string
  status: AgentStatus
  context: number
  subtitle: string
  meta?: string
  variant?: "prime" | "librarian" | "builder"
  register: (id: string) => (element: HTMLDivElement | null) => void
  footer?: React.ReactNode
  accent?: React.ReactNode
}

function NodeCard({
  id,
  codename,
  status,
  context,
  subtitle,
  meta,
  variant = "builder",
  register,
  footer,
  accent,
}: NodeCardProps) {
  const palette = statusPalette[status]

  return (
    <Card
      ref={register(id)}
      className={cn(
        "relative w-[280px] overflow-hidden border border-border/60 bg-card/85 backdrop-blur transition duration-500",
        palette.glow,
        status === "active" && "animate-ambient-breathe",
        variant === "prime" && "w-[320px] border-primary/40",
        variant === "librarian" && "border-accent/40",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary/70 to-primary/20" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold tracking-wide text-primary-foreground">
            {codename}
          </CardTitle>
          <Badge className={cn("border px-2.5 py-1 text-xs uppercase tracking-wider", palette.badge)}>
            {palette.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        {meta ? <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">{meta}</p> : null}
      </CardHeader>
      <CardContent className="flex items-center gap-4 pb-4">
        <div className="relative">
          <div className="h-14 w-14 rounded-[32%] bg-gradient-to-br from-primary/40 via-primary/10 to-transparent blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "grid h-12 w-12 place-items-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary-foreground shadow-inner",
                status === "blocked" && "border-alert/40 bg-alert/10 text-alert",
              )}
            >
              {Math.min(context, 99)}%
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            Context Buffer
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary/70" />
            Channel Integrity
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            Signal Density
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border/50 bg-card/60 px-6 py-3 text-xs text-muted-foreground">
        {footer ?? <span className="tracking-[0.3em] text-primary-foreground/60">STABLE</span>}
        {accent}
      </CardFooter>
    </Card>
  )
}

export function CommandArena() {
  const state = useMemo(() => mockState, [])
  const { containerRef, registerNode, links } = useCommandLinks(state)

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(192,132,252,0.14),transparent_55%),#020617] py-16 text-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
          <header className="flex flex-col items-center gap-3 text-center">
            <Badge className="bg-primary/20 px-4 py-1 text-primary">
              ArkPass Command Arena
            </Badge>
            <h1 className="text-4xl font-semibold tracking-[0.18em] text-primary-foreground">
              OPERATIONAL LATTICE
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Live nerve-center monitoring of Prime, Librarian, and Node orchestration. Pulses indicate active
              assignments, completions, and escalations flowing through illuminated command conduits.
            </p>
          </header>

          <div ref={containerRef} className="relative mx-auto flex w-full max-w-5xl flex-col gap-16">
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="pulse-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
                  <stop offset="50%" stopColor="rgba(56,189,248,0.9)" />
                  <stop offset="100%" stopColor="rgba(56,189,248,0.25)" />
                </linearGradient>
                <linearGradient id="pulse-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(74,222,128,0.25)" />
                  <stop offset="55%" stopColor="rgba(74,222,128,0.9)" />
                  <stop offset="100%" stopColor="rgba(74,222,128,0.25)" />
                </linearGradient>
                <linearGradient id="pulse-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(192,132,252,0.25)" />
                  <stop offset="55%" stopColor="rgba(192,132,252,0.9)" />
                  <stop offset="100%" stopColor="rgba(192,132,252,0.25)" />
                </linearGradient>
                <linearGradient id="pulse-alert" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(248,113,113,0.25)" />
                  <stop offset="55%" stopColor="rgba(248,113,113,0.9)" />
                  <stop offset="100%" stopColor="rgba(248,113,113,0.25)" />
                </linearGradient>
              </defs>
              {links.map((link) => {
                const palette = signalPalette[link.signal]
                const gradientId =
                  link.signal === "assignment"
                    ? "pulse-blue"
                    : link.signal === "completion"
                      ? "pulse-green"
                      : link.signal === "escalation"
                        ? "pulse-alert"
                        : "pulse-accent"
                return (
                  <g key={link.id} className={palette.glow}>
                    <line
                      x1={link.x1}
                      y1={link.y1}
                      x2={link.x2}
                      y2={link.y2}
                      stroke={`url(#${gradientId})`}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray="14 16"
                      className="animate-flow-trace opacity-90"
                    />
                  </g>
                )
              })}
            </svg>

            <div className="relative flex justify-center">
              <NodeCard
                id={state.prime.id}
                codename={state.prime.codename}
                status={state.prime.status}
                context={state.prime.context}
                subtitle="Supervisor • Prime Command"
                meta={`NODE ${state.prime.id.toUpperCase()}`}
                variant="prime"
                register={registerNode}
                footer={
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Signal Stable
                  </div>
                }
              />
            </div>

            <div className="relative flex flex-wrap items-start justify-center gap-8">
              {state.librarians.map((librarian) => (
                <NodeCard
                  key={librarian.id}
                  id={librarian.id}
                  codename={librarian.codename}
                  status={librarian.status}
                  context={librarian.context}
                  subtitle="Context Historian • Librarian"
                  meta={`LINKS ${librarian.builders.length.toString().padStart(2, "0")}`}
                  variant="librarian"
                  register={registerNode}
                  footer={
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] uppercase tracking-[0.25em]">
                            roster
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-card/90 text-xs">
                          <div className="flex flex-col gap-1">
                            {librarian.builders.map((builderId) => {
                              const builder = state.builders.find((item) => item.id === builderId)
                              return builder ? (
                                <span key={builder.id} className="text-muted-foreground">
                                  {builder.codename} • {builder.mission}
                                </span>
                              ) : null
                            })}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-[11px] uppercase tracking-[0.35em] text-accent-foreground/70">
                        {librarian.builders.length} Nodes
                      </span>
                    </div>
                  }
                />
              ))}
            </div>

            <div className="relative grid gap-6 md:grid-cols-3">
              {state.builders.map((builder) => {
                const door = state.doors.find((d) => d.id === builder.door)
                return (
                  <NodeCard
                    key={builder.id}
                    id={builder.id}
                    codename={builder.codename}
                    status={builder.status}
                    context={builder.context}
                    subtitle={builder.mission}
                    meta={door ? `${door.id} • ${door.status.toUpperCase()}` : undefined}
                    register={registerNode}
                    accent={
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="border-secondary/40 bg-secondary/25 text-secondary-foreground">
                          {builder.door}
                        </Badge>
                      </div>
                    }
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
