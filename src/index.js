const FEATURES = new Set(["sso", "scim", "auditExport", "customRetention", "privateDeployment", "advancedPolicy"]);
const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function validateEnterprisePolicy(policy) {
  const errors = [];
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) return Object.freeze({ valid: false, errors: Object.freeze(["policy must be an object"]) });
  if (!ID.test(policy.tenantId ?? "")) errors.push("tenantId must be a valid identifier");
  if (!Array.isArray(policy.enabledFeatures)) errors.push("enabledFeatures must be an array");
  const features = Array.isArray(policy.enabledFeatures) ? policy.enabledFeatures : [];
  if (features.some((feature) => typeof feature !== "string" || !FEATURES.has(feature))) errors.push("enabledFeatures contains an unsupported feature");
  if (new Set(features).size !== features.length) errors.push("enabledFeatures must not contain duplicates");
  if (policy.auditExport === true && !features.includes("auditExport")) errors.push("auditExport requires the auditExport feature entitlement");
  if (policy.sso && !features.includes("sso")) errors.push("SSO configuration requires the sso feature entitlement");
  if (policy.sso && (!["oidc", "saml"].includes(policy.sso.protocol) || typeof policy.sso.issuer !== "string" || !isHttpsUrl(policy.sso.issuer))) errors.push("SSO requires an OIDC/SAML protocol and HTTPS issuer");
  if (policy.scim && (!features.includes("scim") || policy.scim.enabled !== true || !isHttpsUrl(policy.scim.baseUrl))) errors.push("SCIM requires entitlement, explicit enablement, and an HTTPS base URL");
  if (policy.auditRetentionDays !== undefined && (!Number.isInteger(policy.auditRetentionDays) || policy.auditRetentionDays < 30 || policy.auditRetentionDays > 3650)) errors.push("auditRetentionDays must be between 30 and 3650");
  if (policy.membershipAuthority !== undefined) errors.push("membership authority is not owned by this policy contract");
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}

export function effectiveEntitlements({ purchasedFeatures = [], policyFeatures = [], planAllows = [] } = {}) {
  for (const list of [purchasedFeatures, policyFeatures, planAllows]) if (!Array.isArray(list) || list.some((x) => typeof x !== "string" || !FEATURES.has(x))) throw new TypeError("entitlement inputs must contain supported feature identifiers");
  const purchased = new Set(purchasedFeatures);
  const policy = new Set(policyFeatures);
  const plan = new Set(planAllows);
  return Object.freeze([...FEATURES].filter((feature) => purchased.has(feature) && policy.has(feature) && plan.has(feature)).sort());
}

function isHttpsUrl(value) {
  if (typeof value !== "string") return false;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}
