# Enterprise SSO and Directory Lifecycle Security Contract

**Status:** proposed contract and acceptance criteria only. No SSO/SCIM endpoint, identity-provider integration, or runtime test is claimed implemented.

## Scope and authority

This document defines security requirements for enterprise identity-provider configuration and, if separately approved, directory-driven user lifecycle integration. It does not select an SSO/SCIM vendor or authorize implementation.

Enterprise may manage organization-level configuration and workflow, but must not become a competing canonical tenant membership or role-grant authority. ADR-0021 remains unresolved; membership, role grants, and effective authorization must continue to use the authority approved by the platform decision process. Authentication assertions, directory attributes, and group names do not independently grant application permissions.

## SSO configuration lifecycle

Treat issuer, audience/client ID, redirect URI, signing-key source, logout URI, domain verification, and metadata URLs as security-sensitive configuration.

- Validate configuration server-side before activation; do not trust browser validation.
- Require exact allowlisted redirect URIs and reject wildcard or open redirects.
- Validate issuer and audience against the organization’s explicitly configured identity-provider profile.
- Validate signature, allowed algorithms, key provenance, expiry/not-before, nonce/state, and protocol-specific replay protections.
- Apply secure metadata/JWKS refresh rules, bounded fetches, and safe failure behavior. Do not fetch arbitrary user-provided URLs without SSRF protections.
- Support staged configuration validation and rollback to a previously approved version. A failed or incomplete change must not silently weaken authentication.
- Keep client secrets, private keys, and bearer credentials write-only. Display configured status and key identifiers, never secret values.
- Separate configuration-edit permission from activation permission where the accepted authorization matrix requires it. Record actor, configuration version, validation result, and activation outcome.
- Avoid account linking based only on a mutable email address. Define a verified stable subject/issuer mapping and an explicit recovery process.

## Directory provisioning and deprovisioning

SCIM or another directory provisioning mechanism is an optional future capability, not an approved implementation choice. If adopted, define the supported protocol/version, resource schema, authentication, group semantics, and provider-specific behavior before exposing endpoints.

- Authenticate provisioning callers with dedicated credentials or an approved mutually authenticated mechanism; scope credentials to the intended organization and endpoint.
- Rotate and revoke provisioning credentials; never return existing secrets.
- Validate content type, schema, size, attribute types, and allowed operations; rate-limit requests and bound pagination/filter complexity.
- Treat external subject IDs and group values as untrusted mapping inputs. A group name must not silently become a privileged role without an approved mapping and current authorization decision.
- Make create/update/deactivate operations idempotent. Handle duplicate delivery, out-of-order updates, retries, and replay explicitly.
- Deactivation must trigger the approved access-revocation workflow for sessions and relevant credentials/resources; a directory record update alone is not proof that access has ended.
- Preserve sufficient audit evidence for provisioning, changes, deactivation, failed processing, and reactivation. Do not hard-delete audit history as a side effect of deactivation.
- Do not assume SCIM deprovisioning automatically revokes API keys, service accounts, OAuth grants, or other non-human credentials; define those lifecycles separately.
- Do not restore previous privileges automatically on reactivation without a fresh policy decision.

## Tenant and membership isolation

Resolve organization scope from the authenticated, configured integration context and authoritative platform mapping. Do not accept a caller-supplied tenant ID as the sole scope proof. Every lookup, update, export, and lifecycle event must be checked against that scope at the server-side enforcement point.

Do not create local membership tables or role grants that compete with the canonical authority. If provisioning events arrive before the membership authority is resolved, record/queue them only under a documented bounded policy; do not activate access or invent a fallback owner.

## Audit and operational handling

For SSO configuration changes, provisioning requests, membership-affecting events, and export actions, record event ID/schema version, timestamp, integration/organization reference, actor or authenticated client, target reference, operation, configuration version, outcome category, correlation ID, and a redacted change summary. Protect audit access separately and avoid logging assertions, tokens, secrets, raw directory payloads, or unnecessary personal data.

Failed validation, signature mismatch, issuer/audience mismatch, replay detection, revoked credentials, invalid scope, and dependency outages must produce bounded outcomes. Fail closed for authentication and privileged changes. Avoid error messages that reveal whether unrelated organizations or users exist.

## Proposed acceptance matrix

These are proposed future tests, not tests already run.

| Scenario | Required result |
|---|---|
| Assertion has wrong issuer or audience | Reject authentication |
| Assertion signature invalid or key untrusted | Reject authentication; no fallback to unsigned acceptance |
| Expired assertion or nonce/state mismatch | Reject authentication |
| Redirect URI is wildcard or unapproved | Reject configuration |
| Metadata/JWKS URL resolves to private/internal target | Reject or safely block fetch under SSRF policy |
| Provider signing keys rotate | Refresh only through approved bounded process; invalid keys fail closed |
| Configuration activation fails | Keep last approved configuration or disable safely; emit audit outcome |
| Secret configuration is read back | Never return secret material |
| SCIM credential revoked | Reject subsequent requests |
| Duplicate provisioning request | Idempotent result; no duplicate side effect |
| Out-of-order stale directory event | Do not overwrite newer authoritative state without version/reconciliation policy |
| Directory deactivation processed | Trigger approved revocation workflow and produce auditable outcome |
| Directory group claims privileged role | No privilege granted without approved mapping and policy decision |
| Caller tampers with organization scope | Deny cross-organization access |
| Membership authority unavailable or unresolved | Do not activate access using a competing local authority |
| Audit export requests another organization’s data | Deny and record safe outcome |
| Provisioning payload contains secrets/untrusted markup | Redact from logs and render safely |
| Reactivation arrives after deactivation | Require current authorization and explicit restoration policy |

## Release gate

Before implementation, approve: SSO protocol and identity-provider profile; account-linking and recovery semantics; provisioning protocol/version and group mapping; credential lifecycle; membership/role-grant authority under ADR-0021; revocation behavior; audit ownership/retention; and executable negative tests. A successful login alone does not validate tenant isolation or provisioning correctness.

## Related documents

- [Enterprise security review](SECURITY_REVIEW.md)
- [Enterprise technical design](TECHNICAL_DESIGN.md)
- [Enterprise dependency contracts](DEPENDENCIES_AND_CONTRACTS.md)
- [Auth session and token revocation contract](https://github.com/Monupatel62/aether-ai-auth/blob/main/docs/SESSION_AND_TOKEN_REVOCATION_CONTRACT.md)
- [Security policy decision contract](https://github.com/Monupatel62/aether-ai-security/blob/main/docs/POLICY_DECISION_CONTRACT_AND_ACCEPTANCE.md)
- [GitHub Enterprise SCIM deprovisioning documentation](https://docs.github.com/en/enterprise-cloud/admin/managing-iam/provisioning-user-accounts-with-scim/deprovisioning-and-reinstating-users)

## Open decisions

SSO protocol/profile, SCIM support and version, group-to-role mapping, account linking, emergency access, revocation latency, audit retention, and ADR-0021 membership/role-grant ownership remain open.
