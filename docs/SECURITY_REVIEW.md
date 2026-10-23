# Security Review — aether-ai-enterprise

Status: checklist only; no implementation or test evidence is present.

Threats: cross-tenant administration, role escalation, SSO misconfiguration, unauthorized audit exports, and competing membership authorities.

Controls: resolve canonical membership owner; enforce server-side authorization; validate SSO issuer/audience/signatures/redirects; limit and audit exports; keep secrets in runtime configuration.

Tests: cross-tenant denial, role escalation, SSO failures, export scope, membership changes, and admin audit records.
