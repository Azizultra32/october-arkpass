#!/usr/bin/env bash
#
# Agent Summoning Script
# Usage: ./scripts/agent-summon.sh <role> [agent-id]
#
# Examples:
#   ./scripts/agent-summon.sh adjudicator
#   ./scripts/agent-summon.sh builder AGENT-00001
#

set -euo pipefail

ROLE="${1:-}"
AGENT_ID="${2:-}"

if [[ -z "$ROLE" ]]; then
  echo "❌ Error: Role required"
  echo "Usage: ./scripts/agent-summon.sh <role> [agent-id]"
  echo ""
  echo "Available roles:"
  echo "  - builder"
  echo "  - librarian"
  echo "  - adjudicator"
  echo "  - consigliere"
  echo "  - constitution_keeper"
  echo "  - twin_a"
  echo "  - twin_b"
  exit 1
fi

GENOME_FILE="agents/genomes/${ROLE}.genome.yaml"

if [[ ! -f "$GENOME_FILE" ]]; then
  echo "❌ Error: GENOME not found for role: $ROLE"
  echo "Expected: $GENOME_FILE"
  exit 1
fi

echo "🧬 Loading GENOME: $ROLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# If specific agent requested, load their MOJO
if [[ -n "$AGENT_ID" ]]; then
  MOJO_FILE="agents/mojos/${AGENT_ID}.yaml"

  if [[ ! -f "$MOJO_FILE" ]]; then
    echo "❌ Error: MOJO not found for agent: $AGENT_ID"
    echo "Expected: $MOJO_FILE"
    exit 1
  fi

  AGENT_NAME=$(grep "^assigned_name:" "$MOJO_FILE" | awk '{print $2}' | tr -d '"')
  GENDER=$(grep "^gender:" "$MOJO_FILE" | awk '{print $2}' | tr -d '"')
  RATING=$(grep "^  overall_rating:" "$MOJO_FILE" | awk '{print $2}')
  STATUS=$(grep "^status:" "$MOJO_FILE" | awk '{print $2}' | tr -d '"')

  echo "💾 Loading MOJO: $AGENT_ID"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "   Name: $AGENT_NAME"
  echo "   Type: $GENDER"
  echo "   Rating: $RATING/5.0"
  echo "   Status: $STATUS"
  echo ""

  if [[ "$GENDER" == "broski" ]]; then
    echo "⚡ $AGENT_NAME BROSKI is ONLINE"
  else
    echo "⚡ $AGENT_NAME HOMESLICE is ONLINE"
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🎯 Mission: Ready for tasking"
  echo ""
  echo "Agent file: $MOJO_FILE"
  echo "Genome file: $GENOME_FILE"

else
  # No specific agent - show available agents for this role
  echo ""
  echo "Available ${ROLE} agents:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  FOUND=0
  for mojo in agents/mojos/AGENT-*.yaml; do
    if [[ ! -f "$mojo" ]]; then
      continue
    fi

    MOJO_GENOME=$(grep "^genome:" "$mojo" | awk '{print $2}' | tr -d '"')

    if [[ "$MOJO_GENOME" == "$ROLE" ]]; then
      FOUND=1
      AID=$(grep "^agent_id:" "$mojo" | awk '{print $2}' | tr -d '"')
      ANAME=$(grep "^assigned_name:" "$mojo" | awk '{print $2}' | tr -d '"')
      AGENDER=$(grep "^gender:" "$mojo" | awk '{print $2}' | tr -d '"')
      ARATING=$(grep "^  overall_rating:" "$mojo" | awk '{print $2}')
      ASTATUS=$(grep "^status:" "$mojo" | awk '{print $2}' | tr -d '"')

      printf "  %s - %s (%s) - Rating: %.1f - Status: %s\n" \
        "$AID" "$ANAME" "$AGENDER" "$ARATING" "$ASTATUS"
    fi
  done

  if [[ $FOUND -eq 0 ]]; then
    echo "  No agents found for role: $ROLE"
    echo ""
    echo "💡 Create new agent with: ./scripts/agent-create.sh --role $ROLE --name <name> --gender <broski|homeslice>"
  fi

  echo ""
  echo "To summon specific agent: ./scripts/agent-summon.sh $ROLE AGENT-#####"
fi
