# Dependencies and Contracts — aether-ai-enterprise

Dependencies: aether-ai-auth and aether-ai-security for approved identity/access contracts; aether-ai-billing for entitlement checks where applicable; aether-ai-observability for safe telemetry.

Version SSO configuration, membership/admin actions, policy updates, and audit-export requests. Define scope, limits, error codes, idempotency, retention, and audit fields. Avoid creating a second source of truth for tenant membership. ADR-0021 must assign canonical membership/role-grant ownership before implementation.
