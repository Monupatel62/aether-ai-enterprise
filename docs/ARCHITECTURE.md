# Architecture — aether-ai-enterprise

This component owns enterprise administration capabilities, not canonical identity or membership unless ADR-0021 explicitly assigns that ownership.

Flow: authenticate through the approved identity boundary; resolve membership from the canonical authority; authorize the exact organization action; apply policy change or scoped export; emit a redacted audit record. Fail closed on identity, membership, or policy lookup failure. Never trust client-supplied tenant IDs or role assertions as authorization proof.
