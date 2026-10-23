# Dependencies and Contracts — aether-ai-enterprise

**Status:** Proposed. Canonical tenant/workspace membership and role-grant ownership remains unresolved under ADR-0021.

## Dependencies
- `aether-ai-auth`: principal and session contracts.
- `aether-ai-security`: shared policy decision and security-event contracts.
- `aether-ai-billing`: commercial entitlement contracts where applicable.
- `aether-ai-observability`: safe telemetry interfaces.

Enterprise must not import API, Admin UI, or resource-domain implementation details. Document package imports, network calls, and events as separate edge types.

## Owned contracts
- Enterprise-specific SSO/SCIM administration, if approved.
- Enterprise settings and feature entitlements where distinct from resource authorization.
- Audit-export requests and enterprise administration workflows, subject to approved authorization policy.

## Membership ownership boundary
The phrase “membership/admin actions” describes possible workflows; it does not assign Enterprise canonical ownership. Until ADR-0021 is accepted, Enterprise must not create canonical membership or role-grant storage, duplicate lifecycle state, or define competing semantics.

If Option A in the decision brief is accepted, confirm explicitly that Enterprise owns membership for every customer tier, including non-enterprise and personal users. If another option is accepted, Enterprise consumes that owner's versioned contract. Auth remains responsible for identity/session lifecycle. Resource-owning domains enforce resource/action authorization, and billing entitlement is not resource permission.

## Contract requirements
For each public API/event, document version, producer/consumer, actor and tenant scope, idempotency, ordering/replay, limits, errors, retention/deletion, and audit fields. Client-provided tenant IDs and roles are not authorization evidence.

## Implementation gate
Do not implement membership lifecycle or role-grant persistence here until ADR-0021 is accepted and the master dependency matrix, edge register, repository catalog, and security contracts are reconciled. This document does not select an option or authorize implementation.
