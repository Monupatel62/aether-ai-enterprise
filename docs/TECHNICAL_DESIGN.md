# Technical Design — aether-ai-enterprise

Proposed modules: organization policy API, SSO configuration lifecycle, membership-authority adapter, audit export service, and entitlement adapter.

Security invariants: server-side organization authorization for every operation; validate SSO issuer/audience/signing keys/redirect configuration; scope exports to authorized tenants and audit every export. Keep membership authority external until ADR-0021 decides otherwise. Open decisions: membership authority, SSO/SCIM, export format, retention, entitlement source.
