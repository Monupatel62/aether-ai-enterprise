# Engineering Standard — aether-ai-enterprise

- Keep identity, membership, policy, and entitlement authorities explicit.
- Do not implement a competing membership/role source of truth.
- Enforce authorization server-side and fail closed on dependency failures.
- Audit privileged changes and exports without logging secrets or sensitive payloads.
- Version contracts and document migration/rollback for policy changes.
- Use synthetic tenants and test identity providers.
- No production readiness claim without executed security and integration tests.
