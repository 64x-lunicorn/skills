# Security and data minimisation

## Transport

- TLS 1.2+ MUST be enforced, TLS 1.3 SHOULD be preferred. No plain HTTP, internal traffic included.
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` MUST be set (RFC 6797).
- API endpoints SHOULD NOT redirect HTTP to HTTPS. Reject the plain request instead, because by then the credentials were already sent unencrypted.

## Authentication

- Bearer tokens per RFC 6750 in the `Authorization` header. **Never** tokens in query parameters; they end up in access logs, `Referer` headers and proxy caches.
- OAuth 2.0 MUST follow **RFC 9700** (security BCP), not the raw text of RFC 6749:
  - PKCE (RFC 7636) for **all** client types.
  - Implicit grant and resource owner password credentials grant are not allowed.
  - Exact redirect URI matching, no wildcards.
  - Rotate refresh tokens, detect reuse and invalidate the chain.
- JWT validation MUST follow RFC 8725:
  - Set the expected `alg` explicitly; reject `none` and algorithm confusion.
  - Check `iss`, `aud`, `exp`, `nbf`. Clock skew at most 60 s.
  - Signing keys via JWKS with key rotation and `kid` evaluation.
- Access tokens SHOULD be short-lived (5 to 15 min).
- Highly sensitive APIs SHOULD use sender-constrained tokens: DPoP (RFC 9449) or mTLS (RFC 8705).
- API keys are acceptable only for server-to-server traffic and MUST be rotatable and revocable per integration.

## Authorisation

- Authorisation MUST be checked on the server **per resource instance**, not only per endpoint. Missing object-level checks (IDOR/BOLA) are the most common severe API flaw.
- A valid token alone MUST NOT grant access.
- Field-level permissions MUST apply before serialisation, not by filtering in the client.
- When existence is confidential: `404` instead of `403`.
- Read and write permissions MUST be modelled separately.

## Input validation

- Every request MUST be validated against a schema (OpenAPI/JSON Schema) **before** any business logic.
- Unknown request fields SHOULD be rejected (`additionalProperties: false`) to prevent mass assignment. Alternatively explicit allowlisting in the mapping; never generic object binding onto entities.
- Maximum body size MUST be enforced on the server **and** the reverse proxy.
- Depth and element count of nested JSON MUST be limited.
- String lengths, number ranges and array sizes MUST be bounded in the schema.
- Regular expressions from client input are not allowed; own expressions MUST be checked for catastrophic backtracking.
- URLs from client input (webhooks, callbacks, image import): SSRF protection through an allowlist of scheme and target, blocking resolution to private IP ranges, not following redirects blindly.
- XML only when unavoidable; then disable external entities and DTDs (XXE).

## Rate limiting and resource protection

- Every public API MUST rate-limit per identity, not only per IP.
- When exceeded: `429` with `Retry-After`. The `RateLimit` and `RateLimit-Policy` headers SHOULD be set; they are `draft-ietf-httpapi-ratelimit-headers` (version -11, May 2026), not an RFC, so document their semantics.
- Expensive operations (reports, exports, searches) MUST have their own, tighter limits.
- Timeouts MUST be set on every layer; no unbounded upstream calls.

## Response headers

```http
Cache-Control: no-store
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none'; frame-ancestors 'none'
Referrer-Policy: no-referrer
```

- `Server`, `X-Powered-By` and framework version headers MUST be removed.
- CORS (WHATWG Fetch, not an RFC): `Access-Control-Allow-Origin` MUST be an allowlist. `*` together with `Access-Control-Allow-Credentials: true` is not allowed and browsers reject it.

## Secrets and logging

- No secrets in the repository, query strings, URLs or error messages.
- Access and application logs MUST mask tokens, passwords, card and ID numbers. Redaction MUST be enforced in the logging layer, not by discipline at each call site.
- Request bodies SHOULD NOT be logged in full.

## Data minimisation and privacy

- Endpoints MUST return only the fields the calling client needs for its purpose. "Return everything, the client filters" is not allowed.
- Personal data MUST NOT appear in URIs (RFC 9110 section 17.9): no email, phone number, employee number or person-linked serial number in the path or query string. Use opaque IDs, or `POST` with a body for lookups.
- Write operations SHOULD support `Prefer: return=minimal` (RFC 7240); the server then answers `204` with `Preference-Applied: return=minimal`.
- Identifiers SHOULD be pseudonymous, so API logs on their own establish no link to a person.
- Retention periods MUST be defined per data category and also apply to logs, caches and the idempotency store.
- Export and deletion paths (data access, erasure) SHOULD exist as separate, audited endpoints.
- Transferring whole object graphs via `expand`/`include` MUST be authorisation-checked and SHOULD be depth-limited.
