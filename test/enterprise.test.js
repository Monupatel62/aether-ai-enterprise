import test from "node:test";
import assert from "node:assert/strict";
import { validateEnterprisePolicy, effectiveEntitlements } from "../src/index.js";

test("accepts valid enterprise feature policy without defining membership authority", () => {
  assert.deepEqual(validateEnterprisePolicy({ tenantId: "tenant-1", enabledFeatures: ["sso", "auditExport"], auditExport: true, auditRetentionDays: 365 }), { valid: true, errors: [] });
});

test("rejects unsafe SSO/SCIM settings and unsupported features", () => {
  const result = validateEnterprisePolicy({ tenantId: "tenant-1", enabledFeatures: ["scim", "unknown"], scim: { enabled: true, baseUrl: "http://internal" }, sso: { protocol: "oidc", issuer: "http://issuer" } });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("unsupported feature")));
  assert.ok(result.errors.some((e) => e.includes("SSO")));
  assert.ok(result.errors.some((e) => e.includes("SCIM")));
});

test("computes entitlements by intersection rather than union", () => {
  assert.deepEqual(effectiveEntitlements({ purchasedFeatures: ["sso", "scim"], policyFeatures: ["sso"], planAllows: ["sso", "scim"] }), ["sso"]);
  assert.throws(() => effectiveEntitlements({ policyFeatures: ["root"] }), /supported feature/);
});

test("keeps membership authority decision outside this repository contract", () => {
  const result = validateEnterprisePolicy({ tenantId: "tenant-1", enabledFeatures: [], membershipAuthority: "enterprise" });
  assert.ok(result.errors.some((e) => e.includes("membership authority")));
});
